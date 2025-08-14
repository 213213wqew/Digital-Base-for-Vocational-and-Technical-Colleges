import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 心理咨询记录数据接口
 */

// 心理咨询记录数据表单数据
export interface OdsXlzxjlsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zxrq?: string; // 咨询日期
  zxrc?: number; // 咨询人次
  gjc?: string; // 关键词
  yyrc?: number; // 预约人次
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 心理咨询记录数据详情
export interface OdsXlzxjlsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zxrq: string; // 咨询日期
  zxrc: number; // 咨询人次
  gjc: string; // 关键词
  yyrc: number; // 预约人次
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 心理咨询记录数据查询参数
export interface OdsXlzxjlsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zxrqStart?: string;
  zxrqEnd?: string;
  zxrcMin?: number;
  zxrcMax?: number;
  gjc?: string;
  yyrcMin?: number;
  yyrcMax?: number;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 心理咨询记录数据分页结果
export interface OdsXlzxjlsjPageResult {
  records: OdsXlzxjlsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询心理咨询记录数据
 * @param query 查询参数
 * @returns 心理咨询记录数据列表
 */
export function getOdsXlzxjlsjPage(query: OdsXlzxjlsjQuery) {
  return request.post<ApiResponse<OdsXlzxjlsjPageResult>>(
    "/data/data/data-base/zygxs/ods-xlzxjlsj/page",
    query,
  );
}

/**
 * 根据ID查询心理咨询记录数据详情
 * @param id 主键ID
 * @returns 心理咨询记录数据详情
 */
export function getOdsXlzxjlsjById(id: number) {
  return request.get<ApiResponse<OdsXlzxjlsjInfo>>(
    `/data/data/data-base/zygxs/ods-xlzxjlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询心理咨询记录数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 心理咨询记录数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXlzxjlsjInfo>>(
    `/data/data/data-base/zygxs/ods-xlzxjlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增心理咨询记录数据
 * @param data 心理咨询记录数据信息
 * @returns 结果
 */
export function addOdsXlzxjlsj(data: OdsXlzxjlsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygxs/ods-xlzxjlsj/add",
    data,
  );
}

/**
 * 修改心理咨询记录数据
 * @param data 心理咨询记录数据信息
 * @returns 结果
 */
export function updateOdsXlzxjlsj(data: OdsXlzxjlsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-xlzxjlsj/update",
    data,
  );
}

/**
 * 删除心理咨询记录数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsXlzxjlsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygxs/ods-xlzxjlsj/${id}`,
  );
}

/**
 * 批量删除心理咨询记录数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsXlzxjlsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-xlzxjlsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出心理咨询记录数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsXlzxjlsj(query: OdsXlzxjlsjQuery) {
  return request.post("/data/data/data-base/zygxs/ods-xlzxjlsj/export", query, {
    responseType: "blob",
  });
}
//获取学校代码
export function getSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}

