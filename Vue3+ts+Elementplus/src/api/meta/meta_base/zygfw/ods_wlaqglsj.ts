import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 网络安全管理数据接口
 */

// 网络安全管理数据表单数据
export interface OdsWlaqglsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  wlsyjls?: number; // 网络使用记录数
  wlsyll?: number; // 网络使用流量
  wlgjsbcs?: number; // 网络攻击识别次数
  wldksysxsl?: string; // 网络带宽使用上行速率
  wldksyxxsl?: string; // 网络带宽使用下行速率
  jlrq?: string; // 记录日期
  sjcjsj?: string; // 数据采集时间
}

// 网络安全管理数据详情
export interface OdsWlaqglsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  wlsyjls: number; // 网络使用记录数
  wlsyll: number; // 网络使用流量
  wlgjsbcs: number; // 网络攻击识别次数
  wldksysxsl: string; // 网络带宽使用上行速率
  wldksyxxsl: string; // 网络带宽使用下行速率
  jlrq: string; // 记录日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
}

// 网络安全管理数据查询参数
export interface OdsWlaqglsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jlrqStart?: string;
  jlrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 网络安全管理数据分页结果
export interface OdsWlaqglsjPageResult {
  records: OdsWlaqglsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询网络安全管理数据
 */
export function getOdsWlaqglsjPage(query: OdsWlaqglsjQuery) {
  return request.post<ApiResponse<OdsWlaqglsjPageResult>>(
    "/api/meta/meta-base/zygfw/ods-wlaqglsj/page",
    query,
  );
}

/**
 * 根据ID查询网络安全管理数据详情
 */
export function getOdsWlaqglsjById(id: number) {
  return request.get<ApiResponse<OdsWlaqglsjInfo>>(
    `/api/meta/meta-base/zygfw/ods-wlaqglsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询网络安全管理数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsWlaqglsjInfo>>(
    `/api/meta/meta-base/zygfw/ods-wlaqglsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增网络安全管理数据
 */
export function addOdsWlaqglsj(data: OdsWlaqglsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygfw/ods-wlaqglsj/add",
    data,
  );
}

/**
 * 修改网络安全管理数据
 */
export function updateOdsWlaqglsj(data: OdsWlaqglsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-wlaqglsj/update",
    data,
  );
}

/**
 * 删除网络安全管理数据
 */
export function deleteOdsWlaqglsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygfw/ods-wlaqglsj/${id}`,
  );
}

/**
 * 批量删除网络安全管理数据
 */
export function batchDeleteOdsWlaqglsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-wlaqglsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出网络安全管理数据
 */
export function exportOdsWlaqglsj(query: OdsWlaqglsjQuery) {
  return request.post("/api/meta/meta-base/zygfw/ods-wlaqglsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}