import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/types";

/**
 * 课堂互动数据接口
 */

// 课堂互动数据表单数据
export interface OdsKthdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识，32位全局唯一编码字符串（大写字母+数字组合）
  xxdm?: string; // 学校代码，10位数字码
  pkh?: string; // 排课号
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  zc?: string; // 周次
  xqj?: string; // 星期几
  skjc?: string; // 上课节次
  skrq?: string; // 上课日期，格式：YYYYMMDD
  sksj?: string; // 上课时间，格式：HHmmss
  kthdfqzcs?: number; // 课堂互动发起总次数
  xscyzcs?: number; // 学生参与总次数
  xscyl?: number; // 学生参与率
  cql?: number; // 出勤率
  sjcjsj?: string; // 数据采集时间，格式：YYYYMMDD HHmmss
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课堂互动数据详情
export interface OdsKthdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  pkh: string; // 排课号
  kch: string; // 课程号
  kcmc: string; // 课程名称
  zc: string; // 周次
  xqj: string; // 星期几
  skjc: string; // 上课节次
  skrq: string; // 上课日期
  sksj: string; // 上课时间
  kthdfqzcs: number; // 课堂互动发起总次数
  xscyzcs: number; // 学生参与总次数
  xscyl: number; // 学生参与率
  cql: number; // 出勤率
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xqjText?: string; // 星期几文本
  skrqDisplay?: string; // 上课日期显示格式
  sksjDisplay?: string; // 上课时间显示格式
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 课堂互动数据查询参数
export interface OdsKthdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  pkh?: string;
  kch?: string;
  kcmc?: string;
  zc?: string;
  xqj?: string;
  skrq?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 课堂互动数据分页结果
export interface OdsKthdsjPageResult {
  records: OdsKthdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询课堂互动数据
 * @param query 查询参数
 * @returns 课堂互动数据列表
 */
export function getOdsKthdsjPage(query: OdsKthdsjQuery) {
  return request.post<ApiResponse<OdsKthdsjPageResult>>(
    "/data/data/data-base/zygjx/ods-kthdsj/page",
    query,
  );
}

/**
 * 根据ID查询课堂互动数据详情
 * @param id 主键ID
 * @returns 课堂互动数据详情
 */
export function getOdsKthdsjById(id: number) {
  return request.get<ApiResponse<OdsKthdsjInfo>>(
    `/data/data/data-base/zygjx/ods-kthdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询课堂互动数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 课堂互动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKthdsjInfo>>(
    `/data/data/data-base/zygjx/ods-kthdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增课堂互动数据
 * @param data 课堂互动数据信息
 * @returns 结果
 */
export function addOdsKthdsj(data: OdsKthdsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-kthdsj/add",
    data,
  );
}

/**
 * 修改课堂互动数据
 * @param data 课堂互动数据信息
 * @returns 结果
 */
export function updateOdsKthdsj(data: OdsKthdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kthdsj/update",
    data,
  );
}

/**
 * 删除课堂互动数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsKthdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kthdsj/${id}`,
  );
}

/**
 * 批量删除课堂互动数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsKthdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kthdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出课堂互动数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsKthdsj(query: OdsKthdsjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-kthdsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kthdsj/batch/report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kthdsj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 单个修改上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kthdsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 单个修改启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kthdsj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export async function getSystemSchoolCode(): Promise<ApiResponse<string>> {
  const response = await request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
  return response;
}
