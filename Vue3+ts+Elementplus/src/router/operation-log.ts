import type { RouteRecordRaw } from "vue-router";

/**
 * 操作日志路由配置
 */
export const operationLogRoutes: RouteRecordRaw[] = [
  {
    path: "/system/operation-log",
    name: "OperationLog",
    component: () => import("@/views/system/operation-log/index.vue"),
    meta: {
      title: "操作日志",
      icon: "Document",
      requireAuth: true,
    },
  },
];

export default operationLogRoutes;
