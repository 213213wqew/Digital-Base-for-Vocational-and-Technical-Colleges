import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 党组织情况基础数据接口
 */

// 党组织情况基础数据表单数据
export interface OdsDzzqkjcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dzzlxm?: string; // 党组织类型码
  dzzmc?: string; // 党组织名称
  dzzbh?: string; // 党组织编号
  lssjdzzmc?: string; // 隶属上级党组织名称
  dnldxm?: string; // 党内领导姓名
  dnldjgh?: string; // 党内领导教工号
  dnldzwm?: string; // 党内领导职务码
  dzzdyrs?: number; // 党组织党员人数
  dzzzt?: string; // 党组织状态
  sjcjsj?: string; // 数据采集时间
}

// 党组织情况基础数据详情
export interface OdsDzzqkjcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzzlxm: string; // 党组织类型码
  dzzmc: string; // 党组织名称
  dzzbh: string; // 党组织编号
  lssjdzzmc: string; // 隶属上级党组织名称
  dnldxm: string; // 党内领导姓名
  dnldjgh: string; // 党内领导教工号
  dnldzwm: string; // 党内领导职务码
  dzzdyrs: number; // 党组织党员人数
  dzzzt: string; // 党组织状态
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  dzzlxmText?: string; // 党组织类型名称
  dnldzwmText?: string; // 党内领导职务名称
  dzzztText?: string; // 党组织状态名称
}

// 党组织情况基础数据查询参数
export interface OdsDzzqkjcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dzzlxm?: string;
  dzzmc?: string;
  dzzbh?: string;
  dnldxm?: string;
  dnldjgh?: string;
  dzzzt?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 党组织情况基础数据分页结果
export interface OdsDzzqkjcsjPageResult {
  records: OdsDzzqkjcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党组织情况基础数据
 */
export function getOdsDzzqkjcsjPage(query: OdsDzzqkjcsjQuery) {
  return request.post<ApiResponse<OdsDzzqkjcsjPageResult>>(
    "/code/code/code-base/zygdz/ods-dzzqkjcsj/page",
    query,
  );
}

/**
 * 根据ID查询党组织情况基础数据详情
 */
export function getOdsDzzqkjcsjById(id: number) {
  return request.get<ApiResponse<OdsDzzqkjcsjInfo>>(
    `/code/code/code-base/zygdz/ods-dzzqkjcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党组织情况基础数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDzzqkjcsjInfo>>(
    `/code/code/code-base/zygdz/ods-dzzqkjcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党组织情况基础数据
 */
export function addOdsDzzqkjcsj(data: OdsDzzqkjcsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygdz/ods-dzzqkjcsj/add",
    data,
  );
}

/**
 * 修改党组织情况基础数据
 */
export function updateOdsDzzqkjcsj(data: OdsDzzqkjcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dzzqkjcsj/update",
    data,
  );
}

/**
 * 删除党组织情况基础数据
 */
export function deleteOdsDzzqkjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygdz/ods-dzzqkjcsj/${id}`,
  );
}

/**
 * 批量删除党组织情况基础数据
 */
export function batchDeleteOdsDzzqkjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dzzqkjcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党组织情况基础数据
 */
export function exportOdsDzzqkjcsj(query: OdsDzzqkjcsjQuery) {
  return request.post("/code/code/code-base/zygdz/ods-dzzqkjcsj/export", query, {
    responseType: "blob",
  });
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}
//党组织类型码字典
export function getDzzlxmDict() {
  return request.get<ApiResponse<DictOption[]>>("/code/code/code-base-source/options/DZZLXDM");
}
//党组织状态码字典
export function getDzzztDict() {
  return request.get<ApiResponse<DictOption[]>>("/code/code/code-base-source/options/DZZZTDM");
}
//党内领导职务码字典
export function getDnldzwmDict() {
  return request.get<ApiResponse<DictOption[]>>("/code/code/code-base-source/options/DNLDRYZWDM");
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