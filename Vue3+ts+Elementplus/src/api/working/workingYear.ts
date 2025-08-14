import request from "@/utils/request";
import { WorkingDayReportDTO } from './workingDay'

export interface WorkingYearDTO {
  queryDate?: string;
  deptId?: number;
  year?: number;
}

export interface WorkingYearVO {
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
  yearStartDate: string;
  yearEndDate: string;
  year: number;
}

/**
 * 工作年报API
 */
export const workingYearApi = {
  /**
   * 获取用户当年需要上报的元数据表列表
   * @param params 查询参数
   * @returns 元数据表列表
   */
  getUserYearlyReportTables(params: WorkingYearDTO): Promise<any> {
    return request.post("/api/working/year/user-tables", params);
  },

  /**
   * 获取用户所有需要按年上报的元数据表
   * @param deptId 部门ID（可选）
   * @returns 元数据表列表
   */
  getUserYearlyMetaTables(deptId?: number): Promise<any> {
    return request.get(`/api/working/year/user/tables`, { params: { deptId } });
  },

  /**
   * 提交工作年报
   * @param params 上报参数
   * @returns 上报结果
   */
  submitReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/year/submit", params);
  },

  /**
   * 确认上报
   * @param params 确认上报参数
   * @returns 确认上报结果
   */
  confirmReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/year/confirm-report", params);
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
  }): Promise<any> {
    return request.get("/api/working/year/migrated-data", params);
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
    return request.get("/api/working/year/column-comments", params);
  },
};
