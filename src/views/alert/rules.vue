<template>
  <div class="view-container">
    <!-- 查询条件 -->
    <div class="filter-container">
      <div class="filter-row">
        <el-select
          v-model="listQuery.appName" @change="()=>{listQuery.group = null}"
          class="filter-item" placeholder="应用名称" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in Object.keys(apps)" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select
          v-model="listQuery.group" @change="fetchData"
          class="filter-item" placeholder="分组名称" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in apps[listQuery.appName]" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input class="filter-item" placeholder="规则id" size="large" style="width: 240px"
                  v-model="listQuery.ruleId"></el-input>
        <el-input class="filter-item" placeholder="规则名称" size="large" style="width: 240px"
                  v-model="listQuery.ruleName"></el-input>
        <el-select
          v-model="listQuery.level" @change="fetchData"
          class="filter-item" placeholder="规则级别" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in AlertLevelEnum" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="fetchData"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
      <div class="filter-row">
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="handleOpenForm(null)"
                   style="width:150px;margin-left: 40px">新增规则
        </el-button>
      </div>
    </div>
    <!-- 日志列表 -->
    <el-table :data="listData.records" style="width: 100%" v-loading="tableLoading" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="ruleName" label="规则名称" width="150" />
      <el-table-column prop="enabled" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.enabled?'success':'warning'">{{ scope.row.enabled ? "启用" : "禁用" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="level" label="告警级别" width="100">
        <template #default="scope">
          {{ ObjectUtil.parseEnums(AlertLevelEnum, scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="规则描述" min-width="280" />
      <el-table-column prop="createdTime" label="创建时间" width="170" />
      <el-table-column prop="updatedTime" label="最后更新时间" width="170" />
      <el-table-column label="操作" width="250">
        <template #default="scope">
          <el-button type="warning" v-if="scope.row.enabled" @click="handleEnableAlert(scope.row.id,false)">
            禁用
          </el-button>
          <el-button type="success" v-else @click="handleEnableAlert(scope.row.id,true)">启用</el-button>
          <el-button type="primary" @click="handleOpenForm(scope.row)">修改</el-button>
          <el-button type="danger" @click="handleDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination class="pagination-container" :total="listData.total" v-model:page="listQuery.current"
                v-model:size="listQuery.size"
                @pagination="fetchData"></pagination>

    <!-- 修改规则弹窗 -->
    <el-dialog class="ModifyForm" v-model="formVisible"
               title="编辑告警规则" center width="700px">
      <el-form :model="form" label-width="120px" label-position="right">
        <el-form-item label="规则ID" style="width: 300px">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="规则名称" style="width: 400px" required>
          <el-input v-model="form.ruleName" />
        </el-form-item>
        <el-form-item label="告警级别" style="width: 400px " required>
          <el-select
            v-model="form.level"
            class="filter-item" placeholder="告警级别" clearable>
            <el-option v-for="item in AlertLevelEnum" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则描述" style="width: 600px" required>
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
        <el-form-item label="匹配条件" style="width: 600px" required>
          <el-input type="textarea" v-model="form.matchCondition" placeholder="命中告警的关键字,支持正则表达式" />
        </el-form-item>
        <el-form-item label="统计策略" style="width: 600px" required>
          <el-select
            v-model="form.statisticType"
            class="filter-item" placeholder="统计策略" clearable>
            <el-option v-for="item in AlertStatisticTypeEnum" :key="item.value" :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
        <div v-if="form.statisticType == AlertStatisticTypeEnum.FIXED_COUNT.value" style="width: 600px">
          <el-form-item label="窗口周期" required>
            <el-input-number placeholder="单位:秒" :step="60" v-model="form.alertCondition.cycle"></el-input-number>
          </el-form-item>
          <el-form-item label="触发阈值" required>
            <el-input-number placeholder="关键词命中多少次后触发告警" :step="1"
                             v-model="form.alertCondition.threshold"></el-input-number>
          </el-form-item>
        </div>

        <div v-if="form.statisticType == AlertStatisticTypeEnum.SLIDING_COUNT.value" style="width: 600px">
          <el-form-item label="窗口周期" required>
            <el-input-number placeholder="单位:秒" :step="60" v-model="form.alertCondition.cycle"></el-input-number>
          </el-form-item>
          <el-form-item label="触发阈值" required>
            <el-input-number placeholder="关键词命中多少次后触发告警" :step="1"
                             v-model="form.alertCondition.threshold"></el-input-number>
          </el-form-item>
        </div>

        <div v-if="form.statisticType == AlertStatisticTypeEnum.FIXED_PERCENT.value" style="width: 600px">
          <el-form-item label="窗口周期" required>
            <el-input-number placeholder="单位:秒" :step="60" v-model="form.alertCondition.cycle"></el-input-number>
          </el-form-item>
          <el-form-item label="统计关键词" required>
            <el-input type="textarea" v-model="form.alertCondition.denominatorExpression"
                      placeholder="进行告警统计的关键字,支持正则表达式" />
          </el-form-item>
          <el-form-item label="触发阈值百分比" required>
            <el-input-number placeholder="0-1之间的小数" :step="0.1" style="width: 200px"
                             v-model="form.alertCondition.threshold"></el-input-number>
          </el-form-item>
        </div>

        <el-form-item label="告警接收人" required>
          <el-input type="textarea" v-model="form.alertReceiver"
                    placeholder="填写接收人账号,使用英文逗号分隔" />
        </el-form-item>
        <el-form-item label="通知方式" required>
          <el-select
            v-model="form.notificationTypes"
            filterable
            multiple
            placeholder="通知方式"
            style="width:600px "
          >
            <el-option
              v-for="e in AlertNotificationTypeEnum"
              :key="e.value"
              :label="e.label"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="submitForm">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import * as api from "@/api/alertRule";
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import * as ObjectUtil from "@/utils/objectUtil";
import { ElMessage, ElMessageBox } from "element-plus";

defineOptions({
  name: "AlertRuleList"
});

const AlertLevelEnum = {
  NOTIFY: { label: "提示告警", value: 1 },
  SECONDARY: { label: "次要告警", value: 2 },
  IMPORTANT: { label: "重要告警", value: 3 },
  EMERGENCY: { label: "紧急告警", value: 4 }
};

const AlertStatisticTypeEnum = {
  IMMEDIATELY: { label: "立即触发", value: 1 },
  FIXED_COUNT: { label: "固定窗口计数", value: 2 },
  SLIDING_COUNT: { label: "滑动窗口计数", value: 3 },
  FIXED_PERCENT: { label: "固定窗口百分比", value: 4 }
};

const AlertNotificationTypeEnum = {
  STATION_MESSAGE: { label: "站内信通知", value: 1, disabled: true, checked: true },
  EMAIL: { label: "邮件通知", value: 2, disabled: false, checked: false },
  SHORT_MESSAGE: { label: "短信通知", value: 3, disabled: false, checked: false }
};

//查询规则
const listData = reactive({
  records: [],
  total: 0
});
const listQuery = reactive({
  current: 1,
  size: 20,
  appName: null,
  group: null,
  ruleId: null,
  ruleName: "",
  level: null,
  timeDesc: true
});
const tableLoading = ref(false);
const fetchData = () => {
  if (listQuery.appName == null || listQuery.group == null) {
    return;
  }
  tableLoading.value = true;
  api.query(listQuery).then(res => {
    console.log(res.data);
    listData.total = res.data.total;
    listData.records = res.data.records;
  }).finally(() => {
    tableLoading.value = false;
  });
};


//查询可用app
const apps = ref([]);
const queryApps = () => {
  api.listApps().then(res => {
    apps.value = res.data;
  });
};

//规则编辑表单
const form = reactive({
  id: null,
  appName: null,
  group: null,
  ruleName: "",
  enabled: true,
  description: "",
  level: null,
  matchCondition: "",
  statisticType: null,
  alertCondition: {},
  alertReceiver: "",
  notificationTypes: []
});
const formVisible = ref(false);
const formLoading = ref(false);

const resetForm = () => {
  Object.assign(form, {
    id: null,
    ruleName: "",
    enabled: true,
    description: "",
    level: null,
    matchCondition: "",
    statisticType: null,
    alertCondition: {}
  });
};

const handleOpenForm = (data: any) => {
  if (listQuery.appName == null || listQuery.group == null) {
    ElMessage.warning("请先选择应用和分组");
    return;
  }
  resetForm();
  form.appName = listQuery.appName;
  form.group = listQuery.group;
  formVisible.value = true;
  if (data) {
    Object.assign(form, data);
  }
};


const submitForm = () => {
  formLoading.value = true;
  if (form.id) {
    api.edit(form).then(resp => {
      ElMessage.success("编辑成功");
      formVisible.value = false;
      fetchData();
    }).finally(() => formLoading.value = false);
  } else {
    api.add(form).then(resp => {
      ElMessage.success("编辑成功");
      formVisible.value = false;
      fetchData();
    }).finally(() => formLoading.value = false);
  }
};

const handleDel = (data: any) => {
  ElMessageBox.confirm(`确定删除规则[${data.ruleName}]吗?`)
    .then(_ => {
      tableLoading.value = true;
      api.del(data.id)
        .then(_ => {
          ElMessage.success("删除成功");
          fetchData();
        }).finally(() => {
        tableLoading.value = false;
      });
    });
};

const handleEnableAlert = (alertRuleId: number, enabled: boolean) => {
  api.enable(alertRuleId, enabled)
    .then(_ => {
      ElMessage.success("操作成功");
      fetchData();
    });
};

//created
queryApps();


</script>

<style scoped lang="scss">

</style>
