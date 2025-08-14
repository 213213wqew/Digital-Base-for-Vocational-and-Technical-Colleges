import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 校园动态信息数据接口
 */

// 校园动态信息数据表单数据
export interface OdsXydtxxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xydtxxbt?: string; // 校园动态信息标题
  xydtxxwbfwlj?: string; // 校园动态信息外部访问链接
  dtfbrq?: string; // 动态发布日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 校园动态信息数据详情
export interface OdsXydtxxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xydtxxbt: string; // 校园动态信息标题
  xydtxxwbfwlj: string; // 校园动态信息外部访问链接
  dtfbrq: string; // 动态发布日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校名称
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 校园动态信息数据查询参数
export interface OdsXydtxxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xydtxxbt?: string;
  dtfbrqStart?: string;
  dtfbrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 校园动态信息数据分页结果
export interface OdsXydtxxsjPageResult {
  records: OdsXydtxxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询校园动态信息数据
 */
export function getOdsXydtxxsjPage(query: OdsXydtxxsjQuery) {
  return request.post<ApiResponse<OdsXydtxxsjPageResult>>(
    "/code/code/code-base/zygfw/ods-xydtxxsj/page",
    query,
  );
}

/**
 * 根据ID查询校园动态信息数据详情
 */
export function getOdsXydtxxsjById(id: number) {
  return request.get<ApiResponse<OdsXydtxxsjInfo>>(
    `/code/code/code-base/zygfw/ods-xydtxxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询校园动态信息数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXydtxxsjInfo>>(
    `/code/code/code-base/zygfw/ods-xydtxxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增校园动态信息数据
 */
export function addOdsXydtxxsj(data: OdsXydtxxsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygfw/ods-xydtxxsj/add",
    data,
  );
}

/**
 * 修改校园动态信息数据
 */
export function updateOdsXydtxxsj(data: OdsXydtxxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-xydtxxsj/update",
    data,
  );
}

/**
 * 删除校园动态信息数据
 */
export function deleteOdsXydtxxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygfw/ods-xydtxxsj/${id}`,
  );
}

/**
 * 批量删除校园动态信息数据
 */
export function batchDeleteOdsXydtxxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-xydtxxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出校园动态信息数据
 */
export function exportOdsXydtxxsj(query: OdsXydtxxsjQuery) {
  return request.post("/code/code/code-base/zygfw/ods-xydtxxsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
