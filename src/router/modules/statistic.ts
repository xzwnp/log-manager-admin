// 最简代码，也就是这些字段必须有
export default {
  path: "/statistic",
  meta: {
    title: "日志统计",
    rank: 4,
    icon: "healthicons:chart-bar-negative"
  },
  children: [
    {
      path: "/operate",
      name: "OperateStatistic",
      component: () => import("@/views/statistic/operate/index.vue"),
      meta: {
        title: "操作统计",
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
