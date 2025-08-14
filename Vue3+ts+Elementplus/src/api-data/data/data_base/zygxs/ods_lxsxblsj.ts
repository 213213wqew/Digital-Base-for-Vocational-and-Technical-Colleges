import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 离校手续办理数据接口
 */

// 离校手续办理数据表单数据
export interface OdsLxsxblsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  jfqkqrrq?: string; // 结费情况确认日期
  xfqrrq?: string; // 学分确认日期
  tsghqrrq?: string; // 图书归还确认日期
  sstsqrrq?: string; // 宿舍退宿确认日期
  byzlqrq?: string; // 毕业证领取日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 离校手续办理数据详情
export interface OdsLxsxblsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  jfqkqrrq: string; // 结费情况确认日期
  xfqrrq: string; // 学分确认日期
  tsghqrrq: string; // 图书归还确认日期
  sstsqrrq: string; // 宿舍退宿确认日期
  byzlqrq: string; // 毕业证领取日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
}

// 离校手续办理数据查询参数
export interface OdsLxsxblsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  jfqkqrrqStart?: string;
  jfqkqrrqEnd?: string;
  xfqrrqStart?: string;
  xfqrrqEnd?: string;
  tsghqrrqStart?: string;
  tsghqrrqEnd?: string;
  sstsqrrqStart?: string;
  sstsqrrqEnd?: string;
  byzlqrqStart?: string;
  byzlqrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 离校手续办理数据分页结果
export interface OdsLxsxblsjPageResult {
  records: OdsLxsxblsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询离校手续办理数据
 */
export function getOdsLxsxblsjPage(query: OdsLxsxblsjQuery) {
  return request.post<ApiResponse<OdsLxsxblsjPageResult>>(
    "/data/data/data-base/zygxs/ods-lxsxblsj/page",
    query,
  );
}

/**
 * 根据ID查询离校手续办理数据详情
 */
export function getOdsLxsxblsjById(id: number) {
  return request.get<ApiResponse<OdsLxsxblsjInfo>>(
    `/data/data/data-base/zygxs/ods-lxsxblsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询离校手续办理数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsLxsxblsjInfo>>(
    `/data/data/data-base/zygxs/ods-lxsxblsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增离校手续办理数据
 */
export function addOdsLxsxblsj(data: OdsLxsxblsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygxs/ods-lxsxblsj/add",
    data,
  );
}

/**
 * 修改离校手续办理数据
 */
export function updateOdsLxsxblsj(data: OdsLxsxblsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-lxsxblsj/update",
    data,
  );
}

/**
 * 删除离校手续办理数据
 */
export function deleteOdsLxsxblsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygxs/ods-lxsxblsj/${id}`,
  );
}

/**
 * 批量删除离校手续办理数据
 */
export function batchDeleteOdsLxsxblsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-lxsxblsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出离校手续办理数据
 */
export function exportOdsLxsxblsj(query: OdsLxsxblsjQuery) {
  return request.post("/data/data/data-base/zygxs/ods-lxsxblsj/export", query, {
    responseType: "blob",
  });
}
//学校代码
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    `/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code`,
  );
}
/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<
    ApiResponse<Array<{ value: string; label: string; xsxm: string }>>
  >("/data/data/data-base/zygxs/ods-xshxsj/student/options", {
   keyword 
  });
}