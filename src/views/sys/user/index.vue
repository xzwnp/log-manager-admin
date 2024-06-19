<template>
  <div class="view-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <div class="filter-row">
        <el-input class="filter-item" placeholder="请输入用户名" size="large" style="width:300px"
                  v-model="listQuery.username"></el-input>
        <!--        <el-select-->
        <!--          v-model="listQuery.role" @change="fetchData"-->
        <!--          class="filter-item" placeholder="用户角色" size="large" style="width: 240px"-->
        <!--          clearable>-->
        <!--          <el-option v-for="item in roleEnum" :key="item.value" :label="item.label" :value="item.value" />-->
        <!--        </el-select>-->
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="fetchData"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>

      </div>
    </div>
    <!-- 日志列表 -->
    <el-table :data="records.records" style="width: 100%" v-loading="tableLoading">
      <el-table-column prop="id" label="ID" min-width="100"/>
      <el-table-column prop="username" label="账号" min-width="150"/>
      <el-table-column prop="nickname" label="姓名" min-width="150"/>
      <el-table-column prop="" label="角色" width="300">
        <template #default="scope">
          <el-tag v-for="role in scope.row.roles">
            {{ role }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="操作" label="操作" width="500">
        <template #header>
          <el-button class="filter-item" type="primary" @click="handleAddUser"
                     style="">添加用户
          </el-button>
        </template>
        <template #default="scope">
          <el-button type="warning" v-if="scope.row.roles.indexOf('系统管理员') !== -1"
                     @click="handleCancelAdmin(scope.row)">取消管理员
          </el-button>
          <el-button type="primary" v-else @click="handleAddAdmin(scope.row)">设为管理员</el-button>
          <el-button type="danger" @click="handleDelUser(scope.row)">删除用户</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination class="pagination-container" :total="records.total" v-model:page="listQuery.current"
                v-model:size="listQuery.size"
                @pagination="fetchData"></pagination>
    <!-- 添加用户弹窗 -->
    <el-dialog class="addUserForm" v-model="formVisible"
               title="添加用户" center width="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="账号" style="width: 400px">
          <el-input v-model="form.username"/>
        </el-form-item>
        <el-form-item label="姓名" style="width: 400px">
          <el-input v-model="form.nickname"/>
        </el-form-item>
        <el-form-item label="密码" style="width: 400px">
          <el-input model-value="初始密码为admin123,请尽快修改" disabled/>
        </el-form-item>
        <el-form-item label="角色">
          <el-checkbox-group v-model="form.roles">
            <el-checkbox label="2" disabled checked>系统用户</el-checkbox>
            <el-checkbox label="1">系统管理员</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddUser">
            添加
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import * as api from "@/api/user";
import {reactive, ref} from "vue";
import Pagination from "@/components/Pagination/index.vue";
import {ElMessage, ElMessageBox} from "element-plus";

defineOptions({
  name: "UserAdmin"
});

const roleEnum = {
  SYS_ADMIN: {label: "系统管理员", value: 1},
  SYS_USER: {label: "普通用户", value: 2}
};

//用户数据
const records = reactive({
  records: [],
  total: 0
});
const listQuery = reactive({
  current: 1,
  size: 20,
  username: "",
  role: null
});
const tableLoading = ref(false);
const fetchData = () => {
  tableLoading.value = true;
  api.queryUser(listQuery).then(res => {
    console.log(res.data);
    records.total = res.data.total;
    records.records = res.data.records;
  }).finally(() => {
    tableLoading.value = false;
  });
};

fetchData();

//添加用户表单
const form = reactive({
  id: null,
  username: "",
  nickname: "",
  password: "",
  roles: []
});
const formVisible = ref(false);
const formLoading = ref(false);
const handleAddUser = () => {
  formVisible.value = true;
};
const submitAddUser = () => {
  formLoading.value = true;
  api.addUser(form).then(res => {
    ElMessage.success("添加成功");
    fetchData();
    formVisible.value = false;
  }).finally(() => {
    formLoading.value = false;
  });
};

const handleCancelAdmin = (row) => {
  ElMessageBox.confirm(`确定取消${row.username}的管理员权限吗?`)
    .then(() => {
      tableLoading.value = true;
      api.modifySysAdminRole(row.username, false)
        .then(res => {
          ElMessage.success("操作成功");
          fetchData();
        }).finally(() => tableLoading.value = false);
    });
};

const handleAddAdmin = (row) => {
  ElMessageBox.confirm(`确定为${row.username}添加管理员权限吗?`)
    .then(() => {
      tableLoading.value = true;
      api.modifySysAdminRole(row.username, true)
        .then(res => {
          ElMessage.success("操作成功");
          fetchData();
        }).finally(() => tableLoading.value = false);
    });
};
const handleDelUser = (row) => {
  ElMessageBox.confirm(`确定删除用户${row.username}吗?`)
    .then(() => {
      tableLoading.value = true;
      api.deleteUser(row.username)
        .then(res => {
          ElMessage.success("操作成功");
          fetchData();
        }).finally(() => tableLoading.value = false);
    });
};
</script>

<style scoped lang="scss">

</style>
