import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 举办社团活动数据接口
 */

// 数据字典选项接口
export interface DataDictionaryOption {
  value: string;
  label: string;
  code: string;
  name: string;
}

// 举办社团活动数据表单数据
export interface OdsJbsthdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sthdbh?: string; // 社团活动编号
  sthdmc?: string; // 社团活动名称
  stbh?: string; // 社团编号
  stmc?: string; // 社团名称
  hdfbsj?: string; // 活动发布时间
  hdkssj?: string; // 活动开始时间
  hdjssj?: string; // 活动结束时间
  hdlqfsm?: string; // 活动录取方式码
  hdzdjsgh?: string; // 活动指导教师工号
  hdzdjsxm?: string; // 活动指导教师姓名
  hdlxm?: string; // 活动类型码
  hdjbm?: string; // 活动级别码
  zdbmrs?: number; // 最大报名人数
  hdbmrs?: number; // 活动报名人数
  hdcyfsm?: string; // 活动参与方式码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 举办社团活动数据详情
export interface OdsJbsthdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sthdbh: string; // 社团活动编号
  sthdmc: string; // 社团活动名称
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  hdfbsj: string; // 活动发布时间
  hdkssj: string; // 活动开始时间
  hdjssj: string; // 活动结束时间
  hdlqfsm: string; // 活动录取方式码
  hdzdjsgh: string; // 活动指导教师工号
  hdzdjsxm: string; // 活动指导教师姓名
  hdlxm: string; // 活动类型码
  hdjbm: string; // 活动级别码
  zdbmrs: number; // 最大报名人数
  hdbmrs: number; // 活动报名人数
  hdcyfsm: string; // 活动参与方式码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 举办社团活动数据查询参数
export interface OdsJbsthdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sthdbh?: string;
  sthdmc?: string;
  stbh?: string;
  stmc?: string;
  hdfbsjStart?: string;
  hdfbsjEnd?: string;
  hdkssjStart?: string;
  hdkssjEnd?: string;
  hdjssjStart?: string;
  hdjssjEnd?: string;
  hdlqfsm?: string;
  hdzdjsgh?: string;
  hdzdjsxm?: string;
  hdlxm?: string;
  hdjbm?: string;
  hdcyfsm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 举办社团活动数据分页结果
export interface OdsJbsthdsjPageResult {
  records: OdsJbsthdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询举办社团活动数据
 */
export function getOdsJbsthdsjPage(query: OdsJbsthdsjQuery) {
  return request.post<ApiResponse<OdsJbsthdsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/page",
    query,
  );
}

/**
 * 根据ID查询举办社团活动数据详情
 */
export function getOdsJbsthdsjById(id: number) {
  return request.get<ApiResponse<OdsJbsthdsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-jbsthdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询举办社团活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJbsthdsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-jbsthdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增举办社团活动数据
 */
export function addOdsJbsthdsj(data: OdsJbsthdsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/add",
    data,
  );
}

/**
 * 修改举办社团活动数据
 */
export function updateOdsJbsthdsj(data: OdsJbsthdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/update",
    data,
  );
}

/**
 * 删除举办社团活动数据
 */
export function deleteOdsJbsthdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-jbsthdsj/${id}`,
  );
}

/**
 * 批量删除举办社团活动数据
 */
export function batchDeleteOdsJbsthdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出举办社团活动数据
 */
export function exportOdsJbsthdsj(query: OdsJbsthdsjQuery) {
  return request.post<ApiResponse<Blob>>("/api/meta/meta-base/zygxs/ods-jbsthdsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 批量修改上报状态
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/batch-report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-jbsthdsj/batch-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单个记录上报状态
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-jbsthdsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单个记录启用状态
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-jbsthdsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}

//获取学校代码
export function getSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}

// 社团（协会）下拉选择选项
export interface OdsStxhjbsjOption {
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  zdjsh: string; // 指导教师工号
  zdjsxm: string; // 指导教师姓名
  value: string; // 选择值（社团编号）
  label: string; // 显示标签（社团编号 - 社团名称 - 指导教师工号 - 指导教师姓名）
}

// 获取社团（协会）下拉选择选项
export const getStxhjbsjOptions = (keyword?: string): Promise<ApiResponse<OdsStxhjbsjOption[]>> => {
  return request.get('/api/meta/meta-base/zygxs/ods-stxhjbsj/options', {
keyword 
  });
};

/**
 * 获取社团活动类型代码选项 (STHDLXDM)
 * @returns Promise<ApiResponse<DataDictionaryOption[]>>
 */
export function getSthdlxdmOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/api/meta/data-base-source/options/STHDLXDM",
  );
}

/**
 * 获取社团活动级别代码选项 (STHDJBDM)
 * @returns Promise<ApiResponse<DataDictionaryOption[]>>
 */
export function getSthdjbdmOptions(){
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/api/meta/data-base-source/options/STHDJBDM",
  );
}

/**
 * 获取社团活动参与方式代码选项 (STHDCYFSDM)
 * @returns Promise<ApiResponse<DataDictionaryOption[]>>
 */
export function getSthdcyfsdmOptions(){
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/api/meta/data-base-source/options/STHDCYFSDM",
  );
}