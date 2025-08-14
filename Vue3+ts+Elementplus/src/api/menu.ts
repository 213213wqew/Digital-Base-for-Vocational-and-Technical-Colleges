import { http } from "@/utils/request";
import type { MenuItem, UserMenuPermissions } from "@/types/menu";
import type { AxiosResponse } from "axios";

// 定义后端API返回的数据结构
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 后端菜单数据类型（MenuDTO）
interface BackendMenuDTO {
  id: string;
  name: string;
  path: string;
  icon: string;
  component?: string;
  type: string; // 后端转换后的类型: 'catalog', 'menu', 'button'
  sort: number;
  visible: number;
  status: number;
  permission: string;
  parentId?: string;
  isFrame?: number;
  isCache?: number;
  remark?: string;
  children?: BackendMenuDTO[];
}

// 菜单缓存接口
interface MenuCache {
  timestamp: number;
  data: MenuItem[];
}

// 用户菜单权限缓存接口
interface UserMenuPermissionsCache {
  timestamp: number;
  data: UserMenuPermissions;
}

// 缓存过期时间（毫秒），默认5分钟
const CACHE_EXPIRATION = 5 * 60 * 1000;

// 缓存对象
const menuCache: Record<string, MenuCache> = {};
const userMenuCache: Record<string, UserMenuPermissionsCache> = {};
const roleMenuCache: Record<string, UserMenuPermissionsCache> = {};

/**
 * 检查缓存是否有效
 * @param timestamp 缓存时间戳
 * @returns 是否有效
 */
const isCacheValid = (timestamp: number): boolean => {
  return Date.now() - timestamp < CACHE_EXPIRATION;
};

/**
 * 转换后端DTO数据为前端所需格式
 * @param menuDTO 后端菜单DTO数据
 * @returns 前端菜单数据
 */
const convertMenuDTO = (menuDTO: BackendMenuDTO): MenuItem => {
  // 解析类型字段
  let menuType: "catalog" | "menu" | "button" = "menu";
  if (menuDTO.type === "catalog") menuType = "catalog";
  else if (menuDTO.type === "button") menuType = "button";

  // 创建新对象避免修改原始数据
  const result: MenuItem = {
    id: menuDTO.id,
    name: menuDTO.name,
    path: menuDTO.path || "",
    component: menuDTO.component || "",
    icon: menuDTO.icon || "",
    type: menuType,
    sort: menuDTO.sort || 0,
    permission: menuDTO.permission || "",
    parentId: menuDTO.parentId,
    visible: menuDTO.visible,
    status: menuDTO.status,
    isFrame: menuDTO.isFrame,
    isCache: menuDTO.isCache,
    remark: menuDTO.remark,
    children: undefined, // 初始化为undefined，而不是空数组
  };

  // 递归处理子菜单
  if (menuDTO.children && menuDTO.children.length > 0) {
    result.children = menuDTO.children.map((child) => convertMenuDTO(child));
  }

  return result;
};

/**
 * 调试输出接口响应
 * @param response 接口响应
 * @param apiName 接口名称
 */
const logApiResponse = (
  response: AxiosResponse<ApiResponse<any>>,
  apiName: string,
) => {
  console.log(`${apiName} 响应:`, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    code: response.data.code,
    message: response.data.message,
    data: response.data.data,
  });
};

/**
 * 清除所有菜单相关缓存
 */
export const clearMenuCache = () => {
  // 清空所有缓存对象
  Object.keys(menuCache).forEach((key) => delete menuCache[key]);
  Object.keys(userMenuCache).forEach((key) => delete userMenuCache[key]);
  Object.keys(roleMenuCache).forEach((key) => delete roleMenuCache[key]);
  console.log("所有菜单缓存已清除");
};

/**
 * 菜单相关API
 */
export const menuApi = {
  /**
   * 获取所有菜单列表
   */
  getMenuList: async (): Promise<MenuItem[]> => {
    // 检查缓存
    const cacheKey = "all_menus";
    if (menuCache[cacheKey] && isCacheValid(menuCache[cacheKey].timestamp)) {
      console.log("使用菜单缓存数据");
      return menuCache[cacheKey].data;
    }

    // 缓存不存在或已过期，调用后端接口
    try {
      console.log("从后端获取菜单列表");
      const response: AxiosResponse<ApiResponse<BackendMenuDTO[]>> =
        await http.get("/api/menus/tree");
      // 获取后端返回的树形结构数据
      const menuDTOs = response.data?.data || [];
      // 直接使用后端返回的树形结构数据，转换为前端所需格式
      const menuList = menuDTOs.map(convertMenuDTO);

      // 更新缓存
      menuCache[cacheKey] = {
        timestamp: Date.now(),
        data: menuList,
      };

      return menuList;
    } catch (error) {
      console.error("获取菜单列表失败:", error);
      return [];
    }
  },

  /**
   * 根据用户ID获取菜单权限
   * @param userId 用户ID
   * @param roleId 角色ID（可选）
   */
  getUserMenuPermissions: async (
    userId: number,
    roleId?: string,
  ): Promise<UserMenuPermissions> => {
    // 生成缓存键
    const cacheKey = roleId
      ? `user_${userId}_role_${roleId}`
      : `user_${userId}`;

    // 检查缓存
    if (
      userMenuCache[cacheKey] &&
      isCacheValid(userMenuCache[cacheKey].timestamp)
    ) {
      console.log(`使用缓存的用户菜单权限: ${cacheKey}`);
      return userMenuCache[cacheKey].data;
    }

    try {
      console.log(`从后端获取用户菜单权限: ${cacheKey}`);
      // 调用后端接口获取当前用户信息
      const userInfoResponse: AxiosResponse<
        ApiResponse<{ permissions: string[] }>
      > = await http.get("/api/auth/info");
      const permissions = userInfoResponse.data?.data?.permissions || [];

      // 调用后端接口获取用户菜单（使用DTO接口）
      let menuResponse: AxiosResponse<ApiResponse<BackendMenuDTO[]>>;

      // 根据是否有roleId使用不同的API
      if (roleId) {
        // 有角色ID时，使用角色专用接口
        menuResponse = await http.get(
          `/api/menus/user/${userId}/role/${roleId}/dto`,
        );
        console.log(`使用角色专用菜单API: userId=${userId}, roleId=${roleId}`);
      } else {
        // 没有角色ID，使用所有角色菜单
        menuResponse = await http.get(`/api/menus/user/${userId}/dto`);
        console.log(`使用用户菜单API: userId=${userId}（所有角色）`);
      }

      // 调试输出
      logApiResponse(menuResponse, "getUserMenuPermissions");
      // 转换菜单类型
      const menuDTOs = menuResponse.data?.data || [];
      const menuList = menuDTOs.map(convertMenuDTO);
      const result = {
        userId,
        permissions,
        menuList,
      };

      // 更新缓存
      userMenuCache[cacheKey] = {
        timestamp: Date.now(),
        data: result,
      };

      return result;
    } catch (error) {
      console.error("获取用户菜单权限失败:", error);
      // 如果接口调用失败，返回空数据，防止前端报错
      return {
        userId,
        permissions: [],
        menuList: [],
      };
    }
  },

  /**
   * 根据角色ID获取菜单权限
   * @param roleId 角色ID
   */
  getRoleMenuPermissions: async (
    roleId: string,
  ): Promise<UserMenuPermissions> => {
    // 生成缓存键
    const cacheKey = `role_${roleId}`;

    // 检查缓存
    if (
      roleMenuCache[cacheKey] &&
      isCacheValid(roleMenuCache[cacheKey].timestamp)
    ) {
      console.log(`使用缓存的角色菜单权限: ${cacheKey}`);
      return roleMenuCache[cacheKey].data;
    }

    try {
      console.log(`从后端获取角色菜单权限: ${cacheKey}`);
      // 调用后端接口获取当前用户信息
      const userInfoResponse: AxiosResponse<
        ApiResponse<{ permissions: string[] }>
      > = await http.get("/api/auth/info");
      const permissions = userInfoResponse.data?.data?.permissions || [];
      // 调用后端接口获取角色菜单（使用DTO接口）
      const menuResponse: AxiosResponse<ApiResponse<BackendMenuDTO[]>> =
        await http.get(`/api/menus/role/${roleId}/dto`);

      // 调试输出
      logApiResponse(menuResponse, "getRoleMenuPermissions");
      // 转换菜单类型
      const menuDTOs = menuResponse.data?.data || [];
      const menuList = menuDTOs.map(convertMenuDTO);
      const result = {
        userId: parseInt(roleId), // 这里传递角色ID作为userId（兼容现有接口）
        permissions,
        menuList,
      };

      // 更新缓存
      roleMenuCache[cacheKey] = {
        timestamp: Date.now(),
        data: result,
      };

      return result;
    } catch (error) {
      console.error("获取角色菜单权限失败:", error);
      // 如果接口调用失败，返回空数据，防止前端报错
      return {
        userId: parseInt(roleId),
        permissions: [],
        menuList: [],
      };
    }
  },

  /**
   * 查询菜单列表
   * @param params 查询参数
   */
  queryMenuList: async (params: any): Promise<MenuItem[]> => {
    try {
      // 检查参数是否有效
      const validParams: Record<string, any> = {};
      for (const key in params) {
        if (
          params[key] !== undefined &&
          params[key] !== null &&
          params[key] !== ""
        ) {
          validParams[key] = params[key];
        }
      }

      // 使用tree接口进行查询
      const response: AxiosResponse<ApiResponse<BackendMenuDTO[]>> =
        await http.get("/api/menus/tree", { params: validParams });

      // 返回转换后的数据
      return (response.data?.data || []).map(convertMenuDTO);
    } catch (error) {
      return [];
    }
  },

  /**
   * 创建菜单
   * @param menu 菜单数据
   */
  createMenu: async (menu: Omit<MenuItem, "id">): Promise<MenuItem> => {
    // 转换前端字符串类型为后端数字类型
    const backendMenu: any = { ...menu };

    // 确保类型字段是数字
    if (typeof backendMenu.type === "string") {
      if (backendMenu.type === "catalog") backendMenu.type = 1;
      else if (backendMenu.type === "menu") backendMenu.type = 2;
      else if (backendMenu.type === "button") backendMenu.type = 3;
    }

    try {
      const response: AxiosResponse<ApiResponse<BackendMenuDTO>> =
        await http.post("/api/menus", backendMenu);
      if (!response.data?.data) {
        throw new Error("创建菜单失败：接口返回数据异常");
      }

      // 清除缓存
      clearMenuCache();

      return convertMenuDTO(response.data.data);
    } catch (error) {
      console.error("创建菜单失败:", error);
      throw error;
    }
  },

  /**
   * 更新菜单
   * @param id 菜单ID
   * @param menu 菜单数据
   */
  updateMenu: async (
    id: number,
    menu: Partial<MenuItem>,
  ): Promise<MenuItem> => {
    // 转换前端字符串类型为后端数字类型
    const backendMenu: any = { ...menu };

    // 确保类型字段是数字
    if (
      backendMenu.type !== undefined &&
      typeof backendMenu.type === "string"
    ) {
      if (backendMenu.type === "catalog") backendMenu.type = 1;
      else if (backendMenu.type === "menu") backendMenu.type = 2;
      else if (backendMenu.type === "button") backendMenu.type = 3;
    }
    try {
      const response: AxiosResponse<ApiResponse<BackendMenuDTO>> =
        await http.put(`/api/menus/${id}`, backendMenu);
      if (!response.data?.data) {
        throw new Error("更新菜单失败：接口返回数据异常");
      }

      // 清除缓存
      clearMenuCache();

      return convertMenuDTO(response.data.data);
    } catch (error) {
      console.error("更新菜单失败:", error);
      throw error;
    }
  },

  /**
   * 删除菜单
   * @param id 菜单ID
   */
  deleteMenu: async (id: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.delete(
        `/api/menus/${id}`,
      );

      // 清除缓存
      clearMenuCache();

      return response.data?.code === 200;
    } catch (error) {
      console.error("删除菜单失败:", error);
      return false;
    }
  },

  /**
   * 批量删除菜单
   * @param ids 菜单ID数组
   */
  batchDeleteMenu: async (ids: number[]): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.delete(
        "/api/menus/batch",
        { data: { ids } },
      );

      // 清除缓存
      clearMenuCache();

      return response.data?.code === 200;
    } catch (error) {
      console.error("批量删除菜单失败:", error);
      return false;
    }
  },

  /**
   * 更新菜单排序
   * @param menuSort 菜单排序数据
   */
  updateMenuSort: async (
    menuSort: { id: number; sort: number }[],
  ): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.put(
        "/api/menus/sort",
        menuSort,
      );

      // 清除缓存
      clearMenuCache();

      return response.data?.code === 200;
    } catch (error) {
      console.error("更新菜单排序失败:", error);
      return false;
    }
  },

  /**
   * 清除菜单缓存
   */
  clearCache: clearMenuCache,
};

// 默认导出
export default menuApi;
