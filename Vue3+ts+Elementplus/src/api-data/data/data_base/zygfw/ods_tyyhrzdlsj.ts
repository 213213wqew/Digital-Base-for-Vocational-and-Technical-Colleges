import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 统一用户认证登录数据接口
 */

// 统一用户认证登录数据表单数据
export interface OdsTyyhrzdlsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dlzh?: string; // 登录账号
  js?: string; // 角色
  szbmmc?: string; // 所在部门名称
  dlsj?: string; // 登录时间
  dlip?: string; // 登录IP
  zhztm?: string; // 账号状态码
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
}

// 统一用户认证登录数据详情
export interface OdsTyyhrzdlsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dlzh: string; // 登录账号
  js: string; // 角色
  szbmmc: string; // 所在部门名称
  dlsj: string; // 登录时间
  dlip: string; // 登录IP
  zhztm: string; // 账号状态码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zhztmText?: string; // 账号状态码文本
}

// 统一用户认证登录数据查询参数
export interface OdsTyyhrzdlsjQuery {
  dlzh?: string;
  js?: string;
  szbmmc?: string;
  pageNum: number;
  pageSize: number;
}

// 统一用户认证登录数据分页结果
export interface OdsTyyhrzdlsjPageResult {
  records: OdsTyyhrzdlsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询统一用户认证登录数据
 */
export function getOdsTyyhrzdlsjPage(query: OdsTyyhrzdlsjQuery) {
  return request.post<ApiResponse<OdsTyyhrzdlsjPageResult>>(
    "/data/data/data-base/zygfw/ods-tyyhrzdlsj/page",
    query,
  );
}

/**
 * 根据ID查询统一用户认证登录数据详情
 */
export function getOdsTyyhrzdlsjById(id: number) {
  return request.get<ApiResponse<OdsTyyhrzdlsjInfo>>(
    `/data/data/data-base/zygfw/ods-tyyhrzdlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询统一用户认证登录数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsTyyhrzdlsjInfo>>(
    `/data/data/data-base/zygfw/ods-tyyhrzdlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增统一用户认证登录数据
 */
export function addOdsTyyhrzdlsj(data: OdsTyyhrzdlsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygfw/ods-tyyhrzdlsj/add",
    data,
  );
}

/**
 * 修改统一用户认证登录数据
 */
export function updateOdsTyyhrzdlsj(data: OdsTyyhrzdlsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-tyyhrzdlsj/update",
    data,
  );
}

/**
 * 删除统一用户认证登录数据
 */
export function deleteOdsTyyhrzdlsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygfw/ods-tyyhrzdlsj/${id}`,
  );
}

/**
 * 批量删除统一用户认证登录数据
 */
export function batchDeleteOdsTyyhrzdlsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-tyyhrzdlsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出统一用户认证登录数据
 */
export function exportOdsTyyhrzdlsj(query: OdsTyyhrzdlsjQuery) {
  return request.post(
    "/data/data/data-base/zygfw/ods-tyyhrzdlsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}
//获取学校代码
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/data/data/data-base-source/options/${dictType}`,
  );
}