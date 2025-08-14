import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 教师企业兼职/实践数据接口
 */

export type OptionType = {
  label: string;
  value: string | number;
  [key: string]: any;
};

// 教师企业兼职/实践数据表单数据
export interface OdsJsqyjzsjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  jsxm?: string; // 教师姓名
  qydllxm?: string; // 企业锻炼类型码
  qyjgdm?: string; // 企业机构代码
  qymc?: string; // 企业名称
  qyxzm?: string; // 企业性质码
  zqysjjzksrq?: string; // 在企业实践/兼职开始日期
  zqysjjzzzrq?: string; // 在企业实践/兼职终止日期
  qysjjzgw?: string; // 企业实践/兼职岗位
  qysshym?: string; // 企业所属行业码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 教师企业兼职/实践数据详情
export interface OdsJsqyjzsjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  qydllxm: string; // 企业锻炼类型码
  qyjgdm: string; // 企业机构代码
  qymc: string; // 企业名称
  qyxzm: string; // 企业性质码
  zqysjjzksrq: string; // 在企业实践/兼职开始日期
  zqysjjzzzrq: string; // 在企业实践/兼职终止日期
  qysjjzgw: string; // 企业实践/兼职岗位
  qysshym: string; // 企业所属行业码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  qydllxmText?: string; // 企业锻炼类型名称
  qyxzmText?: string; // 企业性质名称
  qysshymText?: string; // 企业所属行业名称
}

// 教师企业兼职/实践数据查询参数
export interface OdsJsqyjzsjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  jsxm?: string;
  qymc?: string;
  qydllxm?: string;
  qyxzm?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  zqysjjzksrqStart?: string;
  zqysjjzksrqEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教师企业兼职/实践数据分页结果
export interface OdsJsqyjzsjsjPageResult {
  records: OdsJsqyjzsjsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教师企业兼职/实践数据
 */
export function getOdsJsqyjzsjsjPage(query: OdsJsqyjzsjsjQuery) {
  return request.post<ApiResponse<OdsJsqyjzsjsjPageResult>>(
    "/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/page",
    query,
  );
}

/**
 * 根据ID查询教师企业兼职/实践数据详情
 */
export function getOdsJsqyjzsjsjById(id: number) {
  return request.get<ApiResponse<OdsJsqyjzsjsjInfo>>(
    `/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教师企业兼职/实践数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJsqyjzsjsjInfo>>(
    `/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教师企业兼职/实践数据
 */
export function addOdsJsqyjzsjsj(data: OdsJsqyjzsjsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/add",
    data,
  );
}

/**
 * 修改教师企业兼职/实践数据
 */
export function updateOdsJsqyjzsjsj(data: OdsJsqyjzsjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/update",
    data,
  );
}

/**
 * 删除教师企业兼职/实践数据
 */
export function deleteOdsJsqyjzsjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/${id}`,
  );
}

/**
 * 批量删除教师企业兼职/实践数据
 */
export function batchDeleteOdsJsqyjzsjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教师企业兼职/实践数据
 */
export function exportOdsJsqyjzsjsj(query: OdsJsqyjzsjsjQuery) {
  return request.post('/api/meta/meta-base/zygjg/ods-jsqyjzsjsj/export', query, { responseType: 'blob' });
}
 
/**
 * 根据字典代码获取下拉选项
 * @param code 字典代码
 * @returns 选项列表
 */
export function getOptionsByCode(code: string) {
  return request.get(`/api/meta/data-base-source/options/${code}`);
}

/**
 * 模糊搜索教师下拉选项
 * @param keyword 搜索关键词
 * @returns 教师选项列表
 */
export function getJsOptions(keyword?: string) {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  return request.get<ApiResponse<OptionType[]>>(`/api/meta/meta-base/zygjg/ods-jshxsj/js-options?${params.toString()}`);
}
