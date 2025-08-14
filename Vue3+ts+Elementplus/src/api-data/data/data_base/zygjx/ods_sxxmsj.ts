import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 实训项目数据接口
 */

// 字典选项
export interface DictOption {
  value: string;
  label: string;
}

// 专业下拉选项
export interface ZyOption {
  zyh: string; // 专业号
  zymc: string; // 专业名称
  label: string; // 显示标签：专业号 - 专业名称
  value: string; // 值：专业号
}

// 计划课程号选项
export interface JhkchOption {
  jhkch: string; // 计划课程号
  kcmc: string; // 课程名称
  label: string; // 显示标签：计划课程号 - 课程名称
  value: string; // 值：计划课程号
}

// 实训项目数据表单数据
export interface OdsSxxmsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sxxmbh?: string; // 实训项目编号
  sxxmmc?: string; // 实训项目名称
  sfxnfzsxxm?: string; // 是否虚拟仿真实训项目
  gkzyh?: string; // 归口专业号
  gkzymc?: string; // 归口专业名称
  ssjhkch?: string; // 所属计划课程号
  ptsxzymc?: string; // 配套实训资源名称
  dxrwmc?: string; // 典型任务名称
  jnyq?: string; // 技能要求
  khfs?: string; // 考核方式
  mksl?: number; // 模块数量
  xssxkss?: number; // 学生实训课时数
  sfdwfw?: string; // 是否对外服务
  xn?: string; // 学年（度）
  xq?: string; // 学期码
  qtsxdd?: string; // 其他实训地点
  xnsxsh?: string; // 校内实训室号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 实训项目数据详情
export interface OdsSxxmsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sxxmbh: string; // 实训项目编号
  sxxmmc: string; // 实训项目名称
  sfxnfzsxxm: string; // 是否虚拟仿真实训项目
  gkzyh: string; // 归口专业号
  gkzymc: string; // 归口专业名称
  ssjhkch: string; // 所属计划课程号
  ptsxzymc: string; // 配套实训资源名称
  dxrwmc: string; // 典型任务名称
  jnyq: string; // 技能要求
  khfs: string; // 考核方式
  mksl: number; // 模块数量
  xssxkss: number; // 学生实训课时数
  sfdwfw: string; // 是否对外服务
  xn: string; // 学年（度）
  xq: string; // 学期码
  qtsxdd: string; // 其他实训地点
  xnsxsh: string; // 校内实训室号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sfxnfzsxxmText?: string; // 是否虚拟仿真实训项目文本
  sfdwfwText?: string; // 是否对外服务文本
  xqText?: string; // 学期码文本
  sjcjsjDisplay?: string; // 数据采集时间显示格式
}

// 实训项目数据查询参数
export interface OdsSxxmsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sxxmbh?: string;
  sxxmmc?: string;
  sfxnfzsxxm?: string;
  gkzyh?: string;
  gkzymc?: string;
  ssjhkch?: string;
  xn?: string;
  xq?: string;
  xnsxsh?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 实训项目数据分页结果
export interface OdsSxxmsjPageResult {
  records: OdsSxxmsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询实训项目数据
 * @param query 查询参数
 * @returns 实训项目数据列表
 */
export function getOdsSxxmsjPage(query: OdsSxxmsjQuery) {
  return request.post<ApiResponse<OdsSxxmsjPageResult>>(
    "/data/data/data-base/zygjx/ods-sxxmsj/page",
    query,
  );
}

/**
 * 根据ID查询实训项目数据详情
 * @param id 主键ID
 * @returns 实训项目数据详情
 */
export function getOdsSxxmsjById(id: number) {
  return request.get<ApiResponse<OdsSxxmsjInfo>>(
    `/data/data/data-base/zygjx/ods-sxxmsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询实训项目数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 实训项目数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSxxmsjInfo>>(
    `/data/data/data-base/zygjx/ods-sxxmsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增实训项目数据
 * @param data 实训项目数据信息
 * @returns 结果
 */
export function addOdsSxxmsj(data: OdsSxxmsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-sxxmsj/add",
    data,
  );
}

/**
 * 修改实训项目数据
 * @param data 实训项目数据信息
 * @returns 结果
 */
export function updateOdsSxxmsj(data: OdsSxxmsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-sxxmsj/update",
    data,
  );
}

/**
 * 删除实训项目数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSxxmsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-sxxmsj/${id}`,
  );
}

/**
 * 批量删除实训项目数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSxxmsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-sxxmsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出实训项目数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSxxmsj(query: OdsSxxmsjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-sxxmsj/export", query, {
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
    "/data/data/data-base/zygjx/ods-sxxmsj/batch/report-status",
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
    "/data/data/data-base/zygjx/ods-sxxmsj/batch/enable-status",
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
    `/data/data/data-base/zygjx/ods-sxxmsj/${id}/report-status`,
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
    `/data/data/data-base/zygjx/ods-sxxmsj/enable-status/${id}`,
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
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取字典数据 - 是否标志代码 (SFBZDM)
 * @returns 字典选项列表
 */
export function getSfbzdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 学期代码 (XQDM)
 * @returns 字典选项列表
 */
export function getXqdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/XQDM",
  );
}

/**
 * 获取专业下拉选项列表
 * @param keyword 专业名称关键字（可选）
 * @returns 专业下拉选项列表
 */
export function getZyOptions(keyword?: string) {
  return request.get<ApiResponse<ZyOption[]>>(
    "/data/data/data-base/zygjx/ods-zyszsj/zy-options",
    { keyword },
  );
}

/**
 * 获取计划课程号选项 (用于所属计划课程号字段)
 */
export function getJhkchOptions(keyword?: string) {
  return request.get<ApiResponse<JhkchOption[]>>(
    "/data/data/data-base/zygjx/ods-pksj/jhkch-options",
    {
      params: { keyword },
    },
  );
}

/**
 * 获取实训室号选项列表
 * @param keyword 查询关键字(实训室号或名称模糊查询)
 * @returns 选项列表
 */
export function getSxshOptions(keyword?: string) {
  const params = keyword ? { keyword } : {};
  return request.get<
    ApiResponse<Array<{ value: string; label: string; sxsmc: string }>>
  >("/data/data/data-base/zygjx/ods-sxxmsj/sxsh/options", { params });
}

// 实训项目选项接口
export interface SxxmOption {
  sxxmbh: string; // 实训项目编号
  sxxmmc: string; // 实训项目名称
  label: string; // 显示标签：实训项目编号 - 实训项目名称
  value: string; // 值：实训项目编号
}

/**
 * 获取实训项目编号选项列表
 * @param keyword 查询关键字(项目编号或名称模糊查询)
 * @returns 实训项目选项列表
 */
export function getSxxmOptions(keyword?: string) {
  const params = keyword ? { keyword } : {};
  return request.get<ApiResponse<SxxmOption[]>>(
    "/data/data/data-base/zygjx/ods-sxxmsj/options/sxxm",
    { params },
  );
}
