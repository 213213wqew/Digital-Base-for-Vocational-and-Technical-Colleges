import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 国家平台资源对接数据接口
 */

// 国家平台资源对接数据表单数据
export interface OdsGjptzydjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zybh?: string; // 资源编号
  zymc?: string; // 资源名称
  zyjbm?: string; // 资源级别码
  gjzhjxptzylxm?: string; // 国家智慧教学平台资源类型码
  zyfwlj?: string; // 资源访问链接
  djrq?: string; // 对接日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 国家平台资源对接数据详情
export interface OdsGjptzydjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zybh: string; // 资源编号
  zymc: string; // 资源名称
  zyjbm: string; // 资源级别码
  zyjbmText: string; // 资源级别文本
  gjzhjxptzylxm: string; // 国家智慧教学平台资源类型码
  gjzhjxptzylxmText: string; // 国家智慧教学平台资源类型文本
  zyfwlj: string; // 资源访问链接
  djrq: string; // 对接日期
  djrqDisplay: string; // 对接日期显示格式
  sjcjsj: string; // 数据采集时间
  sjcjsjDisplay: string; // 数据采集时间显示格式
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  reportStatusText: string; // 上报状态文本
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  enableStatusText: string; // 启用状态文本
  createTime: string;
  updateTime: string;
}

// 国家平台资源对接数据查询参数
export interface OdsGjptzydjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zybh?: string;
  zymc?: string;
  zyjbm?: string;
  gjzhjxptzylxm?: string;
  djrqStart?: string;
  djrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 国家平台资源对接数据分页结果
export interface OdsGjptzydjsjPageResult {
  records: OdsGjptzydjsjInfo[];
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
 * 分页查询国家平台资源对接数据
 * @param query 查询参数
 * @returns 国家平台资源对接数据列表
 */
export function getOdsGjptzydjsjPage(query: OdsGjptzydjsjQuery) {
  return request.post<ApiResponse<OdsGjptzydjsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/page",
    query,
  );
}

/**
 * 根据ID查询国家平台资源对接数据详情
 * @param id 主键ID
 * @returns 国家平台资源对接数据详情
 */
export function getOdsGjptzydjsjById(id: number) {
  return request.get<ApiResponse<OdsGjptzydjsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-gjptzydjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询国家平台资源对接数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 国家平台资源对接数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsGjptzydjsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-gjptzydjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增国家平台资源对接数据
 * @param data 国家平台资源对接数据信息
 * @returns 结果
 */
export function addOdsGjptzydjsj(data: OdsGjptzydjsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/add",
    data,
  );
}

/**
 * 修改国家平台资源对接数据
 * @param data 国家平台资源对接数据信息
 * @returns 结果
 */
export function updateOdsGjptzydjsj(data: OdsGjptzydjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/update",
    data,
  );
}

/**
 * 删除国家平台资源对接数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsGjptzydjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-gjptzydjsj/${id}`,
  );
}

/**
 * 批量删除国家平台资源对接数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsGjptzydjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出国家平台资源对接数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsGjptzydjsj(query: OdsGjptzydjsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/export",
    query,
    {
      responseType: "blob",
    },
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
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/batch/report-status",
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
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/batch/enable-status",
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
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-gjptzydjsj/${id}/report-status`,
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
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-gjptzydjsj/enable-status/${id}`,
    {
      status: enableStatus,
    },
  );
}

/**
 * 获取字典数据 - 资源级别码 (JBDM)
 */
export function getResourceLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/JBDM",
  );
}

/**
 * 获取字典数据 - 国家平台对接资源类型码 (GJPTDJZYLXDM)
 */
export function getResourceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/GJPTDJZYLXDM",
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

/**
 * 获取资源选项列表(从数字资源基本数据表获取，用于资源编号和资源名称的下拉选择)
 * @param keyword 搜索关键字
 * @returns 资源选项列表
 */
export function getResourceOptions(keyword?: string) {
  return request.get<
    ApiResponse<
      Array<{ value: string; label: string; zybh: string; zymc: string }>
    >
  >("/api/meta/meta-base/zygjx/ods-szzyjbsj/resource-options", {
    keyword,
  });
}

/**
 * 导入国家平台资源对接数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importOdsGjptzydjsj(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/api/meta/meta-base/zygjx/ods-gjptzydjsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}
