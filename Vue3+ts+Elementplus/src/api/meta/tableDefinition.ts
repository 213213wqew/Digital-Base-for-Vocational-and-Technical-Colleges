import { request } from "@/utils/request";
import type { ApiResponse, PageResult } from "@/utils/request";

/**
 * 元数据表定义查询参数
 */
export interface MetaTableQuery {
  subsetCode?: string;
  subsetName?: string;
  subcatalogCode?: string;
  subcatalogName?: string;
  tableChineseName?: string;
  tableReportFrequency?: string;
  status?: string;
  pageNum: number;
  pageSize: number;
  orderByColumn?: string; // 排序字段
  isAsc?: string; // 排序方式：asc/desc
}

/**
 * 元数据表定义信息
 */
export interface MetaTableInfo {
  id: number;
  subsetCode: string;
  subsetName: string;
  catalogCode: string;
  catalogName: string;
  subcatalogCode: string;
  subcatalogName: string;
  tableVersion: string;
  tableEnglishName: string;
  tableChineseName: string;
  tableMainSource: string;
  tableReportFrequency: string;
  tableReportScope: string;
  tableReportPeriod: string;
  description: string;
  isStandard: boolean;
  status: string;
  hasHeaders?: boolean;
  createTime: string;
  updateTime: string;
}

/**
 * 元数据表单
 */
export interface MetaTableForm {
  id?: number;
  subsetCode: string;
  subsetName: string;
  catalogCode: string;
  catalogName: string;
  subcatalogCode: string;
  subcatalogName: string;
  tableVersion: string;
  tableEnglishName: string;
  tableChineseName: string;
  tableMainSource: string;
  tableReportFrequency: string;
  tableReportScope: string;
  tableReportPeriod: string;
  description: string;
  isStandard: boolean;
  status: string;
}

/**
 * 获取状态选项
 */
export function getStatusOptions() {
  return [
    { value: "ACTIVE", label: "启用" },
    { value: "DRAFT", label: "草稿" },
    { value: "INACTIVE", label: "停用" },
  ];
}

/**
 * 分页查询元数据表定义列表
 * @param query 查询参数
 * @returns 分页数据
 */
export function listMetaTable(query: MetaTableQuery) {
  return request.post<ApiResponse<PageResult<MetaTableInfo>>>(
    "/api/meta/table-definitions/list",
    query,
  );
}

/**
 * 查询所有活跃元数据表定义
 * @returns 活跃元数据表定义列表
 */
export function listActiveMetaTable() {
  return request.get<ApiResponse<MetaTableInfo[]>>(
    "/api/meta/table-definitions/active",
  );
}

/**
 * 根据ID获取元数据表定义详情
 * @param id 元数据表定义ID
 * @returns 元数据表定义详情
 */
export function getMetaTable(id: number) {
  return request.get<ApiResponse<MetaTableInfo>>(
    `/api/meta/table-definitions/${id}`,
  );
}

/**
 * 新增元数据表定义
 * @param data 元数据表定义数据
 * @returns 操作结果
 */
export function addMetaTable(data: MetaTableForm) {
  return request.post<ApiResponse<number>>("/api/meta/table-definitions", data);
}

/**
 * 修改元数据表定义
 * @param id 元数据表定义ID
 * @param data 元数据表定义数据
 * @returns 操作结果
 */
export function updateMetaTable(id: number, data: MetaTableForm) {
  return request.put<ApiResponse<Boolean>>(
    `/api/meta/table-definitions/${id}`,
    data,
  );
}

/**
 * 删除元数据表定义
 * @param id 元数据表定义ID
 * @returns 操作结果
 */
export function deleteMetaTable(id: number) {
  return request.delete<ApiResponse<Boolean>>(
    `/api/meta/table-definitions/${id}`,
  );
}

/**
 * 批量删除元数据表定义
 * @param ids 元数据表定义ID列表
 * @returns 操作结果
 */
export function batchDeleteMetaTable(ids: number[]) {
  return request.delete<ApiResponse<Boolean>>(
    "/api/meta/table-definitions/batch",
    { data: ids },
  );
}

/**
 * 修改元数据表定义状态
 * @param id 元数据表定义ID
 * @param status 状态
 * @returns 操作结果
 */
export function changeMetaTableStatus(id: number, status: string) {
  return request.put<ApiResponse<Boolean>>(
    `/api/meta/table-definitions/${id}/status`,
    { status },
  );
}

/**
 * 获取表头定义数据
 * @param tableId 表定义ID
 * @returns 表头定义数据列表
 */
export function getTableHeaders(tableId: number) {
  return request.get<ApiResponse<any[]>>(
    `/api/meta/table-headers/table-header-definitions/by-table/${tableId}`,
  );
}
