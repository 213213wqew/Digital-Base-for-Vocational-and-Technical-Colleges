import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 虚拟仿真数字资源基本数据接口
 */

// 虚拟仿真数字资源基本数据表单数据
export interface MetaBaseZygjxOdsXnfzszzyjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zybh?: string; // 资源编号
  zymc?: string; // 资源名称
  sszyh?: string; // 所属专业号
  zyfzrh?: string; // 资源负责人号
  zyjbm?: string; // 资源级别码
  zylxm?: string; // 虚拟仿真资源类型码
  zycjsj?: string; // 资源创建时间
  zygxsj?: string; // 资源更新时间
  glkch?: string; // 关联课程号
  sssxjdbh?: string; // 所属实训基地编号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 虚拟仿真数字资源基本数据详情
export interface MetaBaseZygjxOdsXnfzszzyjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zybh: string; // 资源编号
  zymc: string; // 资源名称
  sszyh: string; // 所属专业号
  zyfzrh: string; // 资源负责人号
  zyjbm: string; // 资源级别码
  zylxm: string; // 虚拟仿真资源类型码
  zycjsj: string; // 资源创建时间
  zygxsj: string; // 资源更新时间
  glkch: string; // 关联课程号
  sssxjdbh: string; // 所属实训基地编号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zyjbmText?: string; // 资源级别名称
  zylxmText?: string; // 虚拟仿真资源类型名称
}

// 虚拟仿真数字资源基本数据查询参数
export interface MetaBaseZygjxOdsXnfzszzyjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zybh?: string;
  zymc?: string;
  sszyh?: string;
  zyfzrh?: string;
  zyjbm?: string;
  zylxm?: string;
  glkch?: string;
  sssxjdbh?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 虚拟仿真数字资源基本数据分页结果
export interface MetaBaseZygjxOdsXnfzszzyjbsjPageResult {
  records: MetaBaseZygjxOdsXnfzszzyjbsjInfo[];
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
 * 分页查询虚拟仿真数字资源基本数据
 * @param query 查询参数
 * @returns 虚拟仿真数字资源基本数据列表
 */
export function getOdsXnfzszzyjbsjPage(
  query: MetaBaseZygjxOdsXnfzszzyjbsjQuery,
) {
  return request.post<ApiResponse<MetaBaseZygjxOdsXnfzszzyjbsjPageResult>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/page",
    query,
  );
}

/**
 * 根据ID查询虚拟仿真数字资源基本数据详情
 * @param id 主键ID
 * @returns 虚拟仿真数字资源基本数据详情
 */
export function getOdsXnfzszzyjbsjById(id: number) {
  return request.get<ApiResponse<MetaBaseZygjxOdsXnfzszzyjbsjInfo>>(
    `/data/data/data-base/zygjx/ods-xnfzszzyjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询虚拟仿真数字资源基本数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 虚拟仿真数字资源基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<MetaBaseZygjxOdsXnfzszzyjbsjInfo>>(
    `/data/data/data-base/zygjx/ods-xnfzszzyjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增虚拟仿真数字资源基本数据
 * @param data 虚拟仿真数字资源基本数据信息
 * @returns 结果
 */
export function addOdsXnfzszzyjbsj(data: MetaBaseZygjxOdsXnfzszzyjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/add",
    data,
  );
}

/**
 * 修改虚拟仿真数字资源基本数据
 * @param data 虚拟仿真数字资源基本数据信息
 * @returns 结果
 */
export function updateOdsXnfzszzyjbsj(data: MetaBaseZygjxOdsXnfzszzyjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/update",
    data,
  );
}

/**
 * 删除虚拟仿真数字资源基本数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsXnfzszzyjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-xnfzszzyjbsj/${id}`,
  );
}

/**
 * 批量删除虚拟仿真数字资源基本数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsXnfzszzyjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出虚拟仿真数字资源基本数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsXnfzszzyjbsj(
  query: MetaBaseZygjxOdsXnfzszzyjbsjQuery,
) {
  return request.post(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典数据 - 资源级别 (JBDM)
 * @returns 字典选项列表
 */
export function getResourceLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JBDM",
  );
}

/**
 * 获取字典数据 - 虚拟仿真资源类型 (XNFZZYLXDM)
 * @returns 字典选项列表
 */
export function getVirtualSimulationResourceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/XNFZZYLXDM",
  );
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/batch-update-report-status",
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
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/batch-update-enable-status",
    {
      ids,
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
 * 获取数字资源选项列表（用于下拉框，可搜索）
 * @param keyword 搜索关键字
 * @returns 资源选项列表
 */
export function getResourceOptions(keyword: string) {
  return request.get<ApiResponse<any[]>>(
    `/data/data/data-base/zygjx/ods-szzyjbsj/resource-options`,
    {
      keyword,
    },
  );
}

/**
 * 修改单个记录的上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/update-report-status",
    {
      id,
      reportStatus,
    },
  );
}

/**
 * 修改单个记录的启用状态
 * @param id 记录ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xnfzszzyjbsj/update-enable-status",
    {
      id,
      enableStatus,
    },
  );
}
