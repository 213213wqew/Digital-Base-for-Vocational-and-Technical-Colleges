import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 专著发表数据接口
 */

// 专著发表数据表单数据
export interface OdsZzfbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zzbh?: string; // 专著编号
  zzzwmc?: string; // 专著中文名称
  zzjj?: string; // 专著简介
  cbrq?: string; // 出版日期
  dywcrgh?: string; // 第一完成人工号
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 专著发表数据详情
export interface OdsZzfbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zzbh: string; // 专著编号
  zzzwmc: string; // 专著中文名称
  zzjj: string; // 专著简介
  cbrq: string; // 出版日期
  dywcrgh: string; // 第一完成人工号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 专著发表数据查询参数
export interface OdsZzfbsjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zzbh?: string; // 专著编号
  zzzwmc?: string; // 专著中文名称
  dywcrgh?: string; // 第一完成人工号
  cbrqStart?: string; // 出版日期开始
  cbrqEnd?: string; // 出版日期结束
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
  pageNum: number; // 当前页码
  pageSize: number; // 每页数量
}

// 专著发表数据分页结果
export interface OdsZzfbsjPageResult {
  records: OdsZzfbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询专著发表数据
 */
export function getOdsZzfbsjPage(query: OdsZzfbsjQuery) {
  return request.post<ApiResponse<OdsZzfbsjPageResult>>(
    "/api/meta/meta-base/zygky/ods-zzfbsj/page",
    query,
  );
}

/**
 * 根据ID查询专著发表数据详情
 */
export function getOdsZzfbsjById(id: number) {
  return request.get<ApiResponse<OdsZzfbsjInfo>>(
    `/api/meta/meta-base/zygky/ods-zzfbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询专著发表数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZzfbsjInfo>>(
    `/api/meta/meta-base/zygky/ods-zzfbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增专著发表数据
 */
export function addOdsZzfbsj(data: OdsZzfbsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygky/ods-zzfbsj/add",
    data,
  );
}

/**
 * 修改专著发表数据
 */
export function updateOdsZzfbsj(data: OdsZzfbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygky/ods-zzfbsj/update",
    data,
  );
}

/**
 * 删除专著发表数据
 */
export function deleteOdsZzfbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygky/ods-zzfbsj/${id}`,
  );
}

/**
 * 批量删除专著发表数据
 */
export function batchDeleteOdsZzfbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygky/ods-zzfbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出专著发表数据
 */
export function exportOdsZzfbsj(query: OdsZzfbsjQuery) {
  return request.post("/api/meta/meta-base/zygky/ods-zzfbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}

/**
 * 获取字典选项
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any[]>>(
    `/api/meta/data-base-source/options/${dictType}`,
  );
}
