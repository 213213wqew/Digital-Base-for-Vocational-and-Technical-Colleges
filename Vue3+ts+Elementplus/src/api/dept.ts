import http from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";

export interface DeptQuery {
  deptName?: string;
  deptCode?: string;
  status?: number;
}

export interface DeptFormData {
  id?: number;
  deptName: string;
  deptCode: string;
  parentId?: number;
  orderNum?: number;
  leaderId?: string;
  phone?: string;
  email?: string;
  status: number;
  remark?: string;
}

export interface DeptInfo {
  id: number;
  deptName: string;
  deptCode: string;
  parentId?: number;
  parentName?: string;
  orderNum?: number;
  leaderId?: string;
  leaderName?: string;
  phone?: string;
  email?: string;
  status: number;
  createTime?: string;
  updateTime?: string;
  remark?: string;
  children?: DeptInfo[];
}

export interface UserOption {
  id: string;
  name: string;
}

export interface MetaTableInfo {
  id?: number;
  deptId?: number;
  tableId: number;
  subcatalogCode: string;
  subcatalogName: string;
  catalogCode: string;
  catalogName: string;
  subsetCode: string;
  subsetName: string;
  tableReportFrequency?: string;
  defaultReportFrequency?: string;
}

export interface MetaTableSaveParams {
  deptId: number;
  tableRelations: {
    metaTableId: number;
    tableReportFrequency: string;
  }[];
}

/**
 * 部门相关API
 */
export const deptApi = {
  /**
   * 获取部门列表
   * @param params 查询参数
   */
  getDeptList: async (params: DeptQuery): Promise<DeptInfo[]> => {
    try {
      console.log("API调用参数:", params);

      const response: AxiosResponse<ApiResponse<DeptInfo[]>> = await http.get(
        "/api/system/depts",
        params,
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取部门列表失败:", error);
      throw error;
    }
  },

  /**
   * 获取部门树
   * @param params 查询参数
   */
  getDeptTree: async (params?: DeptQuery): Promise<DeptInfo[]> => {
    try {
      const response: AxiosResponse<ApiResponse<DeptInfo[]>> = await http.get(
        "/api/system/depts/tree",
        params,
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取部门树失败:", error);
      throw error;
    }
  },

  /**
   * 获取部门详情
   * @param id 部门ID
   */
  getDeptById: async (id: number): Promise<DeptInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<DeptInfo>> = await http.get(
        `/api/system/depts/${id}`,
      );
      return response.data?.data || ({} as DeptInfo);
    } catch (error) {
      console.error("获取部门详情失败:", error);
      throw error;
    }
  },

  /**
   * 获取用户列表（用于选择负责人）
   */
  getUserList: async (): Promise<UserOption[]> => {
    try {
      const response: AxiosResponse<ApiResponse<UserOption[]>> = await http.get(
        "/api/system/depts/users",
      );
      return response.data?.data || [];
    } catch (error) {
      console.error("获取用户列表失败:", error);
      throw error;
    }
  },

  /**
   * 创建部门
   * @param data 部门数据
   */
  createDept: async (data: DeptFormData): Promise<DeptInfo> => {
    try {
      const response: AxiosResponse<ApiResponse<DeptInfo>> = await http.post(
        "/api/system/depts",
        data,
      );
      return response.data?.data || ({} as DeptInfo);
    } catch (error) {
      console.error("创建部门失败:", error);
      throw error;
    }
  },

  /**
   * 更新部门
   * @param id 部门ID
   * @param data 部门数据
   */
  updateDept: async (id: number, data: DeptFormData): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.put(
        `/api/system/depts/${id}`,
        data,
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("更新部门失败:", error);
      throw error;
    }
  },

  /**
   * 删除部门
   * @param id 部门ID
   */
  deleteDept: async (id: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.delete(
        `/api/system/depts/${id}`,
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("删除部门失败:", error);
      throw error;
    }
  },

  /**
   * 修改部门状态
   * @param id 部门ID
   * @param status 状态值
   */
  changeDeptStatus: async (id: number, status: number): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.put(
        `/api/system/depts/${id}/status`,
        { status },
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("修改部门状态失败:", error);
      throw error;
    }
  },

  getDeptMetaTables: async (deptId: number): Promise<MetaTableInfo[]> => {
    try {
      const response: AxiosResponse<ApiResponse<MetaTableInfo[]>> =
        await http.get(`/api/system/dept-meta-tables/dept/${deptId}`);
      return response.data?.data || [];
    } catch (error) {
      console.error("获取部门关联的元数据表失败:", error);
      throw error;
    }
  },

  getAvailableMetaTables: async (deptId: number): Promise<MetaTableInfo[]> => {
    try {
      const response: AxiosResponse<ApiResponse<MetaTableInfo[]>> =
        await http.get(`/api/system/dept-meta-tables/available/${deptId}`);
      return response.data?.data || [];
    } catch (error) {
      console.error("获取可关联的元数据表失败:", error);
      throw error;
    }
  },

  saveDeptMetaTables: async (data: MetaTableSaveParams): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.post(
        "/api/system/dept-meta-tables",
        data,
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("保存部门与元数据表关联失败:", error);
      throw error;
    }
  },

  deleteDeptMetaTables: async (ids: number[]): Promise<boolean> => {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await http.delete(
        "/api/system/dept-meta-tables",
        { data: ids },
      );
      return !!response.data?.data;
    } catch (error) {
      console.error("删除部门与元数据表关联失败:", error);
      throw error;
    }
  },
};
