import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 党员组织关系转移数据接口
 */

// 党员组织关系转移数据表单数据
export interface OdsDyzzgxzysjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xm?: string; // 姓名
  rybh?: string; // 人员编号
  lxrq?: string; // 离校日期
  zzgxqx?: string; // 组织关系去向
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 党员组织关系转移数据详情
export interface OdsDyzzgxzysjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xm: string; // 姓名
  rybh: string; // 人员编号
  lxrq: string; // 离校日期
  zzgxqx: string; // 组织关系去向
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 党员组织关系转移数据查询参数
export interface OdsDyzzgxzysjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xm?: string;
  rybh?: string;
  lxrqStart?: string;
  lxrqEnd?: string;
  zzgxqx?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 党员组织关系转移数据分页结果
export interface OdsDyzzgxzysjPageResult {
  records: OdsDyzzgxzysjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党员组织关系转移数据
 */
export function getOdsDyzzgxzysjPage(query: OdsDyzzgxzysjQuery) {
  return request.post<ApiResponse<OdsDyzzgxzysjPageResult>>(
    "/api/meta/meta-base/zygdz/ods-dyzzgxzysj/page",
    query,
  );
}

/**
 * 根据ID查询党员组织关系转移数据详情
 */
export function getOdsDyzzgxzysjById(id: number) {
  return request.get<ApiResponse<OdsDyzzgxzysjInfo>>(
    `/api/meta/meta-base/zygdz/ods-dyzzgxzysj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党员组织关系转移数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDyzzgxzysjInfo>>(
    `/api/meta/meta-base/zygdz/ods-dyzzgxzysj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党员组织关系转移数据
 */
export function addOdsDyzzgxzysj(data: OdsDyzzgxzysjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygdz/ods-dyzzgxzysj/add",
    data,
  );
}

/**
 * 修改党员组织关系转移数据
 */
export function updateOdsDyzzgxzysj(data: OdsDyzzgxzysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygdz/ods-dyzzgxzysj/update",
    data,
  );
}

/**
 * 删除党员组织关系转移数据
 */
export function deleteOdsDyzzgxzysj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygdz/ods-dyzzgxzysj/${id}`,
  );
}

/**
 * 批量删除党员组织关系转移数据
 */
export function batchDeleteOdsDyzzgxzysj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygdz/ods-dyzzgxzysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党员组织关系转移数据
 */
export function exportOdsDyzzgxzysj(query: OdsDyzzgxzysjQuery) {
  return request.post(
    "/api/meta/meta-base/zygdz/ods-dyzzgxzysj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

// 人员信息选项
export interface PersonOption {
  label: string; // 姓名
  value: string; // 人员编号
  xm: string; // 姓名
  rybh: string; // 人员编号
}

/**
 * 搜索人员信息
 * @param keyword 搜索关键字
 */
export function searchPersonInfo(keyword: string) {
  return request.get<ApiResponse<PersonOption[]>>(
    "/api/meta/meta-base/zygdz/ods-dyfzsj/search-person-info",
     {
    keyword 
    }
  );
}