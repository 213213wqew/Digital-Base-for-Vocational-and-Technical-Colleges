import { http } from "@/utils/request";
import type { AxiosResponse } from "axios";

// 定义后端API返回的数据结构
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 操作日志查询参数接口
export interface OperationLogQueryParams {
  current: number;
  size: number;
  username?: string;
  roleName?: string;
  operationModule?: string;
  operationType?: string;
  operationResult?: number;
  startTime?: string;
  endTime?: string;
}

// 操作日志数据接口
export interface OperationLogItem {
  id: string;
  userId: string;
  username: string;
  realName: string;
  roleId?: string;
  roleName?: string;
  operationModule: string;
  operationType: string;
  operationDesc: string;
  requestParams?: string;
  responseResult?: string;
  ipAddress: string;
  userAgent: string;
  operationTime: string;
  executionTime: number;
  operationResult: number;
  errorMsg?: string;
  createTime: string;
  updateTime: string;
}

// 分页结果接口
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 操作日志API
 */
export const operationLogApi = {
  /**
   * 分页查询操作日志
   */
  getLogPage: async (
    params: OperationLogQueryParams,
  ): Promise<PageResult<OperationLogItem>> => {
    try {
      // 调试：打印参数
      console.log("操作日志API调用参数:", params);

      const response: AxiosResponse<ApiResponse<PageResult<OperationLogItem>>> =
        await http.post("/api/system/operation-log/page", params);
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
      console.error("获取操作日志列表失败:", error);
      throw error;
    }
  },

  /**
   * 获取日志详情
   */
  getLogDetail: async (id: string): Promise<OperationLogItem> => {
    try {
      const response: AxiosResponse<ApiResponse<OperationLogItem>> =
        await http.get(`/api/system/operation-log/detail/${id}`);
      if (!response.data?.data) {
        throw new Error("获取日志详情失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("获取日志详情失败:", error);
      throw error;
    }
  },

  /**
   * 清理历史日志
   */
  cleanOldLogs: async (days: number): Promise<number> => {
    try {
      const response: AxiosResponse<ApiResponse<number>> = await http.post(
        "/api/system/operation-log/clean",
        null,
        { params: { days } },
      );
      if (response.data?.data === undefined) {
        throw new Error("清理历史日志失败：接口返回数据异常");
      }
      return response.data.data;
    } catch (error) {
      console.error("清理历史日志失败:", error);
      throw error;
    }
  },
};

// 默认导出
export default operationLogApi;
