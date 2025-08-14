import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 数字资源基本数据接口
 */

// 数字资源基本数据表单数据
export interface MetaBaseZygjxOdsSzzyjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zybh?: string; // 资源编号
  zymc?: string; // 资源名称
  sszyh?: string; // 所属专业号
  zyfzrh?: string; // 资源负责人号
  zyjbm?: string; // 资源级别码
  zylxm?: string; // 资源类型码
  gjzhjxptzylxm?: string; // 国家智慧教学平台资源类型码
  zycjsj?: string; // 资源创建时间
  zygxsj?: string; // 资源更新时间
  glkch?: string; // 关联课程号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 数字资源基本数据详情
export interface MetaBaseZygjxOdsSzzyjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zybh: string; // 资源编号
  zymc: string; // 资源名称
  sszyh: string; // 所属专业号
  zyfzrh: string; // 资源负责人号
  zyjbm: string; // 资源级别码
  zylxm: string; // 资源类型码
  gjzhjxptzylxm: string; // 国家智慧教学平台资源类型码
  zycjsj: string; // 资源创建时间
  zygxsj: string; // 资源更新时间
  glkch: string; // 关联课程号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zyjbmText?: string; // 资源级别名称
  zylxmText?: string; // 资源类型名称
  gjzhjxptzylxmText?: string; // 国家智慧教学平台资源类型名称
}

// 数字资源基本数据查询参数
export interface MetaBaseZygjxOdsSzzyjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zybh?: string;
  zymc?: string;
  sszyh?: string;
  zyfzrh?: string;
  zyjbm?: string;
  zylxm?: string;
  gjzhjxptzylxm?: string;
  glkch?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 数字资源基本数据分页结果
export interface MetaBaseZygjxOdsSzzyjbsjPageResult {
  records: MetaBaseZygjxOdsSzzyjbsjInfo[];
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
 * 分页查询数字资源基本数据
 * @param query 查询参数
 * @returns 数字资源基本数据列表
 */
export function getOdsSzzyjbsjPage(query: MetaBaseZygjxOdsSzzyjbsjQuery) {
  return request.post<ApiResponse<MetaBaseZygjxOdsSzzyjbsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/page",
    query,
  );
}

/**
 * 根据ID查询数字资源基本数据详情
 * @param id 主键ID
 * @returns 数字资源基本数据详情
 */
export function getOdsSzzyjbsjById(id: number) {
  return request.get<ApiResponse<MetaBaseZygjxOdsSzzyjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询数字资源基本数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 数字资源基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<MetaBaseZygjxOdsSzzyjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增数字资源基本数据
 * @param data 数字资源基本数据信息
 * @returns 结果
 */
export function addOdsSzzyjbsj(data: MetaBaseZygjxOdsSzzyjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/add",
    data,
  );
}

/**
 * 修改数字资源基本数据
 * @param data 数字资源基本数据信息
 * @returns 结果
 */
export function updateOdsSzzyjbsj(data: MetaBaseZygjxOdsSzzyjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/update",
    data,
  );
}

/**
 * 删除数字资源基本数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsSzzyjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/${id}`,
  );
}

/**
 * 批量删除数字资源基本数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsSzzyjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出数字资源基本数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsSzzyjbsj(query: MetaBaseZygjxOdsSzzyjbsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-szzyjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 资源级别 (ZYJBDM)
 * @returns 字典选项列表
 */
export function getResourceLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/JBDM",
  );
}

/**
 * 获取字典数据 - 资源类型 (ZYLXDM)
 * @returns 字典选项列表
 */
export function getResourceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SZZYLXDM",
  );
}

/**
 * 获取字典数据 - 国家智慧教学平台资源类型 (GJZHJXPTZYLXDM)
 * @returns 字典选项列表
 */
export function getNationalPlatformResourceTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/GJPTDJZYLXDM",
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
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/batch-update-report-status",
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
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/batch-update-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单条记录上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单条记录启用状态
 * @param id 记录ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
