import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 心理测评数据接口
 */

// 心理测评数据表单数据
export interface OdsXlcpsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zyh?: string; // 专业号
  cprq?: string; // 测评日期
  lbbh?: string; // 量表编号
  lbmc?: string; // 量表名称
  sysj?: number; // 所用时间
  cplx?: string; // 测评类型
  zdjy?: string; // 指导建议
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 心理测评数据详情
export interface OdsXlcpsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zyh: string; // 专业号
  cprq: string; // 测评日期
  lbbh: string; // 量表编号
  lbmc: string; // 量表名称
  sysj: number; // 所用时间
  cplx: string; // 测评类型
  zdjy: string; // 指导建议
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
}

// 心理测评数据查询参数
export interface OdsXlcpsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zyh?: string;
  cprqStart?: string;
  cprqEnd?: string;
  lbbh?: string;
  lbmc?: string;
  sysjMin?: number;
  sysjMax?: number;
  cplx?: string;
  zdjy?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 心理测评数据分页结果
export interface OdsXlcpsjPageResult {
  records: OdsXlcpsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询心理测评数据
 */
export function getOdsXlcpsjPage(query: OdsXlcpsjQuery) {
  return request.post<ApiResponse<OdsXlcpsjPageResult>>(
    "/data/data/data-base/zygxs/ods-xlcpsj/page",
    query,
  );
}

/**
 * 根据ID查询心理测评数据详情
 */
export function getOdsXlcpsjById(id: number) {
  return request.get<ApiResponse<OdsXlcpsjInfo>>(
    `/data/data/data-base/zygxs/ods-xlcpsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询心理测评数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXlcpsjInfo>>(
    `/data/data/data-base/zygxs/ods-xlcpsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增心理测评数据
 */
export function addOdsXlcpsj(data: OdsXlcpsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygxs/ods-xlcpsj/add",
    data,
  );
}

/**
 * 修改心理测评数据
 */
export function updateOdsXlcpsj(data: OdsXlcpsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-xlcpsj/update",
    data,
  );
}

/**
 * 删除心理测评数据
 */
export function deleteOdsXlcpsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygxs/ods-xlcpsj/${id}`,
  );
}

/**
 * 批量删除心理测评数据
 */
export function batchDeleteOdsXlcpsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-xlcpsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出心理测评数据
 */
export function exportOdsXlcpsj(query: OdsXlcpsjQuery) {
  return request.post("/data/data/data-base/zygxs/ods-xlcpsj/export", query, {
    responseType: "blob",
  });
}
/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取专业号列表
 * @param query 查询条件
 * @returns 专业号列表
 */
export function getZyhOptions(query: string) {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base/zygjx/ods-zyjsqksj/batch/options?query=" + query,
  );
}
/**
 * 获取字典数据 - 专业层次 (ZYCCDM)
 * @returns 字典选项列表
 */
export function getCplxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/CPLXDM",
  );
}