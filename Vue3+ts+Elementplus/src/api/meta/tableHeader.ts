import { request } from "@/utils/request";
import type { ApiResponse, PageResult } from "@/utils/request";

// 定义查询参数接口
export interface TableHeaderQuery {
  tableId?: number;
  headerCode?: string;
  headerName?: string;
  headerConstraintValue?: string;
  headerNumber?: string;
  isEnable?: boolean;
  pageNum: number;
  pageSize: number;
  orderByColumn?: string; // 排序字段
  isAsc?: string; // 排序方式：asc/desc
}

// 定义表头定义实体接口
export interface TableHeaderInfo {
  id?: number;
  tableId: number;
  tableName: string;
  headerCode: string;
  headerName: string;
  headerChineseName: string;
  headerType: string;
  headerLength: number;
  headerConstraint: string;
  headerConstraintValue: string;
  headerExemplify: string;
  headerNumber: string;
  headerConstraintTable: string;
  headerConstraintTableId?: string;
  headerConstraintTableValue: string;
  headerConstraintTableValueDescription?: string;
  displayOrder: number;
  colspan: number;
  isEnable: boolean;
  reservedField1?: string;
  reservedField2?: string;
  reservedField3?: string;
  reservedField4?: string;
  reservedField5?: string;
  createTime?: string;
  updateTime?: string;
}

// 定义表头表单数据接口
export interface TableHeaderForm {
  id?: number;
  tableId: number;
  tableName: string;
  headerCode: string;
  headerName: string;
  headerChineseName: string;
  headerType: string;
  headerLength: number;
  headerConstraint: string;
  headerConstraintValue: string;
  headerExemplify: string;
  headerNumber: string;
  headerConstraintTable: string;
  headerConstraintTableId?: string;
  headerConstraintTableValue: string;
  headerConstraintTableValueDescription?: string;
  displayOrder: number;
  colspan: number;
  isEnable: boolean;
  reservedField1?: string;
  reservedField2?: string;
  reservedField3?: string;
  reservedField4?: string;
  reservedField5?: string;
}

// 分页查询表头定义列表
export function listTableHeaders(query: TableHeaderQuery) {
  return request.post<ApiResponse<PageResult<TableHeaderInfo>>>(
    "/api/meta/table-headers/list",
    query,
  );
}

// 获取表头定义详情
export function getTableHeader(id: number) {
  return request.get<ApiResponse<TableHeaderInfo>>(
    `/api/meta/table-headers/${id}`,
  );
}

// 获取表头列表
export function getTableHeaderList(tableId: number) {
  return request.get<ApiResponse<TableHeaderInfo[]>>(
    `/api/meta/table-headers/list/${tableId}`,
  );
}

// 新增表头定义
export function addTableHeader(data: TableHeaderForm) {
  return request.post<ApiResponse<boolean>>("/api/meta/table-headers", data);
}

// 修改表头定义
export function updateTableHeader(id: number, data: TableHeaderForm) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/table-headers/${id}`,
    data,
  );
}

// 删除表头定义
export function deleteTableHeader(id: number) {
  return request.delete<ApiResponse<boolean>>(`/api/meta/table-headers/${id}`);
}

// 批量删除表头定义
export function batchDeleteTableHeaders(ids: number[]) {
  return request.delete<ApiResponse<boolean>>("/api/meta/table-headers/batch", {
    data: ids,
  });
}

// 检查表头编码是否存在
export function checkTableHeaderCodeExists(
  tableId: number,
  headerCode: string,
  id?: number,
) {
  let url = `/api/meta/table-headers/checkWithParams?tableId=${tableId}&headerCode=${headerCode}`;
  if (id !== undefined) {
    url += `&id=${id}`;
  }
  return request.get<ApiResponse<boolean>>(url);
}

// 导出表头为Excel
export function exportTableHeaderToExcel(tableId: number) {
  return request.get<ApiResponse<string>>(
    `/api/meta/table-headers/export/${tableId}`,
  );
}

// 导入Excel表头定义
export function importTableHeaderFromExcel(formData: FormData) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/table-headers/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}
