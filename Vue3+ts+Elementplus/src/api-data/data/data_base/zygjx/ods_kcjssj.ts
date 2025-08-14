import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-data.ts";

/**
 * 课程建设数据接口
 */

// 课程建设数据表单数据
export interface OdsKcjssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  fzrh?: string; // 负责人号
  sqrq?: string; // 申请日期
  lxnd?: string; // 立项年度
  ysrq?: string; // 验收日期
  jflym?: string; // 经费来源码
  lxjf?: number; // 立项经费
  ssdwmc?: string; // 所属单位名称
  kcjslbm?: string; // 课程建设类别码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课程建设数据详情
export interface OdsKcjssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  fzrh: string; // 负责人号
  sqrq: string; // 申请日期
  lxnd: string; // 立项年度
  ysrq: string; // 验收日期
  jflym: string; // 经费来源码
  lxjf: number; // 立项经费
  ssdwmc: string; // 所属单位名称
  kcjslbm: string; // 课程建设类别码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jflymText?: string; // 经费来源文本
  kcjslbmText?: string; // 课程建设类别文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 课程建设数据查询参数
export interface OdsKcjssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kcmc?: string;
  kch?: string;
  fzrh?: string;
  lxnd?: string;
  kcjslbm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
  excludeFields?: string[]; // 导出时需要排除的字段
  sortField?: string; // 排序字段
  sortOrder?: string; // 排序顺序
}

// 课程建设数据分页结果
export interface OdsKcjssjPageResult {
  records: OdsKcjssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 课程基本信息（用于搜索课程时返回）
export interface CourseBasicInfo {
  id: number;
  kcmc: string; // 课程名称
  kch: string; // 课程号
}

// 字典选项接口
export interface DictOption {
  label: string;
  value: string;
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
}

/**
 * 分页查询课程建设数据
 * @param query 查询参数
 * @returns 课程建设数据列表
 */
export function getCourseConstructionDataPage(query: OdsKcjssjQuery) {
  return request.post<ApiResponse<OdsKcjssjPageResult>>(
    "/data/data/data-base/zygjx/ods-kcjssj/page",
    query,
  );
}

/**
 * 根据ID查询课程建设数据详情
 * @param id 主键ID
 * @returns 课程建设数据详情
 */
export function getCourseConstructionDataById(id: number) {
  return request.get<ApiResponse<OdsKcjssjInfo>>(
    `/data/data/data-base/zygjx/ods-kcjssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询课程建设数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 课程建设数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKcjssjInfo>>(
    `/data/data/data-base/zygjx/ods-kcjssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增课程建设数据
 * @param data 课程建设数据信息
 * @returns 结果
 */
export function addCourseConstructionData(data: OdsKcjssjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-kcjssj/add",
    data,
  );
}

/**
 * 修改课程建设数据
 * @param data 课程建设数据信息
 * @returns 结果
 */
export function updateCourseConstructionData(data: OdsKcjssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kcjssj/update",
    data,
  );
}

/**
 * 删除课程建设数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteCourseConstructionData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kcjssj/${id}`,
  );
}

/**
 * 批量删除课程建设数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteCourseConstructionData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-kcjssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出课程建设数据
 * @param query 查询参数
 */
export function exportCourseConstructionData(
  query: OdsKcjssjQuery,
): Promise<void> {
  return request
    .post("/data/data/data-base/zygjx/ods-kcjssj/export", query, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      // 检查响应类型
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        // 如果返回的是JSON（说明是错误信息）
        return response.data.text().then((text: string) => {
          const error = JSON.parse(text);
          throw new Error(error.message || "导出失败");
        });
      }

      // 正常的Excel文件响应
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `课程建设数据_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error("导出失败:", error);
      throw error;
    });
}

/**
 * 更新上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kcjssj/report-status/${id}?reportStatus=${reportStatus}`,
  );
}

/**
 * 更新启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kcjssj/enable-status/${id}?enableStatus=${enableStatus}`,
  );
}

/**
 * 批量更新上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kcjssj/batch/report-status?reportStatus=${reportStatus}`,
    ids,
  );
}

/**
 * 批量更新启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-kcjssj/batch/enable-status?enableStatus=${enableStatus}`,
    ids,
  );
}

/**
 * 获取经费来源选项
 * @returns 经费来源选项列表
 */
export function getFundSourceOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/data/data/data-base-source/options/JFLYDM",
  );
}

/**
 * 获取课程建设类别选项
 * @returns 课程建设类别选项列表
 */
export function getCourseConstructionTypeOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/data/data/data-base-source/options/KCJSLBDM",
  );
}

/**
 * 获取是否选项
 * @returns 是否选项列表
 */
export function getYesNoOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/code/system/dict/data/type/sys_yes_no",
  );
}

/**
 * 获取上报状态选项
 * @returns 上报状态选项列表
 */
export function getReportStatusOptions() {
  return [
    { label: "未上报", value: "0" },
    { label: "已上报", value: "1" },
    { label: "上报失败", value: "2" },
  ];
}

/**
 * 获取启用状态选项
 * @returns 启用状态选项列表
 */
export function getEnableStatusOptions() {
  return [
    { label: "禁用", value: "0" },
    { label: "启用", value: "1" },
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
      keyword,
      limit,
    },
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
 * 导入课程建设数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importCourseConstructionData(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygjx/ods-kcjssj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}

/**
 * 解析Excel文件表头（高级导入）
 * @param file Excel文件
 * @returns Excel解析结果
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<ExcelParseResult>>(
    "/data/data/data-base/zygjx/ods-kcjssj/parse-excel",
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
 * 导入课程建设数据（带字段映射）
 * @param file Excel文件
 * @param config 导入配置
 * @returns 导入结果
 */
export function importCourseConstructionDataWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("config", JSON.stringify(config));

  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygjx/ods-kcjssj/import-with-mapping",
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
 * 下载导入模板（高级导入）
 * @param config 模板配置
 * @returns 模板文件
 */
export function downloadTemplate(config: any) {
  return request.post(
    "/data/data/data-base/zygjx/ods-kcjssj/download-template",
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
    { field: 'xxdm', label: '学校代码', type: 'string', required: true, maxLength: 10 },
    { field: 'kcmc', label: '课程名称', type: 'string', required: true, maxLength: 60 },
    { field: 'kch', label: '课程号', type: 'string', required: true, maxLength: 50 },
    { field: 'fzrh', label: '负责人号', type: 'string', required: true, maxLength: 20 },
    { field: 'sqrq', label: '申请日期', type: 'date', required: false },
    { field: 'lxnd', label: '立项年度', type: 'string', required: true, maxLength: 4 },
    { field: 'ysrq', label: '验收日期', type: 'date', required: false },
    { field: 'jflym', label: '经费来源', type: 'select', required: false },
    { field: 'lxjf', label: '立项经费', type: 'number', required: false },
    { field: 'ssdwmc', label: '所属单位名称', type: 'string', required: false, maxLength: 200 },
    { field: 'kcjslbm', label: '课程建设类别', type: 'select', required: false },
    { field: 'sjcjsj', label: '数据采集时间', type: 'date', required: false },
    { field: 'reportStatus', label: '上报状态', type: 'select', required: false },
    { field: 'enableStatus', label: '启用状态', type: 'select', required: false },
  ];
}
