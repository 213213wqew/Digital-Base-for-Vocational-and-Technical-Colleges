import { request } from "@/utils/request";
import type { ApiResponse, PageResult } from "@/utils/request";

// 字段查询参数接口
export interface FieldQueryParams {
  pageNum: number;
  pageSize: number;
  tableId?: number;
  fieldCode?: string;
  fieldName?: string;
  fieldType?: string;
}

// 字段定义信息接口
export interface FieldInfo {
  id: number;
  tableId: number;
  tableName?: string;
  fieldCode: string;
  fieldName: string;
  fieldType: string;
  length?: number;
  precision?: number;
  scale?: number;
  isRequired: boolean;
  isUnique: boolean;
  defaultValue?: string;
  validationRule?: string;
  description?: string;
  displayOrder: number;
  status: number;
  createTime?: string;
  updateTime?: string;
}

// 字段表单数据接口
export interface FieldForm {
  id?: number;
  tableId: number;
  fieldCode: string;
  fieldName: string;
  fieldType: string;
  length?: number;
  precision?: number;
  scale?: number;
  isRequired: boolean;
  isUnique: boolean;
  defaultValue?: string;
  validationRule?: string;
  description?: string;
  displayOrder: number;
  status?: number;
}

// 分页查询字段列表
export function listMetaFields(query: FieldQueryParams) {
  return request.get<ApiResponse<PageResult<FieldInfo>>>(
    "/api/meta/field-definitions",
    { params: query },
  );
}

// 根据ID获取字段详情
export function getMetaField(id: number) {
  return request.get<ApiResponse<FieldInfo>>(
    `/api/meta/field-definitions/${id}`,
  );
}

// 根据表ID获取字段列表
export function getFieldsByTableId(tableId: number) {
  return request.get<ApiResponse<FieldInfo[]>>(
    `/api/meta/field-definitions/table/${tableId}`,
  );
}

// 新增字段定义
export function addMetaField(data: FieldForm) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/field-definitions",
    data,
  );
}

// 修改字段定义
export function updateMetaField(id: number, data: FieldForm) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/field-definitions/${id}`,
    data,
  );
}

// 删除字段定义
export function deleteMetaField(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/field-definitions/${id}`,
  );
}

// 批量删除字段定义
export function batchDeleteMetaFields(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/field-definitions/batch",
    { data: ids },
  );
}

// 检查字段编码是否存在
export function checkFieldCodeExists(
  tableId: number,
  fieldCode: string,
  id?: number,
) {
  return request.get<ApiResponse<boolean>>(
    "/api/meta/field-definitions/check",
    {
      params: { tableId, fieldCode, id },
    },
  );
}
