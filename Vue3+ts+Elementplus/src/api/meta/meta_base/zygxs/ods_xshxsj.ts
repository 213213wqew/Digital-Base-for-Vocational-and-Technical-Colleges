import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 学生画像数据接口
 */

// 学生画像数据表单数据
export interface OdsXshxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  sjkbfwcs?: number; // 数据看板访问次数
  pjwdjjg?: string; // 评价维度及结果
  sjscrq?: string; // 数据生成日期
  sjkbzxfwrq?: string; // 数据看板最新访问日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 学生画像数据详情
export interface OdsXshxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  sjkbfwcs: number; // 数据看板访问次数
  pjwdjjg: string; // 评价维度及结果
  sjscrq: string; // 数据生成日期
  sjkbzxfwrq: string; // 数据看板最新访问日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 学生画像数据查询参数
export interface OdsXshxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  sjscrqStart?: string;
  sjscrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生画像数据分页结果
export interface OdsXshxsjPageResult {
  records: OdsXshxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生画像数据
 */
export function getOdsXshxsjPage(query: OdsXshxsjQuery) {
  return request.post<ApiResponse<OdsXshxsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/page",
    query,
  );
}

/**
 * 根据ID查询学生画像数据详情
 */
export function getOdsXshxsjById(id: number) {
  return request.get<ApiResponse<OdsXshxsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xshxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生画像数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXshxsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xshxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生画像数据
 */
export function addOdsXshxsj(data: OdsXshxsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/add",
    data,
  );
}

/**
 * 修改学生画像数据
 */
export function updateOdsXshxsj(data: OdsXshxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/update",
    data,
  );
}

/**
 * 删除学生画像数据
 */
export function deleteOdsXshxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xshxsj/${id}`,
  );
}

/**
 * 批量删除学生画像数据
 */
export function batchDeleteOdsXshxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生画像数据
 */
export function exportOdsXshxsj(query: OdsXshxsjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-xshxsj/export", query, {
    responseType: "blob",
  });
}

// 专业选项接口
export interface ZyOption {
  value: string; // 专业号
  label: string; // 专业名称
}

/**
 * 获取专业下拉选项列表
 */
export function getZyOptions(keyword?: string) {
  return request.get<ApiResponse<ZyOption[]>>(
    "/api/meta/meta-base/zygjx/ods-zyszsj/zy-options",
    {
      keyword 
    }
  );
}
