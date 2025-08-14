import { http } from "@/utils/request";
import type { UserInfo, PageParams, PageResult } from "@/types";
import type { AxiosResponse } from "axios";

// 定义后端API返回的数据结构
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户查询参数
export interface UserQueryParams extends PageParams {
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  status?: number;
  roleId?: string;
  deptId?: string;
  startTime?: string;
  endTime?: string;
}

// 用户创建/更新参数
export interface UserFormData {
  id?: string;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  status: number;
  roleIds: string[];
  deptIds?: number[]; // 部门ID数组，使用数字类型
  deptId?: string; // 为了兼容旧代码保留
  mainDeptId?: number; // 主部门ID
  password?: string;
  remark?: string;
}

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 分页查询用户列表
   * @param params 查询参数
   */
  getUserList: async (
    params: UserQueryParams,
  ): Promise<PageResult<UserInfo>> => {
    try {
      // 调试：打印参数
      console.log("API调用参数:", params);

      const response: AxiosResponse<ApiResponse<PageResult<UserInfo>>> =
        await http.get("/api/users", params);
      return (
        response.data?.data || {
          records: [],
          total: 0,
          current: 1,
          size: 10,
          pages: 0,
        }
      );
    } catch (error) {
      console.error("获取用户列表失败:", error);
      throw error;
    }
  },

  /**
   * 获取用户详情
   * @param id 用户ID
   */
  getUserDetail: async (id: string): Promise<UserInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<UserInfo>> = await http.get(
        `/api/users/${id}`,
      );
      if (!response.data?.data) {
        throw new Error("获取用户详情失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("获取用户详情失败:", error);
      throw error;
    }
  },

  /**
   * 创建用户
   * @param data 用户数据
   */
  createUser: async (data: UserFormData): Promise<UserInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<UserInfo>> = await http.post(
        "/api/users",
        data,
      );
      if (!response.data?.data) {
        throw new Error("创建用户失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("创建用户失败:", error);
      throw error;
    }
  },

  /**
   * 更新用户
   * @param id 用户ID
   * @param data 用户数据
   */
  updateUser: async (
    id: string,
    data: Partial<UserFormData>,
  ): Promise<UserInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<UserInfo>> = await http.put(
        `/api/users/${id}`,
        data,
      );
      if (!response.data?.data) {
        throw new Error("更新用户失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("更新用户失败:", error);
      throw error;
    }
  },

  /**
   * 删除用户
   * @param id 用户ID
   */
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.delete(
        `/api/users/${id}`,
      );
      return response.data?.code === 200;
    } catch (error) {
      console.error("删除用户失败:", error);
      throw error;
    }
  },

  /**
   * 批量删除用户
   * @param ids 用户ID数组
   */
  batchDeleteUser: async (ids: string[]): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.delete(
        "/api/users/batch",
        { data: { ids } },
      );
      return response.data?.code === 200;
    } catch (error) {
      console.error("批量删除用户失败:", error);
      throw error;
    }
  },

  /**
   * 重置用户密码
   * @param id 用户ID
   * @param newPassword 新密码
   */
  resetUserPassword: async (
    id: string,
    newPassword?: string,
  ): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.put(
        `/api/users/${id}/password/reset`,
        { newPassword },
      );
      return response.data?.code === 200;
    } catch (error) {
      console.error("重置用户密码失败:", error);
      throw error;
    }
  },

  /**
   * 修改用户状态
   * @param id 用户ID
   * @param status 状态值（0-禁用, 1-启用）
   */
  changeUserStatus: async (id: string, status: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.put(
        `/api/users/${id}/status`,
        { status },
      );
      return response.data?.code === 200;
    } catch (error) {
      console.error("修改用户状态失败:", error);
      throw error;
    }
  },

  /**
   * 导出用户数据
   * @param params 查询参数
   */
  exportUserData: async (params?: UserQueryParams): Promise<Blob> => {
    try {
      const response = await http.get("/api/users/export", {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      console.error("导出用户数据失败:", error);
      throw error;
    }
  },

  /**
   * 导入用户数据
   * @param file 导入文件
   */
  importUserData: async (
    file: File,
  ): Promise<{
    successCount: number;
    failCount: number;
    errors?: string[];
  }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response: AxiosResponse<
        ApiResponse<{
          successCount: number;
          failCount: number;
          errors?: string[];
        }>
      > = await http.post("/api/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!response.data?.data) {
        throw new Error("导入用户数据失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("导入用户数据失败:", error);
      throw error;
    }
  },

  /**
   * 获取用户角色列表
   * @param id 用户ID
   */
  getUserRoles: async (id: string): Promise<string[]> => {
    try {
      const response: AxiosResponse<ApiResponse<string[]>> = await http.get(
        `/api/users/${id}/roles`,
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取用户角色失败:", error);
      throw error;
    }
  },

  /**
   * 分配用户角色
   * @param id 用户ID
   * @param roleIds 角色ID数组
   */
  assignUserRoles: async (id: string, roleIds: string[]): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<null>> = await http.put(
        `/api/users/${id}/roles`,
        { roleIds },
      );
      return response.data?.code === 200;
    } catch (error) {
      console.error("分配用户角色失败:", error);
      throw error;
    }
  },
};

// 默认导出
export default userApi;
