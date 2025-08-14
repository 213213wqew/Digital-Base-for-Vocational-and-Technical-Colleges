import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 论文发表数据接口
 */

// 论文发表数据表单数据
export interface OdsLwfbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  lwbh?: string; // 论文编号
  lwzwmc?: string; // 论文中文名称
  lwjj?: string; // 论文简介
  fbrq?: string; // 发表日期
  fbkwmc?: string; // 发表刊物名称
  dywcrgh?: string; // 第一完成人工号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 论文发表数据详情
export interface OdsLwfbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  lwbh: string; // 论文编号
  lwzwmc: string; // 论文中文名称
  lwjj?: string; // 论文简介
  fbrq: string; // 发表日期
  fbkwmc: string; // 发表刊物名称
  dywcrgh?: string; // 第一完成人工号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 论文发表数据查询参数
export interface OdsLwfbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  lwbh?: string;
  lwzwmc?: string;
  fbkwmc?: string;
  dywcrgh?: string;
  fbrqStart?: string;
  fbrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 论文发表数据分页结果
export interface OdsLwfbsjPageResult {
  records: OdsLwfbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询论文发表数据
 */
export function getOdsLwfbsjPage(query: OdsLwfbsjQuery) {
  return request.post<ApiResponse<OdsLwfbsjPageResult>>(
    "/code/code/code-base/zygky/ods-lwfbsj/page",
    query,
  );
}

/**
 * 根据ID查询论文发表数据详情
 */
export function getOdsLwfbsjById(id: number) {
  return request.get<ApiResponse<OdsLwfbsjInfo>>(
    `/code/code/code-base/zygky/ods-lwfbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询论文发表数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsLwfbsjInfo>>(
    `/code/code/code-base/zygky/ods-lwfbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增论文发表数据
 */
export function addOdsLwfbsj(data: OdsLwfbsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygky/ods-lwfbsj/add",
    data,
  );
}

/**
 * 修改论文发表数据
 */
export function updateOdsLwfbsj(data: OdsLwfbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-lwfbsj/update",
    data,
  );
}

/**
 * 删除论文发表数据
 */
export function deleteOdsLwfbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygky/ods-lwfbsj/${id}`,
  );
}

/**
 * 批量删除论文发表数据
 */
export function batchDeleteOdsLwfbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-lwfbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出论文发表数据
 */
export function exportOdsLwfbsj(query: OdsLwfbsjQuery) {
  return request.post("/code/code/code-base/zygky/ods-lwfbsj/export", query, {
    responseType: "blob",
  });
}


/**
 * 获取业务字典选项
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any>>(
      `/code/code/code-base-source/options/${dictType}`
  );
}


/**
 * 获取系统学校代码
 */
 
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}