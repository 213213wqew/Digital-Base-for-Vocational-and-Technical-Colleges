import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

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
  sortField?: string; // 排序字段
  sortOrder?: string; // 排序方向
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/page",
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
    `/data/data/data-base/zygjx/ods-gjptzydjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询国家平台资源对接数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 国家平台资源对接数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsGjptzydjsjInfo>>(
    `/data/data/data-base/zygjx/ods-gjptzydjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增国家平台资源对接数据
 * @param data 国家平台资源对接数据信息
 * @returns 结果
 */
export function addOdsGjptzydjsj(data: OdsGjptzydjsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-gjptzydjsj/add",
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/update",
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
    `/data/data/data-base/zygjx/ods-gjptzydjsj/${id}`,
  );
}

/**
 * 批量删除国家平台资源对接数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsGjptzydjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-gjptzydjsj/batch",
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/export",
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/batch/report-status",
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/batch/enable-status",
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
    `/data/data/data-base/zygjx/ods-gjptzydjsj/${id}/report-status`,
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
    `/data/data/data-base/zygjx/ods-gjptzydjsj/enable-status/${id}`,
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
    "/data/data/data-base-source/options/JBDM",
  );
}

/**
 * 获取字典数据 - 国家平台对接资源类型码 (GJPTDJZYLXDM)
 */
export function getResourceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/GJPTDJZYLXDM",
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxhxtjssj/system-school-code",
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
  >("/data/data/data-base/zygjx/ods-szzyjbsj/resource-options", {
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
    "/data/data/data-base/zygjx/ods-gjptzydjsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}

// ==== 高级导入相关类型定义 ====

// 系统字段定义接口
export interface SystemField {
  field: string; // 字段名
  label: string; // 中文名称
  type: 'string' | 'number' | 'date' | 'select'; // 字段类型
  required: boolean; // 是否必填
  maxLength?: number; // 最大长度
  options?: DictOption[]; // 选项（仅select类型）
}

// Excel表头接口
export interface ExcelHeader {
  columnIndex: number; // 列索引
  columnName: string; // 列名（Excel中的表头）
}

// Excel解析结果接口
export interface ExcelParseResult {
  headers: ExcelHeader[]; // 表头信息
  dataPreview: string[][]; // 数据预览（前几行）
  totalRows: number; // 总行数
}

// 字段映射类型
export type FieldMapping = Record<string, string>;

// 导入配置接口
export interface ImportConfig {
  fieldMapping: FieldMapping;
  unmappedFieldsDefaults?: Record<string, any>;
  startRow?: number;
  autoGenerateId?: boolean;
  updateByResourceNumber?: boolean; // 是否根据资源编号更新已有数据
}

/**
 * 解析Excel文件表头
 * @param file Excel文件
 * @returns Excel解析结果
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<ExcelParseResult>>(
    "/data/data/data-base/zygjx/ods-gjptzydjsj/parse-excel",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 60000, // 1分钟超时
    },
  );
}

/**
 * 导入国家平台资源对接数据（带字段映射）
 * @param file Excel文件
 * @param config 导入配置
 * @returns 导入结果
 */
export function importOdsGjptzydjsjWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("config", JSON.stringify(config));

  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygjx/ods-gjptzydjsj/import-with-mapping",
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
 * 下载导入模板
 * @param config 模板配置
 * @returns 模板文件
 */
export function downloadTemplate(config: any) {
  return request.post(
    "/data/data/data-base/zygjx/ods-gjptzydjsj/download-template",
    config,
    {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

/**
 * 获取系统字段定义（用于Excel导入映射）
 * @returns 系统字段列表
 */
export function getSystemFields(): SystemField[] {
  return [
    // 后端自动生成的字段，不包含在导入模板中
    // { field: 'zjsjwyxbs', label: '主键数据唯一性标识', type: 'string', required: false, maxLength: 32 },
    // { field: 'xxdm', label: '学校代码', type: 'string', required: true, maxLength: 10 },
    
    // 用户需要填写的业务字段
    { field: 'zybh', label: '资源编号', type: 'string', required: true, maxLength: 50 },
    { field: 'zymc', label: '资源名称', type: 'string', required: true, maxLength: 100 },
    { field: 'zyjbm', label: '资源级别', type: 'select', required: true, maxLength: 20 },
    { field: 'gjzhjxptzylxm', label: '资源类型', type: 'select', required: true, maxLength: 20 },
    { field: 'zyfwlj', label: '资源访问链接', type: 'string', required: true, maxLength: 200 },
    { field: 'djrq', label: '对接日期', type: 'date', required: true },
    
    // 系统管理字段，有默认值，可选填写
    { field: 'sjcjsj', label: '数据采集时间', type: 'date', required: false },
    { field: 'reportStatus', label: '上报状态', type: 'select', required: false },
    { field: 'enableStatus', label: '启用状态', type: 'select', required: false },
  ];
}
