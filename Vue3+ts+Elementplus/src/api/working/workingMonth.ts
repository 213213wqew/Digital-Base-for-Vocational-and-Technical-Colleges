import request from "@/utils/request";
import { WorkingDayReportDTO } from './workingDay'

export interface WorkingMonthDTO {
  queryDate?: string;
  deptId?: number;
  year?: number;
  month?: number;
}

export interface WorkingMonthVO {
  tableId: number;
  tableName: string; // 数据表英文名
  tableChineseName: string; // 数据表中文名
  subsetCode: string;
  subsetName: string;
  catalogCode: string;
  catalogName: string;
  subcatalogCode: string;
  subcatalogName: string;
  deptId: number;
  deptName: string;
  tableReportFrequency: string;
  reportStatus: number;
  monthStartDate: string;
  monthEndDate: string;
  year: number;
  month: number;
}

/**
 * 工作月报API
 */
export const workingMonthApi = {
  /**
   * 获取用户当月需要上报的元数据表列表
   * @param params 查询参数
   * @returns 元数据表列表
   */
  getUserMonthlyReportTables(params: WorkingMonthDTO): Promise<any> {
    return request.post("/api/working/month/user-tables", params);
  },
  

  /**
   * 获取用户所有需要按月上报的元数据表
   * @param deptId 部门ID（可选）
   * @returns 元数据表列表
   */
  getUserMonthlyMetaTables(deptId?: number): Promise<any> {
    return request.get(`/api/working/month/user/tables`, {
      params: { deptId },
    });
  },

  /**
   * 提交工作月报
   * @param params 上报参数
   * @returns 上报结果
   */
  submitReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/month/submit", params);
  },

  /**
   * 确认上报
   * @param params 确认上报参数
   * @returns 确认上报结果
   */
  confirmReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/month/confirm-report", params);
  },

  /**
   * 获取迁移后的数据
   * @param params 查询参数
   * @returns 迁移后的数据
   */
  getMigratedData(params: {
    subsetCode: string;
    tableName: string;
    reportDate: string;
    year: number;
    month: number;
  }): Promise<any> {
    return request.get("/api/working/month/migrated-data", params);
  },

  /**
   * 获取表字段注释信息
   * @param params 查询参数
   * @returns 字段注释信息
   */
  getColumnComments(params: {
    subsetCode: string;
    tableName: string;
  }): Promise<any> {
    return request.get("/api/working/month/column-comments", params);
  },
};
