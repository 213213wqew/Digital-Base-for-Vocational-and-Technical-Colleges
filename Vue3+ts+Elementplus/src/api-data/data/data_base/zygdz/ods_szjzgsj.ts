import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-data.ts";

/**
 * 思政教职工数据接口
 */

// 思政教职工数据表单数据
export interface OdsSzjzgsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  jsxm?: string; // 教师姓名
  rylxm?: string; // 人员类型码
  jl?: number; // 教龄
  zksxzymc?: string; // 专科所学专业名称
  bksxzymc?: string; // 本科所学专业名称
  sssxzymc?: string; // 硕士所学专业名称
  bssxzymc?: string; // 博士所学专业名称
  bzrfdynxszknx?: number; // 班主任辅导员年限/思政课年限
  sfxljkkjs?: string; // 是否心理健康课教师
  sfxlzxs?: string; // 是否心理咨询师
  sfcyxlzxszgzs?: string; // 是否持有"心理咨询师"资格证书
  xlzxszgzsbh?: string; // "心理咨询师"资格证书编号
  sjcjsj?: string; // 数据采集时间
}

// 思政教职工数据详情
export interface OdsSzjzgsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  rylxm: string; // 人员类型码
  jl: number; // 教龄
  zksxzymc: string; // 专科所学专业名称
  bksxzymc: string; // 本科所学专业名称
  sssxzymc: string; // 硕士所学专业名称
  bssxzymc: string; // 博士所学专业名称
  bzrfdynxszknx: number; // 班主任辅导员年限/思政课年限
  sfxljkkjs: string; // 是否心理健康课教师
  sfxlzxs: string; // 是否心理咨询师
  sfcyxlzxszgzs: string; // 是否持有"心理咨询师"资格证书
  xlzxszgzsbh: string; // "心理咨询师"资格证书编号
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  rylxmText?: string; // 人员类型名称
}

// 思政教职工数据查询参数
export interface OdsSzjzgsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  jsxm?: string;
  rylxm?: string;
  sfxljkkjs?: string;
  sfxlzxs?: string;
  sfcyxlzxszgzs?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 思政教职工数据分页结果
export interface OdsSzjzgsjPageResult {
  records: OdsSzjzgsjInfo[];
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
 * 分页查询思政教职工数据
 */
export function getOdsSzjzgsjPage(query: OdsSzjzgsjQuery) {
  return request.post<ApiResponse<OdsSzjzgsjPageResult>>(
    "/data/data/data-base/zygdz/ods-szjzgsj/page",
    query,
  );
}

/**
 * 根据ID查询思政教职工数据详情
 */
export function getOdsSzjzgsjById(id: number) {
  return request.get<ApiResponse<OdsSzjzgsjInfo>>(
    `/data/data/data-base/zygdz/ods-szjzgsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询思政教职工数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSzjzgsjInfo>>(
    `/data/data/data-base/zygdz/ods-szjzgsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增思政教职工数据
 */
export function addOdsSzjzgsj(data: OdsSzjzgsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygdz/ods-szjzgsj/add",
    data,
  );
}

/**
 * 修改思政教职工数据
 */
export function updateOdsSzjzgsj(data: OdsSzjzgsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygdz/ods-szjzgsj/update",
    data,
  );
}

/**
 * 删除思政教职工数据
 */
export function deleteOdsSzjzgsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygdz/ods-szjzgsj/${id}`,
  );
}

/**
 * 批量删除思政教职工数据
 */
export function batchDeleteOdsSzjzgsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygdz/ods-szjzgsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出思政教职工数据
 */
export function exportOdsSzjzgsj(query: OdsSzjzgsjQuery) {
  return request.post("/data/data/data-base/zygdz/ods-szjzgsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 人员类型 (YJSRYLXDM)
 */
export function getPersonTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SZJZGRYLXDM",
  );
}

/**
 * 获取字典数据 - 是否标志代码 (SFBZDM)
 */
export function getYesNoOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SFBZDM",
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
 // 教师选项类型
export interface JsOption {
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  label: string; // 显示标签
  value: string; // 值
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
  return request.get<ApiResponse<JsOption[]>>(`/data/data/data-base/zygjg/ods-jshxsj/js-options?${params.toString()}`);
}
