import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 排课数据接口
 */

// 排课数据表单数据
export interface OdsPksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jhkch?: string; // 计划课程号
  pkh?: string; // 排课号
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  zyssyxbmc?: string; // 专业所属院系部名称
  zymc?: string; // 专业名称
  zyh?: string; // 专业号
  nj?: string; // 年级
  bjmc?: string; // 班级名称
  kkxnd?: string; // 开课学年度
  kkxqm?: string; // 开课学期码
  zc?: string; // 周次
  xqj?: string; // 星期几
  skjc?: string; // 上课节次
  skrq?: string; // 上课日期
  sksj?: string; // 上课时间
  jgh?: string; // 教工号
  jxbrs?: number; // 教学班人数
  skdd?: string; // 上课地点
  jsh?: string; // 教室号
  skddlbm?: string; // 授课地点类别码
  xyjccbh?: string; // 选用教材出版号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 排课数据详情
export interface OdsPksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jhkch: string; // 计划课程号
  pkh: string; // 排课号
  kch: string; // 课程号
  kcmc: string; // 课程名称
  zyssyxbmc: string; // 专业所属院系部名称
  zymc: string; // 专业名称
  zyh: string; // 专业号
  nj: string; // 年级
  bjmc: string; // 班级名称
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  zc: string; // 周次
  xqj: string; // 星期几
  skjc: string; // 上课节次
  skrq: string; // 上课日期
  sksj: string; // 上课时间
  jgh: string; // 教工号
  jxbrs: number; // 教学班人数
  skdd: string; // 上课地点
  jsh: string; // 教室号
  skddlbm: string; // 授课地点类别码
  xyjccbh: string; // 选用教材出版号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kkxqmText?: string; // 开课学期文本
  xqjText?: string; // 星期几文本
  skddlbmText?: string; // 授课地点类别文本
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  skrqDisplay?: string; // 上课日期显示格式
  sksjDisplay?: string; // 上课时间显示格式
}

// 排课数据查询参数
export interface OdsPksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jhkch?: string;
  pkh?: string;
  kch?: string;
  kcmc?: string;
  zyssyxbmc?: string;
  zymc?: string;
  zyh?: string;
  nj?: string;
  bjmc?: string;
  kkxnd?: string;
  kkxqm?: string;
  xqj?: string;
  jgh?: string;
  skdd?: string;
  jsh?: string;
  skddlbm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 排课数据分页结果
export interface OdsPksjPageResult {
  records: OdsPksjInfo[];
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

// 专业基本信息接口（用于下拉选择）
export interface MajorBasicInfo {
  zyh: string; // 专业号
  zymc: string; // 专业名称
  zyssyxbmc: string; // 专业所属院系部名称
  label: string; // 显示标签：专业号 - 专业名称
  value: string; // 值：专业号
}

// 教师基本信息接口（用于下拉选择）
export interface TeacherBasicInfo {
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  label: string; // 显示标签：教工号 - 教师姓名
  value: string; // 值：教工号
}

// 教室基本信息接口（用于下拉选择）
export interface ClassroomBasicInfo {
  jsh: string; // 教室号
  jsmc: string; // 教室名称
  label: string; // 显示标签：教室号 - 教室名称
  value: string; // 值：教室号
}

// 课程选项接口
export interface CourseOption {
  pkh: string;
  jhkch: string;
  kch: string;
  kcmc: string;
}

/**
 * 分页查询排课数据
 * @param query 查询参数
 * @returns 排课数据列表
 */
export function getOdsPksjPage(query: OdsPksjQuery) {
  return request.post<ApiResponse<OdsPksjPageResult>>(
    "/code/code/code-base/zygjx/ods-pksj/page",
    query,
  );
}

/**
 * 根据ID查询排课数据详情
 * @param id 主键ID
 * @returns 排课数据详情
 */
export function getOdsPksjById(id: number) {
  return request.get<ApiResponse<OdsPksjInfo>>(
    `/code/code/code-base/zygjx/ods-pksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询排课数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 排课数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsPksjInfo>>(
    `/code/code/code-base/zygjx/ods-pksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增排课数据
 * @param data 排课数据信息
 * @returns 结果
 */
export function addOdsPksj(data: OdsPksjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-pksj/add",
    data,
  );
}

/**
 * 修改排课数据
 * @param data 排课数据信息
 * @returns 结果
 */
export function updateOdsPksj(data: OdsPksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-pksj/update",
    data,
  );
}

/**
 * 删除排课数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsPksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-pksj/${id}`,
  );
}

/**
 * 批量删除排课数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsPksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-pksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出排课数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsPksj(query: OdsPksjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-pksj/export", query, {
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
    "/code/code/code-base/zygjx/ods-pksj/batch/report-status",
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
    "/code/code/code-base/zygjx/ods-pksj/batch/enable-status",
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
    `/code/code/code-base/zygjx/ods-pksj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单个排课数据启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态(0-禁用,1-启用)
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-pksj/enable-status/${id}`,
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
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

// 字典选项（后端返回格式）
export interface DictOption {
  label: string; // 显示文本
  value: string; // 选项值
}

/**
 * 获取字典数据 - 学期代码 (XQDM)
 * @returns 字典选项列表
 */
export function getXqdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/XQDM",
  );
}

/**
 * 获取字典数据 - 授课地点类别代码 (SKDDLBDM)
 * @returns 字典选项列表
 */
export function getSkddlbdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SKDDLBDM",
  );
}

/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词（课程号或课程名称）
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchCourses(keyword?: string, limit: number = 20) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  params.append("limit", limit.toString());

  return request.get<ApiResponse<CourseBasicInfo[]>>(
    `/code/code/code-base/zygjx/ods-kcjbs/search?${params.toString()}`,
  );
}

/**
 * 模糊搜索专业基本信息
 * 从专业设置数据表中获取专业号、专业名称、专业所属院系部名称
 * @param keyword 搜索关键词（专业号或专业名称）
 * @param limit 返回结果数量限制
 * @returns 专业基本信息列表
 */
export function searchMajors(keyword?: string, limit: number = 20) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  // 注意：后端已经限制了50条，这里传limit只是为了保持接口一致性
  if (limit !== 20) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<MajorBasicInfo[]>>(
    `/code/code/code-base/zygjx/ods-zyszsj/zy-options?${params.toString()}`,
  );
}

/**
 * 模糊搜索教师基本信息
 * 从教师画像数据表中获取教工号、教师姓名
 * @param keyword 搜索关键词（教工号或教师姓名）
 * @param limit 返回结果数量限制
 * @returns 教师基本信息列表
 */
export function searchTeachers(keyword?: string, limit: number = 50) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  // 注意：后端已经限制了50条，这里传limit只是为了保持接口一致性
  if (limit !== 50) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<TeacherBasicInfo[]>>(
    `/code/code/code-base/zygjg/ods-jshxsj/js-options?${params.toString()}`,
  );
}

/**
 * 模糊搜索教室基本信息
 * 从教室基本数据表中获取教室号、教室名称
 * @param keyword 搜索关键词（教室号或教室名称）
 * @param limit 返回结果数量限制
 * @returns 教室基本信息列表
 */
export function searchClassrooms(keyword?: string, limit: number = 50) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  // 注意：后端已经限制了50条，这里传limit只是为了保持接口一致性
  if (limit !== 50) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<ClassroomBasicInfo[]>>(
    `/code/code/code-base/zygjx/ods-jsjbsj/js-options?${params.toString()}`,
  );
}

// 获取课程选项
export function getJhkchOptions(keyword?: string) {
  return request.get<ApiResponse<CourseOption[]>>(
    "/code/code/code-base/zygjx/ods-pksj/jhkch-options",
    {
      keyword,
    },
  );
}
