import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 校本数据中心数据集成情况数据接口
 */

// 校本数据中心数据集成情况数据表单数据
export interface OdsXbsjzxsjjcqksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sjkmc?: string; // 数据库名称
  sjbmc?: string; // 数据表名称
  sjbsm?: string; // 数据表说明
  sjbgxplm?: string; // 数据表更新频率码
  xxhxtbh?: string; // 信息化系统编号
  sjhjl?: number; // 数据汇聚量
  sjjkfwdyl?: number; // 数据接口服务调用量
  sjbgxfsm?: string; // 数据表更新方式码
  sjbgxrq?: string; // 数据表更新日期
  sjcjsj?: string; // 数据采集时间
}

// 校本数据中心数据集成情况数据详情
export interface OdsXbsjzxsjjcqksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sjkmc: string; // 数据库名称
  sjbmc: string; // 数据表名称
  sjbsm: string; // 数据表说明
  sjbgxplm: string; // 数据表更新频率码
  xxhxtbh: string; // 信息化系统编号
  sjhjl: number; // 数据汇聚量
  sjjkfwdyl: number; // 数据接口服务调用量
  sjbgxfsm: string; // 数据表更新方式码
  sjbgxrq: string; // 数据表更新日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  sjbgxplmText?: string; // 数据表更新频率名称
  sjbgxfsmText?: string; // 数据表更新方式名称
}

// 校本数据中心数据集成情况数据查询参数
export interface OdsXbsjzxsjjcqksjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sjkmc?: string; // 数据库名称
  sjbmc?: string; // 数据表名称
  sjbgxplm?: string; // 数据表更新频率码
  xxhxtbh?: string; // 信息化系统编号
  sjbgxfsm?: string; // 数据表更新方式码
  sjbgxrqStart?: string; // 数据表更新日期开始
  sjbgxrqEnd?: string; // 数据表更新日期结束
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
  pageNum: number;
  pageSize: number;
}

// 校本数据中心数据集成情况数据分页结果
export interface OdsXbsjzxsjjcqksjPageResult {
  records: OdsXbsjzxsjjcqksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询校本数据中心数据集成情况数据
 */
export function getOdsXbsjzxsjjcqksjPage(query: OdsXbsjzxsjjcqksjQuery) {
  return request.post<ApiResponse<OdsXbsjzxsjjcqksjPageResult>>(
    "/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/page",
    query,
  );
}

/**
 * 根据ID查询校本数据中心数据集成情况数据详情
 */
export function getOdsXbsjzxsjjcqksjById(id: number) {
  return request.get<ApiResponse<OdsXbsjzxsjjcqksjInfo>>(
    `/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询校本数据中心数据集成情况数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXbsjzxsjjcqksjInfo>>(
    `/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增校本数据中心数据集成情况数据
 */
export function addOdsXbsjzxsjjcqksj(data: OdsXbsjzxsjjcqksjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/add",
    data,
  );
}

/**
 * 修改校本数据中心数据集成情况数据
 */
export function updateOdsXbsjzxsjjcqksj(data: OdsXbsjzxsjjcqksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/update",
    data,
  );
}

/**
 * 删除校本数据中心数据集成情况数据
 */
export function deleteOdsXbsjzxsjjcqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/${id}`,
  );
}

/**
 * 批量删除校本数据中心数据集成情况数据
 */
export function batchDeleteOdsXbsjzxsjjcqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出校本数据中心数据集成情况数据
 */
export function exportOdsXbsjzxsjjcqksj(query: OdsXbsjzxsjjcqksjQuery) {
  return request.post(
    "/api/meta/meta-base/zygfw/ods-xbsjzxsjjcqksj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

// 状态常量
export const REPORT_STATUS = {
  UNREPORTED: "0",
  REPORTED: "1",
  FAILED: "2",
};

export const ENABLE_STATUS = {
  DISABLED: "0",
  ENABLED: "1",
};

/**
 * 按字典类型获取选项
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any[]>>(`/api/meta/data-base-source/options/${dictType}`);
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}

/**
 * 搜索信息化系统信息
 */
export function searchSystemInfo(query: string) {
  return request.get<ApiResponse<any[]>>("/api/meta/meta-base/zygxx/ods-xxhxtjssj/options", {
  query 
  });
}
