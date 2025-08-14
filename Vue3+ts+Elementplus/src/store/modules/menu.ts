import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { MenuItem } from "@/types/menu";
import { MenuUtils } from "@/utils/menu";
import { menuApi } from "@/api/menu";
import { useUserStore } from "./user";

/**
 * 菜单状态管理
 */
export const useMenuStore = defineStore(
  "menu",
  () => {
    // 状态
    const menuList = ref<MenuItem[]>([]);
    const userPermissions = ref<string[]>([]);
    const loading = ref(false);
    const menuLoaded = ref(false); // 菜单是否已加载标识
    const currentRoleId = ref<string | null>(null); // 当前加载菜单使用的角色ID
    const currentUserId = ref<number | null>(null); // 当前加载菜单使用的用户ID

    // 计算属性

    /**
     * 显示的菜单列表（直接使用后端返回的菜单，不做过滤）
     */
    const filteredMenuList = computed(() => {
      // 直接返回后端传来的菜单，不做过滤
      return menuList.value;
    });

    /**
     * 菜单树形结构
     */
    const menuTree = computed(() => {
      return MenuUtils.buildMenuTree(menuList.value);
    });

    /**
     * 路由配置
     */
    const routeConfig = computed(() => {
      return MenuUtils.menuToRoutes(menuList.value);
    });

    /**
     * 扁平化的菜单列表
     */
    const flatMenuList = computed(() => {
      return MenuUtils.flattenMenus(menuList.value);
    });

    // 操作方法

    /**
     * 初始化菜单数据
     */
    const initMenuData = async () => {
      loading.value = true;
      try {
        const menus = await menuApi.getMenuList();
        menuList.value = menus;
        menuLoaded.value = true;
      } catch (error) {
        console.error("获取菜单数据失败:", error);
        menuList.value = [];
      } finally {
        loading.value = false;
      }
    };

    /**
     * 设置用户权限
     * @param permissions 权限列表
     */
    const setUserPermissions = (permissions: string[]) => {
      userPermissions.value = permissions;
    };

    /**
     * 根据用户ID获取菜单权限
     * @param userId 用户ID
     * @param roleId 角色ID（可选）
     */
    const getUserMenuPermissions = async (
      userId: number | string,
      roleId?: string,
    ) => {
      // 检查是否需要重新加载
      if (
        menuLoaded.value &&
        currentUserId.value === userId &&
        currentRoleId.value === roleId &&
        menuList.value.length > 0
      ) {
        console.log("菜单已加载，使用缓存数据:", {
          userId,
          roleId: roleId || "(所有角色)",
          menuCount: menuList.value.length,
        });
        return {
          userId,
          permissions: userPermissions.value,
          menuList: menuList.value,
        };
      }

      loading.value = true;
      try {
        const data = await menuApi.getUserMenuPermissions(
          userId as number,
          roleId,
        );

        // 设置菜单和权限数据
        menuList.value = data.menuList || [];
        userPermissions.value = data.permissions || [];
        menuLoaded.value = true;
        currentUserId.value = userId as number;
        currentRoleId.value = roleId || null;

        console.log("菜单加载完成:", {
          userId,
          roleId: roleId || "(所有角色)",
          menuCount: menuList.value.length,
        });

        return data;
      } catch (error) {
        console.error("获取用户菜单权限失败:", error);
        menuList.value = [];
        userPermissions.value = [];
        throw error;
      } finally {
        loading.value = false;
      }
    };

    /**
     * 根据角色ID获取菜单权限
     * @param roleId 角色ID
     */
    const getRoleMenuPermissions = async (roleId: string) => {
      // 检查是否需要重新加载
      if (
        menuLoaded.value &&
        currentRoleId.value === roleId &&
        menuList.value.length > 0
      ) {
        console.log("使用缓存的角色菜单数据:", {
          roleId,
          menuCount: menuList.value.length,
        });
        return {
          userId: parseInt(roleId),
          permissions: userPermissions.value,
          menuList: menuList.value,
        };
      }

      loading.value = true;
      try {
        const data = await menuApi.getRoleMenuPermissions(roleId);

        // 设置菜单和权限数据
        menuList.value = data.menuList || [];
        userPermissions.value = data.permissions || [];
        menuLoaded.value = true;
        currentRoleId.value = roleId;
        currentUserId.value = null;

        return data;
      } catch (error) {
        console.error("获取角色菜单权限失败:", error);
        menuList.value = [];
        userPermissions.value = [];
        throw error;
      } finally {
        loading.value = false;
      }
    };

    /**
     * 根据用户ID和角色ID获取菜单权限（角色切换专用）
     * @param userId 用户ID
     * @param roleId 角色ID
     */
    const getUserRoleMenuPermissions = async (
      userId: string | number,
      roleId: string,
    ) => {
      // 直接调用getUserMenuPermissions，它已包含缓存检查逻辑
      return getUserMenuPermissions(userId, roleId);
    };

    /**
     * 检查用户是否有某个权限
     * @param permission 权限标识
     */
    const hasPermission = (permission: string): boolean => {
      return userPermissions.value.includes(permission);
    };

    /**
     * 检查用户是否有某些权限中的任意一个
     * @param permissions 权限标识数组
     */
    const hasAnyPermission = (permissions: string[]): boolean => {
      return permissions.some((permission) =>
        userPermissions.value.includes(permission),
      );
    };

    /**
     * 检查用户是否有某些权限的全部
     * @param permissions 权限标识数组
     */
    const hasAllPermissions = (permissions: string[]): boolean => {
      return permissions.every((permission) =>
        userPermissions.value.includes(permission),
      );
    };

    /**
     * 根据路径查找菜单
     * @param path 路径
     */
    const findMenuByPath = (path: string): MenuItem | null => {
      return MenuUtils.findMenu(menuList.value, (menu) => menu.path === path);
    };

    /**
     * 根据ID查找菜单
     * @param id 菜单ID
     */
    const findMenuById = (id: string): MenuItem | null => {
      return MenuUtils.findMenu(menuList.value, (menu) => menu.id === id);
    };

    /**
     * 根据路径构建面包屑
     * @param path 路径
     */
    const buildBreadcrumb = (path: string): MenuItem[] => {
      return MenuUtils.buildBreadcrumb(menuList.value, path);
    };

    /**
     * 获取默认展开的菜单键值
     * @param path 当前路径
     */
    const getDefaultOpenKeys = (path: string): string[] => {
      const breadcrumb = buildBreadcrumb(path);
      return breadcrumb
        .filter((item) => item.type === "catalog")
        .map((item) => String(item.id));
    };

    /**
     * 添加菜单
     * @param menu 菜单数据
     */
    const addMenu = async (menu: Omit<MenuItem, "id">): Promise<MenuItem> => {
      try {
        const newMenu = await menuApi.createMenu(menu);
        menuLoaded.value = false; // 标记菜单需要重新加载
        return newMenu;
      } catch (error) {
        console.error("添加菜单失败:", error);
        throw error;
      }
    };

    /**
     * 更新菜单
     * @param id 菜单ID
     * @param menu 菜单数据
     */
    const updateMenu = async (
      id: number | string,
      menu: Partial<MenuItem>,
    ): Promise<MenuItem> => {
      try {
        const updatedMenu = await menuApi.updateMenu(Number(id), menu);
        menuLoaded.value = false; // 标记菜单需要重新加载
        return updatedMenu;
      } catch (error) {
        console.error("更新菜单失败:", error);
        throw error;
      }
    };

    /**
     * 删除菜单
     * @param id 菜单ID
     */
    const deleteMenu = async (id: number | string): Promise<boolean> => {
      try {
        const success = await menuApi.deleteMenu(Number(id));
        if (success) {
          // 从当前菜单列表中移除
          menuList.value = menuList.value.filter((item) => item.id !== id);
          menuLoaded.value = false; // 标记菜单需要重新加载
        }
        return success;
      } catch (error) {
        console.error("删除菜单失败:", error);
        throw error;
      }
    };

    /**
     * 批量删除菜单
     * @param ids 菜单ID数组
     */
    const batchDeleteMenu = async (ids: string[]): Promise<boolean> => {
      try {
        const success = await menuApi.batchDeleteMenu(
          ids.map((id) => Number(id)),
        );
        if (success) {
          menuList.value = menuList.value.filter(
            (item) => !ids.includes(item.id),
          );
          menuLoaded.value = false; // 标记菜单需要重新加载
        }
        return success;
      } catch (error) {
        console.error("批量删除菜单失败:", error);
        throw error;
      }
    };

    /**
     * 重置菜单状态
     */
    const resetMenuState = () => {
      menuList.value = [];
      userPermissions.value = [];
      loading.value = false;
      menuLoaded.value = false;
      currentRoleId.value = null;
      currentUserId.value = null;
    };

    // 监听用户状态变化
    const userStore = useUserStore();

    // 当角色变化时，标记菜单需要重新加载
    watch(
      () => userStore.currentRoleId,
      (newRoleId, oldRoleId) => {
        if (newRoleId !== oldRoleId) {
          menuLoaded.value = false;
        }
      },
    );

    return {
      // 状态
      menuList,
      userPermissions,
      loading,
      menuLoaded,

      // 计算属性
      filteredMenuList,
      menuTree,
      routeConfig,
      flatMenuList,

      // 方法
      initMenuData,
      setUserPermissions,
      getUserMenuPermissions,
      getRoleMenuPermissions,
      getUserRoleMenuPermissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      findMenuByPath,
      findMenuById,
      buildBreadcrumb,
      getDefaultOpenKeys,
      addMenu,
      updateMenu,
      deleteMenu,
      batchDeleteMenu,
      resetMenuState,
    };
  },
  {
    persist: {
      key: "menu-store",
      storage: sessionStorage,
      paths: [
        "menuList",
        "userPermissions",
        "menuLoaded",
        "currentRoleId",
        "currentUserId",
      ],
    },
  },
);
