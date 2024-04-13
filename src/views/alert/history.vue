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
        <el-select
          v-model="listQuery.level" @change="fetchData"
          class="filter-item" placeholder="告警级别" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in AlertLevelEnum" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input class="filter-item" placeholder="规则id" size="large" style="width: 240px"
                  v-model="listQuery.ruleId"></el-input>
        <el-input class="filter-item" placeholder="规则名称" size="large" style="width: 240px"
                  v-model="listQuery.ruleName"></el-input>
        <date-time-picker class="filter-item" style="width: 400px" size="large"
                          v-model="listQuery.timeRange"
        ></date-time-picker>

        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="fetchData"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
    </div>
    <!-- 日志列表 -->
    <el-table :data="listData.records" style="width: 100%" v-loading="tableLoading" border>
      <el-table-column prop="id" label="ID" width="100" />
      <el-table-column prop="level" label="告警级别" width="150">
        <template #default="scope">
          {{ ObjectUtil.parseEnums(AlertLevelEnum, scope.row.level) }}
        </template>
      </el-table-column>
      <el-table-column prop="ruleId" label="规则id" width="150" />
      <el-table-column prop="ruleName" label="规则名称" width="200" />
      <el-table-column prop="alertDescription" label="告警信息" min-width="600" />
      <el-table-column prop="alertReceiver" label="告警接收人" min-width="300" />
      <el-table-column prop="createdTime" label="告警时间" width="200" />
    </el-table>
    <pagination class="pagination-container" :total="listData.total" v-model:page="listQuery.current"
                v-model:size="listQuery.size"
                @pagination="fetchData"></pagination>
  </div>

</template>

<script lang="ts" setup>
import * as api from "@/api/alertHistory";
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import * as ObjectUtil from "@/utils/objectUtil";
import DateTimePicker from "@/components/DateTimePicker/index.vue";

defineOptions({
  name: "AlertRuleList"
});

const AlertLevelEnum = {
  NOTIFY: { label: "提示告警", value: 1 },
  SECONDARY: { label: "次要告警", value: 2 },
  IMPORTANT: { label: "重要告警", value: 3 },
  EMERGENCY: { label: "紧急告警", value: 4 }
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
  startTime: null,
  endTime: null,
  timeRange: [],
  timeDesc: true
});
const tableLoading = ref(false);
const fetchData = () => {
  if (listQuery.appName == null || listQuery.group == null) {
    return;
  }
  if (listQuery.timeRange.length >= 2) {
    listQuery.startTime = listQuery.timeRange[0];
    listQuery.endTime = listQuery.timeRange[1];
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


//created
queryApps();


</script>

<style scoped lang="scss">

</style>
