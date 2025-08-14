import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 实习保险购买情况数据接口
 */

// 实习保险购买情况数据表单数据
export interface OdsSxbxgmqksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  bxxzmc?: string; // 保险险种名称
  bdh?: string; // 保单号
  bxfczfmc?: string; // 保险费出资方名称
  bxgmrq?: string; // 保险购买日期
  bxgmfm?: string; // 保险购买方码
  gmbxzlm?: string; // 购买保险种类码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实习保险购买情况数据详情
export interface OdsSxbxgmqksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  bxxzmc: string; // 保险险种名称
  bdh: string; // 保单号
  bxfczfmc: string; // 保险费出资方名称
  bxgmrq: string; // 保险购买日期
  bxgmrqDisplay: string; // 保险购买日期显示格式
  bxgmfm: string; // 保险购买方码
  bxgmfmText: string; // 保险购买方码文本
  gmbxzlm: string; // 购买保险种类码
  gmbxzlmText: string; // 购买保险种类码文本
  sjcjsj: string; // 数据采集时间
  sjcjsjDisplay: string; // 数据采集时间显示格式
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  reportStatusText: string; // 上报状态文本
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  enableStatusText: string; // 启用状态文本
  createTime: string;
  updateTime: string;
}

// 实习保险购买情况数据查询参数
export interface OdsSxbxgmqksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  bxxzmc?: string;
  bdh?: string;
  bxfczfmc?: string;
  bxgmrqStart?: string;
  bxgmrqEnd?: string;
  bxgmfm?: string;
  gmbxzlm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实习保险购买情况数据分页结果
export interface OdsSxbxgmqksjPageResult {
  records: OdsSxbxgmqksjInfo[];
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
 * 分页查询实习保险购买情况数据
 * @param query 查询参数
 * @returns 实习保险购买情况数据列表
 */
export function getOdsSxbxgmqksjPage(query: OdsSxbxgmqksjQuery) {
  return request.post<ApiResponse<OdsSxbxgmqksjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/page",
    query,
  );
}

/**
 * 根据ID查询实习保险购买情况数据详情
 * @param id 主键ID
 * @returns 实习保险购买情况数据详情
 */
export function getOdsSxbxgmqksjById(id: number) {
  return request.get<ApiResponse<OdsSxbxgmqksjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxbxgmqksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实习保险购买情况数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实习保险购买情况数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxbxgmqksjInfo>>(
    `/api/meta/meta-base/zygjx/ods-sxbxgmqksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实习保险购买情况数据
 * @param data 实习保险购买情况数据信息
 * @returns 结果
 */
export function addOdsSxbxgmqksj(data: OdsSxbxgmqksjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/add",
    data,
  );
}

/**
 * 修改实习保险购买情况数据
 * @param data 实习保险购买情况数据信息
 * @returns 结果
 */
export function updateOdsSxbxgmqksj(data: OdsSxbxgmqksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/update",
    data,
  );
}

/**
 * 删除实习保险购买情况数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxbxgmqksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-sxbxgmqksj/${id}`,
  );
}

/**
 * 批量删除实习保险购买情况数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxbxgmqksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实习保险购买情况数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxbxgmqksj(query: OdsSxbxgmqksjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典数据 - 保险购买方 (BXGMFDM)
 * @returns 字典选项列表
 */
export function getInsuranceBuyerOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/BXGMFDM",
  );
}

/**
 * 导入实习保险购买情况数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importOdsSxbxgmqksj(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时，导入可能需要较长时间
    },
  );
}

/**
 * 获取字典数据 - 购买保险种类 (GMBXZLDM)
 * @returns 字典选项列表
 */
export function getInsuranceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/GMBXZLDM",
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
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-sxbxgmqksj/batch/enable-status",
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
    `/api/meta/meta-base/zygjx/ods-sxbxgmqksj/${id}/report-status`,
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
    `/api/meta/meta-base/zygjx/ods-sxbxgmqksj/enable-status/${id}`,
    {
      enableStatus,
    },
  );
}
