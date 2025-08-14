import http from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { ApiResponse, PageParams, PageResult } from "@/types";

export interface RoleQuery extends PageParams {
  roleName?: string;
  roleCode?: string;
  status?: number;
}

export interface RoleFormData {
  id?: number;
  roleName: string;
  roleCode: string;
  description?: string;
  dataScope?: number;
  status: number;
}

export interface RoleInfo {
  id: number;
  roleName: string;
  roleCode: string;
  description?: string;
  dataScope?: number;
  status: number;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

/**
 * 角色相关API
 */
export const roleApi = {
  /**
   * 获取角色列表
   * @param params 查询参数
   */
  getRoleList: async (params: RoleQuery): Promise<PageResult<RoleInfo>> => {
    try {
      // 调试：打印参数
      console.log("API调用参数:", params);

      const response: AxiosResponse<ApiResponse<PageResult<RoleInfo>>> =
        await http.get("/api/system/roles", params);
      return (
        response.data?.data || { records: [], total: 0, current: 1, size: 10 }
      );
    } catch (error) {
      console.error("获取角色列表失败:", error);
      throw error;
    }
  },

  /**
   * 获取所有活跃角色（用于下拉选择）
   */
  getAllActiveRoles: async (): Promise<RoleInfo[]> => {
    try {
      const response: AxiosResponse<ApiResponse<RoleInfo[]>> = await http.get(
        "/api/system/roles/active",
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取活跃角色失败:", error);
      throw error;
    }
  },

  /**
   * 获取角色详情
   * @param id 角色ID
   */
  getRoleById: async (id: number): Promise<RoleInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<RoleInfo>> = await http.get(
        `/api/system/roles/${id}`,
      );
      return response.data?.data || ({} as RoleInfo);
    } catch (error) {
      console.error("获取角色详情失败:", error);
      throw error;
    }
  },

  /**
   * 创建角色
   * @param data 角色数据
   */
  createRole: async (data: RoleFormData): Promise<RoleInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<RoleInfo>> = await http.post(
        "/api/system/roles",
        data,
      );
      return response.data?.data || ({} as RoleInfo);
    } catch (error) {
      console.error("创建角色失败:", error);
      throw error;
    }
  },

  /**
   * 更新角色
   * @param id 角色ID
   * @param data 角色数据
   */
  updateRole: async (id: number, data: RoleFormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.put(
        `/api/system/roles/${id}`,
        data,
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("更新角色失败:", error);
      throw error;
    }
  },

  /**
   * 删除角色
   * @param id 角色ID
   */
  deleteRole: async (id: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.delete(
        `/api/system/roles/${id}`,
      );

      if (response.data?.code !== 200) {
        // 如果后端返回了错误信息，则抛出包含该信息的错误
        throw new Error(response.data?.message || "删除角色失败");
      }

      return !!response.data?.data;
    } catch (error) {
      console.error("删除角色失败:", error);
      throw error; // 将错误向上传递，让调用方处理
    }
  },

  /**
   * 批量删除角色
   * @param ids 角色ID数组
   */
  batchDeleteRoles: async (ids: number[]): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.delete(
        "/api/system/roles/batch",
        { data: { ids } },
      );

      if (response.data?.code !== 200) {
        // 如果后端返回了错误信息，则抛出包含该信息的错误
        throw new Error(response.data?.message || "批量删除角色失败");
      }

      return !!response.data?.data;
    } catch (error) {
      console.error("批量删除角色失败:", error);
      throw error; // 将错误向上传递，让调用方处理
    }
  },

  /**
   * 修改角色状态
   * @param id 角色ID
   * @param status 状态值
   */
  changeRoleStatus: async (id: number, status: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.put(
        `/api/system/roles/${id}/status`,
        { status },
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("修改角色状态失败:", error);
      throw error;
    }
  },

  /**
   * 获取角色菜单ID列表
   * @param roleId 角色ID
   */
  getRoleMenuIds: async (roleId: number): Promise<string[]> => {
    try {
      const response: AxiosResponse<ApiResponse<string[]>> = await http.get(
        `/api/menus/role/${roleId}/ids`,
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取角色菜单ID列表失败:", error);
      return [];
    }
  },

  /**
   * 分配角色菜单
   * @param roleId 角色ID
   * @param menuIds 菜单ID数组
   */
  assignRoleMenus: async (
    roleId: number,
    menuIds: string[],
  ): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.post(
        `/api/system/roles/${roleId}/menus`,
        { menuIds },
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("分配角色菜单失败:", error);
      throw error;
    }
  },
};
