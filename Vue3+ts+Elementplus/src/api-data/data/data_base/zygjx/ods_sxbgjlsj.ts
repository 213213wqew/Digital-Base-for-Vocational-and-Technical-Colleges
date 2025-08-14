import { request } from "@/utils/request-data.ts";
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
    "/data/data/data-base/zygjx/ods-sxbgjlsj/page",
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
    `/data/data/data-base/zygjx/ods-sxbgjlsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实习报告记录数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实习报告记录数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxbgjlsjInfo>>(
    `/data/data/data-base/zygjx/ods-sxbgjlsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实习报告记录数据
 * @param data 实习报告记录数据信息
 * @returns 结果
 */
export function addOdsSxbgjlsj(data: OdsSxbgjlsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-sxbgjlsj/add",
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
    "/data/data/data-base/zygjx/ods-sxbgjlsj/update",
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
    `/data/data/data-base/zygjx/ods-sxbgjlsj/${id}`,
  );
}

/**
 * 批量删除实习报告记录数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxbgjlsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-sxbgjlsj/batch",
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
  return request.post("/data/data/data-base/zygjx/ods-sxbgjlsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 实习报告类别 (SXBGLBDM)
 * @returns 字典选项列表
 */
export function getReportTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SXBGLBDM",
  );
}

/**
 * 获取字典数据 - 教师批阅状态 (JSPYZTDM)
 * @returns 字典选项列表
 */
export function getTeacherReviewStatusOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JSPYZTDM",
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
    "/data/data/data-base/zygjx/ods-sxbgjlsj/batch/report-status",
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
    "/data/data/data-base/zygjx/ods-sxbgjlsj/batch/enable-status",
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
    `/data/data/data-base/zygjx/ods-sxbgjlsj/${id}/report-status`,
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
    `/data/data/data-base/zygjx/ods-sxbgjlsj/${id}/enable-status`,
    {
      status: enableStatus,
    },
  );
}

// ==================== 导入功能相关接口 ====================

/**
 * Excel表头信息
 */
export interface ExcelHeader {
  columnIndex: number;
  columnName: string;
}

/**
 * Excel解析结果
 */
export interface ExcelParseResult {
  headers: ExcelHeader[];
  dataPreview: string[][];
  totalRows: number;
}

/**
 * 字段映射配置
 */
export interface FieldMapping {
  [columnIndex: string]: string; // columnIndex -> systemFieldName
}

/**
 * 导入配置
 */
export interface ImportConfig {
  fieldMapping: FieldMapping;
  unmappedFieldsDefaults: Record<string, any>;
  startRow: number;
  autoGenerateId: boolean;
  updateByStudentNumber?: boolean; // 根据学号更新数据
}

/**
 * 系统字段定义
 */
export interface SystemField {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select';
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  example?: string; // 字段示例
  description?: string; // 字段描述
  isDefault?: boolean; // 是否为默认值字段
}

/**
 * 导入结果
 */
export interface ImportResult {
  totalCount: number;
  successCount: number;
  insertCount: number;
  updateCount: number;
  failureCount: number;
  errorDetails?: string[];
}

/**
 * 解析Excel文件表头
 * @param file Excel文件
 * @returns 解析结果
 */
export function parseExcelHeaders(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post<ApiResponse<ExcelParseResult>>(
    "/data/data/data-base/zygjx/ods-sxbgjlsj/parse-excel-headers",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

/**
 * 带字段映射的数据导入
 * @param file Excel文件
 * @param config 导入配置
 * @returns 导入结果
 */
export function importOdsSxbgjlsjWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('config', JSON.stringify(config));
  
  return request.post<ApiResponse<ImportResult>>(
    "/data/data/data-base/zygjx/ods-sxbgjlsj/import-with-mapping",
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
}

/**
 * 下载导入模板
 * @param config 模板配置
 * @returns Excel模板文件
 */
export function downloadTemplate(config?: { excludeFields?: string[] }) {
  return request.post(
    "/data/data/data-base/zygjx/ods-sxbgjlsj/download-template",
    config || {},
    {
      responseType: "blob",
    }
  );
}

/**
 * 获取系统字段定义
 * @returns 系统字段列表
 */
export function getSystemFields(): SystemField[] {
  return [
    {
      field: 'zjsjwyxbs',
      label: '主键数据唯一性标识',
      type: 'string',
      required: false,
      isDefault: true, // 系统自动生成
      example: '系统自动生成',
      description: '系统自动生成的唯一标识，无需填写'
    },
    {
      field: 'xxdm',
      label: '学校代码',
      type: 'string',
      required: true,
      isDefault: true, // 系统自动填充
      example: '4344000123',
      description: '10位学校代码，系统自动填充'
    },
    {
      field: 'xh',
      label: '学号',
      type: 'string',
      required: true,
      example: '202012345678',
      description: '学生学号，最多20位'
    },
    {
      field: 'xsxm',
      label: '学生姓名',
      type: 'string',
      required: true,
      example: '张三',
      description: '学生姓名，最多36位'
    },
    {
      field: 'sxqymc',
      label: '实习企业名称',
      type: 'string',
      required: true,
      example: '某某科技有限公司',
      description: '实习企业名称，最多200位'
    },
    {
      field: 'sxgwmc',
      label: '实习岗位名称',
      type: 'string',
      required: false,
      example: '软件工程师',
      description: '实习岗位名称，最多100位'
    },
    {
      field: 'sxzdjs',
      label: '实习指导教师',
      type: 'string',
      required: false,
      example: '李老师',
      description: '实习指导教师姓名，最多36位'
    },
    {
      field: 'sxbglbm',
      label: '实习报告类别码',
      type: 'select',
      required: false,
      example: '1',
      description: '实习报告类别码，可通过字典获取'
    },
    {
      field: 'sxbgnrzy',
      label: '实习报告内容摘要',
      type: 'string',
      required: false,
      example: '本次实习主要从事...',
      description: '实习报告内容摘要，最多500位'
    },
    {
      field: 'sxbgnr',
      label: '实习报告内容',
      type: 'string',
      required: false,
      example: '实习期间主要工作内容...',
      description: '实习报告详细内容'
    },
    {
      field: 'sxbgtjrq',
      label: '实习报告提交日期',
      type: 'date',
      required: false,
      example: '20241201',
      description: '实习报告提交日期，格式：YYYYMMDD'
    },
    {
      field: 'jspyztm',
      label: '教师批阅状态码',
      type: 'select',
      required: false,
      example: '1',
      description: '教师批阅状态码，可通过字典获取'
    },
    {
      field: 'sjcjsj',
      label: '数据采集时间',
      type: 'date',
      required: true,
      isDefault: true, // 系统自动生成
      example: '系统自动生成',
      description: '数据采集时间，系统自动生成'
    },
    {
      field: 'reportStatus',
      label: '上报状态',
      type: 'select',
      required: false,
      isDefault: true, // 系统默认值
      example: '0',
      description: '0-未上报，1-已上报，2-上报失败',
      options: [
        { label: '未上报', value: '0' },
        { label: '已上报', value: '1' },
        { label: '上报失败', value: '2' }
      ]
    },
    {
      field: 'enableStatus',
      label: '启用状态',
      type: 'select',
      required: false,
      isDefault: true, // 系统默认值
      example: '1',
      description: '0-禁用，1-启用',
      options: [
        { label: '禁用', value: '0' },
        { label: '启用', value: '1' }
      ]
    }
  ];
}
