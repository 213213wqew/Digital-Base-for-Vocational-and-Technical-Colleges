import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 职业技能鉴定机构数据接口
 */

// 职业技能鉴定机构数据表单数据
export interface OdsZyjnjdjgsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jdjgmc?: string; // 鉴定机构名称
  jdzsmc?: string; // 鉴定证书名称
  jddjm?: string; // 鉴定等级码
  jldwjbm?: string; // 建立单位级别码
  jldwbmm?: string; // 建立单位部门码
  jdrs?: number; // 鉴定人数
  jdnd?: string; // 鉴定年度
  sjcjsj?: string; // 数据采集时间
}

// 职业技能鉴定机构数据详情
export interface OdsZyjnjdjgsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jdjgmc: string; // 鉴定机构名称
  jdzsmc: string; // 鉴定证书名称
  jddjm: string; // 鉴定等级码
  jldwjbm: string; // 建立单位级别码
  jldwbmm: string; // 建立单位部门码
  jdrs: number; // 鉴定人数
  jdnd: string; // 鉴定年度
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  jddjmText?: string; // 鉴定等级码文本
  jldwjbmText?: string; // 建立单位级别码文本
  jldwbmmText?: string; // 建立单位部门码文本
}

// 职业技能鉴定机构数据查询参数
export interface OdsZyjnjdjgsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jdjgmc?: string;
  jdzsmc?: string;
  jddjm?: string;
  jdnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 职业技能鉴定机构数据分页结果
export interface OdsZyjnjdjgsjPageResult {
  records: OdsZyjnjdjgsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询职业技能鉴定机构数据
 */
export function getOdsZyjnjdjgsjPage(query: OdsZyjnjdjgsjQuery) {
  return request.post<ApiResponse<OdsZyjnjdjgsjPageResult>>(
    "/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/page",
    query,
  );
}

/**
 * 根据ID查询职业技能鉴定机构数据详情
 */
export function getOdsZyjnjdjgsjById(id: number) {
  return request.get<ApiResponse<OdsZyjnjdjgsjInfo>>(
    `/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询职业技能鉴定机构数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZyjnjdjgsjInfo>>(
    `/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增职业技能鉴定机构数据
 */
export function addOdsZyjnjdjgsj(data: OdsZyjnjdjgsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/add",
    data,
  );
}

/**
 * 修改职业技能鉴定机构数据
 */
export function updateOdsZyjnjdjgsj(data: OdsZyjnjdjgsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/update",
    data,
  );
}

/**
 * 删除职业技能鉴定机构数据
 */
export function deleteOdsZyjnjdjgsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/${id}`,
  );
}

/**
 * 批量删除职业技能鉴定机构数据
 */
export function batchDeleteOdsZyjnjdjgsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出职业技能鉴定机构数据
 */
export function exportOdsZyjnjdjgsj(query: OdsZyjnjdjgsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygxq/ods-zyjnjdjgsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}
 
/**
 * 党员干部学习数据接口
 */

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}
/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/api/meta/data-base-source/options/${dictType}`,
  );
}
