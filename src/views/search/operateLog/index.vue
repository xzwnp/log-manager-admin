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
          v-model="listQuery.group" @change="queryLogs"
          class="filter-item" placeholder="分组名称" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in apps[listQuery.appName]" :key="item" :label="item" :value="item" />
        </el-select>
        <el-input class="filter-item" placeholder="traceId" size="large" style="width: 240px"
                  v-model="listQuery.traceId"></el-input>
        <date-time-picker class="filter-item" style="width: 400px" size="large" v-model="listQuery.timeRange">
        </date-time-picker>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="queryLogs"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
      <div class="filter-row" style="margin-bottom: 20px">
        <el-input class="filter-item" placeholder="操作名称" size="large" style="width: 300px"
                  v-model="listQuery.operate"></el-input>
        <el-input class="filter-item" placeholder="操作员编号" size="large" style="width: 250px"
                  v-model="listQuery.operatorId"></el-input>
        <el-input class="filter-item" placeholder="操作员名称" size="large" style="width: 250px"
                  v-model="listQuery.operatorName"></el-input>
      </div>
    </div>
    <!-- 日志列表 -->
    <el-table :data="logs.records" style="width: 100%" v-loading="tableLoading" @sort-change="sortChange" border>
      <el-table-column prop="traceId" label="traceId" width="150" />
      <el-table-column prop="operate" label="操作名称" width="150" />
      <el-table-column prop="content" label="操作描述" min-width="350" />
      <el-table-column prop="success" label="操作结果" width="150">
        <template v-slot="scope">
          <el-tag v-if="scope.row.success" type="success">操作成功</el-tag>
          <el-tag v-else type="danger">操作失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operatorId" label="操作员编号" width="150" />
      <el-table-column prop="operatorName" label="操作员姓名" width="150" />
      <el-table-column prop="operateTime" label="操作时间" width="200" sortable="custom"
                       :sort-orders="['ascending', 'descending']" />
    </el-table>
    <pagination class="pagination-container" :total="logs.total" v-model:page="listQuery.current" v-model:size="listQuery.size"
                @pagination="queryLogs"></pagination>
  </div>
</template>

<script lang="ts" setup>
import * as api from "@/api/operateLog";
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import DateTimePicker from "@/components/DateTimePicker/index.vue";

defineOptions({
  name: "SearchDbLog"
});

//查询日志
const logs = reactive({
  records: [],
  total: 0
});
const listQuery = reactive({
  current: 1,
  size: 20,
  appName: null,
  group: null,
  operate: null,
  operatorId: null,
  operatorName: null,
  traceId: null,
  startTime: null,
  endTime: null,
  timeRange: [],
  timeDesc: true
});
const tableLoading = ref(false);
const queryLogs = () => {
  if (listQuery.appName == null || listQuery.group == null) {
    return;
  }
  tableLoading.value = true;
  if (listQuery.timeRange.length >= 2) {
    listQuery.startTime = listQuery.timeRange[0];
    listQuery.endTime = listQuery.timeRange[1];
  }
  api.searchOperateLogs(listQuery).then(res => {
    console.log(res.data);
    logs.total = res.data.total;
    logs.records = res.data.records;
  }).finally(() => {
    tableLoading.value = false;
  });
};
const sortChange = () => {
  listQuery.timeDesc = !listQuery.timeDesc;
  queryLogs();
};

queryLogs();

//查询可用app
const apps = ref([]);
const queryApps = () => {
  api.listApps().then(res => {
    apps.value = res.data;
    console.log("keys", Object.keys(apps.value));
  });
};
queryApps();


</script>

<style scoped lang="scss">

</style>
