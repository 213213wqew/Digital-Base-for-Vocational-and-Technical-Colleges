import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 教师画像数据接口
 */

// 教师画像数据表单数据
export interface OdsJshxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  jsxm?: string; // 教师姓名
  sjkbfwcs?: number; // 数据看板访问次数
  pjwdjjg?: string; // 评价维度及结果
  sjscrq?: string; // 数据生成日期
  sjkbzxfwrq?: string; // 数据看板最新访问日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 教师画像数据详情
export interface OdsJshxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  sjkbfwcs: number; // 数据看板访问次数
  pjwdjjg: string; // 评价维度及结果
  sjscrq: string; // 数据生成日期
  sjkbzxfwrq: string; // 数据看板最新访问日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 教师画像数据查询参数
export interface OdsJshxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  jsxm?: string;
  sjscrqStart?: string;
  sjscrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教师画像数据分页结果
export interface OdsJshxsjPageResult {
  records: OdsJshxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教师画像数据
 * @param query 查询参数
 * @returns 教师画像数据列表
 */
export function getOdsJshxsjPage(query: OdsJshxsjQuery) {
  return request.post<ApiResponse<OdsJshxsjPageResult>>(
    "/code/code/code-base/zygjg/ods-jshxsj/page",
    query,
  );
}

/**
 * 根据ID查询教师画像数据详情
 * @param id 主键ID
 * @returns 教师画像数据详情
 */
export function getOdsJshxsjById(id: number) {
  return request.get<ApiResponse<OdsJshxsjInfo>>(
    `/code/code/code-base/zygjg/ods-jshxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教师画像数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 教师画像数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJshxsjInfo>>(
    `/code/code/code-base/zygjg/ods-jshxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教师画像数据
 * @param data 教师画像数据信息
 * @returns 结果
 */
export function addOdsJshxsj(data: OdsJshxsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjg/ods-jshxsj/add",
    data,
  );
}

/**
 * 修改教师画像数据
 * @param data 教师画像数据信息
 * @returns 结果
 */
export function updateOdsJshxsj(data: OdsJshxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjg/ods-jshxsj/update",
    data,
  );
}

/**
 * 删除教师画像数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsJshxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjg/ods-jshxsj/${id}`,
  );
}

/**
 * 批量删除教师画像数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsJshxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjg/ods-jshxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教师画像数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsJshxsj(query: OdsJshxsjQuery) {
  return request.post("/code/code/code-base/zygjg/ods-jshxsj/export", query, {
    responseType: "blob",
  });
}
