import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 实习报告记录数据接口
 */

// 实习报告记录数据表单数据
export interface OdsSxbgjlsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  sxqymc?: string; // 实习企业名称
  sxgwmc?: string; // 实习岗位名称
  sxzdjs?: string; // 实习指导教师
  sxbglbm?: string; // 实习报告类别码
  sxbgnrzy?: string; // 实习报告内容摘要
  sxbgnr?: string; // 实习报告内容
  sxbgtjrq?: string; // 实习报告提交日期
  jspyztm?: string; // 教师批阅状态码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实习报告记录数据详情
export interface OdsSxbgjlsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  sxqymc: string; // 实习企业名称
  sxgwmc: string; // 实习岗位名称
  sxzdjs: string; // 实习指导教师
  sxbglbm: string; // 实习报告类别码
  sxbgnrzy: string; // 实习报告内容摘要
  sxbgnr: string; // 实习报告内容
  sxbgtjrq: string; // 实习报告提交日期
  jspyztm: string; // 教师批阅状态码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sxbglbmText?: string; // 实习报告类别文本
  jspyztmText?: string; // 教师批阅状态文本
  sxbgtjrqDisplay?: string; // 实习报告提交日期显示
  sjcjsjDisplay?: string; // 数据采集时间显示
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 实习报告记录数据查询参数
export interface OdsSxbgjlsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  sxqymc?: string;
  sxgwmc?: string;
  sxzdjs?: string;
  sxbglbm?: string;
  sxbgtjrqStart?: string;
  sxbgtjrqEnd?: string;
  jspyztm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实习报告记录数据分页结果
export interface OdsSxbgjlsjPageResult {
  records: OdsSxbgjlsjInfo[];
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
 * 分页查询实习报告记录数据
 * @param query 查询参数
 * @returns 实习报告记录数据列表
 */
export function pageOdsSxbgjlsj(query: OdsSxbgjlsjQuery) {
  return request.post<ApiResponse<OdsSxbgjlsjPageResult>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/page",
    query,
  );
}

/**
 * 根据ID查询实习报告记录数据详情
 * @param id 主键ID
 * @returns 实习报告记录数据详情
 */
export function getOdsSxbgjlsjById(id: number) {
  return request.get<ApiResponse<OdsSxbgjlsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxbgjlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实习报告记录数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实习报告记录数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxbgjlsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxbgjlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实习报告记录数据
 * @param data 实习报告记录数据信息
 * @returns 结果
 */
export function addOdsSxbgjlsj(data: OdsSxbgjlsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/add",
    data,
  );
}

/**
 * 修改实习报告记录数据
 * @param data 实习报告记录数据信息
 * @returns 结果
 */
export function updateOdsSxbgjlsj(data: OdsSxbgjlsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/update",
    data,
  );
}

/**
 * 删除实习报告记录数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxbgjlsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxbgjlsj/${id}`,
  );
}

/**
 * 批量删除实习报告记录数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxbgjlsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实习报告记录数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxbgjlsj(query: OdsSxbgjlsjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-sxbgjlsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 实习报告类别 (SXBGLBDM)
 * @returns 字典选项列表
 */
export function getReportTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SXBGLBDM",
  );
}

/**
 * 获取字典数据 - 教师批阅状态 (JSPYZTDM)
 * @returns 字典选项列表
 */
export function getTeacherReviewStatusOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/JSPYZTDM",
  );
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/batch/report-status",
    {
      ids,
      status: reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxbgjlsj/batch/enable-status",
    {
      ids,
      status: enableStatus,
    },
  );
}

/**
 * 单个修改上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateOdsSxbgjlsjReportStatus(
  id: number,
  reportStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxbgjlsj/${id}/report-status`,
    {
      status: reportStatus,
    },
  );
}

/**
 * 单个修改启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateOdsSxbgjlsjEnableStatus(
  id: number,
  enableStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxbgjlsj/${id}/enable-status`,
    {
      status: enableStatus,
    },
  );
}
