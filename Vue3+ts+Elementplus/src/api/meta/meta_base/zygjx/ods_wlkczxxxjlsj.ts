import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 网络课程在线学习记录数据接口
 */

// 课程基本信息（用于下拉选择）
export interface CourseBasicInfo {
  kch: string; // 课程号
  kcmc: string; // 课程名称
}

// 网络课程在线学习记录数据表单数据
export interface OdsWlkczxxxjlsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  wlkcbh?: string; // 网络课程编号
  wlkcmc?: string; // 网络课程名称
  wlkclym?: string; // 网络课程来源码
  wlkcssptmc?: string; // 网络课程所属平台名称
  zjjsgh?: string; // 主讲教师工号
  zjjsxm?: string; // 主讲教师姓名
  xsxxrq?: string; // 学生学习日期
  xsxxsc?: number; // 学生学习时长
  xsxxrc?: number; // 学生学习人次
  xstjzys?: number; // 学生提交作业数
  dytls?: number; // 答疑讨论数
  lrrq?: string; // 录入日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 网络课程在线学习记录数据详情
export interface OdsWlkczxxxjlsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  wlkcbh: string; // 网络课程编号
  wlkcmc: string; // 网络课程名称
  wlkclym: string; // 网络课程来源码
  wlkcssptmc: string; // 网络课程所属平台名称
  zjjsgh: string; // 主讲教师工号
  zjjsxm: string; // 主讲教师姓名
  xsxxrq: string; // 学生学习日期
  xsxxsc: number; // 学生学习时长
  xsxxrc: number; // 学生学习人次
  xstjzys: number; // 学生提交作业数
  dytls: number; // 答疑讨论数
  lrrq: string; // 录入日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  wlkclymText?: string; // 网络课程来源文本
  xsxxrqDisplay?: string; // 学生学习日期显示
  lrrqDisplay?: string; // 录入日期显示
  sjcjsjDisplay?: string; // 数据采集时间显示
}

// 网络课程在线学习记录数据查询参数
export interface OdsWlkczxxxjlsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  wlkcbh?: string;
  wlkcmc?: string;
  wlkclym?: string;
  wlkcssptmc?: string;
  zjjsgh?: string;
  zjjsxm?: string;
  xsxxrqStart?: string;
  xsxxrqEnd?: string;
  lrrqStart?: string;
  lrrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 网络课程在线学习记录数据分页结果
export interface OdsWlkczxxxjlsjPageResult {
  records: OdsWlkczxxxjlsjInfo[];
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

// 课程基本信息（来自课程基本数据子类表）
export interface CourseInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm: string; // 课程类型码
  kcsxm: string; // 课程属性码
  kcxzm: string; // 课程性质码
  ggklbm: string; // 公共课类别码
  jpkcjbm: string; // 精品课程级别码
  jxjhgdkss: number; // 教学计划规定课时数
  sjjxkss: number; // 实践教学课时数
  xnfzsxkss: number; // 虚拟仿真实训课时数
  sfkzrtkc: string; // 是否课证融通课程
  xgjsmc: string; // 相关竞赛名称
  sfxqhzkfkc: string; // 是否校企合作开发课程
  sfyxskc: string; // 是否有线上课程
  xskcwz: string; // 线上课程网址
  sfkcszsfkc: string; // 是否课程思政示范课程
  ktjxsjzyxykczym: string; // 课堂教学设计主要选用课程资源码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kclxmText?: string; // 课程类型文本
  kcsxmText?: string; // 课程属性文本
  kcxzmText?: string; // 课程性质文本
  ggklbmText?: string; // 公共课类别文本
  jpkcjbmText?: string; // 精品课程级别文本
  sfkzrtkcText?: string; // 是否课证融通课程文本
  sfxqhzkfkcText?: string; // 是否校企合作开发课程文本
  sfyxskcText?: string; // 是否有线上课程文本
  sfkcszsfkcText?: string; // 是否课程思政示范课程文本
}

/**
 * 分页查询网络课程在线学习记录数据
 * @param query 查询参数
 * @returns 网络课程在线学习记录数据列表
 */
export function getOdsWlkczxxxjlsjPage(query: OdsWlkczxxxjlsjQuery) {
  return request.post<ApiResponse<OdsWlkczxxxjlsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/page",
    query,
  );
}

/**
 * 根据ID查询网络课程在线学习记录数据详情
 * @param id 主键ID
 * @returns 网络课程在线学习记录数据详情
 */
export function getOdsWlkczxxxjlsjById(id: number) {
  return request.get<ApiResponse<OdsWlkczxxxjlsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询网络课程在线学习记录数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 网络课程在线学习记录数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsWlkczxxxjlsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增网络课程在线学习记录数据
 * @param data 网络课程在线学习记录数据信息
 * @returns 结果
 */
export function addOdsWlkczxxxjlsj(data: OdsWlkczxxxjlsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/add",
    data,
  );
}

/**
 * 修改网络课程在线学习记录数据
 * @param data 网络课程在线学习记录数据信息
 * @returns 结果
 */
export function updateOdsWlkczxxxjlsj(data: OdsWlkczxxxjlsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/update",
    data,
  );
}

/**
 * 删除网络课程在线学习记录数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsWlkczxxxjlsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/${id}`,
  );
}

/**
 * 批量删除网络课程在线学习记录数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsWlkczxxxjlsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出网络课程在线学习记录数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsWlkczxxxjlsj(query: OdsWlkczxxxjlsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典数据 - 网络课程来源 (WLKCLYDM)
 * @returns 字典选项列表
 */
export function getCourseSourceOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/WLKCLYDM",
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
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-wlkczxxxjlsj/${id}/enable-status`,
    {
      status: enableStatus,
    },
  );
}

/**
 * 模糊查询线上课程信息
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 线上课程列表
 */
export function searchOnlineCourses(keyword?: string, limit: number = 20) {
  return request.get<ApiResponse<CourseBasicInfo[]>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/search/online-courses",
    {
      keyword,
    },
  );
}

/** 获取学校代码 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
