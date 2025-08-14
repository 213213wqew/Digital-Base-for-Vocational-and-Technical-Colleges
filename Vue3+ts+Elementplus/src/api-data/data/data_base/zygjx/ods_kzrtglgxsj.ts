import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 课证融通关联关系数据接口
 */

// 课程基本信息接口（用于下拉选择）
export interface CourseBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  createTime?: string;
  updateTime?: string;
}

// 证书基本信息接口（用于下拉选择）
export interface CertificateBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zsh: string; // 证书号
  zyh: string; // 专业号
  fzjgbm: string; // 发证机构编码
  fzjgmc: string; // 发证机构名称
  zsmc: string; // 证书名称
  zslx: string; // 证书类型
  zsdj: string; // 证书等级
  jddd: string; // 鉴定地点
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime?: string;
  updateTime?: string;
}

// 课证融通关联关系数据查询参数
export interface OdsKzrtglgxsjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
  pageNum?: number; // 页码
  pageSize?: number; // 每页数量
}

// 课证融通关联关系数据DTO
export interface OdsKzrtglgxsjDTO {
  id?: number; // 主键ID
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课证融通关联关系数据VO
export interface OdsKzrtglgxsjVO {
  id: number; // 主键ID
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsj: string; // 数据采集时间
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  reportStatusText?: string; // 上报状态文本
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  enableStatusText?: string; // 启用状态文本
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 分页结果接口
export interface OdsKzrtglgxsjPageResult {
  records: OdsKzrtglgxsjVO[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// Excel解析结果接口
export interface ExcelParseResult {
  headers: Array<{
    columnName: string;
    columnIndex: number;
  }>;
  dataPreview: Array<Array<string>>;
  totalRows: number;
}

// 字段映射配置接口
export interface FieldMapping {
  [columnIndex: string]: string; // columnIndex -> systemFieldName
}

// 导入配置接口
export interface ImportConfig {
  fieldMapping: FieldMapping;
  unmappedFieldsDefaults: Record<string, any>;
  startRow: number;
  autoGenerateId: boolean;
}

// 系统字段定义接口
export interface SystemField {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select';
  required: boolean;
  maxLength?: number;
  options?: Array<{ label: string; value: string }>;
}

// 字典选项接口
export interface DictOption {
  label: string;
  value: string;
}

/**
 * 分页查询课证融通关联关系数据
 * @param query 查询参数
 * @returns 课证融通关联关系数据列表
 */
export function getOdsKzrtglgxsjPage(query: OdsKzrtglgxsjQuery) {
  return request.post<ApiResponse<OdsKzrtglgxsjPageResult>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/page",
    query,
  );
}

/**
 * 根据ID查询课证融通关联关系数据详情
 * @param id 主键ID
 * @returns 课证融通关联关系数据详情
 */
export function getOdsKzrtglgxsjById(id: number) {
  return request.get<ApiResponse<OdsKzrtglgxsjVO>>(
    `/data/data/data-base/zygjx/ods-kzrtglgxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询课证融通关联关系数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 课证融通关联关系数据
 */
export function getOdsKzrtglgxsjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKzrtglgxsjVO>>(
    `/data/data/data-base/zygjx/ods-kzrtglgxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增课证融通关联关系数据
 * @param data 课证融通关联关系数据信息
 * @returns 结果
 */
export function addOdsKzrtglgxsj(data: OdsKzrtglgxsjDTO) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/add",
    data,
  );
}

/**
 * 修改课证融通关联关系数据
 * @param data 课证融通关联关系数据信息
 * @returns 结果
 */
export function updateOdsKzrtglgxsj(data: OdsKzrtglgxsjDTO) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/update",
    data,
  );
}

/**
 * 删除课证融通关联关系数据
 * @param ids ID字符串，多个用逗号分隔
 * @returns 结果
 */
export function deleteOdsKzrtglgxsj(ids: string) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kzrtglgxsj/${ids}`,
  );
}

/**
 * 批量删除课证融通关联关系数据
 * @param ids ID数组
 * @returns 结果
 */
export function batchDeleteOdsKzrtglgxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kzrtglgxsj/${ids.join(",")}`,
  );
}

/**
 * 导出课证融通关联关系数据
 * @param params 参数，包括查询条件和excludeFields排除字段
 * @returns Excel文件
 */
export function exportOdsKzrtglgxsj(params: any) {
  return request.post<ArrayBuffer>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/export",
    params,
    {
      responseType: "arraybuffer",
    },
  );
}

/**
 * 批量更新上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/batch/report-status",
    {
      ids: ids,
      status: reportStatus,
    },
  );
}

/**
 * 批量更新启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/batch/enable-status",
    {
      ids: ids,
      status: enableStatus,
    },
  );
}

/**
 * 解析Excel表头
 * @param file Excel文件
 * @returns Excel解析结果
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<ExcelParseResult>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/parse-excel",
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
 * 导入课证融通关联关系数据（带字段映射）
 * @param file Excel文件
 * @param config 导入配置
 * @returns 导入结果
 */
export function importKzrtglgxsjDataWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("config", JSON.stringify(config));

  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/import-with-mapping",
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
 * 导入课证融通关联关系数据（兼容老版本）
 * @param file Excel文件
 * @returns 导入结果
 */
export function importOdsKzrtglgxsj(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/import",
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
 * @param params 参数，包括excludeFields排除字段
 * @returns Excel模板文件
 */
export function downloadTemplate(params?: any) {
  return request.post<ArrayBuffer>(
    "/data/data/data-base/zygjx/ods-kzrtglgxsj/download-template",
    params || {},
    {
      responseType: "arraybuffer",
      timeout: 60000, // 1分钟超时
    },
  );
}

/**
 * 获取系统字段定义（用于Excel导入映射）
 * @returns 系统字段列表
 */
export function getSystemFields(): SystemField[] {
  return [
    { field: 'kcmc', label: '课程名称', type: 'string', required: true, maxLength: 60 },
    { field: 'kch', label: '课程号', type: 'string', required: true, maxLength: 50 },
    { field: 'zsh', label: '证书号', type: 'string', required: false, maxLength: 50 },
    { field: 'zsmc', label: '证书名称', type: 'string', required: false, maxLength: 100 },
    // 注意：以下字段由后端自动生成，不需要在Excel模板中包含
    // { field: 'zjsjwyxbs', label: '主键数据唯一性标识', type: 'string', required: false },
    // { field: 'xxdm', label: '学校代码', type: 'string', required: true, maxLength: 10 },
    // { field: 'sjcjsj', label: '数据采集时间', type: 'date', required: false },
    // { field: 'reportStatus', label: '上报状态', type: 'select', required: false },
    // { field: 'enableStatus', label: '启用状态', type: 'select', required: false },
  ];
}

/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchCourses(keyword?: string, limit: number = 20) {
  return request.get<ApiResponse<CourseBasicInfo[]>>(
    "/data/data/data-base/zygjx/ods-kcjbs/search",
    {
      params: {
        keyword,
        limit,
      },
    },
  );
}

/**
 * 模糊搜索证书信息
 * 从1+X证书数据表中获取证书号和证书名称
 * @param keyword 搜索关键词，不传则获取所有数据
 * @param limit 返回结果数量限制，不传则使用后端默认值
 * @returns 证书信息列表
 */
export function searchCertificates(keyword?: string, limit?: number) {
  return request.get<ApiResponse<CertificateBasicInfo[]>>(
    "/data/data/data-base/zygxs/ods-gzxzssj/search",
    {
      params: {
        keyword: keyword?.trim(),
        limit,
      },
    },
  );
}
