import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生缺勤数据接口
 */

// 学生缺勤数据表单数据
export interface OdsXsqqsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  kkxnd?: string; // 开课学年度
  kkxqm?: string; // 开课学期码
  qqrq?: string; // 缺勤日期
  qqlx?: string; // 缺勤类型
  kqlx?: string; // 考勤类型
  qqyy?: string; // 缺勤原因
  spsj?: string; // 审批时间
  spr?: string; // 审批人
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
}

// 学生缺勤数据详情
export interface OdsXsqqsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  kkxnd: string; // 开课学年度
  kkxqm: string; // 开课学期码
  qqrq: string; // 缺勤日期
  qqlx: string; // 缺勤类型
  kqlx: string; // 考勤类型
  qqyy: string; // 缺勤原因
  spsj: string; // 审批时间
  spr: string; // 审批人
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kkxqmText?: string; // 开课学期名称
  qqlxText?: string; // 缺勤类型名称
  kqlxText?: string; // 考勤类型名称
}

// 学生缺勤数据查询参数
export interface OdsXsqqsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  kkxnd?: string;
  kkxqm?: string;
  qqlx?: string;
  kqlx?: string;
  spr?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生缺勤数据分页结果
export interface OdsXsqqsjPageResult {
  records: OdsXsqqsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生缺勤数据
 */
export function getOdsXsqqsjPage(query: OdsXsqqsjQuery) {
  return request.post<ApiResponse<OdsXsqqsjPageResult>>(
    "/code/code/code-base/zygxs/ods-xsqqsj/page",
    query,
  );
}

/**
 * 根据ID查询学生缺勤数据详情
 */
export function getOdsXsqqsjById(id: number) {
  return request.get<ApiResponse<OdsXsqqsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsqqsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生缺勤数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsqqsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsqqsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生缺勤数据
 */
export function addOdsXsqqsj(data: OdsXsqqsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-xsqqsj/add",
    data,
  );
}

/**
 * 修改学生缺勤数据
 */
export function updateOdsXsqqsj(data: OdsXsqqsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsqqsj/update",
    data,
  );
}

/**
 * 删除学生缺勤数据
 */
export function deleteOdsXsqqsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-xsqqsj/${id}`,
  );
}

/**
 * 批量删除学生缺勤数据
 */
export function batchDeleteOdsXsqqsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsqqsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生缺勤数据
 */
export function exportOdsXsqqsj(query: OdsXsqqsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-xsqqsj/export", query, {
    responseType: "blob",
  });
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

// 学生选项
export interface StudentOption {
  xh: string; // xh
  label: string; // xh - xsxm
  xsxm: string;
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
 * 获取字典选项
 * @param code 字典代码
 * @returns 字典选项列表
 */
export function getDictOptions(code: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    `/code/code/code-base-source/options/${code}`
  );
}

// 字典代码常量
export const DICT_CODES = {
  XQDM: 'XQDM', // 学期代码
  QQLXDM: 'QQLXDM', // 缺勤类型代码
  KQLXDM: 'KQLXDM', // 考勤类型代码
} as const;