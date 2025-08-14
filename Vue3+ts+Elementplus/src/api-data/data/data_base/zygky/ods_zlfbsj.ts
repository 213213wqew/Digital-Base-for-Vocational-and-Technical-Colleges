import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 专利发布数据接口
 */

// 专利发布数据表单数据
export interface OdsZlfbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  fbzlbh?: string; // 发布专利编号
  fbzlmc?: string; // 发布专利名称
  fbzljj?: string; // 发布专利简介
  sqggrq?: string; // 授权公告日期
  dywcrgh?: string; // 第一完成人工号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 专利发布数据详情
export interface OdsZlfbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  fbzlbh: string; // 发布专利编号
  fbzlmc: string; // 发布专利名称
  fbzljj: string; // 发布专利简介
  sqggrq: string; // 授权公告日期
  dywcrgh: string; // 第一完成人工号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 专利发布数据查询参数
export interface OdsZlfbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  fbzlbh?: string;
  fbzlmc?: string;
  dywcrgh?: string;
  sqggrqStart?: string;
  sqggrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 专利发布数据分页结果
export interface OdsZlfbsjPageResult {
  records: OdsZlfbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询专利发布数据
 */
export function getOdsZlfbsjPage(query: OdsZlfbsjQuery) {
  return request.post<ApiResponse<OdsZlfbsjPageResult>>(
    "/data/data/data-base/zygky/ods-zlfbsj/page",
    query,
  );
}

/**
 * 根据ID查询专利发布数据详情
 */
export function getOdsZlfbsjById(id: number) {
  return request.get<ApiResponse<OdsZlfbsjInfo>>(
    `/data/data/data-base/zygky/ods-zlfbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询专利发布数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZlfbsjInfo>>(
    `/data/data/data-base/zygky/ods-zlfbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增专利发布数据
 */
export function addOdsZlfbsj(data: OdsZlfbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygky/ods-zlfbsj/add",
    data,
  );
}

/**
 * 修改专利发布数据
 */
export function updateOdsZlfbsj(data: OdsZlfbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygky/ods-zlfbsj/update",
    data,
  );
}

/**
 * 删除专利发布数据
 */
export function deleteOdsZlfbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygky/ods-zlfbsj/${id}`,
  );
}

/**
 * 批量删除专利发布数据
 */
export function batchDeleteOdsZlfbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygky/ods-zlfbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出专利发布数据
 */
export function exportOdsZlfbsj(query: OdsZlfbsjQuery) {
  return request.post("/data/data/data-base/zygky/ods-zlfbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取业务字典选项
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any>>(
    `/data/data/data-base-source/options/${dictType}`
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
