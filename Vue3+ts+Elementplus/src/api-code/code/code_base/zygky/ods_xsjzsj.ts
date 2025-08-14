import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学术讲座数据接口
 */

// 学术讲座数据表单数据
export interface OdsXsjzsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xsjzbh?: string; // 学术讲座编号
  xsjzzt?: string; // 学术讲座主题
  xsjznrjj?: string; // 学术讲座内容简介
  xsjzrq?: string; // 学术讲座日期
  zjrxm?: string; // 主讲人姓名
  cyxss?: number; // 参与学生数
  cyjss?: number; // 参与教师数
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 学术讲座数据详情
export interface OdsXsjzsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xsjzbh: string; // 学术讲座编号
  xsjzzt: string; // 学术讲座主题
  xsjznrjj: string; // 学术讲座内容简介
  xsjzrq: string; // 学术讲座日期
  zjrxm: string; // 主讲人姓名
  cyxss: number; // 参与学生数
  cyjss: number; // 参与教师数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 学术讲座数据查询参数
export interface OdsXsjzsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xsjzbh?: string;
  xsjzzt?: string;
  zjrxm?: string;
  xsjzrqStart?: string;
  xsjzrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 学术讲座数据分页结果
export interface OdsXsjzsjPageResult {
  records: OdsXsjzsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学术讲座数据
 */
export function getOdsXsjzsjPage(query: OdsXsjzsjQuery) {
  return request.post<ApiResponse<OdsXsjzsjPageResult>>(
    "/code/code/code-base/zygky/ods-xsjzsj/page",
    query,
  );
}

/**
 * 根据ID查询学术讲座数据详情
 */
export function getOdsXsjzsjById(id: number) {
  return request.get<ApiResponse<OdsXsjzsjInfo>>(
    `/code/code/code-base/zygky/ods-xsjzsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学术讲座数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsjzsjInfo>>(
    `/code/code/code-base/zygky/ods-xsjzsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学术讲座数据
 */
export function addOdsXsjzsj(data: OdsXsjzsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygky/ods-xsjzsj/add",
    data,
  );
}

/**
 * 修改学术讲座数据
 */
export function updateOdsXsjzsj(data: OdsXsjzsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-xsjzsj/update",
    data,
  );
}

/**
 * 删除学术讲座数据
 */
export function deleteOdsXsjzsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygky/ods-xsjzsj/${id}`,
  );
}

/**
 * 批量删除学术讲座数据
 */
export function batchDeleteOdsXsjzsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygky/ods-xsjzsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学术讲座数据
 */
export function exportOdsXsjzsj(query: OdsXsjzsjQuery) {
  return request.post("/code/code/code-base/zygky/ods-xsjzsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}

/**
 * 获取字典选项
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any[]>>(
    `/code/code/code-base-source/options/${dictType}`,
  );
}
