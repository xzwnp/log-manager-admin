// 最简代码，也就是这些字段必须有
export default {
  path: "/alert",
  meta: {
    title: "日志告警",
    rank: 3,
    icon: "fluent:warning-shield-20-filled"
  },
  children: [
    {
      path: "/rules/list",
      name: "AlertRuleList",
      component: () => import("@/views/alert/rules.vue"),
      meta: {
        title: "规则配置"
      }
    },
    {
      path: "/history",
      name: "AlertHistory",
      component: () => import("@/views/alert/history.vue"),
      meta: {
        title: "告警历史"
      }
    }
  ]
} as RouteConfigsTable;
