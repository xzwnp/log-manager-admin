// 最简代码，也就是这些字段必须有
export default {
  path: "/search",
  meta: {
    title: "系统管理",
    icon: "icon-park-solid:system",
    rank: 1
  },
  children: [
    {
      path: "/sys/user",
      name: "UserAdmin",
      component: () => import("@/views/sys/user/index.vue"),
      meta: {
        title: "用户管理",
        showParent: true
      }
    },
    {
      path: "/sys/app",
      name: "AppAdmin",
      component: () => import("@/views/sys/app/index.vue"),
      meta: {
        title: "应用管理",
        showParent: true
      }
    }
  ]
} as RouteConfigsTable;
