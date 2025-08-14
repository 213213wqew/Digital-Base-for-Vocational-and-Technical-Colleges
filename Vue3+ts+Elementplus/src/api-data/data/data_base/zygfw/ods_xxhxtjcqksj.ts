import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 信息化系统集成情况数据接口
 */

// 信息化系统集成情况数据表单数据
export interface OdsXxhxtjcqksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xxhxtbh?: string; // 信息化系统编号
  xxhxtjc?: string; // 信息化系统简称
  xxhxtqc?: string; // 信息化系统全称
  jcfxm?: string; // 集成方向码
  jcbb?: string; // 集成版本
  jcfsm?: string; // 集成方式码
  jkxym?: string; // 接口协议码
  jkbb?: string; // 接口版本
  rzfsm?: string; // 认证方式码
  jcwcrq?: string; // 集成完成日期
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 信息化系统集成情况数据详情
export interface OdsXxhxtjcqksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xxhxtbh: string; // 信息化系统编号
  xxhxtjc: string; // 信息化系统简称
  xxhxtqc: string; // 信息化系统全称
  jcfxm: string; // 集成方向码
  jcbb: string; // 集成版本
  jcfsm: string; // 集成方式码
  jkxym: string; // 接口协议码
  jkbb: string; // 接口版本
  rzfsm: string; // 认证方式码
  jcwcrq: string; // 集成完成日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jcfxmText?: string; // 集成方向名称
  jcfsmText?: string; // 集成方式名称
  jkxymText?: string; // 接口协议名称
  rzfsmText?: string; // 认证方式名称
}

// 信息化系统集成情况数据查询参数
export interface OdsXxhxtjcqksjQuery {
  xxhxtjc?: string;
  xxhxtqc?: string;
  pageNum: number;
  pageSize: number;
}

// 信息化系统集成情况数据分页结果
export interface OdsXxhxtjcqksjPageResult {
  records: OdsXxhxtjcqksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 分页查询信息化系统集成情况数据
 */
export function getOdsXxhxtjcqksjPage(query: OdsXxhxtjcqksjQuery) {
  return request.post<ApiResponse<OdsXxhxtjcqksjPageResult>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/page",
    query,
  );
}

/**
 * 根据ID查询信息化系统集成情况数据详情
 */
export function getOdsXxhxtjcqksjById(id: number) {
  return request.get<ApiResponse<OdsXxhxtjcqksjInfo>>(
    `/data/data/data-base/zygfw/ods-xxhxtjcqksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询信息化系统集成情况数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXxhxtjcqksjInfo>>(
    `/data/data/data-base/zygfw/ods-xxhxtjcqksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增信息化系统集成情况数据
 */
export function addOdsXxhxtjcqksj(data: OdsXxhxtjcqksjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/add",
    data,
  );
}

/**
 * 修改信息化系统集成情况数据
 */
export function updateOdsXxhxtjcqksj(data: OdsXxhxtjcqksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/update",
    data,
  );
}

/**
 * 删除信息化系统集成情况数据
 */
export function deleteOdsXxhxtjcqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygfw/ods-xxhxtjcqksj/${id}`,
  );
}

/**
 * 批量删除信息化系统集成情况数据
 */
export function batchDeleteOdsXxhxtjcqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出信息化系统集成情况数据
 */
export function exportOdsXxhxtjcqksj(query: OdsXxhxtjcqksjQuery) {
  return request.post(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/data/data/data-base-source/options/${dictType}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}

/**
 * 批量修改上报状态
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/batch-report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygfw/ods-xxhxtjcqksj/batch-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单条记录上报状态
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygfw/ods-xxhxtjcqksj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单条记录启用状态
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygfw/ods-xxhxtjcqksj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}
/**
 * 远程搜索信息化系统建设数据
 * @param query 搜索关键词
 */
export function searchSystemInfo(query: string) {
  return request.get<ApiResponse<any[]>>("/data/data/data-base/zygxx/ods-xxhxtjssj/options", {
    query 
    });
}
