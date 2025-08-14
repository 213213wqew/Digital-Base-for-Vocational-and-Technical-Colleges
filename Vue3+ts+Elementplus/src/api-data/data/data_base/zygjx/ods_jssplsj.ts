import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 教室视频流数据接口
 */

// 教室视频流数据表单数据
export interface OdsJssplsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jsh?: string; // 教室号
  spsbid?: string; // 视频设备ID
  spsbdwmc?: string; // 视频设备点位名称
  spldz?: string; // 视频流地址
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 教室视频流数据详情
export interface OdsJssplsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jsh: string; // 教室号
  spsbid: string; // 视频设备ID
  spsbdwmc: string; // 视频设备点位名称
  spldz: string; // 视频流地址
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 教室视频流数据查询参数
export interface OdsJssplsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jsh?: string;
  spsbid?: string;
  spsbdwmc?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教室视频流数据分页结果
export interface OdsJssplsjPageResult {
  records: OdsJssplsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教室视频流数据
 */
export function getOdsJssplsjPage(query: OdsJssplsjQuery) {
  return request.post<ApiResponse<OdsJssplsjPageResult>>(
    "/data/data/data-base/zygjx/ods-jssplsj/page",
    query,
  );
}

/**
 * 根据ID查询教室视频流数据详情
 */
export function getOdsJssplsjById(id: number) {
  return request.get<ApiResponse<OdsJssplsjInfo>>(
    `/data/data/data-base/zygjx/ods-jssplsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教室视频流数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJssplsjInfo>>(
    `/data/data/data-base/zygjx/ods-jssplsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教室视频流数据
 */
export function addOdsJssplsj(data: OdsJssplsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-jssplsj/add",
    data,
  );
}

/**
 * 修改教室视频流数据
 */
export function updateOdsJssplsj(data: OdsJssplsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-jssplsj/update",
    data,
  );
}

/**
 * 删除教室视频流数据
 */
export function deleteOdsJssplsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-jssplsj/${id}`,
  );
}

/**
 * 批量删除教室视频流数据
 */
export function batchDeleteOdsJssplsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-jssplsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教室视频流数据
 */
export function exportOdsJssplsj(query: OdsJssplsjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-jssplsj/export", query, {
    responseType: "blob",
  });
}

// 系统学校代码响应类型
export interface SystemSchoolCodeResponse {
  schoolCode: string;
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<SystemSchoolCodeResponse>>(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
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
 * 获取教室下拉选项
 * @param keyword 搜索关键词，支持教室号或教室名称模糊查询
 * @returns 教室选项列表
 */
export function getJsOptions(keyword?: string) {
  return request.get<ApiResponse<JsOption[]>>(
    "/data/data/data-base/zygjx/ods-jssplsj/js-options",
    {
      keyword ,
    }
  );
}
