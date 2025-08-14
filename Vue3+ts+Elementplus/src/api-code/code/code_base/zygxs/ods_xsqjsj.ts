import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生请假数据接口
 */

// 学生请假数据表单数据
export interface OdsXsqjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  kkxnd?: string; // 开课学年度
  kkxqm?: string; // 开课学期码
  qjlx?: string; // 请假类型
  qjkssj?: string; // 请假开始时间
  qjjssj?: string; // 请假结束时间
  qjtjlx?: string; // 请假提交类型
  qjyy?: string; // 请假原因
  qjts?: number; // 请假天数
  spsj?: string; // 审批时间
  spr?: string; // 审批人
  sfcx?: string; // 是否出校
  sfxj?: string; // 是否销假
  xjsj?: string; // 销假时间
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
}

// 学生请假数据详情
export interface OdsXsqjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  qjlx: string; // 请假类型
  qjkssj: string; // 请假开始时间
  qjjssj: string; // 请假结束时间
  qjtjlx: string; // 请假提交类型
  qjyy: string; // 请假原因
  qjts: number; // 请假天数
  spsj: string; // 审批时间
  spr: string; // 审批人
  sfcx: string; // 是否出校
  sfxj: string; // 是否销假
  xjsj: string; // 销假时间
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kkxqmText?: string; // 开课学期名称
  qjlxText?: string; // 请假类型名称
  qjtjlxText?: string; // 请假提交类型名称
}

// 学生请假数据查询参数
export interface OdsXsqjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  kkxnd?: string;
  kkxqm?: string;
  qjlx?: string;
  qjtjlx?: string;
  spr?: string;
  sfcx?: string;
  sfxj?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生请假数据分页结果
export interface OdsXsqjsjPageResult {
  records: OdsXsqjsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生请假数据
 */
export function getOdsXsqjsjPage(query: OdsXsqjsjQuery) {
  return request.post<ApiResponse<OdsXsqjsjPageResult>>(
    "/code/code/code-base/zygxs/ods-xsqjsj/page",
    query,
  );
}

/**
 * 根据ID查询学生请假数据详情
 */
export function getOdsXsqjsjById(id: number) {
  return request.get<ApiResponse<OdsXsqjsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsqjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生请假数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsqjsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsqjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生请假数据
 */
export function addOdsXsqjsj(data: OdsXsqjsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-xsqjsj/add",
    data,
  );
}

/**
 * 修改学生请假数据
 */
export function updateOdsXsqjsj(data: OdsXsqjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsqjsj/update",
    data,
  );
}

/**
 * 删除学生请假数据
 */
export function deleteOdsXsqjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-xsqjsj/${id}`,
  );
}

/**
 * 批量删除学生请假数据
 */
export function batchDeleteOdsXsqjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsqjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生请假数据
 */
export function exportOdsXsqjsj(query: OdsXsqjsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-xsqjsj/export", query, {
    responseType: "blob",
  });
}

// 学生选项
export interface StudentOption {
  xh: string; // xh
  label: string; // xh - xsxm
  xsxm: string;
}

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
  code?: string;
}

/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<
    ApiResponse<Array<{ value: string; label: string; xsxm: string }>>
  >("/code/code/code-base/zygxs/ods-xshxsj/student/options", {
   keyword 
  });
}

/**
 * 获取开课学期码字典选项
 */
export function getXqdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/XQDM"
  );
}

/**
 * 获取请假类型字典选项
 */
export function getQjlxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/QJLXDM"
  );
}

/**
 * 获取请假提交类型字典选项
 */
export function getTjlxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/TJLXDM"
  );
}

/**
 * 获取是否标志字典选项
 */
export function getSfbzOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SFBZDM"
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
//教师选项
export interface TeacherOption {
  value: string; // jgh
  label: string; // xm (jgh)
}

/**
 * 获取教师下拉选项
 */
export function getTeacherOptions(keyword: string) {
  return request.get<ApiResponse<TeacherOption[]>>(
    "/code/code/code-base/zygjg/ods-jshxsj/js-options",
    {
    
        keyword,
      
    },
  );
}