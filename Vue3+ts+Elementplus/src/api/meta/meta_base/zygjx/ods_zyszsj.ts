import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

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
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 专业设置数据信息
export interface OdsZyszszjInfo extends OdsZyszszjForm {
  id: number;
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
  createBy?: string; // 创建人
  updateBy?: string; // 更新人
}

// 专业设置数据查询参数
export interface OdsZyszszjQuery {
  pageNum: number;
  pageSize: number;
  xxdm?: string; // 学校代码
  zymc?: string; // 专业名称
  zyh?: string; // 专业号
  zyssyxbmc?: string; // 专业所属院系部名称
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
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
  beginTime?: string; // 开始时间
  endTime?: string; // 结束时间
}

// 专业设置数据分页结果
export interface OdsZyszszjPageResult {
  total: number;
  rows: OdsZyszszjInfo[];
}

// 字典选项
export interface DictOption {
  label: string;
  value: string;
}

/**
 * 获取专业设置数据分页列表
 * @param query 查询参数
 * @returns 分页列表
 */
export function getOdsZyszszjPage(query: OdsZyszszjQuery) {
  return request.post<ApiResponse<OdsZyszszjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-zyszsj/page",
    query,
  );
}

/**
 * 获取专业设置数据详情
 * @param id 主键ID
 * @returns 详情信息
 */
export function getOdsZyszszjDetail(id: number) {
  return request.get<ApiResponse<OdsZyszszjInfo>>(
    `/api/meta/meta-base/zygjx/ods-zyszsj/${id}`,
  );
}

/**
 * 根据ID获取专业设置数据详情
 * @param id 主键ID
 * @returns 详情信息
 */
export function getOdsZyszszjById(id: number) {
  return request.get<ApiResponse<OdsZyszszjInfo>>(
    `/api/meta/meta-base/zygjx/ods-zyszsj/${id}`,
  );
}

/**
 * 新增专业设置数据
 * @param data 专业设置数据表单
 * @returns 结果
 */
export function addOdsZyszsj(data: OdsZyszszjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-zyszsj/add",
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
    "/api/meta/meta-base/zygjx/ods-zyszsj/update",
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
    `/api/meta/meta-base/zygjx/ods-zyszsj/${id}`,
  );
}

/**
 * 批量删除专业设置数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsZyszsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-zyszsj/batch",
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
  return request.post("/api/meta/meta-base/zygjx/ods-zyszsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 导入专业设置数据
 * @param file 导入文件
 * @returns 导入结果
 */
export function importOdsZyszsj(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request.post<ApiResponse<any>>(
    "/api/meta/meta-base/zygjx/ods-zyszsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}

/**
 * 获取字典数据 - 专业层次 (ZYCCDM)
 * @returns 字典选项列表
 */
export function getZyccmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/ZYCCDM",
  );
}

/**
 * 获取字典数据 - 学制 (XZDM)
 * @returns 字典选项列表
 */
export function getXzmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XZDM",
  );
}

/**
 * 获取字典数据 - 授予学位类别 (SYXWLBDM)
 * @returns 字典选项列表
 */
export function getSyxwlbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SYXWLBDM",
  );
}

/**
 * 获取字典数据 - 是否重点专业 (SFBZDM)
 * @returns 字典选项列表
 */
export function getSfzdzyOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 重点专业级别 (ZDZYJBDM)
 * @returns 字典选项列表
 */
export function getZdzyjbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/ZDZYJBDM",
  );
}

/**
 * 获取字典数据 - 重点专业类型 (ZDZYLXDM)
 * @returns 字典选项列表
 */
export function getZdzylxmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/ZDZYLXDM",
  );
}

/**
 * 获取专业号列表
 * @param query 查询条件
 * @returns 专业号列表
 */
export function getZyhOptions(query: string) {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/meta-base/zygjx/ods-zyjsqksj/batch/options?query=" + query,
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
    "/api/meta/meta-base/zygjx/ods-zyszsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-zyszsj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-zyszsj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-zyszsj/enable-status/${id}`,
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
    ? `/api/meta/meta-base/zygjx/ods-zyszsj/zy-options?keyword=${encodeURIComponent(keyword)}`
    : "/api/meta/meta-base/zygjx/ods-zyszsj/zy-options";
  return request.get<ApiResponse<ZyOption[]>>(url);
}
