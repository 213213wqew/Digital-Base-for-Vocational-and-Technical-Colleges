import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 实训基地数据接口
 */

// 字典选项
export interface DictOption {
  value: string;
  label: string;
}

// 实训基地数据表单数据
export interface OdsSxjdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sxjdbh?: string; // 实训基地编号
  sxjdmc?: string; // 实训基地名称
  ssgldwmc?: string; // 所属管理单位名称
  sxjdjlrq?: string; // 实训基地建立日期
  ytdw?: string; // 依托单位
  syzymc?: string; // 适应专业名称
  jdhzqy?: string; // 基地合作企业
  sxjdlbm?: string; // 实训基地类别码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实训基地数据详情
export interface OdsSxjdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sxjdbh: string; // 实训基地编号
  sxjdmc: string; // 实训基地名称
  ssgldwmc: string; // 所属管理单位名称
  sxjdjlrq: string; // 实训基地建立日期
  ytdw: string; // 依托单位
  syzymc: string; // 适应专业名称
  jdhzqy: string; // 基地合作企业
  sxjdlbm: string; // 实训基地类别码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 实训基地数据查询参数
export interface OdsSxjdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sxjdbh?: string;
  sxjdmc?: string;
  ssgldwmc?: string;
  ytdw?: string;
  syzymc?: string;
  sxjdlbm?: string;
  sxjdjlrqStart?: string;
  sxjdjlrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实训基地数据分页结果
export interface OdsSxjdsjPageResult {
  records: OdsSxjdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询实训基地数据
 * @param query 查询参数
 * @returns 实训基地数据列表
 */
export function getOdsSxjdsjPage(query: OdsSxjdsjQuery) {
  return request.post<ApiResponse<OdsSxjdsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-sxjdsj/page",
    query,
  );
}

/**
 * 根据ID查询实训基地数据详情
 * @param id 主键ID
 * @returns 实训基地数据详情
 */
export function getOdsSxjdsjById(id: number) {
  return request.get<ApiResponse<OdsSxjdsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxjdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实训基地数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实训基地数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxjdsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxjdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实训基地数据
 * @param data 实训基地数据信息
 * @returns 结果
 */
export function addOdsSxjdsj(data: OdsSxjdsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-sxjdsj/add",
    data,
  );
}

/**
 * 修改实训基地数据
 * @param data 实训基地数据信息
 * @returns 结果
 */
export function updateOdsSxjdsj(data: OdsSxjdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxjdsj/update",
    data,
  );
}

/**
 * 删除实训基地数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxjdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-sxjdsj/${id}`,
  );
}

/**
 * 批量删除实训基地数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxjdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxjdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实训基地数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxjdsj(query: OdsSxjdsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-sxjdsj/export", query, {
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
    "/api/meta/meta-base/zygjx/ods-sxjdsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-sxjdsj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-sxjdsj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-sxjdsj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
