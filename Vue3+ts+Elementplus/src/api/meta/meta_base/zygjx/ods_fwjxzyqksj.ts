import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 访问教学资源情况数据接口
 */

// 访问教学资源情况数据表单数据
export interface OdsFwjxzyqksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  fwrybh?: string; // 访问人员编号
  fwryxm?: string; // 访问人员姓名
  jxzybh?: string; // 教学资源编号
  jxzymc?: string; // 教学资源名称
  fwjxzykssj?: string; // 访问教学资源开始时间(格式：YYYYMMDD HHmmss)
  fwjxzyjssj?: string; // 访问教学资源结束时间(格式：YYYYMMDD HHmmss)
  sjcjsj?: string; // 数据采集时间(格式：YYYYMMDD HHmmss)
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 访问教学资源情况数据详情
export interface OdsFwjxzyqksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  fwrybh: string; // 访问人员编号
  fwryxm: string; // 访问人员姓名
  jxzybh: string; // 教学资源编号
  jxzymc: string; // 教学资源名称
  fwjxzykssj: string; // 访问教学资源开始时间(格式：YYYYMMDD HHmmss)
  fwjxzyjssj: string; // 访问教学资源结束时间(格式：YYYYMMDD HHmmss)
  sjcjsj: string; // 数据采集时间(格式：YYYYMMDD HHmmss)
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  fwjxzyksskjDisplay?: string; // 访问开始时间(显示格式)
  fwjxzyjsskjDisplay?: string; // 访问结束时间(显示格式)
  sjcjsjDisplay?: string; // 数据采集时间(显示格式)
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 访问教学资源情况数据查询参数
export interface OdsFwjxzyqksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  fwrybh?: string;
  fwryxm?: string;
  jxzybh?: string;
  jxzymc?: string;
  fwjxzyksskjStart?: string;
  fwjxzyksskjEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 访问教学资源情况数据分页结果
export interface OdsFwjxzyqksjPageResult {
  records: OdsFwjxzyqksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询访问教学资源情况数据
 * @param query 查询参数
 * @returns 访问教学资源情况数据列表
 */
export function getOdsFwjxzyqksjPage(query: OdsFwjxzyqksjQuery) {
  return request.post<ApiResponse<OdsFwjxzyqksjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/page",
    query,
  );
}

/**
 * 根据ID查询访问教学资源情况数据详情
 * @param id 主键ID
 * @returns 访问教学资源情况数据详情
 */
export function getOdsFwjxzyqksjById(id: number) {
  return request.get<ApiResponse<OdsFwjxzyqksjInfo>>(
    `/api/meta/meta-base/zygjx/ods-fwjxzyqksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询访问教学资源情况数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 访问教学资源情况数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsFwjxzyqksjInfo>>(
    `/api/meta/meta-base/zygjx/ods-fwjxzyqksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增访问教学资源情况数据
 * @param data 访问教学资源情况数据信息
 * @returns 结果
 */
export function addOdsFwjxzyqksj(data: OdsFwjxzyqksjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/add",
    data,
  );
}

/**
 * 修改访问教学资源情况数据
 * @param data 访问教学资源情况数据信息
 * @returns 结果
 */
export function updateOdsFwjxzyqksj(data: OdsFwjxzyqksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/update",
    data,
  );
}

/**
 * 删除访问教学资源情况数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsFwjxzyqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-fwjxzyqksj/${id}`,
  );
}

/**
 * 批量删除访问教学资源情况数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsFwjxzyqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出访问教学资源情况数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsFwjxzyqksj(query: OdsFwjxzyqksjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/export",
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
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-fwjxzyqksj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-fwjxzyqksj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-fwjxzyqksj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

// 资源选项接口类型
export interface ResourceOption {
  value: string; // 资源编号
  label: string; // 资源名称
  zybh: string; // 资源编号
  zymc: string; // 资源名称
}

/**
 * 获取教学资源选项列表(用于下拉框)
 * @param keyword 搜索关键字
 * @returns 资源选项列表
 */
export function getResourceOptions(keyword?: string) {
  return request.get<
    ApiResponse<
      Array<{ value: string; label: string; zybh: string; zymc: string }>
    >
  >("/api/meta/meta-base/zygjx/ods-szzyjbsj/resource-options", {
    keyword,
  });
}
