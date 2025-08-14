import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 专业设置数据接口
 */

// 专业设置数据表单数据
export interface OdsZyszszjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zyssyxbmc?: string; // 专业所属院系部名称
  zymc?: string; // 专业名称
  zyh?: string; // 专业号
  sszyqmc?: string; // 所属专业群名称
  sszyqh?: string; // 所属专业群号
  pzszny?: string; // 批准设置年月
  sczsny?: string; // 首次招生年月
  zyccm?: string; // 专业层次码
  xzm?: string; // 学制码
  syxwlbm?: string; // 授予学位类别码
  sfzdzy?: string; // 是否重点专业
  zdzyjbm?: string; // 重点专业级别码
  zdzylxm?: string; // 重点专业类型码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 专业设置数据详情
export interface OdsZyszszjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zyssyxbmc: string; // 专业所属院系部名称
  zymc: string; // 专业名称
  zyh: string; // 专业号
  sszyqmc: string; // 所属专业群名称
  sszyqh: string; // 所属专业群号
  pzszny: string; // 批准设置年月
  sczsny: string; // 首次招生年月
  zyccm: string; // 专业层次码
  xzm: string; // 学制码
  syxwlbm: string; // 授予学位类别码
  sfzdzy: string; // 是否重点专业
  zdzyjbm: string; // 重点专业级别码
  zdzylxm: string; // 重点专业类型码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zyccmText?: string; // 专业层次文本
  xzmText?: string; // 学制文本
  syxwlbmText?: string; // 授予学位类别文本
  sfzdzyText?: string; // 是否重点专业文本
  zdzyjbmText?: string; // 重点专业级别文本
  zdzylxmText?: string; // 重点专业类型文本
}

// 专业设置数据查询参数
export interface OdsZyszszjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zyssyxbmc?: string;
  zymc?: string;
  zyh?: string;
  sszyqmc?: string;
  zyccm?: string;
  xzm?: string;
  sfzdzy?: string;
  zdzyjbm?: string;
  zdzylxm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 专业设置数据分页结果
export interface OdsZyszszjPageResult {
  records: OdsZyszszjInfo[];
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
 * 分页查询专业设置数据
 * @param query 查询参数
 * @returns 专业设置数据列表
 */
export function getOdsZyszszjPage(query: OdsZyszszjQuery) {
  return request.post<ApiResponse<OdsZyszszjPageResult>>(
    "/code/code/code-base/zygjx/ods-zyszsj/page",
    query,
  );
}

/**
 * 根据ID查询专业设置数据详情
 * @param id 主键ID
 * @returns 专业设置数据详情
 */
export function getOdsZyszszjById(id: number) {
  return request.get<ApiResponse<OdsZyszszjInfo>>(
    `/code/code/code-base/zygjx/ods-zyszsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询专业设置数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 专业设置数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZyszszjInfo>>(
    `/code/code/code-base/zygjx/ods-zyszsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增专业设置数据
 * @param data 专业设置数据信息
 * @returns 结果
 */
export function addOdsZyszsj(data: OdsZyszszjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-zyszsj/add",
    data,
  );
}

/**
 * 修改专业设置数据
 * @param data 专业设置数据信息
 * @returns 结果
 */
export function updateOdsZyszsj(data: OdsZyszszjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyszsj/update",
    data,
  );
}

/**
 * 删除专业设置数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsZyszsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-zyszsj/${id}`,
  );
}

/**
 * 批量删除专业设置数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsZyszsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-zyszsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出专业设置数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsZyszsj(query: OdsZyszszjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-zyszsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 专业层次 (ZYCCDM)
 * @returns 字典选项列表
 */
export function getZyccmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZYCCDM",
  );
}

/**
 * 获取字典数据 - 学制 (XZDM)
 * @returns 字典选项列表
 */
export function getXzmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/XZDM",
  );
}

/**
 * 获取字典数据 - 授予学位类别 (SYXWLBDM)
 * @returns 字典选项列表
 */
export function getSyxwlbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SYXWLBDM",
  );
}

/**
 * 获取字典数据 - 是否重点专业 (SFBZDM)
 * @returns 字典选项列表
 */
export function getSfzdzyOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 重点专业级别 (ZDZYJBDM)
 * @returns 字典选项列表
 */
export function getZdzyjbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZDZYJBDM",
  );
}

/**
 * 获取字典数据 - 重点专业类型 (ZDZYLXDM)
 * @returns 字典选项列表
 */
export function getZdzylxmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZDZYLXDM",
  );
}

/**
 * 获取专业号列表
 * @param query 查询条件
 * @returns 专业号列表
 */
export function getZyhOptions(query: string) {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/batch/options?query=" + query,
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
    "/code/code/code-base/zygjx/ods-zyszsj/batch/report-status",
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
    "/code/code/code-base/zygjx/ods-zyszsj/batch/enable-status",
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
    `/code/code/code-base/zygjx/ods-zyszsj/${id}/report-status`,
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
    `/code/code/code-base/zygjx/ods-zyszsj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

// 专业下拉选项类型
export interface ZyOption {
  zyh: string; // 专业号
  zymc: string; // 专业名称
  zyssyxbmc: string; // 专业所属院系部名称
}

/**
 * 获取专业下拉选项列表
 * @param keyword 专业名称关键字（可选）
 * @returns 专业下拉选项列表
 */
export function getZyOptions(keyword?: string) {
  const url = keyword
    ? `/code/code/code-base/zygjx/ods-zyszsj/zy-options?keyword=${encodeURIComponent(keyword)}`
    : "/data/data/data-base/zygjx/ods-zyszsj/zy-options";
  return request.get<ApiResponse<ZyOption[]>>(url);
}
