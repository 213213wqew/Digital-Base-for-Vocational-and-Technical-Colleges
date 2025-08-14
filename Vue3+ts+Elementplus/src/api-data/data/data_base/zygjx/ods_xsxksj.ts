import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生选课数据接口
 */

// 学生选课数据表单数据
export interface OdsXsxksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  jhkch?: string; // 计划课程号
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  kkxnd?: string; // 开课学年度
  kkxqm?: string; // 开课学期码(1-第一学期,2-第二学期,3-第三学期)
  xksj?: string; // 选课时间
  xkxzm?: string; // 选课性质码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 学生选课数据详情
export interface OdsXsxksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  jhkch: string; // 计划课程号
  kch: string; // 课程号
  kcmc: string; // 课程名称
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  xksj: string; // 选课时间
  xkxzm: string; // 选课性质码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kkxqmText?: string; // 开课学期文本
  xkxzmText?: string; // 选课性质文本
  xksjDisplay?: string; // 选课时间显示格式
  sjcjsjDisplay?: string; // 数据采集时间显示格式
}

// 学生选课数据查询参数
export interface OdsXsxksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  jhkch?: string;
  kch?: string;
  kcmc?: string;
  kkxnd?: string;
  kkxqm?: string;
  xkxzm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 学生选课数据分页结果
export interface OdsXsxksjPageResult {
  records: OdsXsxksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}
// 课程基本信息接口（用于下拉选择）
export interface CourseBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  createTime?: string;
  updateTime?: string;
}

/**
 * 分页查询学生选课数据
 * @param query 查询参数
 * @returns 学生选课数据列表
 */
export function getOdsXsxksjPage(query: OdsXsxksjQuery) {
  return request.post<ApiResponse<OdsXsxksjPageResult>>(
    "/data/data/data-base/zygjx/ods-xsxksj/page",
    query,
  );
}

/**
 * 根据ID查询学生选课数据详情
 * @param id 主键ID
 * @returns 学生选课数据详情
 */
export function getOdsXsxksjById(id: number) {
  return request.get<ApiResponse<OdsXsxksjInfo>>(
    `/data/data/data-base/zygjx/ods-xsxksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生选课数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 学生选课数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsxksjInfo>>(
    `/data/data/data-base/zygjx/ods-xsxksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生选课数据
 * @param data 学生选课数据信息
 * @returns 结果
 */
export function addOdsXsxksj(data: OdsXsxksjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-xsxksj/add",
    data,
  );
}

/**
 * 修改学生选课数据
 * @param data 学生选课数据信息
 * @returns 结果
 */
export function updateOdsXsxksj(data: OdsXsxksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xsxksj/update",
    data,
  );
}

/**
 * 删除学生选课数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsXsxksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-xsxksj/${id}`,
  );
}

/**
 * 批量删除学生选课数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsXsxksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xsxksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生选课数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsXsxksj(query: OdsXsxksjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-xsxksj/export", query, {
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
    "/data/data/data-base/zygjx/ods-xsxksj/batch/report-status",
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
    "/data/data/data-base/zygjx/ods-xsxksj/batch/enable-status",
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
    `/data/data/data-base/zygjx/ods-xsxksj/${id}/report-status`,
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
    `/data/data/data-base/zygjx/ods-xsxksj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 获取课程性质代码字典数据 - KCXZDM
 * @returns 字典选项列表
 */
export function getDictKcxzOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/KCXZDM",
  );
}

/**
 * 获取学期代码字典数据 - XQDM
 * @returns 字典选项列表
 */
export function getDictXqOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/XQDM",
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

// 课程信息选项接口 - 使用后端OdsKcjbsVO格式
export interface CourseOption {
  id: number;
  zjsjwyxbs: string;
  xxdm: string;
  kch: string; // 课程号
  kcmc: string; // 课程名称
  kclxm?: string;
  kcsxm?: string;
  kcxzm?: string;
}

/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词（课程号或课程名称）
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchCourseOptions(keyword?: string, limit: number = 20) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  params.append("limit", limit.toString());

  return request.get<ApiResponse<CourseBasicInfo[]>>(
    `/data/data/data-base/zygjx/ods-kcjbs/search?${params.toString()}`,
  );
}

// 计划课程号选项接口
export interface JhkchOption {
  jhkch: string; // 计划课程号
  pkh: string; // 排课号
  kcmc: string; // 课程名称
  label: string; // 显示标签
  value: string; // 值
}

/**
 * 获取计划课程号选项 (用于所属计划课程号字段)
 */
export function getJhkchOptions(keyword?: string) {
  return request.get<ApiResponse<JhkchOption[]>>(
    "/data/data/data-base/zygjx/ods-pksj/jhkch-options",
    {
      keyword,
    },
  );
}
