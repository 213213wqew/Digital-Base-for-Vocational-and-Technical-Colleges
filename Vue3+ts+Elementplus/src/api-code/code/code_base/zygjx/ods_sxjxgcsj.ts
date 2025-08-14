import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 实训教学过程数据接口
 */

// 实训教学过程数据表单数据
export interface OdsSxjxgcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sxxmbh?: string; // 实训项目编号
  sszyh?: string; // 所属专业号
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  xssxkss?: number; // 学生实训课时数
  sxksrq?: string; // 实训开始日期
  sxjsrq?: string; // 实训结束日期
  sxjgzhpj?: number; // 实训结果综合评价
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实训教学过程数据详情
export interface OdsSxjxgcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sxxmbh: string; // 实训项目编号
  sszyh: string; // 所属专业号
  xh: string; // 学号
  xsxm: string; // 学生姓名
  xssxkss: number; // 学生实训课时数
  sxksrq: string; // 实训开始日期
  sxjsrq: string; // 实训结束日期
  sxjgzhpj: number; // 实训结果综合评价
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sxksrqDisplay?: string; // 实训开始日期显示
  sxjsrqDisplay?: string; // 实训结束日期显示
  sjcjsjDisplay?: string; // 数据采集时间显示
  sxjgzhpjText?: string; // 实训结果综合评价文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
  statusLoading?: boolean; // 状态加载状态（前端使用）
}

// 实训教学过程数据查询参数
export interface OdsSxjxgcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sxxmbh?: string;
  sszyh?: string;
  xh?: string;
  xsxm?: string;
  sxksrq?: string;
  sxjsrq?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实训教学过程数据分页结果
export interface OdsSxjxgcsjPageResult {
  records: OdsSxjxgcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询实训教学过程数据
 * @param query 查询参数
 * @returns 实训教学过程数据列表
 */
export function getOdsSxjxgcsjPage(query: OdsSxjxgcsjQuery) {
  return request.post<ApiResponse<OdsSxjxgcsjPageResult>>(
    "/code/code/code-base/zygjx/ods-sxjxgcsj/page",
    query,
  );
}

/**
 * 根据ID查询实训教学过程数据详情
 * @param id 主键ID
 * @returns 实训教学过程数据详情
 */
export function getOdsSxjxgcsjById(id: number) {
  return request.get<ApiResponse<OdsSxjxgcsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxjxgcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实训教学过程数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实训教学过程数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxjxgcsjInfo>>(
    `/code/code/code-base/zygjx/ods-sxjxgcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实训教学过程数据
 * @param data 实训教学过程数据信息
 * @returns 结果
 */
export function addOdsSxjxgcsj(data: OdsSxjxgcsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-sxjxgcsj/add",
    data,
  );
}

/**
 * 修改实训教学过程数据
 * @param data 实训教学过程数据信息
 * @returns 结果
 */
export function updateOdsSxjxgcsj(data: OdsSxjxgcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxjxgcsj/update",
    data,
  );
}

/**
 * 删除实训教学过程数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxjxgcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjxgcsj/${id}`,
  );
}

/**
 * 批量删除实训教学过程数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxjxgcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxjxgcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实训教学过程数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxjxgcsj(query: OdsSxjxgcsjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-sxjxgcsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-sxjxgcsj/batch/report-status",
    {
      ids,
      reportStatus,
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
    "/code/code/code-base/zygjx/ods-sxjxgcsj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 单个修改上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjxgcsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 单个修改启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-sxjxgcsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取实训项目编号选项列表
 * @param keyword 查询关键字
 * @returns 选项列表
 */
export function getSxxmbhOptions(keyword?: string) {
  const params = keyword ? { keyword } : {};
  return request.get<
    ApiResponse<Array<{ value: string; label: string; gkzyh: string }>>
  >("/code/code/code-base/zygjx/ods-sxjxgcsj/sxxmbh/options", { params });
}

/**
 * 获取学号学生姓名选项列表
 * @param keyword 查询关键字(学号或姓名模糊查询)
 * @returns 选项列表
 */
export function getStudentOptions(keyword?: string) {
  const params = keyword ? { keyword } : {};
  return request.get<
    ApiResponse<Array<{ value: string; label: string; xsxm: string }>>
  >("/code/code/code-base/zygxs/ods-xshxsj/student/options", { params });
}
