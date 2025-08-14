import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 课程基本数据接口
 */

// 课程基本数据表单数据
export interface OdsKcjbsForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  ggklbm?: string; // 公共课类别码
  jpkcjbm?: string; // 精品课程级别码
  jxjhgdkss?: number; // 教学计划规定课时数
  sjjxkss?: number; // 实践教学课时数
  xnfzsxkss?: number; // 虚拟仿真实训课时数
  sfkzrtkc?: string; // 是否课证融通课程
  xgjsmc?: string; // 相关竞赛名称
  sfxqhzkfkc?: string; // 是否校企合作开发课程
  sfyxskc?: string; // 是否有线上课程
  xskcwz?: string; // 线上课程网址
  sfkcszsfkc?: string; // 是否课程思政示范课程
  ktjxsjzyxykczym?: string; // 课堂教学设计主要选用课程资源码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课程基本数据详情
export interface OdsKcjbsInfo {
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

// 课程基本数据查询参数
export interface OdsKcjbsQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kcmc?: string;
  kch?: string;
  kclxm?: string;
  kcsxm?: string;
  kcxzm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 课程基本数据分页结果
export interface OdsKcjbsPageResult {
  records: OdsKcjbsInfo[];
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
 * 分页查询课程基本数据
 * @param query 查询参数
 * @returns 课程基本数据列表
 */
export function getCourseDataPage(query: OdsKcjbsQuery) {
  return request.post<ApiResponse<OdsKcjbsPageResult>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/page",
    query,
  );
}

/**
 * 根据ID查询课程基本数据详情
 * @param id 主键ID
 * @returns 课程基本数据详情
 */
export function getCourseDataById(id: number) {
  return request.get<ApiResponse<OdsKcjbsInfo>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/${id}`,
  );
}

/**
 * 根据唯一性标识查询课程基本数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 课程基本数据
 */
export function getCourseDataByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKcjbsInfo>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增课程基本数据
 * @param data 课程基本数据信息
 * @returns 结果
 */
export function addCourseData(data: OdsKcjbsForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/add",
    data,
  );
}

/**
 * 修改课程基本数据
 * @param data 课程基本数据信息
 * @returns 结果
 */
export function updateCourseData(data: OdsKcjbsForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/update",
    data,
  );
}

/**
 * 删除课程基本数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteCourseData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/${id}`,
  );
}

/**
 * 批量删除课程基本数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteCourseData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出课程基本数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportCourseData(query: OdsKcjbsQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-kcjbs/export", query, {
    responseType: "blob",
  });
}

/**
 * 导入课程基本数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importCourseData(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时，导入可能需要较长时间
    },
  );
}

/**
 * 模糊查询课程信息
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 课程列表
 */
export function searchCourses(keyword?: string, limit: number = 20) {
  return request.get<ApiResponse<OdsKcjbsInfo[]>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/search",
    {
      params: {
        keyword,
        limit,
      },
    },
  );
}

/**
 * 模糊查询线上课程信息（用于网络课程在线学习记录数据）
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 线上课程列表
 */
export function searchOnlineCourses(keyword?: string, limit: number = 50) {
  return request.get<ApiResponse<OdsKcjbsInfo[]>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/search/online-courses",
    {
      params: {
        keyword,
        limit,
      },
    },
  );
}

/**
 * 获取字典数据 - 课程类型 (KCLXDM)
 * @returns 字典选项列表
 */
export function getCourseTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/KCLXDM",
  );
}

/**
 * 获取字典数据 - 课程属性 (KCSXDM)
 * @returns 字典选项列表
 */
export function getCoursePropertyOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/KCSXDM",
  );
}

/**
 * 获取字典数据 - 课程性质 (KCXZDM)
 * @returns 字典选项列表
 */
export function getCourseNatureOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/KCXZDM",
  );
}

/**
 * 获取字典数据 - 公共课类别 (GGKLBDM)
 * @returns 字典选项列表
 */
export function getPublicCourseCategoryOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/GGKLBDM",
  );
}

/**
 * 获取字典数据 - 精品课程级别 (JPKCJBDM)
 * @returns 字典选项列表
 */
export function getQualityCourseLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/JPKCJBDM",
  );
}

/**
 * 获取字典数据 - 是否 (SFBZDM)
 * @returns 字典选项列表
 */
export function getYesNoOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 主要选用课程资源代码 (ZYXYKCZYDM)
 * @returns 字典选项列表
 */
export function getCourseResourceOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/ZYXYKCZYDM",
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
    `/api/meta/meta-base/zygjx/ods-kcjbs/batch/report-status?reportStatus=${reportStatus}`,
    ids,
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
    `/api/meta/meta-base/zygjx/ods-kcjbs/batch/enable-status?enableStatus=${enableStatus}`,
    ids,
  );
}

/**
 * 修改单个数据上报状态
 * @param id 数据ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/report-status/${id}?reportStatus=${reportStatus}`,
  );
}

/**
 * 修改单个数据启用状态
 * @param id 数据ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/enable-status/${id}?enableStatus=${enableStatus}`,
  );
}

// 同步数据相关接口
export interface SyncResult {
  totalCount: number; // 总数
  successCount: number; // 成功数
  failedCount: number; // 失败数
  skippedCount: number; // 跳过数
  message?: string; // 附加消息
}

export interface SyncSchedule {
  moduleName: string; // 模块名称
  syncTime: string; // 同步时间
  enabled: boolean; // 是否启用
  remark?: string; // 备注
}

/**
 * 同步课程基本数据
 * @returns 同步结果
 */
export function fetchCourseData() {
  return request.post<ApiResponse<SyncResult>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/sync",
  );
}

/**
 * 保存同步计划配置
 * @param schedule 同步计划
 * @returns 操作结果
 */
export function saveSyncSchedule(schedule: SyncSchedule) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kcjbs/sync/schedule",
    schedule,
  );
}
