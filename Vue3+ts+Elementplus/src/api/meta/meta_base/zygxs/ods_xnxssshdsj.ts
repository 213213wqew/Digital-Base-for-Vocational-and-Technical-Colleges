import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 校内学生赛事活动数据接口
 */

// 校内学生赛事活动数据表单数据
export interface OdsXnxssshdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sshdbh?: string; // 赛事活动编号
  sshdmc?: string; // 赛事活动名称
  sshdlxm?: string; // 赛事活动类型码
  hdksrq?: string; // 活动开始日期
  hdjsrq?: string; // 活动结束日期
  cyjss?: number; // 参与教师数
  cyxss?: number; // 参与学生数
  sjcjsj?: string; // 数据采集时间
}

// 校内学生赛事活动数据详情
export interface OdsXnxssshdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sshdbh: string; // 赛事活动编号
  sshdmc: string; // 赛事活动名称
  sshdlxm: string; // 赛事活动类型码
  hdksrq: string; // 活动开始日期
  hdjsrq: string; // 活动结束日期
  cyjss: number; // 参与教师数
  cyxss: number; // 参与学生数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sshdlxmText?: string; // 赛事活动类型名称
}

// 校内学生赛事活动数据查询参数
export interface OdsXnxssshdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sshdbh?: string;
  sshdmc?: string;
  sshdlxm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 校内学生赛事活动数据分页结果
export interface OdsXnxssshdsjPageResult {
  records: OdsXnxssshdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询校内学生赛事活动数据
 */
export function getOdsXnxssshdsjPage(query: OdsXnxssshdsjQuery) {
  return request.post<ApiResponse<OdsXnxssshdsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-xnxssshdsj/page",
    query,
  );
}

/**
 * 根据ID查询校内学生赛事活动数据详情
 */
export function getOdsXnxssshdsjById(id: number) {
  return request.get<ApiResponse<OdsXnxssshdsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xnxssshdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询校内学生赛事活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXnxssshdsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xnxssshdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增校内学生赛事活动数据
 */
export function addOdsXnxssshdsj(data: OdsXnxssshdsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-xnxssshdsj/add",
    data,
  );
}

/**
 * 修改校内学生赛事活动数据
 */
export function updateOdsXnxssshdsj(data: OdsXnxssshdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xnxssshdsj/update",
    data,
  );
}

/**
 * 删除校内学生赛事活动数据
 */
export function deleteOdsXnxssshdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xnxssshdsj/${id}`,
  );
}

/**
 * 批量删除校内学生赛事活动数据
 */
export function batchDeleteOdsXnxssshdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xnxssshdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出校内学生赛事活动数据
 */
export function exportOdsXnxssshdsj(query: OdsXnxssshdsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygxs/ods-xnxssshdsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}
/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
 // 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取字典数据 - 赛事活动类型 (SSHDLXM)
 * @returns 字典选项列表
 */
export function getSshdlxmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SSHDLXDM",
  );
}