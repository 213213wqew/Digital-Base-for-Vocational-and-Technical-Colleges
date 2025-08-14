import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

// 实习基础数据信息接口
export interface OdsSxjcsjInfo {
  id?: number;
  zjsjwyxbs: string;
  xxdm: string;
  xh: string;
  xsxm: string;
  zyh?: string;
  zymc?: string;
  bjmc?: string;
  xzm?: string;
  xqm?: string;
  sxsfks?: string;
  sxsfjs?: string;
  sxqyhylbm?: string;
  sxnr?: string;
  sfdk?: string;
  sxapm?: string;
  sxxsm?: string;
  sxsc?: number;
  sxcj?: number;
  sxksrq?: string;
  sxjsrq?: string;
  sxqymc?: string;
  sxddszsjgbm?: string;
  sxddszsjgmc?: string;
  sxddszshjgbm?: string;
  sxddszshjgmc?: string;
  xnzdjsgh?: string;
  xnzdjsxm?: string;
  xnzdjsdh?: string;
  qyzmzdryxm?: string;
  qyzmzdrydh?: string;
  zfsxxssjbc?: number;
  xjjdzxdh?: string;
  sfqdsfxy?: string;
  sfkssx?: string;
  sffgwsx?: string;
  rxnf?: string;
  sjcjsj: string;
  reportStatus?: string;
  enableStatus?: string;
  createTime?: string;
  updateTime?: string;
  // 扩展显示字段
  xzmText?: string;
  xqmText?: string;
  sxsfksText?: string;
  sxsfjsText?: string;
  sxqyhylbmText?: string;
  sfdkText?: string;
  sxapmText?: string;
  sxxsmText?: string;
  sfqdsfxyText?: string;
  sfkssxText?: string;
  sffgwsxText?: string;
  sxksrqDisplay?: string;
  sxjsrqDisplay?: string;
  sjcjsjDisplay?: string;
  reportStatusText?: string;
  enableStatusText?: string;
}

// 分页响应接口
export interface PageResult<T = any> {
  records: T[];
  total: number;
  current: number;
  size: number;
  pages: number;
}

// 实习基础数据查询参数
export interface OdsSxjcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  zyh?: string;
  zymc?: string;
  bjmc?: string;
  sxqymc?: string;
  sxksrqStart?: string;
  sxksrqEnd?: string;
  sxjsrqStart?: string;
  sxjsrqEnd?: string;
  sxsfks?: string;
  sxsfjs?: string;
  sfdk?: string;
  sxapm?: string;
  sxxsm?: string;
  sfqdsfxy?: string;
  sfkssx?: string;
  sffgwsx?: string;
  rxnf?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
  orderByColumn?: string; // 排序字段
  isAsc?: string; // 排序方式
}

// 分页查询实习基础数据
export function pageOdsSxjcsj(query: OdsSxjcsjQuery) {
  return request.post<ApiResponse<PageResult<OdsSxjcsjInfo>>>(
    "/data/data/data-base/zygjx/ods-sxjcsj/page",
    query,
  );
}

// 根据ID查询实习基础数据详情
export function getOdsSxjcsjById(id: number) {
  return request.get<ApiResponse<OdsSxjcsjInfo>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/${id}`,
  );
}

// 根据唯一性标识查询实习基础数据
export function getOdsSxjcsjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxjcsjInfo>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/unique/${zjsjwyxbs}`,
  );
}

// 新增实习基础数据
export function addOdsSxjcsj(data: OdsSxjcsjInfo) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-sxjcsj/add",
    data,
  );
}

// 修改实习基础数据
export function updateOdsSxjcsj(data: OdsSxjcsjInfo) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-sxjcsj/update",
    data,
  );
}

// 删除实习基础数据
export function deleteOdsSxjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/${id}`,
  );
}

// 批量删除实习基础数据
export function batchDeleteOdsSxjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-sxjcsj/batch",
    { data: ids },
  );
}

// 导出实习基础数据
export function exportOdsSxjcsj(query: OdsSxjcsjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-sxjcsj/export", query, {
    responseType: "blob",
    timeout: 60000, // 60秒超时
  });
}

// 修改单个实习基础数据上报状态
export function updateOdsSxjcsjReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/report-status/${id}?reportStatus=${reportStatus}`,
  );
}

// 修改单个实习基础数据启用状态
export function updateOdsSxjcsjEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/enable-status/${id}?enableStatus=${enableStatus}`,
  );
}

// 批量修改实习基础数据上报状态
export function batchUpdateOdsSxjcsjReportStatus(
  ids: number[],
  reportStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/batch/report-status?reportStatus=${reportStatus}`,
    ids,
  );
}

// 批量修改实习基础数据启用状态
export function batchUpdateOdsSxjcsjEnableStatus(
  ids: number[],
  enableStatus: string,
) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxjcsj/batch/enable-status?enableStatus=${enableStatus}`,
    ids,
  );
}

// ============== 导入相关接口 ==============

// Excel解析结果接口
export interface ExcelParseResult {
  headers: ExcelHeader[];
  dataPreview: string[][];
  totalRows: number;
}

// Excel表头信息
export interface ExcelHeader {
  columnIndex: number;
  columnName: string;
}

// 字段映射接口
export interface FieldMapping {
  [columnIndex: string]: string; // 列索引 -> 系统字段名
}

// 导入配置接口
export interface ImportConfig {
  fieldMapping: FieldMapping;
  unmappedFieldsDefaults: Record<string, any>;
  updateByStudentNumber?: boolean; // 是否根据学号更新，默认false
  startRow?: number;
  autoGenerateId?: boolean;
}

// 系统字段定义接口
export interface SystemField {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'select';
  required: boolean;
  options?: Array<{ value: string; label: string }>;
  example?: string;
}

// 导入结果接口
export interface ImportResult {
  success: boolean;
  successCount: number;
  updateCount: number;
  failCount: number;
  message: string;
  errorDetails?: string[];
}

// 解析Excel表头
export function parseExcelHeaders(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  
  return request.post<ApiResponse<ExcelParseResult>>(
    '/data/data/data-base/zygjx/ods-sxjcsj/parse-excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 30000
    }
  );
}

// 带字段映射的导入
export function importOdsSxjcsjWithMapping(file: File, config: ImportConfig) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('config', JSON.stringify(config));
  
  return request.post<ApiResponse<ImportResult>>(
    '/data/data/data-base/zygjx/ods-sxjcsj/import-with-mapping',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 120000 // 2分钟超时
    }
  );
}

// 下载导入模板
export function downloadTemplate(query?: any) {
  return request.post('/data/data/data-base/zygjx/ods-sxjcsj/download-template', query || {}, {
    responseType: 'blob',
    timeout: 30000
  });
}

// 获取系统字段定义
export function getSystemFields(): SystemField[] {
  return [
    { field: 'zjsjwyxbs', label: '主键数据唯一性标识', type: 'string', required: false },
    { field: 'xxdm', label: '学校代码', type: 'string', required: true },
    { field: 'xh', label: '学号', type: 'string', required: true },
    { field: 'xsxm', label: '学生姓名', type: 'string', required: true },
    { field: 'zyh', label: '专业号', type: 'string', required: false },
    { field: 'zymc', label: '专业名称', type: 'string', required: false },
    { field: 'bjmc', label: '班级名称', type: 'string', required: false },
    { field: 'xzm', label: '学制码', type: 'select', required: false },
    { field: 'xqm', label: '学期码', type: 'select', required: false },
    { field: 'sxsfks', label: '实习是否开始', type: 'select', required: false },
    { field: 'sxsfjs', label: '实习是否结束', type: 'select', required: false },
    { field: 'sxqyhylbm', label: '实习企业行业类别码', type: 'string', required: false },
    { field: 'sxnr', label: '实习内容', type: 'string', required: false },
    { field: 'sfdk', label: '是否对口', type: 'select', required: false },
    { field: 'sxapm', label: '实习安排码', type: 'select', required: false },
    { field: 'sxxsm', label: '实习形式码', type: 'select', required: false },
    { field: 'sxsc', label: '实习时长', type: 'number', required: false },
    { field: 'sxcj', label: '实习成绩', type: 'number', required: false },
    { field: 'sxksrq', label: '实习开始日期', type: 'date', required: false },
    { field: 'sxjsrq', label: '实习结束日期', type: 'date', required: false },
    { field: 'sxqymc', label: '实习企业名称', type: 'string', required: false },
    { field: 'sxddszsjgbm', label: '实习地点所在省机构编码', type: 'string', required: false },
    { field: 'sxddszsjgmc', label: '实习地点所在省机构名称', type: 'string', required: false },
    { field: 'sxddszshjgbm', label: '实习地点所在市机构编码', type: 'string', required: false },
    { field: 'sxddszshjgmc', label: '实习地点所在市机构名称', type: 'string', required: false },
    { field: 'xnzdjsgh', label: '校内指导教师工号', type: 'string', required: false },
    { field: 'xnzdjsxm', label: '校内指导教师姓名', type: 'string', required: false },
    { field: 'xnzdjsdh', label: '校内指导教师电话', type: 'string', required: false },
    { field: 'qyzmzdryxm', label: '企业专门指导人员姓名', type: 'string', required: false },
    { field: 'qyzmzdrydh', label: '企业专门指导人员电话', type: 'string', required: false },
    { field: 'zfsxxssjbc', label: '支付实习学生生均报酬', type: 'number', required: false },
    { field: 'xjjdzxdh', label: '校级监督咨询电话', type: 'string', required: false },
    { field: 'sfqdsfxy', label: '是否签订三方协议', type: 'select', required: false },
    { field: 'sfkssx', label: '是否跨省实习', type: 'select', required: false },
    { field: 'sffgwsx', label: '是否赴国外实习', type: 'select', required: false },
    { field: 'rxnf', label: '入学年份', type: 'string', required: false },
    { field: 'sjcjsj', label: '数据采集时间', type: 'date', required: false },
    { field: 'reportStatus', label: '上报状态', type: 'select', required: false },
    { field: 'enableStatus', label: '启用状态', type: 'select', required: false }
  ];
}

// 获取学制码选项
export function getEducationSystemOptions() {
  return [
    { value: '3', label: '三年制' },
    { value: '4', label: '四年制' },
    { value: '5', label: '五年制' }
  ];
}

// 获取学期码选项
export function getSemesterOptions() {
  return [
    { value: '1', label: '第一学期' },
    { value: '2', label: '第二学期' },
    { value: '3', label: '第三学期' },
    { value: '4', label: '第四学期' },
    { value: '5', label: '第五学期' },
    { value: '6', label: '第六学期' }
  ];
}

// 获取是否选项
export function getYesNoOptions() {
  return [
    { value: '1', label: '是' },
    { value: '0', label: '否' }
  ];
}

// 获取实习安排码选项
export function getInternshipArrangementOptions() {
  return [
    { value: '1', label: '学校统一安排' },
    { value: '2', label: '学生自主选择' },
    { value: '3', label: '校企合作安排' }
  ];
}

// 获取实习形式码选项
export function getInternshipFormOptions() {
  return [
    { value: '1', label: '集中实习' },
    { value: '2', label: '分散实习' },
    { value: '3', label: '顶岗实习' }
  ];
}
