import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 访问数字图书馆资源数据接口
 */

// 访问数字图书馆资源数据表单数据
export interface OdsFwsztsgzysjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dzqkfwcs?: number; // 电子期刊访问次数
  dztsfwcs?: number; // 电子图书访问次数
  fwrq?: string; // 访问日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 访问数字图书馆资源数据详情
export interface OdsFwsztsgzysjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzqkfwcs: number; // 电子期刊访问次数
  dztsfwcs: number; // 电子图书访问次数
  fwrq: string; // 访问日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  fwrqDisplay?: string; // 访问日期显示格式
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
  totalFwcs?: number; // 总访问次数
}

// 访问数字图书馆资源数据查询参数
export interface OdsFwsztsgzysjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  fwrqStart?: string;
  fwrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 访问数字图书馆资源数据分页结果
export interface OdsFwsztsgzysjPageResult {
  records: OdsFwsztsgzysjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询访问数字图书馆资源数据
 * @param query 查询参数
 * @returns 访问数字图书馆资源数据列表
 */
export function getOdsFwsztsgzysjPage(query: OdsFwsztsgzysjQuery) {
  return request.post<ApiResponse<OdsFwsztsgzysjPageResult>>(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/page",
    query,
  );
}

/**
 * 根据ID查询访问数字图书馆资源数据详情
 * @param id 主键ID
 * @returns 访问数字图书馆资源数据详情
 */
export function getOdsFwsztsgzysjById(id: number) {
  return request.get<ApiResponse<OdsFwsztsgzysjInfo>>(
    `/code/code/code-base/zygjx/ods-fwsztsgzysj/${id}`,
  );
}

/**
 * 根据唯一性标识查询访问数字图书馆资源数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 访问数字图书馆资源数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsFwsztsgzysjInfo>>(
    `/code/code/code-base/zygjx/ods-fwsztsgzysj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增访问数字图书馆资源数据
 * @param data 访问数字图书馆资源数据信息
 * @returns 结果
 */
export function addOdsFwsztsgzysj(data: OdsFwsztsgzysjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/add",
    data,
  );
}

/**
 * 修改访问数字图书馆资源数据
 * @param data 访问数字图书馆资源数据信息
 * @returns 结果
 */
export function updateOdsFwsztsgzysj(data: OdsFwsztsgzysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/update",
    data,
  );
}

/**
 * 删除访问数字图书馆资源数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsFwsztsgzysj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-fwsztsgzysj/${id}`,
  );
}

/**
 * 批量删除访问数字图书馆资源数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsFwsztsgzysj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出访问数字图书馆资源数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsFwsztsgzysj(query: OdsFwsztsgzysjQuery) {
  return request.post(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/batch/report-status",
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
    "/code/code/code-base/zygjx/ods-fwsztsgzysj/batch/enable-status",
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
    `/code/code/code-base/zygjx/ods-fwsztsgzysj/${id}/report-status`,
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
    `/code/code/code-base/zygjx/ods-fwsztsgzysj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}
