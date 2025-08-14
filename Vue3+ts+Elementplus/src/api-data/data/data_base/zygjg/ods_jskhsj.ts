import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 教师考核数据接口
 */

// 教师考核数据表单数据
export interface OdsJskhsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  jzgxm?: string; // 教师姓名
  jzgkhlbm?: string; // 教职工考核类别码
  jzgkhrq?: string; // 教职工考核日期
  jzgkhnr?: string; // 教职工考核内容
  jzgkhdwh?: string; // 教职工考核单位号
  khdwmc?: string; // 考核单位名称
  dwkhjgm?: string; // 单位考核结果码
  dwkhfzrh?: string; // 单位考核负责人号
  fzrxm?: string; // 负责人姓名
  xxkhjgm?: string; // 学校考核结果码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 教师考核数据详情
export interface OdsJskhsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  jzgxm: string; // 教师姓名
  jzgkhlbm: string; // 教职工考核类别码
  jzgkhrq: string; // 教职工考核日期
  jzgkhnr: string; // 教职工考核内容
  jzgkhdwh: string; // 教职工考核单位号
  khdwmc: string; // 考核单位名称
  dwkhjgm: string; // 单位考核结果码
  dwkhfzrh: string; // 单位考核负责人号
  fzrxm: string; // 负责人姓名
  xxkhjgm: string; // 学校考核结果码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jzgkhlbmText?: string; // 教职工考核类别名称
  dwkhjgmText?: string; // 单位考核结果名称
  xxkhjgmText?: string; // 学校考核结果名称
}

// 教师考核数据查询参数
export interface OdsJskhsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  jzgxm?: string;
  jzgkhlbm?: string;
  khdwmc?: string;
  dwkhjgm?: string;
  xxkhjgm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教师考核数据分页结果
export interface OdsJskhsjPageResult {
  records: OdsJskhsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 分页查询教师考核数据
 */
export function getOdsJskhsjPage(query: OdsJskhsjQuery) {
  return request.post<ApiResponse<OdsJskhsjPageResult>>(
    "/data/data/data-base/zygjg/ods-jskhsj/page",
    query,
  );
}

/**
 * 根据ID查询教师考核数据详情
 */
export function getOdsJskhsjById(id: number) {
  return request.get<ApiResponse<OdsJskhsjInfo>>(
    `/data/data/data-base/zygjg/ods-jskhsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教师考核数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJskhsjInfo>>(
    `/data/data/data-base/zygjg/ods-jskhsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教师考核数据
 */
export function addOdsJskhsj(data: OdsJskhsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjg/ods-jskhsj/add",
    data,
  );
}

/**
 * 修改教师考核数据
 */
export function updateOdsJskhsj(data: OdsJskhsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-jskhsj/update",
    data,
  );
}

/**
 * 删除教师考核数据
 */
export function deleteOdsJskhsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjg/ods-jskhsj/${id}`,
  );
}

/**
 * 批量删除教师考核数据
 */
export function batchDeleteOdsJskhsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-jskhsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教师考核数据
 */
export function exportOdsJskhsj(query: OdsJskhsjQuery) {
  return request.post("/data/data/data-base/zygjg/ods-jskhsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 教职工考核类别 (JZGKHLBDM)
 */
export function getAssessmentTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JZGKHLBDM",
  );
}

/**
 * 获取字典数据 - 考核结果 (KHJGDM)
 */
export function getAssessmentResultOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/KHJGDM",
  );
}

/**
 * 批量修改上报状态
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-jskhsj/batch-report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-jskhsj/batch-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单条记录上报状态
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjg/ods-jskhsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单条记录启用状态
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjg/ods-jskhsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}
