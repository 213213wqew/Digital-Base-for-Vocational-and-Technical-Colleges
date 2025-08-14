import request from "@/utils/request";

// 同步配置信息接口
export interface SyncScheduleConfig {
  id?: number;
  moduleName: string;
  moduleCode: string;
  sourceTable: string;
  targetTable: string;
  syncTime: string;
  syncCycleType?: string; // 同步周期类型
  cycleConfig?: string; // 周期配置JSON
  cronExpression?: string;
  enabled: boolean;
  sortOrder: number;
  syncApiUrl: string;
  remark?: string;
  createdTime?: string;
  updatedTime?: string;
}

// 同步周期类型选项
export interface SyncCycleTypeOption {
  value: string;
  label: string;
  description: string;
}

export interface PageParams {
  pageNum: number;
  pageSize: number;
  moduleName?: string;
  enabled?: boolean | null;
}

// 分页查询参数
export interface SyncConfigQuery {
  pageNum: number;
  pageSize: number;
  moduleName?: string;
  enabled?: boolean;
}

// 分页结果
export interface SyncConfigPageResult {
  records: SyncScheduleConfig[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// API响应格式
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页查询同步配置
 */
export function getSyncConfigList(params: PageParams) {
  return request.get("/api/sync/schedule-config/list", params);
}

/**
 * 根据ID获取同步配置
 */
export function getSyncConfigById(id: number) {
  return request.get(`/api/sync/schedule-config/${id}`);
}

/**
 * 新增同步配置
 */
export function addSyncConfig(data: SyncScheduleConfig) {
  return request.post("/api/sync/schedule-config", data);
}

/**
 * 更新同步配置
 */
export function updateSyncConfig(data: SyncScheduleConfig) {
  return request.put("/api/sync/schedule-config", data);
}

/**
 * 删除同步配置
 */
export function deleteSyncConfig(id: number) {
  return request.delete(`/api/sync/schedule-config/${id}`);
}

/**
 * 批量删除同步配置
 */
export function batchDeleteSyncConfig(ids: number[]) {
  return request.delete("/api/sync/schedule-config/batch", ids);
}

/**
 * 测试同步功能
 */
export function testSyncFunction(id: number) {
  return request.post(`/api/sync/schedule-config/test/${id}`);
}

/**
 * 获取所有启用的配置
 */
export function getAllEnabledConfigs() {
  return request.get("/api/sync/schedule-config/enabled");
}

/**
 * 获取数据库所有表名
 */
export function getAllTableNames() {
  return request.get("/api/sync/schedule-config/tables");
}

// 重新加载所有定时任务
export function reloadAllTasks() {
  return request.post("/api/sync/schedule-config/reload-all");
}

// 获取定时任务状态
export function getTaskStatus() {
  return request.get("/api/sync/schedule-config/task-status");
}

// 获取同步周期类型选项
export function getCycleTypes() {
  return request.get("/api/sync/schedule-config/cycle-types");
}
