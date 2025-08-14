import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 虚拟仿真基地对外服务数据接口
 */

// 虚拟仿真基地对外服务数据表单数据
export interface OdsXnfzjddwfwsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dwfwbh?: string; // 对外服务编号
  dwfwlxm?: string; // 对外服务类型码
  xnfzsxxmbh?: string; // 虚拟仿真实训项目编号
  dwfwrc?: number; // 对外服务人次
  dwfwdx?: string; // 对外服务对象
  fwkss?: number; // 服务课时数
  fwrq?: string; // 服务日期
  fwdwmc?: string; // 服务单位名称
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 虚拟仿真基地对外服务数据详情
export interface OdsXnfzjddwfwsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dwfwbh: string; // 对外服务编号
  dwfwlxm: string; // 对外服务类型码
  xnfzsxxmbh: string; // 虚拟仿真实训项目编号
  dwfwrc: number; // 对外服务人次
  dwfwdx: string; // 对外服务对象
  fwkss: number; // 服务课时数
  fwrq: string; // 服务日期
  fwdwmc: string; // 服务单位名称
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  fwrqDisplay?: string; // 服务日期显示
  sjcjsjDisplay?: string; // 数据采集时间显示
  dwfwlxmText?: string; // 对外服务类型文本
  dwfwdxText?: string; // 对外服务对象文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
  statusLoading?: boolean; // 状态操作加载状态
}

// 虚拟仿真基地对外服务数据查询参数
export interface OdsXnfzjddwfwsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dwfwbh?: string;
  dwfwlxm?: string;
  xnfzsxxmbh?: string;
  dwfwdx?: string;
  fwrq?: string;
  fwdwmc?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 虚拟仿真基地对外服务数据分页结果
export interface OdsXnfzjddwfwsjPageResult {
  records: OdsXnfzjddwfwsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询虚拟仿真基地对外服务数据
 * @param query 查询参数
 * @returns 虚拟仿真基地对外服务数据列表
 */
export function getOdsXnfzjddwfwsjPage(query: OdsXnfzjddwfwsjQuery) {
  return request.post<ApiResponse<OdsXnfzjddwfwsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/page",
    query,
  );
}

/**
 * 根据ID查询虚拟仿真基地对外服务数据详情
 * @param id 主键ID
 * @returns 虚拟仿真基地对外服务数据详情
 */
export function getOdsXnfzjddwfwsjById(id: number) {
  return request.get<ApiResponse<OdsXnfzjddwfwsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询虚拟仿真基地对外服务数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 虚拟仿真基地对外服务数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXnfzjddwfwsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增虚拟仿真基地对外服务数据
 * @param data 虚拟仿真基地对外服务数据信息
 * @returns 结果
 */
export function addOdsXnfzjddwfwsj(data: OdsXnfzjddwfwsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/add",
    data,
  );
}

/**
 * 修改虚拟仿真基地对外服务数据
 * @param data 虚拟仿真基地对外服务数据信息
 * @returns 结果
 */
export function updateOdsXnfzjddwfwsj(data: OdsXnfzjddwfwsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/update",
    data,
  );
}

/**
 * 删除虚拟仿真基地对外服务数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsXnfzjddwfwsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/${id}`,
  );
}

/**
 * 批量删除虚拟仿真基地对外服务数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsXnfzjddwfwsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出虚拟仿真基地对外服务数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsXnfzjddwfwsj(query: OdsXnfzjddwfwsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/export",
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
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/batch/report-status",
    {
      ids,
      status: reportStatus,
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
    "/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/batch/enable-status",
    {
      ids,
      status: enableStatus,
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
    `/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/${id}/report-status`,
    {
      status: reportStatus,
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
    `/api/meta/meta-base/zygjx/ods-xnfzjddwfwsj/enable-status/${id}`,
    {
      status: enableStatus,
    },
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 获取虚拟仿真基地对外服务类型字典数据
 * @returns 字典选项列表
 */
export function getDictXnfzjddwfwlxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XNFZJDDWFWLXDM",
  );
}

/**
 * 获取虚拟仿真基地对外服务对象字典数据
 * @returns 字典选项列表
 */
export function getDictXnfzjddwfwdxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XNFZJDDWFWDXDM",
  );
}

// 实训项目选项接口
export interface SxxmOption {
  sxxmbh: string; // 实训项目编号
  sxxmmc: string; // 实训项目名称
  label: string; // 显示标签：实训项目编号 - 实训项目名称
  value: string; // 值：实训项目编号
}

/**
 * 获取实训项目编号选项列表（从实训项目数据表）
 * @param keyword 查询关键字(项目编号或名称模糊查询)
 * @returns 实训项目选项列表
 */
export function getSxxmOptions(keyword?: string) {
  const params = keyword ? { keyword } : {};
  return request.get<ApiResponse<SxxmOption[]>>(
    "/api//meta/meta-base/zygjx/ods-sxxmsj/sxsh/options",
    { params },
  );
}
