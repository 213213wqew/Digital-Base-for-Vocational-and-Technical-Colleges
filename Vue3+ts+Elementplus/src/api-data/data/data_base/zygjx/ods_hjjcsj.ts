import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 获奖教材数据接口
 */

// 字典选项
export interface DictOption {
  value: string;  // 提交的值：基础代码名称
  label: string;  // 显示的文本：数据源名称
}

// 获奖教材数据表单数据
export interface OdsHjjcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  hjjcbh?: string; // 获奖教材编号
  hjxm?: string; // 获奖项目
  hjjc?: string; // 获奖届次
  hjrq?: string; // 获奖日期
  jlmc?: string; // 奖励名称
  jljbm?: string; // 奖励级别码
  jldjm?: string; // 奖励等级码
  bjdw?: string; // 颁奖单位
  cbh?: string; // 出版号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 获奖教材数据详情
export interface OdsHjjcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  hjjcbh: string; // 获奖教材编号
  hjxm: string; // 获奖项目
  hjjc: string; // 获奖届次
  hjrq: string; // 获奖日期
  jlmc: string; // 奖励名称
  jljbm: string; // 奖励级别码
  jldjm: string; // 奖励等级码
  bjdw: string; // 颁奖单位
  cbh: string; // 出版号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  jljbmText?: string; // 奖励级别码文本
  jldjmText?: string; // 奖励等级码文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 获奖教材数据查询参数
export interface OdsHjjcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  hjjcbh?: string;
  hjxm?: string;
  jlmc?: string;
  jljbm?: string;
  jldjm?: string;
  bjdw?: string;
  hjrqStart?: string;
  hjrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 获奖教材数据分页结果
export interface OdsHjjcsjPageResult {
  records: OdsHjjcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询获奖教材数据
 */
export function getOdsHjjcsjPage(query: OdsHjjcsjQuery) {
  return request.post<ApiResponse<OdsHjjcsjPageResult>>(
    "/data/data/data-base/zygjx/ods-hjjcsj/page",
    query,
  );
}

/**
 * 根据ID查询获奖教材数据详情
 */
export function getOdsHjjcsjById(id: number) {
  return request.get<ApiResponse<OdsHjjcsjInfo>>(
    `/data/data/data-base/zygjx/ods-hjjcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询获奖教材数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsHjjcsjInfo>>(
    `/data/data/data-base/zygjx/ods-hjjcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增获奖教材数据
 */
export function addOdsHjjcsj(data: OdsHjjcsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-hjjcsj/add",
    data,
  );
}

/**
 * 修改获奖教材数据
 */
export function updateOdsHjjcsj(data: OdsHjjcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-hjjcsj/update",
    data,
  );
}

/**
 * 删除获奖教材数据
 */
export function deleteOdsHjjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-hjjcsj/${id}`,
  );
}

/**
 * 批量删除获奖教材数据
 */
export function batchDeleteOdsHjjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-hjjcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出获奖教材数据
 */
export function exportOdsHjjcsj(query: OdsHjjcsjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-hjjcsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 奖励级别码 (JBDM)
 */
export function getJljbmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JBDM",
  );
}

/**
 * 获取字典数据 - 奖励等级码 (JLDJDM)
 */
export function getJldjmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JLDJDM",
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}
