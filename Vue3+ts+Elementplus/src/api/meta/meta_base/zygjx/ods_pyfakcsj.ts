import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 培养方案课程设置数据接口
 */

// 培养方案课程设置数据表单数据
export interface OdsPyfakcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kch?: string; // 课程号
  jhkch?: string; // 计划课程号
  kkxnd?: string; // 开课学年度
  kkxqm?: string; // 开课学期码
  ksxsm?: string; // 考试形式码
  sfzyhxkc?: string; // 是否专业核心课程
  ktjxsjzyskfsm?: string; // 课堂教学设计主要授课方式码
  zjjsgh?: string; // 主讲教师工号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 培养方案课程设置数据详情
export interface OdsPyfakcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kch: string; // 课程号
  jhkch: string; // 计划课程号
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  ksxsm: string; // 考试形式码
  sfzyhxkc: string; // 是否专业核心课程
  ktjxsjzyskfsm: string; // 课堂教学设计主要授课方式码
  zjjsgh: string; // 主讲教师工号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kkxqmText?: string; // 开课学期名称
  ksxsmText?: string; // 考试形式名称
  sfzyhxkcText?: string; // 是否专业核心课程名称
  ktjxsjzyskfsmText?: string; // 课堂教学设计主要授课方式名称
}

// 培养方案课程设置数据查询参数
export interface OdsPyfakcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kch?: string;
  jhkch?: string;
  kkxnd?: string;
  kkxqm?: string;
  ksxsm?: string;
  sfzyhxkc?: string;
  ktjxsjzyskfsm?: string;
  zjjsgh?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 培养方案课程设置数据分页结果
export interface OdsPyfakcsjPageResult {
  records: OdsPyfakcsjInfo[];
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

// 计划课程号选项（来自排课数据）
export interface JhkchOption {
  jhkch: string; // 计划课程号
  pkh: string; // 排课号
  kch: string; // 课程号
  kcmc: string; // 课程名称
  jgh: string; // 教师工号
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  label: string; // 显示标签 (计划课程号 - 课程名称 - 教师工号)
  value: string; // 值 (计划课程号)
}

/**
 * 分页查询培养方案课程设置数据
 */
export function getOdsPyfakcsjPage(query: OdsPyfakcsjQuery) {
  return request.post<ApiResponse<OdsPyfakcsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/page",
    query,
  );
}

/**
 * 根据ID查询培养方案课程设置数据详情
 */
export function getOdsPyfakcsjById(id: number) {
  return request.get<ApiResponse<OdsPyfakcsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-pyfakcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询培养方案课程设置数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsPyfakcsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-pyfakcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增培养方案课程设置数据
 */
export function addOdsPyfakcsj(data: OdsPyfakcsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/add",
    data,
  );
}

/**
 * 修改培养方案课程设置数据
 */
export function updateOdsPyfakcsj(data: OdsPyfakcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/update",
    data,
  );
}

/**
 * 删除培养方案课程设置数据
 */
export function deleteOdsPyfakcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-pyfakcsj/${id}`,
  );
}

/**
 * 批量删除培养方案课程设置数据
 */
export function batchDeleteOdsPyfakcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出培养方案课程设置数据
 */
export function exportOdsPyfakcsj(query: OdsPyfakcsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-pyfakcsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 开课学期 (KKXQM)
 */
export function getSemesterOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XQDM",
  );
}

/**
 * 获取字典数据 - 考试形式 (KSXSM)
 */
export function getExamTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/KSXSDM",
  );
}

/**
 * 获取字典数据 - 是否专业核心课程 (SFBZDM)
 */
export function getIsCoreOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 课堂教学设计主要授课方式 (KTJXSJZYSKFSM)
 */
export function getTeachingModeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/ZYSKFSDM",
  );
}

/**
 * 批量修改上报状态
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/batch-update-report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-pyfakcsj/batch-update-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单个记录上报状态
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-pyfakcsj/${id}/report-status/${reportStatus}`,
  );
}

/**
 * 修改单个记录启用状态
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-pyfakcsj/${id}/enable-status/${enableStatus}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取计划课程号选项（来自排课数据）
 */
export function getJhkchOptions(keyword?: string) {
  return request.get<ApiResponse<JhkchOption[]>>(
    "/api/meta/meta-base/zygjx/ods-pksj/jhkch-options",
    {
    
        keyword
      
    },
  );
}
