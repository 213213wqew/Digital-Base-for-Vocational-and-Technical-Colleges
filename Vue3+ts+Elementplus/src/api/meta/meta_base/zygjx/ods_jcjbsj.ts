import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 教材基本数据接口
 */

// 教材基本数据表单数据
export interface OdsJcjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  cbh?: string; // 出版号
  jcbh?: string; // 教材编号
  jcmc?: string; // 教材名称
  jclxm?: string; // 教材类型码
  bc?: string; // 版次
  cbs?: string; // 出版社
  bzzzs?: number; // 编著者总数
  cbrq?: string; // 出版日期
  zz?: string; // 作者
  flh?: string; // 分类号
  dj?: number; // 定价
  sfgjghjc?: string; // 是否国家规划教材
  ghjcpc?: string; // 规划教材批次
  sfxqhzkfjc?: string; // 是否校企合作开发教材
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 教材基本数据详情
export interface OdsJcjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  cbh: string; // 出版号
  jcbh: string; // 教材编号
  jcmc: string; // 教材名称
  jclxm: string; // 教材类型码
  bc: string; // 版次
  cbs: string; // 出版社
  bzzzs: number; // 编著者总数
  cbrq: string; // 出版日期
  zz: string; // 作者
  flh: string; // 分类号
  dj: number; // 定价
  sfgjghjc: string; // 是否国家规划教材
  ghjcpc: string; // 规划教材批次
  sfxqhzkfjc: string; // 是否校企合作开发教材
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码名称
  jclxmText?: string; // 教材类型名称
  sfgjghjcText?: string; // 是否国家规划教材文本
  sfxqhzkfjcText?: string; // 是否校企合作开发教材文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 教材基本数据查询参数
export interface OdsJcjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jcbh?: string;
  jcmc?: string;
  jclxm?: string;
  cbs?: string;
  zz?: string;
  sfgjghjc?: string;
  sfxqhzkfjc?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教材基本数据分页结果
export interface OdsJcjbsjPageResult {
  records: OdsJcjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教材基本数据
 */
export function getOdsJcjbsjPage(query: OdsJcjbsjQuery) {
  return request.post<ApiResponse<OdsJcjbsjPageResult>>(
    "/api/meta/meta-base/zygjx/ods-jcjbsj/page",
    query,
  );
}

/**
 * 根据ID查询教材基本数据详情
 */
export function getOdsJcjbsjById(id: number) {
  return request.get<ApiResponse<OdsJcjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jcjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教材基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJcjbsjInfo>>(
    `/api/meta/meta-base/zygjx/ods-jcjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教材基本数据
 */
export function addOdsJcjbsj(data: OdsJcjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygjx/ods-jcjbsj/add",
    data,
  );
}

/**
 * 修改教材基本数据
 */
export function updateOdsJcjbsj(data: OdsJcjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jcjbsj/update",
    data,
  );
}

/**
 * 删除教材基本数据
 */
export function deleteOdsJcjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-jcjbsj/${id}`,
  );
}

/**
 * 批量删除教材基本数据
 */
export function batchDeleteOdsJcjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-jcjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教材基本数据
 */
export function exportOdsJcjbsj(query: OdsJcjbsjQuery) {
  return request.post("/api/meta/meta-base/zygjx/ods-jcjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取数字资源基本数据分页列表(用于下拉框选项)
 */
export function getSzzyjbsjPage(query?: any) {
  return request.post<ApiResponse<any>>(
    "/api/meta/meta-base/zygjx/ods-szzyjbsj/page",
    query || { pageNum: 1, pageSize: 50 }
  );
}

/**
 * 根据唯一性标识查询数字资源基本数据(用于获取字典选项)
 */
export function getSzzyjbsjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<any>>(
    `/api/meta/meta-base/zygjx/ods-szzyjbsj/unique/${zjsjwyxbs}`
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取教材基本数据下拉选项
 */
export function getOdsJcjbsjOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string; cbh: string }>>>(
    "/api/meta/meta-base/zygjx/ods-jcjbsj/options",
     { keyword } 
  );
}
