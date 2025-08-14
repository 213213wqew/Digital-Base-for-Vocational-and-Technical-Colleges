import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 实训室基本数据接口
 */

// 实训室基本数据表单数据
export interface OdsSxsjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sxsh?: string; // 实训室号
  sxsmc?: string; // 实训室名称
  ssgldwmc?: string; // 所属管理单位名称
  sssxjdbh?: string; // 所属实训基地编号
  sxsjlrq?: string; // 实训室建立日期
  fzrjgh?: string; // 负责人教工号
  gws?: number; // 工位数
  fjh?: string; // 房间号
  fjmc?: string; // 房间名称
  syshzqy?: string; // 实验室合作企业
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实训室基本数据详情
export interface OdsSxsjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sxsh: string; // 实训室号
  sxsmc: string; // 实训室名称
  ssgldwmc: string; // 所属管理单位名称
  sssxjdbh: string; // 所属实训基地编号
  sxsjlrq: string; // 实训室建立日期
  fzrjgh: string; // 负责人教工号
  gws: number; // 工位数
  fjh: string; // 房间号
  fjmc: string; // 房间名称
  syshzqy: string; // 实验室合作企业
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 实训室基本数据查询参数
export interface OdsSxsjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sxsh?: string;
  sxsmc?: string;
  ssgldwmc?: string;
  sssxjdbh?: string;
  fzrjgh?: string;
  fjh?: string;
  fjmc?: string;
  syshzqy?: string;
  sxsjlrqStart?: string;
  sxsjlrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实训室基本数据分页结果
export interface OdsSxsjbsjPageResult {
  records: OdsSxsjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询实训室基本数据
 * @param query 查询参数
 * @returns 实训室基本数据列表
 */
export function getOdsSxsjbsjPage(query: OdsSxsjbsjQuery) {
  return request.post<ApiResponse<OdsSxsjbsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/page",
    query,
  );
}

/**
 * 根据ID查询实训室基本数据详情
 * @param id 主键ID
 * @returns 实训室基本数据详情
 */
export function getOdsSxsjbsjById(id: number) {
  return request.get<ApiResponse<OdsSxsjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxsjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实训室基本数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实训室基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxsjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxsjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实训室基本数据
 * @param data 实训室基本数据信息
 * @returns 结果
 */
export function addOdsSxsjbsj(data: OdsSxsjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/add",
    data,
  );
}

/**
 * 修改实训室基本数据
 * @param data 实训室基本数据信息
 * @returns 结果
 */
export function updateOdsSxsjbsj(data: OdsSxsjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/update",
    data,
  );
}

/**
 * 删除实训室基本数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxsjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-sxsjbsj/${id}`,
  );
}

/**
 * 批量删除实训室基本数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxsjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实训室基本数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxsjbsj(query: OdsSxsjbsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-sxsjbsj/export", query, {
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
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-sxsjbsj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-sxsjbsj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-sxsjbsj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

export interface DictOption {
  label: string;
  value: string;
}

/**
 * 获取实训基地类别字典数据
 */
export function getSxjdlbmDict() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SXJDLBDM",
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
