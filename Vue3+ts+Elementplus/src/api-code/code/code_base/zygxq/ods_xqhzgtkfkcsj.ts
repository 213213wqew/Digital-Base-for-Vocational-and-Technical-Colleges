import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 校企合作共同开发课程数据接口
 */

// 校企合作共同开发课程数据表单数据
export interface OdsXqhzgtkfkcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kch?: string; // 课程号
  kcmc?: string; // 课程名称
  kcjj?: string; // 课程简介
  qyshxydm?: string; // 合作企业统一社会信用代码
  hzqymc?: string; // 合作企业名称
  kckfkssj?: string; // 开始日期
  kckfjssj?: string; // 结束日期
  xxfzrgh?: string; // 学校负责人工号
  xxfzr?: string; // 学校负责人
  qyfzr?: string; // 企业负责人
  sjcjsj?: string; // 数据采集时间
}

// 校企合作共同开发课程数据详情
export interface OdsXqhzgtkfkcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kch: string; // 课程号
  kcmc: string; // 课程名称
  kcjj: string; // 课程简介
  qyshxydm: string; // 合作企业统一社会信用代码
  hzqymc: string; // 合作企业名称
  kckfkssj: string; // 开始日期
  kckfjssj: string; // 结束日期
  xxfzrgh: string; // 学校负责人工号
  xxfzr: string; // 学校负责人
  qyfzr: string; // 企业负责人
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
}

// 校企合作共同开发课程数据查询参数
export interface OdsXqhzgtkfkcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kch?: string;
  kcmc?: string;
  qyshxydm?: string;
  hzqymc?: string;
  xxfzr?: string;
  qyfzr?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 校企合作共同开发课程数据分页结果
export interface OdsXqhzgtkfkcsjPageResult {
  records: OdsXqhzgtkfkcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询校企合作共同开发课程数据
 */
export function getOdsXqhzgtkfkcsjPage(query: OdsXqhzgtkfkcsjQuery) {
  return request.post<ApiResponse<OdsXqhzgtkfkcsjPageResult>>(
    "/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/page",
    query,
  );
}

/**
 * 根据ID查询校企合作共同开发课程数据详情
 */
export function getOdsXqhzgtkfkcsjById(id: number) {
  return request.get<ApiResponse<OdsXqhzgtkfkcsjInfo>>(
    `/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询校企合作共同开发课程数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXqhzgtkfkcsjInfo>>(
    `/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增校企合作共同开发课程数据
 */
export function addOdsXqhzgtkfkcsj(data: OdsXqhzgtkfkcsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/add",
    data,
  );
}

/**
 * 修改校企合作共同开发课程数据
 */
export function updateOdsXqhzgtkfkcsj(data: OdsXqhzgtkfkcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/update",
    data,
  );
}

/**
 * 删除校企合作共同开发课程数据
 */
export function deleteOdsXqhzgtkfkcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/${id}`,
  );
}

/**
 * 批量删除校企合作共同开发课程数据
 */
export function batchDeleteOdsXqhzgtkfkcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出校企合作共同开发课程数据
 */
export function exportOdsXqhzgtkfkcsj(query: OdsXqhzgtkfkcsjQuery) {
  return request.post(
    "/code/code/code-base/zygxq/ods-xqhzgtkfkcsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}


// 产学合作企业搜索结果
export interface OdsCxhzCompanyInfo {
  hzqymc: string;
  hzqytyshxydm: string;
}

/**
 * 模糊搜索产学合作企业
 * @param companyName 企业名称关键字
 */
export function searchCxhzCompanies(companyName: string) {
  return request.get<ApiResponse<OdsCxhzCompanyInfo[]>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/search",
    {
       companyName ,
    },
  );
}

// 课程基本信息接口（用于下拉选择）
export interface CourseBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  createTime?: string;
  updateTime?: string;
}

/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词（课程号或课程名称）
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchOnlineCourses(keyword?: string, limit: number = 20) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  params.append("limit", limit.toString());

  return request.get<ApiResponse<CourseBasicInfo[]>>(
    `/code/code/code-base/zygjx/ods-kcjbs/search?${params.toString()}`,
  );
}