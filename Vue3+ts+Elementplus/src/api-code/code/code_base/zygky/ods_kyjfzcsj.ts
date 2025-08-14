import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 科研经费支出数据接口
 */

// 科研经费支出数据表单数据
export interface OdsKyjfzcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kyxmbh?: string; // 科研项目编号
  jfzckyxmmc?: string; // 经费支出科研项目名称
  jfzckyxmlbm?: string; // 经费支出科研项目类别码
  zcje?: number; // 支出金额
  zcsj?: string; // 支出时间
  zcyt?: string; // 支出用途
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 科研经费支出数据详情
export interface OdsKyjfzcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kyxmbh: string; // 科研项目编号
  jfzckyxmmc: string; // 经费支出科研项目名称
  jfzckyxmlbm: string; // 经费支出科研项目类别码
  zcje: number; // 支出金额
  zcsj: string; // 支出时间
  zcyt: string; // 支出用途
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jfzckyxmlbmText?: string; // 经费支出科研项目类别名称
}

// 科研经费支出数据查询参数
export interface OdsKyjfzcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kyxmbh?: string;
  jfzckyxmmc?: string;
  jfzckyxmlbm?: string;
  zcsjStart?: string;
  zcsjEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 科研经费支出数据分页结果
export interface OdsKyjfzcsjPageResult {
  records: OdsKyjfzcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询科研经费支出数据
 */
export async function getOdsKyjfzcsjPage(query: OdsKyjfzcsjQuery) {
  const response = await request.post<ApiResponse<OdsKyjfzcsjPageResult>>(
    "/code/code/code-base/zygky/ods-kyjfzcsj/page",
    query,
  );
  return response.data;
}

/**
 * 根据ID查询科研经费支出数据详情
 */
export async function getOdsKyjfzcsjById(id: number) {
  const response = await request.get<ApiResponse<OdsKyjfzcsjInfo>>(
    `/code/code/code-base/zygky/ods-kyjfzcsj/${id}`,
  );
  return response.data;
}

/**
 * 根据唯一性标识查询科研经费支出数据
 */
export async function getByUniqueId(zjsjwyxbs: string) {
  const response = await request.get<ApiResponse<OdsKyjfzcsjInfo>>(
    `/code/code/code-base/zygky/ods-kyjfzcsj/unique/${zjsjwyxbs}`,
  );
  return response.data;
}

/**
 * 新增科研经费支出数据
 */
export async function addOdsKyjfzcsj(data: OdsKyjfzcsjForm) {
  const response = await request.post<ApiResponse<number>>(
    "/code/code/code-base/zygky/ods-kyjfzcsj/add",
    data,
  );
  return response.data;
}

/**
 * 修改科研经费支出数据
 */
export async function updateOdsKyjfzcsj(data: OdsKyjfzcsjForm) {
  const response = await request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-kyjfzcsj/update",
    data,
  );
  return response.data;
}

/**
 * 删除科研经费支出数据
 */
export async function deleteOdsKyjfzcsj(id: number) {
  const response = await request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygky/ods-kyjfzcsj/${id}`,
  );
  return response.data;
}

/**
 * 批量删除科研经费支出数据
 */
export async function batchDeleteOdsKyjfzcsj(ids: number[]) {
  const response = await request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-kyjfzcsj/batch",
    {
      data: ids,
    },
  );
  return response.data;
}

/**
 * 导出科研经费支出数据
 */
export function exportOdsKyjfzcsj(query: OdsKyjfzcsjQuery) {
  return request.post("/code/code/code-base/zygky/ods-kyjfzcsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典选项
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any>>(
    `/code/code/code-base-source/options/${dictType}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(`/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code`);
}

// 科研项目研究活动数据详情
export interface OdsKyxmyjhdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kyxmbh: string; // 科研项目编号
  kyxmmc: string; // 科研项目名称
  kyxmyjhdzt: string; // 科研项目研究活动主题
  kyxmyjhdnrjj: string; // 科研项目研究活动内容简介
  kyxmyjhdrq: string; // 科研项目研究活动日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
}
/**
 * 根据关键字搜索科研项目基本数据
 */
export function searchOdsKyxmjbsj(keyword: string) {
  return request.get<ApiResponse<OdsKyxmyjhdsjInfo[]>>(
    "/code/code/code-base/zygky/ods-kyxmjbsj/search",
    {
     keyword ,
    },
  );
}