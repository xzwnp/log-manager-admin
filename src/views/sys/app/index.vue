<template>
  <div class="view-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <div class="filter-row">
        <el-input class="filter-item" placeholder="请输入应用名称" size="large" style="width:300px"
                  v-model="listQuery.appName"></el-input>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="fetchData"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
      <div class="filter-row">
        <span style="flex:1"></span>
        <el-button class="filter-item" type="success" size="large" @click="handleImportApp"
                   style="width:150px">导 入 应 用
        </el-button>
      </div>
    </div>
    <!-- 日志列表 -->
    <el-table :data="records.records" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="ID" min-width="100" />
      <el-table-column prop="appName" label="应用名称" min-width="150" />
      <el-table-column prop="description" label="应用描述" min-width="150" />
      <el-table-column prop="" label="应用分组" min-width="300">
        <template #default="scope">
          <el-tag v-for="group in scope.row.groups">
            {{ group }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="" label="状态" min-width="300">
        <template #default="scope">
          <el-switch v-model="scope.row.enabled" active-text="启用" inactive-text="禁用"
                     @click="handleEnableApp(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="操作" label="操作" width="500">
        <template #default="scope">
          <el-button type="primary" @click="handleModifyApp(scope.row)">修改</el-button>
          <el-button type="danger" @click="handleDelApp(scope.row)">删除应用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination class="pagination-container" :total="records.total" v-model:page="listQuery.current" v-model:size="listQuery.size"
                @pagination="fetchData"></pagination>
    <!-- 修改应用信息弹窗 -->
    <el-dialog class="modifyAppForm" v-model="formVisible"
               title="编辑应用信息" center width="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="应用名称" style="width: 400px">
          <el-input v-model="form.appName" disabled />
        </el-form-item>
        <el-form-item label="应用说明" style="width: 400px">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="分组信息" style="width: 400px">
          <el-tag v-for="group in form.groups">
            {{ group }}
          </el-tag>
        </el-form-item>
        <el-form-item label="应用管理员">
          <el-tag
            v-for="tag in form.admins"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleDelAppAdmin(tag)"
            style="margin-right: 10px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="adminInputTagVisible"
            v-model="adminInputTag"
            size="small"
            style="width: 60px"
            @keyup.enter="handleAddAppAdmin"
            @blur="handleAddAppAdmin"
          />
          <el-button v-else class="button-new-tag" size="small" @click="adminInputTagVisible = true">
            + 新增
          </el-button>
        </el-form-item>

        <el-form-item label="应用成员">
          <el-tag
            v-for="tag in form.users"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleDelAppUser(tag)"
            style="margin-right: 10px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="userInputTagVisible"
            v-model="userInputTag"
            size="small"
            style="width: 60px"
            @keyup.enter="handleAddAppUser"
            @blur="handleAddAppUser"
          />
          <el-button v-else class="button-new-tag" size="small" @click="userInputTagVisible = true">
            + 新增
          </el-button>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitModifyApp">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import * as api from "@/api/appAdmin";
import { reactive, Ref, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { modifyAppInfo } from "@/api/appAdmin";

defineOptions({
  name: "AppAdmin"
});

//用户数据
const records = reactive({
  records: [],
  total: 0
});
const listQuery = reactive({
  current: 1,
  size: 20,
  appName: ""
});
const tableLoading = ref(false);
const fetchData = () => {
  tableLoading.value = true;
  api.queryApps(listQuery).then(res => {
    records.total = res.data.total;
    records.records = res.data.records;
  }).finally(() => {
    tableLoading.value = false;
  });
};

fetchData(); //打开页面时自动加载数据


const handleImportApp = () => {
  ElMessageBox.confirm("该操作会覆盖已有应用的分组信息,是否确定继续?")
    .then(_ => {
      tableLoading.value = true;
      api.importApps().then(res => {
        ElMessage.success("导入成功");
        fetchData();
      }).finally(() => tableLoading.value = false);
    });
};


//应用编辑表单
const form = reactive({
  id: null,
  appName: "",
  description: "",
  groups: [],
  admins: [],
  users: []
});
const formVisible = ref(false);
const formLoading = ref(false);

const handleModifyApp = (data: any) => {
  formVisible.value = true;
  formLoading.value = true;
  api.queryAppDetail(data.appName)
    .then(res => {
      Object.assign(form, res.data);
    })
    .finally(() => formLoading.value = false);
};


function fetchAppInfo() {
  formLoading.value = true;
  api.queryAppDetail(form.appName).then(_ => {
  }).finally(() => {
    formLoading.value = false;
  });
}

const submitModifyApp = () => {
  formLoading.value = true;
  api.modifyAppInfo(form).then(_ => {
    ElMessage.success("保存成功");
    fetchData();
    formVisible.value = false;
  }).finally(() => {
    formLoading.value = false;
  });
};

const handleDelApp = (data: any) => {
  ElMessageBox.confirm(`确定删除应用${data.appName}吗?`)
    .then(_ => {
      tableLoading.value = true;
      api.deleteApp(data.appName)
        .then(_ => {
          ElMessage.success("删除成功");
          fetchData();
        }).finally(() => {
        tableLoading.value = false;
      });
    });
};

const handleEnableApp = (data: any) => {
  tableLoading.value = true;
  api.enableApp(data.appName, data.enabled).then(res => {
    ElMessage.success("操作成功");
    fetchData();
  }).finally(() => tableLoading.value = false);
};

//管理员tag
const adminInputTagVisible = ref(false);
const adminInputTag = ref("");

const handleAddAppAdmin = () => {
  if (adminInputTag.value.trim() === "") {
    adminInputTagVisible.value = false;
    return;
  }
  api.modifyAppAdmin(form.appName, adminInputTag.value, true)
    .then(res => {
      ElMessage.success("添加成功");
      fetchAppInfo();
      adminInputTag.value = "";
      adminInputTagVisible.value = false;
    });
};

const handleDelAppAdmin = (tag: string) => {
  api.modifyAppAdmin(form.appName, tag, false)
    .then(res => {
      ElMessage.success("删除成功");
      fetchAppInfo();
    });
};


//应用成员tag
const userInputTagVisible = ref(false);
const userInputTag = ref("");

const handleAddAppUser = () => {
  if (userInputTag.value.trim() === "") {
    userInputTagVisible.value = false;
    return;
  }
  api.modifyAppUser(form.appName, userInputTag.value, true)
    .then(res => {
      ElMessage.success("添加成功");
      form.users.push(userInputTag.value);
      userInputTag.value = "";
      userInputTagVisible.value = false;
    });
};

const handleDelAppUser = (tag: string) => {
  api.modifyAppUser(form.appName, tag, false)
    .then(res => {
      ElMessage.success("删除成功");
      form.users = form.users.filter(user => user !== tag);
    });
};


</script>

<style scoped lang="scss">

</style>
