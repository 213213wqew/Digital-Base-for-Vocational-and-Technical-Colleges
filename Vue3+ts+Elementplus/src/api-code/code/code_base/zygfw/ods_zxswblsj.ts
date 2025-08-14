import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 在线事务办理数据接口
 */

// 在线事务办理数据表单数据
export interface OdsZxswblsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  bsswmc?: string; // 办事事务名称
  bsswlxm?: string; // 办事事务类型码
  rylxm?: string; // 人员类型码
  sqsj?: string; // 申请时间
  swblr?: string; // 事务申请人
  blsj?: string; // 办理时间
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 在线事务办理数据详情
export interface OdsZxswblsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  bsswmc: string; // 办事事务名称
  bsswlxm: string; // 办事事务类型码
  rylxm: string; // 人员类型码
  sqsj: string; // 申请时间
  swblr: string; // 事务申请人
  blsj: string; // 办理时间
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  bsswlxmText?: string; // 办事事务类型名称
  rylxmText?: string; // 人员类型名称
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 在线事务办理数据查询参数
export interface OdsZxswblsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  bsswmc?: string;
  bsswlxm?: string;
  rylxm?: string;
  swblr?: string;
  sqsjStart?: string;
  sqsjEnd?: string;
  blsjStart?: string;
  blsjEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 在线事务办理数据分页结果
export interface OdsZxswblsjPageResult {
  records: OdsZxswblsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询在线事务办理数据
 */
export function getOdsZxswblsjPage(query: OdsZxswblsjQuery) {
  return request.post<ApiResponse<OdsZxswblsjPageResult>>(
    "/code/code/code-base/zygfw/ods-zxswblsj/page",
    query,
  );
}

/**
 * 根据ID查询在线事务办理数据详情
 */
export function getOdsZxswblsjById(id: number) {
  return request.get<ApiResponse<OdsZxswblsjInfo>>(
    `/code/code/code-base/zygfw/ods-zxswblsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询在线事务办理数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZxswblsjInfo>>(
    `/code/code/code-base/zygfw/ods-zxswblsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增在线事务办理数据
 */
export function addOdsZxswblsj(data: OdsZxswblsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygfw/ods-zxswblsj/add",
    data,
  );
}

/**
 * 修改在线事务办理数据
 */
export function updateOdsZxswblsj(data: OdsZxswblsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-zxswblsj/update",
    data,
  );
}

/**
 * 删除在线事务办理数据
 */
export function deleteOdsZxswblsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygfw/ods-zxswblsj/${id}`,
  );
}

/**
 * 批量删除在线事务办理数据
 */
export function batchDeleteOdsZxswblsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygfw/ods-zxswblsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出在线事务办理数据
 */
export function exportOdsZxswblsj(query: OdsZxswblsjQuery) {
  return request.post("/code/code/code-base/zygfw/ods-zxswblsj/export", query, {
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
  return request.get<ApiResponse<any[]>>(`/code/code/code-base-source/options/${dictType}`);
}
