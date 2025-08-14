import request from "@/utils/request";
import { WorkingDayReportDTO } from './workingDay'

export interface WorkingWeekDTO {
  queryDate?: string;
  deptId?: number;
}

export interface WorkingWeekVO {
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
  weekStartDate: string;
  weekEndDate: string;
}

/**
 * 工作周报API
 */
export const workingWeekApi = {
  /**
   * 获取用户当周需要上报的元数据表列表
   * @param params 查询参数
   * @returns 元数据表列表
   */
  getUserWeeklyReportTables(params: WorkingWeekDTO): Promise<any> {
    return request.post("/api/working/week/user-tables", params);
  },

  /**
   * 获取用户所有需要按周上报的元数据表
   * @param deptId 部门ID（可选）
   * @returns 元数据表列表
   */
  getUserWeeklyMetaTables(deptId?: number): Promise<any> {
    return request.get(`/api/working/week/user/tables`, { params: { deptId } });
  },

  /**
   * 提交工作周报
   * @param params 上报参数
   * @returns 上报结果
   */
  submitReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/week/submit", params);
  },

  /**
   * 确认上报
   * @param params 确认上报参数
   * @returns 确认上报结果
   */
  confirmReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/week/confirm-report", params);
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
    week: number;
  }): Promise<any> {
    return request.get("/api/working/week/migrated-data", params);
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
    return request.get("/api/working/week/column-comments", params);
  },
};
