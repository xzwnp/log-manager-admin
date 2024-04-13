// 最简代码，也就是这些字段必须有
export default {
  path: "/search",
  meta: {
    title: "日志查询",
    icon: "fluent:slide-search-32-filled",
    rank: 2
  },
  children: [
    {
      path: "/appLog/index",
      name: "SearchAppLog",
      component: () => import("@/views/search/appLog/index.vue"),
      meta: {
        title: "应用日志查询"
      }
    },
    {
      path: "/operateLog/index",
      name: "SearchOperateLog",
      component: () => import("@/views/search/operateLog/index.vue"),
      meta: {
        title: "操作日志查询"
      }
    },
    {
      path: "/dbLog/index",
      name: "SearchDbLog",
      component: () => import("@/views/search/dbLog/index.vue"),
      meta: {
        title: "数据库日志查询"
      }
    }
  ]
} as RouteConfigsTable;
