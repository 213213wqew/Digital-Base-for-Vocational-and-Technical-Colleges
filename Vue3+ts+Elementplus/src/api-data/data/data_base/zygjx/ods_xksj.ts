import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 巡课数据接口
 */

// 字典选项类型
export interface DictOption {
  label: string;
  value: string;
}

/**
 * 获取教师到课情况字典选项
 */
export function getTeacherAttendanceOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JSDKQKDM",
  );
}

/**
 * 获取课堂互动情况字典选项
 */
export function getClassInteractionOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/KTHDQKDM",
  );
}

/**
 * 获取教学条件字典选项
 */
export function getTeachingConditionOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JXTJZKDM",
  );
}

// 巡课数据表单数据
export interface OdsXksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  pkh?: string; // 排课号
  zc?: string; // 周次
  xqj?: string; // 星期几
  skjc?: string; // 上课节次
  ydxsrs?: number; // 应到学生人数
  sdxsrs?: number; // 实到学生人数
  jsdkqkm?: string; // 教师到课情况码
  kthdqkm?: string; // 课堂互动情况码
  xkr?: string; // 巡课人
  jxtjm?: string; // 教学条件码
  ycsm?: string; // 异常说明
  xksj?: string; // 巡课时间
  sjcjsj?: string; // 数据采集时间
}

// 巡课数据详情
export interface OdsXksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  pkh: string; // 排课号
  zc: string; // 周次
  xqj: string; // 星期几
  skjc: string; // 上课节次
  ydxsrs: number; // 应到学生人数
  sdxsrs: number; // 实到学生人数
  jsdkqkm: string; // 教师到课情况码
  kthdqkm: string; // 课堂互动情况码
  xkr: string; // 巡课人
  jxtjm: string; // 教学条件码
  ycsm: string; // 异常说明
  xksj: string; // 巡课时间
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jsdkqkmText?: string; // 教师到课情况文本
  kthdqkmText?: string; // 课堂互动情况文本
  jxtjmText?: string; // 教学条件文本
}

// 巡课数据查询参数
export interface OdsXksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  pkh?: string;
  zc?: string;
  xqj?: string;
  skjc?: string;
  jsdkqkm?: string;
  kthdqkm?: string;
  xkr?: string;
  jxtjm?: string;
  xksj?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 巡课数据分页结果
export interface OdsXksjPageResult {
  records: OdsXksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询巡课数据
 */
export function getOdsXksjPage(query: OdsXksjQuery) {
  return request.post<ApiResponse<OdsXksjPageResult>>(
    "/data/data/data-base/zygjx/ods-xksj/page",
    query,
  );
}

/**
 * 根据ID查询巡课数据详情
 */
export function getOdsXksjById(id: number) {
  return request.get<ApiResponse<OdsXksjInfo>>(
    `/data/data/data-base/zygjx/ods-xksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询巡课数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXksjInfo>>(
    `/data/data/data-base/zygjx/ods-xksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增巡课数据
 */
export function addOdsXksj(data: OdsXksjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygjx/ods-xksj/add",
    data,
  );
}

/**
 * 修改巡课数据
 */
export function updateOdsXksj(data: OdsXksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xksj/update",
    data,
  );
}

/**
 * 删除巡课数据
 */
export function deleteOdsXksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygjx/ods-xksj/${id}`,
  );
}

/**
 * 批量删除巡课数据
 */
export function batchDeleteOdsXksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygjx/ods-xksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出巡课数据
 */
export function exportOdsXksj(query: OdsXksjQuery) {
  return request.post("/data/data/data-base/zygjx/ods-xksj/export", query, {
    responseType: "blob",
  });
}

// 排课数据信息
export interface OdsPksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  pkh: string; // 排课号
  zc: string; // 周次
  xqj: string; // 星期几
  skjc: string; // 上课节次
  kcmc: string; // 课程名称
  jgh: string; // 教师工号
  jsxm: string; // 教师姓名
  bjmc: string; // 班级名称
  jsmc: string; // 教室名称
}

/**
 * 获取排课列表（用于巡课数据）
 */
export function getOdsPksjList(query: {
  pkh?: string;
  zc?: string;
  xqj?: string;
  skjc?: string;
}) {
  const queryString = new URLSearchParams(
    query as Record<string, string>,
  ).toString();
  return request.get<ApiResponse<OdsPksjInfo[]>>(
    `/data/data/data-base/zygjx/ods-pksj/list-for-xksj?${queryString}`,
  );
}
