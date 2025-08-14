import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

// 实习基础数据信息接口
export interface OdsSxjcsjInfo {
  id?: number;
  zjsjwyxbs: string;
  xxdm: string;
  xh: string;
  xsxm: string;
  zyh?: string;
  zymc?: string;
  bjmc?: string;
  xzm?: string;
  xqm?: string;
  sxsfks?: string;
  sxsfjs?: string;
  sxqyhylbm?: string;
  sxnr?: string;
  sfdk?: string;
  sxapm?: string;
  sxxsm?: string;
  sxsc?: number;
  sxcj?: number;
  sxksrq?: string;
  sxjsrq?: string;
  sxqymc?: string;
  sxddszsjgbm?: string;
  sxddszsjgmc?: string;
  sxddszshjgbm?: string;
  sxddszshjgmc?: string;
  xnzdjsgh?: string;
  xnzdjsxm?: string;
  xnzdjsdh?: string;
  qyzmzdryxm?: string;
  qyzmzdrydh?: string;
  zfsxxssjbc?: number;
  xjjdzxdh?: string;
  sfqdsfxy?: string;
  sfkssx?: string;
  sffgwsx?: string;
  rxnf?: string;
  sjcjsj: string;
  reportStatus?: string;
  enableStatus?: string;
  createTime?: string;
  updateTime?: string;
  // 扩展显示字段
  xzmText?: string;
  xqmText?: string;
  sxsfksText?: string;
  sxsfjsText?: string;
  sxqyhylbmText?: string;
  sfdkText?: string;
  sxapmText?: string;
  sxxsmText?: string;
  sfqdsfxyText?: string;
  sfkssxText?: string;
  sffgwsxText?: string;
  sxksrqDisplay?: string;
  sxjsrqDisplay?: string;
  sjcjsjDisplay?: string;
  reportStatusText?: string;
  enableStatusText?: string;
}

// 分页响应接口
export interface PageResult<T = any> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// 实习基础数据查询参数
export interface OdsSxjcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  zyh?: string;
  zymc?: string;
  bjmc?: string;
  sxqymc?: string;
  sxksrqStart?: string;
  sxksrqEnd?: string;
  sxjsrqStart?: string;
  sxjsrqEnd?: string;
  sxsfks?: string;
  sxsfjs?: string;
  sfdk?: string;
  sxapm?: string;
  sxxsm?: string;
  sfqdsfxy?: string;
  sfkssx?: string;
  sffgwsx?: string;
  rxnf?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 分页查询实习基础数据
export function pageOdsSxjcsj(query: OdsSxjcsjQuery) {
  return request.post<ApiResponse<PageResult<OdsSxjcsjInfo>>>(
    "/code/code/code-base/zygjx/ods-sxjcsj/page",
    query,
  );
}

// 根据ID查询实习基础数据详情
export function getOdsSxjcsjById(id: number) {
  return request.get<ApiResponse<OdsSxjcsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/${id}`,
  );
}

// 根据唯一性标识查询实习基础数据
export function getOdsSxjcsjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxjcsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/unique/${zjsjwyxbs}`,
  );
}

// 新增实习基础数据
export function addOdsSxjcsj(data: OdsSxjcsjInfo) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-sxjcsj/add",
    data,
  );
}

// 修改实习基础数据
export function updateOdsSxjcsj(data: OdsSxjcsjInfo) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxjcsj/update",
    data,
  );
}

// 删除实习基础数据
export function deleteOdsSxjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/${id}`,
  );
}

// 批量删除实习基础数据
export function batchDeleteOdsSxjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxjcsj/batch",
    { data: ids },
  );
}

// 导出实习基础数据
export function exportOdsSxjcsj(query: OdsSxjcsjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-sxjcsj/export", query, {
    responseType: "blob",
    timeout: 60000, // 60秒超时
  });
}

// 修改单个实习基础数据上报状态
export function updateOdsSxjcsjReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/report-status/${id}?reportStatus=${reportStatus}`,
  );
}

// 修改单个实习基础数据启用状态
export function updateOdsSxjcsjEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/enable-status/${id}?enableStatus=${enableStatus}`,
  );
}

// 批量修改实习基础数据上报状态
export function batchUpdateOdsSxjcsjReportStatus(
  ids: number[],
  reportStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/batch/report-status?reportStatus=${reportStatus}`,
    ids,
  );
}

// 批量修改实习基础数据启用状态
export function batchUpdateOdsSxjcsjEnableStatus(
  ids: number[],
  enableStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjcsj/batch/enable-status?enableStatus=${enableStatus}`,
    ids,
  );
}
