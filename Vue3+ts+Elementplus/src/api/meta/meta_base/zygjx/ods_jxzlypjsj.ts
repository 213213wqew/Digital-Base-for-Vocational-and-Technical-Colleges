import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 教学质量与评价数据接口
 */

// 教学质量与评价数据表单数据
export interface OdsJxzlypjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xn?: string; // 学年（度）
  xqm?: string; // 学期码
  jhkch?: string; // 计划课程号
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  gh?: string; // 工号
  kczlpj?: number; // 课程质量评价
  cpxss?: number; // 参评学生数
  pjwcrq?: string; // 评价完成日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 教学质量与评价数据详情
export interface OdsJxzlypjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xn: string; // 学年（度）
  xqm: string; // 学期码
  jhkch: string; // 计划课程号
  kch: string; // 课程号
  kcmc: string; // 课程名称
  gh: string; // 工号
  kczlpj: number; // 课程质量评价
  cpxss: number; // 参评学生数
  pjwcrq: string; // 评价完成日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xqmText?: string; // 学期文本
  pjwcrqDisplay?: string; // 评价完成日期显示格式
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 教学质量与评价数据查询参数
export interface OdsJxzlypjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xn?: string;
  xqm?: string;
  jhkch?: string;
  kch?: string;
  kcmc?: string;
  gh?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 教学质量与评价数据分页结果
export interface OdsJxzlypjsjPageResult {
  records: OdsJxzlypjsjInfo[];
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
 * 分页查询教学质量与评价数据
 * @param query 查询参数
 * @returns 教学质量与评价数据列表
 */
export function getOdsJxzlypjsjPage(query: OdsJxzlypjsjQuery) {
  return request.post<ApiResponse<OdsJxzlypjsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/page",
    query,
  );
}

/**
 * 根据ID查询教学质量与评价数据详情
 * @param id 主键ID
 * @returns 教学质量与评价数据详情
 */
export function getOdsJxzlypjsjById(id: number) {
  return request.get<ApiResponse<OdsJxzlypjsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jxzlypjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教学质量与评价数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 教学质量与评价数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJxzlypjsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jxzlypjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教学质量与评价数据
 * @param data 教学质量与评价数据信息
 * @returns 结果
 */
export function addOdsJxzlypjsj(data: OdsJxzlypjsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/add",
    data,
  );
}

/**
 * 修改教学质量与评价数据
 * @param data 教学质量与评价数据信息
 * @returns 结果
 */
export function updateOdsJxzlypjsj(data: OdsJxzlypjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/update",
    data,
  );
}

/**
 * 删除教学质量与评价数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsJxzlypjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-jxzlypjsj/${id}`,
  );
}

/**
 * 批量删除教学质量与评价数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsJxzlypjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教学质量与评价数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsJxzlypjsj(query: OdsJxzlypjsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-jxzlypjsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 学期 (XQDM)
 * @returns 字典选项列表
 */
export function getSemesterOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XQDM",
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
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-jxzlypjsj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-jxzlypjsj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-jxzlypjsj/enable-status/${id}`,
    {
      status: enableStatus,
    },
  );
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

// 课程选项接口（从排课数据中获取）
export interface CourseOption {
  pkh?: string; // 排课号
  jhkch?: string; // 计划课程号
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  jgh?: string; // 教工号
  label?: string; // 显示标签（计划课程号 - 课程名称 - 教工号）
  value?: string; // 值（计划课程号）
}

/**
 * 获取课程选项（从排课数据中获取）
 * 用于下拉选择和模糊查询计划课程号、课程号、课程名称和教工号
 * @param keyword 关键字（可以是计划课程号、课程号、课程名称或教工号）
 * @returns 课程选项列表，包含课程信息和教师工号
 */
export function getCourseOptions(keyword?: string) {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  return request.get<ApiResponse<CourseOption[]>>(
    `/api/meta/meta-base/zygjx/ods-pksj/jhkch-options?${params.toString()}`,
  );
}

/**
 * 获取教师工号选项（从排课数据中获取）
 * 用于下拉选择和模糊查询教师工号
 * @param keyword 关键字（教师工号）
 * @returns 教师工号选项列表
 */
export function getTeacherOptions(keyword?: string) {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  return request.get<ApiResponse<{ jgh: string }[]>>(
    `/api/meta/meta-base/zygjx/ods-pksj/jgh-options?${params.toString()}`,
  );
}
