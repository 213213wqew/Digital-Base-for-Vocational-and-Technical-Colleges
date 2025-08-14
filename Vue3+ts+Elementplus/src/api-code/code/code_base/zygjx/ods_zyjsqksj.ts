import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

// 专业建设情况数据API

export interface OdsZyjsqksjDTO {
  id?: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zyh?: string; // 专业号
  zdzyjbm?: string; // 重点专业级别码
  zdzylxm?: string; // 重点专业类型码
  syrq?: string; // 授予日期
  bz?: string; // 备注
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态 0:未上报 1:已上报 2:上报失败
  enableStatus?: string; // 启用状态 0:禁用 1:启用
}

export interface OdsZyjsqksjQuery {
  pageNum: number;
  pageSize: number;
  zjsjwyxbs?: string;
  xxdm?: string;
  zyh?: string;
  zdzyjbm?: string;
  zdzylxm?: string;
  syrq?: string;
  reportStatus?: string;
  enableStatus?: string;
  startTime?: string;
  endTime?: string;
}

export interface OdsZyjsqksjVO {
  id: number;
  zjsjwyxbs: string;
  xxdm?: string;
  zyh?: string;
  zdzyjbm?: string;
  zdzyjbmText?: string; // 重点专业级别码文本
  zdzylxm?: string;
  zdzylxmText?: string; // 重点专业类型码文本
  syrq?: string;
  syrqDisplay?: string; // 授予日期显示格式
  bz?: string;
  sjcjsj?: string;
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  reportStatus?: string;
  reportStatusText?: string; // 上报状态文本
  enableStatus?: string;
  enableStatusText?: string; // 启用状态文本
  createTime?: string;
  updateTime?: string;
}

// 专业建设情况数据分页结果
export interface OdsZyjsqksjPageResult {
  records: OdsZyjsqksjVO[];
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
 * 分页查询专业建设情况数据
 */
export function getOdsZyjsqksjPage(query: OdsZyjsqksjQuery) {
  return request.get<ApiResponse<OdsZyjsqksjPageResult>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/page",
    query,
  );
}

/**
 * 根据ID查询专业建设情况数据详情
 */
export function getOdsZyjsqksjById(id: number) {
  return request.get<ApiResponse<OdsZyjsqksjVO>>(
    `/code/code/code-base/zygjx/ods-zyjsqksj/${id}`,
  );
}

/**
 * 根据唯一标识查询专业建设情况数据
 */
export function getOdsZyjsqksjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZyjsqksjVO>>(
    `/code/code/code-base/zygjx/ods-zyjsqksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增专业建设情况数据
 */
export function addOdsZyjsqksj(data: OdsZyjsqksjDTO) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj",
    data,
  );
}

/**
 * 修改专业建设情况数据
 */
export function updateOdsZyjsqksj(data: OdsZyjsqksjDTO) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj",
    data,
  );
}

/**
 * 删除专业建设情况数据
 */
export function deleteOdsZyjsqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-zyjsqksj/${id}`,
  );
}

/**
 * 批量删除专业建设情况数据
 */
export function batchDeleteOdsZyjsqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出专业建设情况数据
 */
export function exportOdsZyjsqksj(query: OdsZyjsqksjQuery) {
  return request.get("/code/code/code-base/zygjx/ods-zyjsqksj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 重点专业级别码 (ZDZYJBDM)
 * @returns 字典选项列表
 */
export function getZdzyjbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZDZYJBDM",
  );
}

/**
 * 获取字典数据 - 重点专业类型码 (ZDZYLXDM)
 * @returns 字典选项列表
 */
export function getZdzylxmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZDZYLXDM",
  );
}

/**
 * 修改单条记录上报状态
 */
export function updateOdsZyjsqksjReportStatus(
  id: number,
  reportStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-zyjsqksj/${id}/report-status`,
    null,
    {
      params: { reportStatus },
    },
  );
}

/**
 * 修改单条记录启用状态
 */
export function updateOdsZyjsqksjEnableStatus(
  id: number,
  enableStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-zyjsqksj/${id}/enable-status`,
    null,
    {
      params: { enableStatus },
    },
  );
}

/**
 * 批量修改上报状态
 */
export function batchUpdateOdsZyjsqksjReportStatus(
  ids: number[],
  reportStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/batch/report-status",
    null,
    {
      params: { ids, reportStatus },
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateOdsZyjsqksjEnableStatus(
  ids: number[],
  enableStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/batch/enable-status",
    null,
    {
      params: { ids, enableStatus },
    },
  );
}
