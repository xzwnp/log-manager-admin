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
        <el-select
          v-model="listQuery.level" @change="queryLogs"
          class="filter-item" placeholder="日志级别" size="large" style="width: 240px"
          clearable>
          <el-option v-for="item in logLevelEnum" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input class="filter-item" placeholder="traceId" size="large" style="width: 240px"
                  v-model="listQuery.traceId"></el-input>
        <date-time-picker class="filter-item" style="width: 400px" size="large"
                          v-model="listQuery.timeRange"
        ></date-time-picker>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="queryLogs"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
      <div class="filter-row" style="margin-bottom: 20px">
        <el-input class="filter-item" placeholder="搜索关键词" size="large" style="flex: 2"
                  v-model="listQuery.keyword"></el-input>
        <el-checkbox v-model="listQuery.isTokenizeKeyword" label="智能搜索" size="large"
                     style="margin-right: 100px"></el-checkbox>
        <el-input class="filter-item" placeholder="排除关键词" size="large" style="flex: 2"
                  v-model="listQuery.negativeKeyword"></el-input>
      </div>
    </div>
    <!-- 日志列表 -->
    <div class="table-container" style="width: 100%">
      <el-table :data="logs.records" v-loading="tableLoading"
                @sort-change="sortChange" border>
        <el-table-column prop="level" label="级别" width="80" />
        <el-table-column prop="traceId" label="traceId" width="150" />
        <el-table-column prop="messageHighlight" label="message" min-width="400">
          <template #default="scope">
            <div v-html="scope.row.messageHighlight" />
            <el-button v-if="hasException(scope.row)" type="primary" :icon="MagicStick"
                       @click="handleFixException(scope.row)">异常分析
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="logger" label="logger" width="150" />
        <el-table-column prop="thread" label="thread" width="150" />
        <el-table-column prop="time" label="时间" width="200" sortable="custom"
                         :sort-orders="['ascending', 'descending']" />
      </el-table>
    </div>

    <pagination class="pagination-container" :total="logs.total" v-model:page="listQuery.current"
                v-model:size="listQuery.size"
                @pagination="queryLogs"></pagination>
    <!--   异常诊断 -->
    <div style="float: right;position: absolute;right: 20px;top: 40%;z-index: 999">
      <el-popover
        placement="left"
        trigger="hover"
        content="异常分析"
      >
        <template #reference>
          <el-button circle size="large"
                     @click="evt => exceptionDiagnosisDialogVisible = true"
                     data-toggle="tooltip"
                     style="width: 50px;height: 50px"
                     type="primary"
          >
            <iconify-icon-online icon="material-symbols:diagnosis-outline-sharp"
                                 style="width: 40px;height: 40px"></iconify-icon-online>
          </el-button>

        </template>
      </el-popover>

    </div>

    <el-drawer
      ref="drawerRef"
      v-model="exceptionDiagnosisDialogVisible"
      title="异常分析"
      direction="rtl"
      class="demo-drawer"
    >
      <div class="exception-dialog-container" v-loading="exceptionDiagnosisDialogLoading">
        <div v-if="!exceptionDiagnosisForm.exceptionMessage">
          <el-empty description="暂未异常分析信息,请先选择一段异常日志"></el-empty>
        </div>
        <div v-else>
          <div class="dialog-bubble html-text-wrap">
            <div v-html="exceptionDiagnosisForm.exceptionMessage"
                 style="color: #666666;width: 100%;white-space: pre-wrap;">
            </div>
          </div>
          <div class="dialog-bubble">
            <TypeIt v-if="exceptionDiagnosisForm.suggestionMessage"
                    :values="exceptionDiagnosisForm.suggestionMessage" :key="exceptionDiagnosisForm.key" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>

</template>

<script lang="ts" setup>
import * as api from "@/api/appLog";
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import DateTimePicker from "@/components/DateTimePicker/index.vue";
import { MagicStick } from "@element-plus/icons-vue";
import TypeIt from "@/components/ReTypeit";
import { ElMessage } from "element-plus";

defineOptions({
  name: "SearchAppLog"
});

const logLevelEnum = {
  DEBUG: { label: "DEBUG", value: 2 },
  INFO: { label: "INFO", value: 3 },
  WARN: { label: "WARN", value: 4 },
  ERROR: { label: "ERROR", value: 5 }
};

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
  level: null,
  keyword: null,
  isTokenizeKeyword: false,
  negativeKeyword: null,
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
  api.searchAppLogs(listQuery).then(res => {
    console.log(res.data);
    logs.total = res.data.total;
    logs.records = res.data.records;
    //第一个换行符,然后把剩下的换行符替换为html可以识别的<br>,所有<em>替换为<mark>
    logs.records.forEach(log => log.messageHighlight = log.messageHighlight.replace(/\r\n/, "").replace(/\r\n/g, "<br>"));
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

//判断日志中是否包含异常信息
let exceptionRegex = /\..*?Exception/g;
const hasException = (row) => {
  console.log(row);
  return row.level === logLevelEnum.ERROR.label && exceptionRegex.test(row.message);
};

const handleFixException = (row) => {
  ElMessage.info("正在生成异常分析...");
  exceptionDiagnosisDialogLoading.value = true;
  api.fixException(row.message).then(res => {
    exceptionDiagnosisDialogVisible.value = true;
    exceptionDiagnosisForm.exceptionMessage = res.data.exceptionMessage.replace(/\r\n/, "").replace(/\r\n/g, "<br>");
    exceptionDiagnosisForm.suggestionMessage = res.data.suggestionMessage.split("\n");
    exceptionDiagnosisForm.key = Date.parse(new Date());
  }).finally(() => exceptionDiagnosisDialogLoading.value = false);
};

//异常诊断弹窗
const exceptionDiagnosisDialogVisible = ref(false);
const exceptionDiagnosisDialogLoading = ref(false);
const exceptionDiagnosisForm = reactive({
  exceptionMessage: "",
  suggestionMessage: [],
  key: Date.parse(new Date()) //用于重新渲染组件
});
</script>

<style scoped lang="scss">
.exception-dialog-container {
  width: 100%;

  .dialog-bubble {
    background: #F5F7FA;
    border-radius: 16px;
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
  }
}

//解决v-html文本不会自动换行的问题
.html-text-wrap {
  overflow: hidden;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-all;
  text-overflow: ellipsis;
}
</style>
