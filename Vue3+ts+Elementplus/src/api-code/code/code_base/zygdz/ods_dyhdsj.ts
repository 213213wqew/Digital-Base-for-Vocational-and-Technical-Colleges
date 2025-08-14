import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 党员活动数据接口
 */

// 党员活动数据表单数据
export interface OdsDyhdsjForm {
  id?: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzzmc: string; // 党组织名称
  dzzbh: string; // 党组织编号
  hdxs: string; // 活动形式
  hdxsText?: string; // 活动形式显示文本
  hddd: string; // 活动地点
  hdnr: string; // 活动内容
  hdksrq: string; // 活动开始日期
  hdjsrq: string; // 活动结束日期
  cyxss: number; // 参与学生数
  cyjss: number; // 参与教师数
  sjcjsj: string; // 数据采集时间
  enableStatus: string; // 启用状态
  reportStatus: string; // 上报状态
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

// 党员活动数据详情
export interface OdsDyhdsjInfo extends OdsDyhdsjForm {
  id: number;
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校名称
  hdxsText?: string; // 活动形式名称
}

// 党员活动数据查询参数
export interface OdsDyhdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dzzmc?: string;
  dzzbh?: string;
  hdxs?: string;
  hddd?: string;
  hdksrqStart?: string;
  hdksrqEnd?: string;
  hdjsrqStart?: string;
  hdjsrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 党员活动数据分页结果
export interface OdsDyhdsjPageResult {
  records: OdsDyhdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党员活动数据
 */
export function getOdsDyhdsjPage(query: OdsDyhdsjQuery) {
  return request.post<ApiResponse<OdsDyhdsjPageResult>>(
    "/code/code/code-base/zygdz/ods-dyhdsj/page",
    query,
  );
}

/**
 * 根据ID查询党员活动数据详情
 */
export function getOdsDyhdsjById(id: number) {
  return request.get<ApiResponse<OdsDyhdsjInfo>>(
    `/code/code/code-base/zygdz/ods-dyhdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党员活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDyhdsjInfo>>(
    `/code/code/code-base/zygdz/ods-dyhdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党员活动数据
 */
export function addOdsDyhdsj(data: OdsDyhdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygdz/ods-dyhdsj/add",
    data,
  );
}

/**
 * 修改党员活动数据
 */
export function updateOdsDyhdsj(data: OdsDyhdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dyhdsj/update",
    data,
  );
}

/**
 * 删除党员活动数据
 */
export function deleteOdsDyhdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygdz/ods-dyhdsj/${id}`,
  );
}

/**
 * 批量删除党员活动数据
 */
export function batchDeleteOdsDyhdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dyhdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党员活动数据
 */
export function exportOdsDyhdsj(query: OdsDyhdsjQuery) {
  return request.post("/code/code/code-base/zygdz/ods-dyhdsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/code/code/code-base-source/options/${dictType}`,
  );
}

/**
 * 党组织信息选项
 */
export interface OrgOption {
  value: string; // 党组织编号
  label: string; // 党组织名称
  dzzlxm: string; // 党组织类型码
}

/**
 * 模糊查询党组织信息
 * @param keyword 搜索关键字
 */
export function searchOrgInfo(keyword?: string) {
  return request.get<ApiResponse<OrgOption[]>>(
    '/code/code/code-base/zygdz/ods-dzzqkjcsj/search-org-info',
    {
      keyword 
    }
  );
}