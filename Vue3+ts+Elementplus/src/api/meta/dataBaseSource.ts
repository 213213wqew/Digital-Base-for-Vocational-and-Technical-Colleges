import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 基础数据源查询参数
 */
export interface DataBaseSourceQuery {
  pageNum: number
  pageSize: number
  sourceCode?: string
  sourceName?: string
  config?: string
  status?: string
  aliases?: string
}

/**
 * 基础数据源表单数据
 */
export interface DataBaseSourceForm {
  id?: number;
  sourceCode: string;
  sourceName: string;
  sourceType: string;
  config?: string;
  description?: string;
  status?: string;
  aliases?: string;
}

/**
 * 基础数据源详情
 */
export interface DataBaseSourceInfo {
  id: number;
  sourceCode: string;
  sourceName: string;
  sourceType: string;
  config: string;
  description: string;
  status: string;
  aliases?: string;
  createTime: string;
  updateTime: string;
}

/**
 * 基础数据源分页结果
 */
export interface DataBaseSourcePageResult {
  records: DataBaseSourceInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询基础数据源
 * @param query 查询参数
 * @returns 基础数据源列表
 */
export function listDataBaseSource(query: DataBaseSourceQuery) {
  return request.post<ApiResponse<DataBaseSourcePageResult>>(
    "/api/meta/data-base-source/list",
    query,
  );
}

/**
 * 获取基础数据源详情
 * @param id 基础数据源ID
 * @returns 基础数据源详情
 */
export function getDataBaseSource(id: number) {
  return request.get<ApiResponse<DataBaseSourceInfo>>(
    `/api/meta/data-base-source/${id}`,
  );
}

/**
 * 新增基础数据源
 * @param data 基础数据源信息
 * @returns 结果
 */
export function addDataBaseSource(data: DataBaseSourceForm) {
  return request.post<ApiResponse<number>>("/api/meta/data-base-source", data);
}

/**
 * 修改基础数据源
 * @param data 基础数据源信息
 * @returns 结果
 */
export function updateDataBaseSource(data: DataBaseSourceForm) {
  return request.put<ApiResponse<boolean>>("/api/meta/data-base-source", data);
}

/**
 * 删除基础数据源
 * @param id 基础数据源ID
 * @returns 结果
 */
export function deleteDataBaseSource(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/data-base-source/${id}`,
  );
}

/**
 * 批量删除基础数据源
 * @param ids 基础数据源ID数组
 * @returns 结果
 */
export function batchDeleteDataBaseSource(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/data-base-source/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导入Excel数据
 * @param formData 包含Excel文件的FormData对象
 * @returns 导入结果
 */
export function importDataBaseSource(formData: FormData) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/data-base-source/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

/**
 * 根据数据源代码获取基础数据列表
 * @param sourceCode 数据源代码
 * @returns 基础数据列表
 */
export function getDataBaseSourceByCode(sourceCode: string) {
  return request.get<ApiResponse<DataBaseSourceInfo[]>>(
    `/api/meta/data-base-source/code/${sourceCode}`,
  );
}

/**
 * 根据代码模式获取下拉选项
 * @param codePattern 代码模式
 * @returns 下拉选项列表
 */
export function getOptionsByCodePattern(codePattern: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    `/api/meta/data-base-source/options/${codePattern}`,
  );
}
