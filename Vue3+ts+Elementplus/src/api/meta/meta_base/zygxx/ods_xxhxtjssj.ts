import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 信息化系统建设数据接口
 */

// 信息化系统建设数据表单数据
export interface MetaBaseZygxxOdsXxhxtjssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  bmmc?: string; // 所属部门名称
  xxhxtbh?: string; // 信息化系统编号
  xxhxtflm?: string; // 信息化系统分类码
  xxhxtjc?: string; // 信息化系统简称
  xxhxtqc?: string; // 信息化系统全称
  xxhxtfwdz?: string; // 信息化系统访问地址
  sftsxxhxt?: string; // 是否特色信息化系统
  cjjcjrfs?: string; // 场景击穿接入方式
  xxhxtms?: string; // 信息化系统描述
  xxhxtjslxm?: string; // 信息化系统建设类型码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 信息化系统建设数据详情
export interface MetaBaseZygxxOdsXxhxtjssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  bmmc: string; // 所属部门名称
  xxhxtbh: string; // 信息化系统编号
  xxhxtflm: string; // 信息化系统分类码
  xxhxtjc: string; // 信息化系统简称
  xxhxtqc: string; // 信息化系统全称
  xxhxtfwdz: string; // 信息化系统访问地址
  sftsxxhxt: string; // 是否特色信息化系统
  cjjcjrfs: string; // 场景击穿接入方式
  xxhxtms: string; // 信息化系统描述
  xxhxtjslxm: string; // 信息化系统建设类型码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxhxtflmText?: string; // 信息化系统分类文本
  sftsxxhxtText?: string; // 是否特色信息化系统文本
  cjjcjrfsText?: string; // 场景击穿接入方式文本
  xxhxtjslxmText?: string; // 信息化系统建设类型文本
}

// 信息化系统建设数据查询参数
export interface MetaBaseZygxxOdsXxhxtjssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  bmmc?: string;
  xxhxtbh?: string;
  xxhxtflm?: string;
  xxhxtjc?: string;
  xxhxtqc?: string;
  sftsxxhxt?: string;
  cjjcjrfs?: string;
  xxhxtjslxm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 信息化系统建设数据分页结果
export interface MetaBaseZygxxOdsXxhxtjssjPageResult {
  records: MetaBaseZygxxOdsXxhxtjssjInfo[];
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
 * 分页查询信息化系统建设数据
 * @param query 查询参数
 * @returns 信息化系统建设数据列表
 */
export function getSystemBuildingDataPage(
  query: MetaBaseZygxxOdsXxhxtjssjQuery,
) {
  return request.post<ApiResponse<MetaBaseZygxxOdsXxhxtjssjPageResult>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/page",
    query,
  );
}

/**
 * 根据ID查询信息化系统建设数据详情
 * @param id 主键ID
 * @returns 信息化系统建设数据详情
 */
export function getSystemBuildingDataById(id: number) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxhxtjssjInfo>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtjssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询信息化系统建设数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 信息化系统建设数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxhxtjssjInfo>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtjssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增信息化系统建设数据
 * @param data 信息化系统建设数据信息
 * @returns 结果
 */
export function addSystemBuildingData(data: MetaBaseZygxxOdsXxhxtjssjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/add",
    data,
  );
}

/**
 * 修改信息化系统建设数据
 * @param data 信息化系统建设数据信息
 * @returns 结果
 */
export function updateSystemBuildingData(data: MetaBaseZygxxOdsXxhxtjssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/update",
    data,
  );
}

/**
 * 删除信息化系统建设数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteSystemBuildingData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxx/ods-xxhxtjssj/${id}`,
  );
}

/**
 * 批量删除信息化系统建设数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteSystemBuildingData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出信息化系统建设数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportSystemBuildingData(
  query: MetaBaseZygxxOdsXxhxtjssjQuery,
) {
  return request.post("/api/meta/meta-base/zygxx/ods-xxhxtjssj/export", query, {
    responseType: "blob",
  });
}

/**
 * 导入信息化系统建设数据
 * @param formData 包含Excel文件的FormData对象
 * @returns 导入结果
 */
export function importSystemBuildingData(formData: FormData) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

/**
 * 获取字典数据 - 信息化系统分类 (XXHXTFLDM)
 * @returns 字典选项列表
 */
export function getSystemTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XXHXTFLDM",
  );
}

/**
 * 获取字典数据 - 是否特色信息化系统 (SFBZDM)
 * @returns 字典选项列表
 */
export function getIsSpecialSystemOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 场景击穿接入方式 (CJJCJRFSDM)
 * @returns 字典选项列表
 */
export function getAccessModeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/CJJCJRFSDM",
  );
}

/**
 * 获取字典数据 - 信息化系统建设类型 (XXHXTJSLXDM)
 * @returns 字典选项列表
 */
export function getBuildingTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/XXHXTJSLXDM",
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
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/batch/report-status",
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
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/batch/enable-status",
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
    `/api/meta/meta-base/zygxx/ods-xxhxtjssj/${id}/report-status`,
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
    `/api/meta/meta-base/zygxx/ods-xxhxtjssj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}

// 数据同步结果
export interface SyncResult {
  totalCount: number; // 总数
  successCount: number; // 成功数
  failedCount: number; // 失败数
  skippedCount: number; // 跳过数
  message?: string; // 附加消息
}

// 定时同步设置
export interface SyncSchedule {
  moduleName: string; // 模块名称
  syncTime: string; // 同步时间
  enabled: boolean; // 是否启用
  remark?: string; // 备注
}

/**
 * 手动获取信息化系统建设数据（从school_ods_xxhxtjssj同步到meta_base）
 * @returns 同步结果
 */
export function fetchSystemBuildingData() {
  return request.post<ApiResponse<SyncResult>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/sync-data",
  );
}

/**
 * 保存定时同步设置
 * @param schedule 同步计划设置
 * @returns 操作结果
 */
export function saveSyncSchedule(schedule: SyncSchedule) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/sync-schedule",
    schedule,
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
