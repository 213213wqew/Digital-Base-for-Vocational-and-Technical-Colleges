import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 一卡通认证数据接口
 */

// 一卡通认证数据表单数据
export interface OdsYktrzsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  cslxm?: string; // 场所类型码
  rzlxm?: string; // 认证类型码
  rzrq?: string; // 认证日期
  rzrc?: number; // 认证人次
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 一卡通认证数据详情
export interface OdsYktrzsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  cslxm: string; // 场所类型码
  rzlxm: string; // 认证类型码
  rzrq: string; // 认证日期
  rzrc: number; // 认证人次
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  cslxmText?: string; // 场所类型名称
  rzlxmText?: string; // 认证类型名称
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 一卡通认证数据查询参数
export interface OdsYktrzsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  cslxm?: string;
  rzlxm?: string;
  rzrqStart?: string;
  rzrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 一卡通认证数据分页结果
export interface OdsYktrzsjPageResult {
  records: OdsYktrzsjInfo[];
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
 * 分页查询一卡通认证数据
 * @param query 查询参数
 * @returns 一卡通认证数据列表
 */
export function getOdsYktrzsjPage(query: OdsYktrzsjQuery) {
  return request.post<ApiResponse<OdsYktrzsjPageResult>>(
    "/code/code/code-base/zygfw/ods-yktrzsj/page",
    query,
  );
}

/**
 * 根据ID查询一卡通认证数据详情
 * @param id 主键ID
 * @returns 一卡通认证数据详情
 */
export function getOdsYktrzsjById(id: number) {
  return request.get<ApiResponse<OdsYktrzsjInfo>>(
    `/code/code/code-base/zygfw/ods-yktrzsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询一卡通认证数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 一卡通认证数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsYktrzsjInfo>>(
    `/code/code/code-base/zygfw/ods-yktrzsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增一卡通认证数据
 * @param data 一卡通认证数据信息
 * @returns 结果
 */
export function addOdsYktrzsj(data: OdsYktrzsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygfw/ods-yktrzsj/add",
    data,
  );
}

/**
 * 修改一卡通认证数据
 * @param data 一卡通认证数据信息
 * @returns 结果
 */
export function updateOdsYktrzsj(data: OdsYktrzsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-yktrzsj/update",
    data,
  );
}

/**
 * 删除一卡通认证数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsYktrzsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygfw/ods-yktrzsj/${id}`,
  );
}

/**
 * 批量删除一卡通认证数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsYktrzsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-yktrzsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出一卡通认证数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsYktrzsj(query: OdsYktrzsjQuery) {
  return request.post("/code/code/code-base/zygfw/ods-yktrzsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统默认学校代码
 */
export const getSystemSchoolCode = (): Promise<ApiResponse<string>> => {
  return request.get("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
};

/**
 * 根据字典类型获取字典选项
 */
export const getDictOptions = (dictType: string): Promise<ApiResponse<any[]>> => {
  return request.get(`/code/code/code-base-source/options/${dictType}`);
};

/**
 * 获取字典数据 - 场所类型 (CSLXDM) - 保留以兼容旧代码
 * @returns 字典选项列表
 */
export function getPlaceTypeOptions() {
  return getDictOptions("YKTRZCSLXDM");
}

/**
 * 获取字典数据 - 认证类型 (RZLXDM) - 保留以兼容旧代码
 * @returns 字典选项列表
 */
export function getAuthTypeOptions() {
  return getDictOptions("YKTRZLXDM");
}

/**
 * 获取字典数据 - 上报状态 (REPORTSTATUS)
 * @returns 字典选项列表
 */
export function getReportStatusOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/REPORTSTATUS",
  );
}

/**
 * 获取字典数据 - 启用状态 (ENABLESTATUS)
 * @returns 字典选项列表
 */
export function getEnableStatusOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ENABLESTATUS",
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
    "/code/code/code-base/zygfw/ods-yktrzsj/batch-report-status",
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
    "/code/code/code-base/zygfw/ods-yktrzsj/batch-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单个数据的上报状态
 * @param id 数据ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygfw/ods-yktrzsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单个数据的启用状态
 * @param id 数据ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygfw/ods-yktrzsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}
