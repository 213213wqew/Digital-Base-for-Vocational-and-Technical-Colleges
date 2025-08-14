import request from "@/utils/request";


export interface WorkingDayDTO {
  userId?: string;
  queryDate?: string;
  deptId?: number;
}

export interface WorkingDayReportDTO {
  tableId: number;
  tableName: string;
  subsetCode: string;
  deptId: number;
  reportDate: string;
  metaBaseTableName?: string; // 新增：meta_base表名
}

export interface WorkingDayVO {
  tableId: number;
  tableName: string;
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
  reportDate: string;
}

/**
 * 工作日报API
 */
export const workingDayApi = {
  /**
   * 获取用户当天需要上报的元数据表列表
   * @param params 查询参数
   * @returns 元数据表列表
   */
  getUserDailyReportTables(params: WorkingDayDTO): Promise<any> {
    return request.post("/api/working/day/user-tables", params);
  },

  /**
   * 获取用户所有需要按天上报的元数据表
   * @param deptId 部门ID（可选）
   * @returns 元数据表列表
   */
  getUserDailyMetaTables(deptId?: number): Promise<any> {
    return request.get(`/api/working/day/user/tables`, { params: { deptId } });
  },

  /**
   * 提交工作日报
   * @param params 上报参数
   * @returns 上报结果
   */
  submitReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/day/submit", params);
  },

  /**
   * 确认上报
   * @param params 确认上报参数
   * @returns 确认上报结果
   */
  confirmReport(params: WorkingDayReportDTO): Promise<any> {
    return request.post("/api/working/day/confirm-report", params);
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
  }): Promise<any> {
    return request.get("/api/working/day/migrated-data", params );
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
    return request.get("/api/working/day/column-comments", params );
  },

  /**
   * 数据校验
   * @param params 校验参数
   * @returns 校验结果
   */
  validateData(params: {
    tableName: string;
    subsetCode: string;
    reportDate: string;
  }): Promise<any> {
    return request.post("/api/working/day/validate-data", params);
  },
};
