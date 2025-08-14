import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 科研项目研究活动数据接口
 */

// 科研项目研究活动数据表单数据
export interface OdsKyxmyjhdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kyxmbh?: string; // 科研项目编号
  kyxmmc?: string; // 科研项目名称
  kyxmyjhdzt?: string; // 科研项目研究活动主题
  kyxmyjhdnrjj?: string; // 科研项目研究活动内容简介
  kyxmyjhdrq?: string; // 科研项目研究活动日期
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
  reportStatus?: string; // 上报状态
  createTime?: string;
  updateTime?: string;
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

// 科研项目研究活动数据查询参数
export interface OdsKyxmyjhdsjQuery {
  kyxmbh?: string;
  kyxmmc?: string;
  kyxmyjhdzt?: string;
  pageNum: number;
  pageSize: number;
}

// 科研项目研究活动数据分页结果
export interface OdsKyxmyjhdsjPageResult {
  records: OdsKyxmyjhdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询科研项目研究活动数据
 */
export function getOdsKyxmyjhdsjPage(query: OdsKyxmyjhdsjQuery) {
  return request.post<ApiResponse<OdsKyxmyjhdsjPageResult>>(
    "/code/code/code-base/zygky/ods-kyxmyjhdsj/page",
    query,
  );
}

/**
 * 根据ID查询科研项目研究活动数据详情
 */
export function getOdsKyxmyjhdsjById(id: number) {
  return request.get<ApiResponse<OdsKyxmyjhdsjInfo>>(
    `/code/code/code-base/zygky/ods-kyxmyjhdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询科研项目研究活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKyxmyjhdsjInfo>>(
    `/code/code/code-base/zygky/ods-kyxmyjhdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增科研项目研究活动数据
 */
export function addOdsKyxmyjhdsj(data: OdsKyxmyjhdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygky/ods-kyxmyjhdsj/add",
    data,
  );
}

/**
 * 修改科研项目研究活动数据
 */
export function updateOdsKyxmyjhdsj(data: OdsKyxmyjhdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-kyxmyjhdsj/update",
    data,
  );
}

/**
 * 删除科研项目研究活动数据
 */
export function deleteOdsKyxmyjhdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygky/ods-kyxmyjhdsj/${id}`,
  );
}

/**
 * 批量删除科研项目研究活动数据
 */
export function batchDeleteOdsKyxmyjhdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-kyxmyjhdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出科研项目研究活动数据
 */
export function exportOdsKyxmyjhdsj(query: OdsKyxmyjhdsjQuery) {
  return request.post(
    "/code/code/code-base/zygky/ods-kyxmyjhdsj/export",
    query,
    {
      responseType: "blob",
    },
  );
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


/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
