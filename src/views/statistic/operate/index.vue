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
          v-model="listQuery.group" @change="queryOperates"
          class="filter-item" placeholder="分组名称" size="large" style="width: 240px">
          <el-option v-for="item in apps[listQuery.appName]" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select
          v-model="listQuery.dimension"
          class="filter-item" placeholder="分组维度" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in statisticDimensionEnum" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="listQuery.operates"
          filterable
          multiple
          placeholder="操作名称"
          size="large" style="width: 240px"
        >
          <el-option
            v-for="item in operates"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <date-time-picker class="filter-item" style="width: 400px" size="large" v-model="listQuery.timeRange">
        </date-time-picker>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="fetchData"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
    </div>
    <div class="chart-container">
      <div class="chart-item container-bg" v-for="chartData in chartDataList">
        <bar :legends="[chartData.legend]" :x-axis="chartData.xAxis"
             :y-data="{[chartData.legend]:chartData.counts}"></bar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { listApps } from "@/api/common";
import DateTimePicker from "@/components/DateTimePicker/index.vue";
import { reactive, ref } from "vue";
import bar from "./bar.vue";
import { listOperates, makeOperateStatistic } from "@/api/statistic";

//图表数据获取
const listQuery = reactive({
  appName: null,
  group: null,
  operates: [],
  startTime: null,
  endTime: null,
  timeRange: [],
  dimension: null
});
const chartDataList = ref([]);
const listLoading = ref(false);

const fetchData = () => {
  if (listQuery.timeRange.length >= 2) {
    listQuery.startTime = listQuery.timeRange[0];
    listQuery.endTime = listQuery.timeRange[1];
  }
  listLoading.value = true;
  makeOperateStatistic(listQuery)
    .then(res => {
      chartDataList.value = res.data;
    }).finally(() => listLoading.value = false);
};

//查询可用app
const apps = ref([]);
const queryApps = () => {
  listApps().then(res => {
    apps.value = res.data;
  });
};

//查询可用操作
const operates = ref([]);
const queryOperates = () => {
  listOperates(listQuery.appName, listQuery.group).then(res => {
    operates.value = res.data;
  });
};

//统计维度枚举
const statisticDimensionEnum = {
  OPERATE_NAME: { label: "操作名称", value: 1 },
  OPERATE_COST: { label: "操作耗时", value: 2 },
  OPERATE_TIME: { label: "操作时间", value: 3 },
  OPERATE_COUNT: { label: "调用次数", value: 4 }
};


//created
queryApps();
</script>

<style scoped lang="scss">
.chart-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2列等宽 */
  grid-gap: 10px; /* 间隙 */
  justify-content: center; /* 水平居中 */
  padding: 10px;

  .chart-item {
  }
}
</style>
