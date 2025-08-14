import { defineStore } from "pinia";
import type { RouteRecordRaw } from "vue-router";
import type { MenuItem } from "@/types";

interface PermissionState {
  routes: RouteRecordRaw[];
  menuList: MenuItem[];
  permissions: string[];
}

export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => ({
    routes: [],
    menuList: [],
    permissions: [],
  }),

  getters: {
    sidebarMenus: (state) => state.menuList.filter((menu) => !menu.hidden),
  },

  actions: {
    async generateRoutes(permissions: string[]): Promise<RouteRecordRaw[]> {
      this.permissions = permissions;

      // 这里应该根据权限生成路由
      // 目前返回空数组，实际项目中需要实现
      this.routes = [];
      this.menuList = [];

      return this.routes;
    },

    hasPermission(permission: string | string[]): boolean {
      if (Array.isArray(permission)) {
        return permission.some((p) => this.permissions.includes(p));
      }
      return this.permissions.includes(permission);
    },

    getBreadcrumbPath(path: string): MenuItem[] {
      // 获取面包屑路径
      return [];
    },

    resetRoutes(): void {
      this.routes = [];
      this.menuList = [];
      this.permissions = [];
    },
  },

  persist: {
    key: "permission-store",
    storage: sessionStorage,
    paths: ["permissions"],
  },
});
