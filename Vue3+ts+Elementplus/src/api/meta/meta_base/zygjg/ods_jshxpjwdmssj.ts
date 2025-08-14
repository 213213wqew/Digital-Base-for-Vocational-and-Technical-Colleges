import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 教师画像评价维度描述数据接口
 */

// 教师画像评价维度描述数据表单数据
export interface OdsJshxpjwdmssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  pjwdyjzbywmc?: string; // 评价维度一级指标英文名称
  pjwdyjzbzwmc?: string; // 评价维度一级指标中文名称
  pjwdywmc?: string; // 评价维度英文名称
  pjwdzwms?: string; // 评价维度中文描述
  pjwdjgms?: string; // 评价维度结果描述
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 教师画像评价维度描述数据详情
export interface OdsJshxpjwdmssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  pjwdyjzbywmc: string; // 评价维度一级指标英文名称
  pjwdyjzbzwmc: string; // 评价维度一级指标中文名称
  pjwdywmc: string; // 评价维度英文名称
  pjwdzwms: string; // 评价维度中文描述
  pjwdjgms: string; // 评价维度结果描述
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
  sjcjsjDisplay?: string; // 数据采集时间显示格式
  statusLoading?: boolean; // 状态切换加载状态
}

// 教师画像评价维度描述数据查询参数
export interface OdsJshxpjwdmssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  pjwdyjzbywmc?: string;
  pjwdyjzbzwmc?: string;
  pjwdywmc?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 教师选项类型
export interface JsOption {
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  label: string; // 显示标签
  value: string; // 值
}

// 教师画像评价维度描述数据分页结果
export interface OdsJshxpjwdmssjPageResult {
  records: OdsJshxpjwdmssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教师画像评价维度描述数据
 */
export function getOdsJshxpjwdmssjPage(query: OdsJshxpjwdmssjQuery) {
  return request.post<ApiResponse<OdsJshxpjwdmssjPageResult>>(
    "/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/page",
    query,
  );
}

/**
 * 根据ID查询教师画像评价维度描述数据详情
 */
export function getOdsJshxpjwdmssjById(id: number) {
  return request.get<ApiResponse<OdsJshxpjwdmssjInfo>>(
    `/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教师画像评价维度描述数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJshxpjwdmssjInfo>>(
    `/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教师画像评价维度描述数据
 */
export function addOdsJshxpjwdmssj(data: OdsJshxpjwdmssjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/add",
    data,
  );
}

/**
 * 修改教师画像评价维度描述数据
 */
export function updateOdsJshxpjwdmssj(data: OdsJshxpjwdmssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/update",
    data,
  );
}

/**
 * 删除教师画像评价维度描述数据
 */
export function deleteOdsJshxpjwdmssj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/${id}`,
  );
}

/**
 * 批量删除教师画像评价维度描述数据
 */
export function batchDeleteOdsJshxpjwdmssj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/batch",
    { data: ids },
  );
}

/**
 * 导出教师画像评价维度描述数据
 */
export function exportOdsJshxpjwdmssj(query: OdsJshxpjwdmssjQuery) {
  return request.post(
    "/api/meta/meta-base/zygjg/ods-jshxpjwdmssj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>('/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code');
}

/**
 * 获取教师下拉选项
 * @param keyword 搜索关键词，支持教工号或教师姓名模糊查询
 * @returns 教师选项列表
 */
export function getJsOptions(keyword?: string) {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  return request.get<ApiResponse<JsOption[]>>(`/api/meta/meta-base/zygjg/ods-jshxsj/js-options?${params.toString()}`);
}
