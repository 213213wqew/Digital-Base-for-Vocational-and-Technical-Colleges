import request from "@/utils/request-code.ts";
import type { OdsPyfasjInfo, OdsPyfasjQuery, OdsPyfasjForm } from "./types.ts";
import type { ApiResponse, PageResult } from "@/types";

// 查询培养方案数据列表
export function getOdsPyfasjPage(
  params: OdsPyfasjQuery,
): Promise<ApiResponse<PageResult<OdsPyfasjInfo>>> {
  return request.get("/data/data/data-base/zygjx/ods-pyfasj/page", { params });
}

// 获取培养方案数据详细信息
export function getOdsPyfasjById(
  id: number,
): Promise<ApiResponse<OdsPyfasjInfo>> {
  return request.get(`/data/data/data-base/zygjx/ods-pyfasj/${id}`);
}

// 新增培养方案数据
export function addOdsPyfasj(data: OdsPyfasjForm): Promise<ApiResponse<null>> {
  return request.post("/data/data/data-base/zygjx/ods-pyfasj", data);
}

// 修改培养方案数据
export function updateOdsPyfasj(
  data: OdsPyfasjForm,
): Promise<ApiResponse<null>> {
  return request.put("/data/data/data-base/zygjx/ods-pyfasj", data);
}

// 删除培养方案数据
export function deleteOdsPyfasj(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/data/data/data-base/zygjx/ods-pyfasj/${id}`);
}

// 批量删除培养方案数据
export function batchDeleteOdsPyfasj(
  ids: number[],
): Promise<ApiResponse<null>> {
  return request.delete("/data/data/data-base/zygjx/ods-pyfasj", { data: ids });
}

// 导出培养方案数据
export function exportOdsPyfasj(params: OdsPyfasjQuery): Promise<any> {
  return request.post("/data/data/data-base/zygjx/ods-pyfasj/export", params, {
    responseType: "blob",
  });
}
