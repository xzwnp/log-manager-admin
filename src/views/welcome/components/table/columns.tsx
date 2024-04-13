import { tableData } from "../../data";
import { delay } from "@pureadmin/utils";
import { ref, onMounted, reactive } from "vue";
import type { PaginationProps } from "@pureadmin/table";
import Empty from "./empty.svg?component";

export function useColumns() {
  const dataList = ref([]);
  const loading = ref(true);
  const columns: TableColumnList = [
    {
      sortable: true,
      label: "序号",
      prop: "id"
    },
    {
      sortable: true,
      label: "应用日志数",
      prop: "appLogNumber"
    },
    {
      sortable: true,
      label: "数据库日志数",
      prop: "dbLogNumber"
    },
    {
      sortable: true,
      label: "操作次数",
      prop: "operateLogNumber"
    },
    {
      sortable: true,
      label: "告警次数",
      prop: "alertNumber"
    },
    {
      sortable: true,
      label: "统计日期",
      prop: "date"
    }
  ];

  /** 分页配置 */
  const pagination = reactive<PaginationProps>({
    pageSize: 10,
    currentPage: 1,
    layout: "prev, pager, next",
    total: 0,
    align: "center"
  });

  function onCurrentChange(page: number) {
    console.log("onCurrentChange", page);
    loading.value = true;
    delay(300).then(() => {
      loading.value = false;
    });
  }

  onMounted(() => {
    dataList.value = tableData;
    pagination.total = dataList.value.length;
    loading.value = false;
  });

  return {
    Empty,
    loading,
    columns,
    dataList,
    pagination,
    onCurrentChange
  };
}
