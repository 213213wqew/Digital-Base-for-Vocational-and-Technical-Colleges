import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

// 查询条件接口
export interface MetaBaseZygxxOdsXxtsxxhxtyysjQuery {
  pageNum: number;
  pageSize: number;
  zjsjwyxbs?: string;
  xxdm?: string;
  tsxxhxtbh?: string;
  tsxxhxtqc?: string;
  nr?: string;
  csrqStart?: string;
  csrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  enableStatus?: string;
  reportStatus?: string;
}

// 表单数据接口
export interface MetaBaseZygxxOdsXxtsxxhxtyysjForm {
  id?: number;
  zjsjwyxbs: string;
  xxdm: string;
  tsxxhxtbh: string;
  tsxxhxtqc: string;
  nr: string;
  csrq: string;
  sjcjsj: string;
  enableStatus?: string;
  reportStatus?: string;
}

// 详情信息接口
export interface MetaBaseZygxxOdsXxtsxxhxtyysjInfo {
  id: number;
  zjsjwyxbs: string;
  xxdm: string;
  tsxxhxtbh: string;
  tsxxhxtqc: string;
  nr: string;
  csrq: string;
  sjcjsj: string;
  enableStatus: string;
  reportStatus: string;
  createTime: string;
  updateTime: string;
}

// 分页结果接口
export interface SpecialSystemPageResult {
  records: MetaBaseZygxxOdsXxtsxxhxtyysjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 系统建设选项接口
export interface SystemBuildingOption {
  xxhxtbh: string;
  xxhxtqc: string;
}

// 同步结果接口
export interface SyncResult {
  totalCount: number;
  successCount: number;
  failedCount: number;
  skippedCount: number;
  message?: string;
  errorMessage?: string;
}

/**
 * 分页查询学校特色信息化系统应用数据
 * @param query 查询参数
 * @returns 学校特色信息化系统应用数据列表
 */
export function listSpecialSystem(query: MetaBaseZygxxOdsXxtsxxhxtyysjQuery) {
  return request.post<ApiResponse<SpecialSystemPageResult>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/page",
    query,
  );
}

/**
 * 根据ID查询学校特色信息化系统应用数据详情
 * @param id 记录ID
 * @returns 学校特色信息化系统应用数据详情
 */
export function getSpecialSystem(id: number) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxtsxxhxtyysjInfo>>(
    `/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学校特色信息化系统应用数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 学校特色信息化系统应用数据详情
 */
export function getSpecialSystemByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxtsxxhxtyysjInfo>>(
    `/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学校特色信息化系统应用数据
 * @param data 学校特色信息化系统应用数据信息
 * @returns 结果
 */
export function addSpecialSystem(data: MetaBaseZygxxOdsXxtsxxhxtyysjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/add",
    data,
  );
}

/**
 * 修改学校特色信息化系统应用数据
 * @param data 学校特色信息化系统应用数据信息
 * @returns 结果
 */
export function updateSpecialSystem(data: MetaBaseZygxxOdsXxtsxxhxtyysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/update",
    data,
  );
}

/**
 * 删除学校特色信息化系统应用数据
 * @param id 记录ID
 * @returns 结果
 */
export function deleteSpecialSystem(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/${id}`,
  );
}

/**
 * 批量删除学校特色信息化系统应用数据
 * @param ids 记录ID数组
 * @returns 结果
 */
export function batchDeleteSpecialSystem(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学校特色信息化系统应用数据
 * @param query
 * @returns Excel文件流
 */
export function exportSpecialSystem(query: MetaBaseZygxxOdsXxtsxxhxtyysjQuery) {
  return request.post(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/export",
    query,
    {
      responseType: "blob",
      timeout: 60000, // 增加超时时间到60秒，因为导出可能需要更长时间
    },
  );
}

/**
 * 获取信息化系统建设数据选项（用于下拉选择）
 * @returns 系统选项列表
 */
export function getSystemBuildingOptions() {
  return request.get<ApiResponse<SystemBuildingOption[]>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-building-options",
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
    `/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/${id}/report-status`,
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
    `/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/${id}/enable-status`,
    {
      enableStatus,
    },
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
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/batch/report-status",
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
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 同步所有特色信息化系统数据
 * 从school_ods_xxtsxxhxtyysj同步全部数据到meta_base_zygxx_ods_xxtsxxhxtyysj
 * @returns 同步结果
 */
export function syncAllSpecialSystemData() {
  return request.post<ApiResponse<SyncResult>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/sync-all-data",
    {},
    {
      timeout: 300000, // 5分钟超时，因为同步可能需要较长时间
    },
  );
}

/**
 * 获取系统学校代码
 * @returns Promise<ApiResponse<string>>
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 导入学校特色信息化系统应用数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importSpecialSystemData(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时，导入可能需要较长时间
    },
  );
}
