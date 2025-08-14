import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/types/api.ts";
import type { AxiosResponse } from "axios";

/**
 * 培养方案数据接口
 */

// 培养方案数据表单数据
export interface OdsPyfasjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jhnj?: string; // 计划年级
  zyh?: string; // 专业号
  zxfyq?: number; // 总学分要求
  zxsyq?: number; // 总学时要求
  jlny?: string; // 建立年月
  pymb?: string; // 培养目标
  yqdzsmc?: string; // 应取得证书名称
  bxxf?: number; // 必修学分
  bxxs?: number; // 必修学时
  xxxf?: number; // 限选学分
  xxxs?: number; // 限选学时
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 培养方案数据详情
export interface OdsPyfasjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jhnj: string; // 计划年级
  zyh: string; // 专业号
  zxfyq: number; // 总学分要求
  zxsyq: number; // 总学时要求
  jlny: string; // 建立年月
  pymb: string; // 培养目标
  yqdzsmc: string; // 应取得证书名称
  bxxf: number; // 必修学分
  bxxs: number; // 必修学时
  xxxf: number; // 限选学分
  xxxs: number; // 限选学时
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  statusLoading?: boolean; // 状态加载状态
}

// 培养方案数据查询参数
export interface OdsPyfasjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jhnj?: string;
  zyh?: string;
  jlny?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 培养方案数据分页结果
export interface OdsPyfasjPageResult {
  records: OdsPyfasjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询培养方案数据
 */
export function getOdsPyfasjPage(query: OdsPyfasjQuery) {
  return request.post<ApiResponse<OdsPyfasjPageResult>>(
    "/code/code/code-base/zygjx/ods-pyfasj/page",
    query,
  );
}

/**
 * 根据ID查询培养方案数据详情
 */
export function getOdsPyfasjById(id: number) {
  return request.get<ApiResponse<OdsPyfasjInfo>>(
    `/code/code/code-base/zygjx/ods-pyfasj/${id}`,
  );
}

/**
 * 根据唯一性标识查询培养方案数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsPyfasjInfo>>(
    `/code/code/code-base/zygjx/ods-pyfasj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增培养方案数据
 */
export function addOdsPyfasj(data: OdsPyfasjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-pyfasj/add",
    data,
  );
}

/**
 * 修改培养方案数据
 */
export function updateOdsPyfasj(data: OdsPyfasjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-pyfasj/update",
    data,
  );
}

/**
 * 删除培养方案数据
 */
export function deleteOdsPyfasj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-pyfasj/${id}`,
  );
}

/**
 * 批量删除培养方案数据
 */
export function batchDeleteOdsPyfasj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-pyfasj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出培养方案数据
 */
export function exportOdsPyfasj(query: OdsPyfasjQuery) {
  return request.post("/code/code/code-base/zygjx/ods-pyfasj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 * @returns Promise<ApiResponse<string>>
 */
export function getSystemSchoolCode(): Promise<ApiResponse<string>> {
  return request.get(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

export interface ZyOption {
  zyh: string;
  zymc: string;
  zysysxbmc: string;
  label: string;
}

/**
 * 获取专业号列表
 * @param keyword 搜索关键字
 * @returns Promise<ApiResponse<ZyOption[]>>
 */
export function getMajorList(
  keyword?: string,
): Promise<ApiResponse<ZyOption[]>> {
  return request.get("/code/code/code-base/zygjx/ods-zyszsj/zy-options", {
    keyword,
  });
}
