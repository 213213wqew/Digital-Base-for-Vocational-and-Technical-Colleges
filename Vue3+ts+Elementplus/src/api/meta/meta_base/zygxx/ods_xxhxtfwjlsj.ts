import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

// 字典选项类型
export interface DictOption {
  value: string;
  label: string;
}

// 信息化系统访问记录数据表单数据
export interface MetaBaseZygxxOdsXxhxtfwjlsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xxhxtbh?: string; // 信息化系统编号
  xxhxtqc?: string; // 信息化系统全称
  fwfsm?: string; // 访问方式码
  jsfwcs?: number; // 教师访问次数
  xsfwcs?: number; // 学生访问次数
  xxhxtfwrq?: string; // 信息化系统访问日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 信息化系统访问记录数据详情
export interface MetaBaseZygxxOdsXxhxtfwjlsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xxhxtbh: string; // 信息化系统编号
  xxhxtqc: string; // 信息化系统全称
  fwfsm: string; // 访问方式码
  jsfwcs: number; // 教师访问次数
  xsfwcs: number; // 学生访问次数
  xxhxtfwrq: string; // 信息化系统访问日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  fwfsmText?: string; // 访问方式文本
  xxhxtfwrqDisplay?: string; // 访问日期显示
  sjcjsjDisplay?: string; // 采集时间显示
  createTime: string;
  updateTime: string;
}

// 信息化系统访问记录数据查询参数
export interface MetaBaseZygxxOdsXxhxtfwjlsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xxhxtbh?: string;
  xxhxtqc?: string;
  fwfsm?: string;
  xxhxtfwrqStart?: string;
  xxhxtfwrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 信息化系统访问记录数据分页结果
export interface MetaBaseZygxxOdsXxhxtfwjlsjPageResult {
  records: MetaBaseZygxxOdsXxhxtfwjlsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 信息化系统建设数据选项类型定义
export interface SystemBuildingOption {
  xxhxtbh: string;
  xxhxtqc: string;
  xxhxtjc?: string;
}

/**
 * 分页查询信息化系统访问记录数据
 * @param query 查询参数
 * @returns 信息化系统访问记录数据列表
 */
export function listAccessRecord(query: MetaBaseZygxxOdsXxhxtfwjlsjQuery) {
  return request.post<ApiResponse<MetaBaseZygxxOdsXxhxtfwjlsjPageResult>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/page",
    query,
  );
}

/**
 * 获取信息化系统访问记录数据详情
 * @param id 信息化系统访问记录数据ID
 * @returns 信息化系统访问记录数据详情
 */
export function getAccessRecord(id: number) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxhxtfwjlsjInfo>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询信息化系统访问记录数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 信息化系统访问记录数据详情
 */
export function getAccessRecordByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxhxtfwjlsjInfo>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增信息化系统访问记录数据
 * @param data 信息化系统访问记录数据信息
 * @returns 结果
 */
export function addAccessRecord(data: MetaBaseZygxxOdsXxhxtfwjlsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/add",
    data,
  );
}

/**
 * 修改信息化系统访问记录数据
 * @param data 信息化系统访问记录数据信息
 * @returns 结果
 */
export function updateAccessRecord(data: MetaBaseZygxxOdsXxhxtfwjlsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/update",
    data,
  );
}

/**
 * 删除信息化系统访问记录数据
 * @param id 信息化系统访问记录数据ID
 * @returns 结果
 */
export function deleteAccessRecord(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/${id}`,
  );
}

/**
 * 批量删除信息化系统访问记录数据
 * @param ids 信息化系统访问记录数据ID数组
 * @returns 结果
 */
export function batchDeleteAccessRecord(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 获取信息化系统建设数据选项（用于下拉选择）
 * @returns 系统选项列表
 */
export function getSystemBuildingOptions() {
  return request.get<ApiResponse<SystemBuildingOption[]>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/system-building-options",
  );
}

/**
 * 导出信息化系统访问记录数据
 * @param query 查询条件
 * @returns Excel文件流
 */
export function exportAccessRecord(query: MetaBaseZygxxOdsXxhxtfwjlsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/export",
    query,
    {
      responseType: "blob",
      timeout: 60000, // 增加超时时间到60秒，因为导出可能需要更长时间
    },
  );
}

/**
 * 导入信息化系统访问记录数据
 * @param formData 包含Excel文件的FormData
 * @returns 导入结果
 */
export function importAccessRecord(formData: FormData) {
  return request.post(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 增加超时时间到120秒，因为导入可能需要更长时间
    },
  );
}

/**
 * 获取字典数据选项
 * @param dictType 字典类型
 * @returns 字典选项列表
 */
export function getDictOptions(codePattern: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/api/meta/data-base-source/options/${codePattern}`,
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
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/batch/report-status",
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
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/batch/enable-status",
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
    `/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 单个修改启用状态
 * @param id 记录ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}

// =========================== 数据同步相关接口 ===========================

/**
 * 同步结果统计类型
 */
export interface SyncResult {
  totalCount: number; // 总数
  successCount: number; // 成功数
  failedCount: number; // 失败数
  skippedCount: number; // 跳过数
  errorMessage?: string; // 错误消息
}

/**
 * 定时同步设置请求类型
 */
export interface SyncScheduleRequest {
  moduleName: string;
  syncTime: string;
  enabled: boolean;
  remark?: string;
}

/**
 * 同步前一天的访问记录数据
 * @returns 同步结果
 */
export const syncYesterdayData = (): Promise<ApiResponse<SyncResult>> => {
  return request.post("/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/sync-data");
};

/**
 * 保存定时同步设置
 * @param data 同步设置数据
 * @returns 保存结果
 */
export const saveSyncSchedule = (
  data: SyncScheduleRequest,
): Promise<ApiResponse<boolean>> => {
  return request.post(
    "/api/meta/meta-base/zygxx/ods-xxhxtfwjlsj/sync-schedule",
    data,
  );
};

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
