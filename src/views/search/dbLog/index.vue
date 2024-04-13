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
        <el-input class="filter-item" placeholder="数据库名称" size="large" style="width: 240px"
                  v-model="listQuery.database"></el-input>
        <el-input class="filter-item" placeholder="数据表名称" size="large" style="width: 240px"
                  v-model="listQuery.table"></el-input>
        <date-time-picker class="filter-item" style="width: 400px" size="large" v-model="listQuery.timeRange">
        </date-time-picker>
        <span class="filter-item" style="flex: 1"></span> <!--   没啥用,占位的   -->
        <el-button class="filter-item" type="primary" size="large" @click="queryLogs"
                   style="width:150px;margin-left: 40px">查 询
        </el-button>
      </div>
      <div style="margin-top: 10px;margin-bottom: 5px;display: flex;flex-direction: column;width: 45%">
        <span style="display: flex">
          <el-text size="large">
            多字段匹配:
          </el-text>
          <span style="flex: 1"></span>
          <el-button class="filter-item" style="margin-left: 40px" :icon="Plus"
                     @click="listQuery.keywordGroups.push({})">增加一行</el-button>
        </span>

        <span v-for="keywordGroup in listQuery.keywordGroups"
              style="margin-top: 10px;display:flex;justify-content: space-between">
          <el-text class="filter-item">
            字段类型:
            <el-switch v-model="keywordGroup.matchNewColumn"
                       active-text="变更后" inactive-text="变更前"
                       style="--el-switch-on-color: #13ce66; --el-switch-off-color: #E6A23C" />
          </el-text>

          <el-input placeholder="字段名称" style="width: 240px"
                    v-model="keywordGroup.columnName"></el-input>
          <el-input placeholder="字段值" style="width: 240px"
                    v-model="keywordGroup.columnValue"></el-input>
        </span>
      </div>
    </div>
    <!-- 日志列表 -->
    <div class="table-container">
      <el-table :data="logs.records" border v-loading="tableLoading" @sort-change="sortChange">
        <el-table-column prop="changeType" label="变更类型" width="100" class-name="cell-vertical-top">
          <template v-slot="scope">
            <el-tag>{{ parseEnums(changeTypeEnum, scope.row.changeType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="database" label="数据库" width="150" class-name="cell-vertical-top" />
        <el-table-column prop="table" label="表" width="150" class-name="cell-vertical-top" />
        <!--      <el-table-column prop="success" label="操作结果" width="150">-->
        <!--        <template v-slot="scope">-->
        <!--          <el-tag v-if="scope.row.success" type="success">操作成功</el-tag>-->
        <!--          <el-tag v-else type="danger">操作失败</el-tag>-->
        <!--        </template>-->
        <!--      </el-table-column>-->
        <el-table-column prop="oldColumns" label="变更前" min-width="300" header-align="center"
                         class-name="cell-vertical-top">
          <template v-slot="scope">
            <el-table :data="Object.keys(scope.row.oldColumns)">
              <el-table-column label="字段名">
                <template v-slot="scope1">{{ scope1.row }}</template>
              </el-table-column>
              <el-table-column label="字段值">
                <template v-slot="scope1">{{ scope.row.oldColumns[scope1.row] }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="newColumns" label="变更后" min-width="300" header-align="center"
                         class-name="cell-vertical-top">
          <template v-slot="scope">
            <el-table :data="Object.keys(scope.row.newColumns)">
              <el-table-column label="字段名">
                <template v-slot="scope1">{{ scope1.row }}</template>
              </el-table-column>
              <el-table-column label="字段值">
                <template v-slot="scope1">{{ scope.row.newColumns[scope1.row] }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="diffColumns" label="差异字段" min-width="300" header-align="center"
                         class-name="cell-vertical-top">
          <template v-slot="scope">
            <el-table :data="Object.keys(scope.row.diffColumns)">
              <el-table-column label="字段名">
                <template v-slot="scope1">{{ scope1.row }}</template>
              </el-table-column>
              <el-table-column label="旧值">
                <template v-slot="scope1">{{ scope.row.diffColumns[scope1.row][0] }}</template>
              </el-table-column>
              <el-table-column label="新值">
                <template v-slot="scope1">{{ scope.row.diffColumns[scope1.row][1] }}</template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="200" sortable="custom"
                         :sort-orders="['ascending', 'descending']" class-name="cell-vertical-top" />
      </el-table>
    </div>
    <div class="pagination-container">
      <pagination class="pagination-container" :total="logs.total" v-model:page="listQuery.current" v-model:size="listQuery.size"
                  @pagination="queryLogs"></pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as api from "@/api/dbLog";
import { reactive, ref } from "vue";
import Pagination from "@/components/Pagination/index.vue";
import DateTimePicker from "@/components/DateTimePicker/index.vue";
import { Plus } from "@element-plus/icons-vue";
import { copyObject, notBlank, parseEnums } from "@/utils/objectUtil";

defineOptions({
  name: "SearchOperateLog"
});

const changeTypeEnum = {
  INSERT: { label: "INSERT", value: 1 },
  UPDATE: { label: "UPDATE", value: 2 },
  DELETE: { label: "DELETE", value: 3 }
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
  database: null,
  table: null,
  changeType: null,
  keywordGroups: <any>[{ matchNewColumn: false }],
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
  let queryForm = copyObject(listQuery, ["timeRange"]);
  if (listQuery.timeRange.length >= 2) {
    queryForm.startTime = listQuery.timeRange[0];
    queryForm.endTime = listQuery.timeRange[1];
  }
  queryForm.keywordGroups = listQuery.keywordGroups.filter(g => notBlank(g.columnName) && notBlank(g.columnValue));
  console.log(queryForm);
  api.searchDbLogs(queryForm).then(res => {
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


//查询可用app
const apps = ref([]);
const queryApps = () => {
  api.listApps().then(res => {
    apps.value = res.data;
    console.log("keys", Object.keys(apps.value));
  });
};

//created
queryApps();

</script>

<style scoped lang="scss">
</style>

<style>
.el-table .cell-vertical-top {
  vertical-align: top
}
</style>
