import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 教室基本数据接口
 */

// 教室基本数据表单数据
export interface OdsJsjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jsh?: string; // 教室号
  jsmc?: string; // 教室名称
  zws?: number; // 座位数
  jslxm?: string; // 教室类型码
  jsms?: string; // 教室描述
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 教室基本数据详情
export interface OdsJsjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jsh: string; // 教室号
  jsmc: string; // 教室名称
  zws: number; // 座位数
  jslxm: string; // 教室类型码
  jsms: string; // 教室描述
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jslxmText?: string; // 教室类型文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 教室基本数据查询参数
export interface OdsJsjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jsh?: string;
  jsmc?: string;
  jslxm?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教室基本数据分页结果
export interface OdsJsjbsjPageResult {
  records: OdsJsjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 教室选项类型
export interface JsOption {
  jsh: string;          // 教室号
  jsmc: string;         // 教室名称
  zws: number;          // 座位数
  jslxm: string;        // 教室类型码
  xxdm: string;         // 学校代码
  label: string;        // 显示标签
  value: string;        // 值
}

/**
 * 分页查询教室基本数据
 */
export function getOdsJsjbsjPage(query: OdsJsjbsjQuery) {
  return request.post<ApiResponse<OdsJsjbsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-jsjbsj/page",
    query,
  );
}

/**
 * 根据ID查询教室基本数据详情
 */
export function getOdsJsjbsjById(id: number) {
  return request.get<ApiResponse<OdsJsjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jsjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教室基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJsjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jsjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教室基本数据
 */
export function addOdsJsjbsj(data: OdsJsjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-jsjbsj/add",
    data,
  );
}

/**
 * 修改教室基本数据
 */
export function updateOdsJsjbsj(data: OdsJsjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jsjbsj/update",
    data,
  );
}

/**
 * 删除教室基本数据
 */
export function deleteOdsJsjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-jsjbsj/${id}`,
  );
}

/**
 * 批量删除教室基本数据
 */
export function batchDeleteOdsJsjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jsjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教室基本数据
 */
export function exportOdsJsjbsj(query: OdsJsjbsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-jsjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取教室类型选项
 */
export function getJslxOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/api/meta/data-base-source/options/SKDDLBDM"
  );
}

/**
 * 获取教室下拉选项
 * @param keyword 搜索关键词，支持教室号或教室名称模糊查询
 * @returns 教室选项列表
 */
export function getJsOptions(keyword?: string) {
  return request.get<ApiResponse<JsOption[]>>(
    "/api/meta/meta-base/zygjx/ods-jsjbsj/js-options",
    {
      params: { keyword },
    }
  );
}

