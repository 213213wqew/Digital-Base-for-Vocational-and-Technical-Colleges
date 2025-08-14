import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学习进修数据接口
 */

// 学习进修数据表单数据
export interface OdsXxjxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jgh?: string; // 教工号
  jsxm?: string; // 教师姓名
  jxxxddm?: string; // 进修学习地点码
  jxpxbh?: string; // 进修培训编号
  jxpxmc?: string; // 进修培训名称
  jxpxzt?: string; // 进修培训主题
  jxpxnrjj?: string; // 进修培训内容简介
  jxpxzjrxm?: string; // 进修培训主讲人姓名
  jxpxksrq?: string; // 进修培训开始日期
  jxpxjzrq?: string; // 进修培训截止日期
  cgrq?: string; // 出国境日期
  cgmdm?: string; // 出国境目的码
  pcdw?: string; // 派出单位
  spdw?: string; // 审批单位
  sprq?: string; // 审批日期
  yhgrq?: string; // 应回国日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 学习进修数据详情
export interface OdsXxjxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  jxxxddm: string; // 进修学习地点码
  jxpxbh: string; // 进修培训编号
  jxpxmc: string; // 进修培训名称
  jxpxzt: string; // 进修培训主题
  jxpxnrjj: string; // 进修培训内容简介
  jxpxzjrxm: string; // 进修培训主讲人姓名
  jxpxksrq: string; // 进修培训开始日期
  jxpxjzrq: string; // 进修培训截止日期
  cgrq: string; // 出国境日期
  cgmdm: string; // 出国境目的码
  pcdw: string; // 派出单位
  spdw: string; // 审批单位
  sprq: string; // 审批日期
  yhgrq: string; // 应回国日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jxxxddmText?: string; // 进修学习地点名称
  cgmdmText?: string; // 出国境目的名称
}

// 学习进修数据查询参数
export interface OdsXxjxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  jgh?: string;
  jsxm?: string;
  jxpxmc?: string;
  jxpxzt?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  jxpxksrqStart?: string;
  jxpxksrqEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教师选择下拉框
export interface TeacherOption {
  value: string; // jgh
  label: string; // xm (jgh)
}

// 学习进修数据分页结果
export interface OdsXxjxsjPageResult {
  records: OdsXxjxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学习进修数据
 */
export function getOdsXxjxsjPage(query: OdsXxjxsjQuery) {
  return request.post<ApiResponse<OdsXxjxsjPageResult>>(
    "/data/data/data-base/zygjg/ods-xxjxsj/page",
    query,
  );
}

/**
 * 根据ID查询学习进修数据详情
 */
export function getOdsXxjxsjById(id: number) {
  return request.get<ApiResponse<OdsXxjxsjInfo>>(
    `/data/data/data-base/zygjg/ods-xxjxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学习进修数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXxjxsjInfo>>(
    `/data/data/data-base/zygjg/ods-xxjxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学习进修数据
 */
export function addOdsXxjxsj(data: OdsXxjxsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjg/ods-xxjxsj/add",
    data,
  );
}

/**
 * 修改学习进修数据
 */
export function updateOdsXxjxsj(data: OdsXxjxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-xxjxsj/update",
    data,
  );
}

/**
 * 删除学习进修数据
 */
export function deleteOdsXxjxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjg/ods-xxjxsj/${id}`,
  );
}

/**
 * 批量删除学习进修数据
 */
export function batchDeleteOdsXxjxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjg/ods-xxjxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学习进修数据
 */
export function exportOdsXxjxsj(query: OdsXxjxsjQuery) {
  return request.post("/data/data/data-base/zygjg/ods-xxjxsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统默认的学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}

/**
 * 根据关键字查询教师选项
 * @param keyword 关键字
 */
export function getTeacherOptions(keyword: string) {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }
  return request.get<ApiResponse<TeacherOption[]>>(
    `/data/data/data-base/zygjg/ods-jshxsj/js-options?${params.toString()}`
  );
}
