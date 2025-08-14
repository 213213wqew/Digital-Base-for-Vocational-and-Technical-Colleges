import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 智慧教室设备运行数据接口
 */

// 智慧教室设备运行数据表单数据
export interface OdsZhjssbyxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sbbm?: string; // 设备编码
  sbmc?: string; // 设备名称
  jsh?: string; // 教室号
  ksyxsj?: string; // 开始运行时间
  jsyxsj?: string; // 结束运行时间
  xtjlsj?: string; // 系统记录时间
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 智慧教室设备运行数据详情
export interface OdsZhjssbyxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sbbm: string; // 设备编码
  sbmc: string; // 设备名称
  jsh: string; // 教室号
  ksyxsj: string; // 开始运行时间
  jsyxsj: string; // 结束运行时间
  xtjlsj: string; // 系统记录时间
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sbbmText?: string; // 设备编码文本
  jshText?: string; // 教室号文本
}

// 智慧教室设备运行数据查询参数
export interface OdsZhjssbyxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sbbm?: string;
  sbmc?: string;
  jsh?: string;
  ksyxsjStart?: string;
  ksyxsjEnd?: string;
  jsyxsjStart?: string;
  jsyxsjEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 智慧教室设备运行数据分页结果
export interface OdsZhjssbyxsjPageResult {
  records: OdsZhjssbyxsjInfo[];
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
 * 分页查询智慧教室设备运行数据
 * @param query 查询参数
 * @returns 智慧教室设备运行数据列表
 */
export function getSmartClassroomDeviceRunningDataPage(
  query: OdsZhjssbyxsjQuery,
) {
  return request.post<ApiResponse<OdsZhjssbyxsjPageResult>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/page",
    query,
  );
}

/**
 * 根据ID查询智慧教室设备运行数据详情
 * @param id 主键ID
 * @returns 智慧教室设备运行数据详情
 */
export function getSmartClassroomDeviceRunningDataById(id: number) {
  return request.get<ApiResponse<OdsZhjssbyxsjInfo>>(
    `/api/meta/meta-base/zygzc/ods-zhjssbyxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询智慧教室设备运行数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 智慧教室设备运行数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZhjssbyxsjInfo>>(
    `/api/meta/meta-base/zygzc/ods-zhjssbyxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增智慧教室设备运行数据
 * @param data 智慧教室设备运行数据信息
 * @returns 结果
 */
export function addSmartClassroomDeviceRunningData(data: OdsZhjssbyxsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/add",
    data,
  );
}

/**
 * 修改智慧教室设备运行数据
 * @param data 智慧教室设备运行数据信息
 * @returns 结果
 */
export function updateSmartClassroomDeviceRunningData(data: OdsZhjssbyxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/update",
    data,
  );
}

/**
 * 删除智慧教室设备运行数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteSmartClassroomDeviceRunningData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygzc/ods-zhjssbyxsj/${id}`,
  );
}

/**
 * 批量删除智慧教室设备运行数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteSmartClassroomDeviceRunningData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出智慧教室设备运行数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportSmartClassroomDeviceRunningData(
  query: OdsZhjssbyxsjQuery,
) {
  return request.post(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典数据 - 设备编码  
 * @param keyword 搜索关键字
 * @returns 字典选项列表
 */
export function getDeviceCodeOptions(keyword?: string) {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/meta-base/zygzc/ods-yqsbjbsj/device-code-options",
    {
       keyword 
    }
  );
}
// 教室基本信息接口（用于下拉选择）
export interface ClassroomBasicInfo {
  jsh: string; // 教室号
  jsmc: string; // 教室名称
  label: string; // 显示标签：教室号 - 教室名称
  value: string; // 值：教室号
}
 
/**
 * 模糊搜索教室基本信息
 * 从教室基本数据表中获取教室号、教室名称
 * @param keyword 搜索关键词（教室号或教室名称）
 * @param limit 返回结果数量限制
 * @returns 教室基本信息列表
 */
export function getClassroomNumberOptions(keyword?: string, limit: number = 50) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  // 注意：后端已经限制了50条，这里传limit只是为了保持接口一致性
  if (limit !== 50) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<ClassroomBasicInfo[]>>(
    `/api/meta/meta-base/zygjx/ods-jsjbsj/js-options?${params.toString()}`,
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
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/batch/report-status",
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
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单个记录上报状态
 * @param id ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygzc/ods-zhjssbyxsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单个记录启用状态
 * @param id ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygzc/ods-zhjssbyxsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}

// 同步结果接口
export interface SyncResult {
  totalCount: number; // 总数
  successCount: number; // 成功数
  failedCount: number; // 失败数
  skippedCount: number; // 跳过数
  message?: string; // 附加消息
}

// 同步调度配置接口
export interface SyncSchedule {
  moduleName: string; // 模块名称
  syncTime: string; // 同步时间
  enabled: boolean; // 是否启用
  remark?: string; // 备注
}

/**
 * 从上级数据源同步智慧教室设备运行数据
 * @returns 同步结果
 */
export function fetchSmartClassroomDeviceRunningData() {
  return request.post<ApiResponse<SyncResult>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/fetch",
  );
}

/**
 * 保存同步调度配置
 * @param schedule 调度配置
 * @returns 操作结果
 */
export function saveSyncSchedule(schedule: SyncSchedule) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygzc/ods-zhjssbyxsj/sync-schedule",
    schedule,
  );
}
/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}