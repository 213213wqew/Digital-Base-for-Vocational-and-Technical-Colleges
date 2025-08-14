import Layout from "@/layout/index.vue";

export default {
  path: "/school",
  component: Layout,
  redirect: "/school/dashboard",
  name: "School",
  meta: {
    title: "学校管理",
    icon: "school",
  },
  children: [
    // 其他学校管理相关路由

    // 学校特色信息化系统应用数据
    {
      path: "ods/xxtsxxhxtyysj",
      name: "SpecialSystemApplication",
      component: () => import("@/views/school/ods/xxtsxxhxtyysj/index.vue"),
      meta: {
        title: "特色信息化系统应用数据",
        icon: "data-analysis",
      },
    },
  ],
};
