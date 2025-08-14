import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生住宿查寝数据接口
 */

// 学生住宿查寝数据表单数据
export interface OdsXszscqsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  bjmc?: string; // 班级名称
  ssbh?: string; // 宿舍编号
  cqsj?: string; // 查寝时间
  cqr?: string; // 查寝人
  zqzt?: string; // 在寝状态
  qksm?: string; // 情况说明
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 学生住宿查寝数据详情
export interface OdsXszscqsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  bjmc: string; // 班级名称
  ssbh: string; // 宿舍编号
  cqsj: string; // 查寝时间
  cqr: string; // 查寝人
  zqzt: string; // 在寝状态
  qksm: string; // 情况说明
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime?: string;
  updateTime?: string;
}

// 查询参数
export interface OdsXszscqsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  bjmc?: string; // 班级名称
  ssbh?: string; // 宿舍编号
  cqr?: string; // 查寝人
  zqzt?: string; // 在寝状态
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum?: number;
  pageSize?: number;
}

// 学生住宿查寝数据分页结果
export interface OdsXszscqsjPageResult {
  records: OdsXszscqsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生住宿查寝数据
 */
export function getOdsXszscqsjPage(query: OdsXszscqsjQuery) {
  return request.post<ApiResponse<OdsXszscqsjPageResult>>(
    "/code/code/code-base/zygxs/ods-xszscqsj/page",
    query,
  );
}

/**
 * 根据ID查询学生住宿查寝数据详情
 */
export function getOdsXszscqsjById(id: number) {
  return request.get<ApiResponse<OdsXszscqsjInfo>>(
    `/code/code/code-base/zygxs/ods-xszscqsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生住宿查寝数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXszscqsjInfo>>(
    `/code/code/code-base/zygxs/ods-xszscqsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生住宿查寝数据
 */
export function addOdsXszscqsj(data: OdsXszscqsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-xszscqsj/add",
    data,
  );
}

/**
 * 修改学生住宿查寝数据
 */
export function updateOdsXszscqsj(data: OdsXszscqsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xszscqsj/update",
    data,
  );
}

/**
 * 删除学生住宿查寝数据
 */
export function deleteOdsXszscqsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-xszscqsj/${id}`,
  );
}

/**
 * 批量删除学生住宿查寝数据
 */
export function batchDeleteOdsXszscqsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xszscqsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生住宿查寝数据
 */
export function exportOdsXszscqsj(query: OdsXszscqsjQuery) {
  return request.post(
    "/code/code/code-base/zygxs/ods-xszscqsj/export",
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
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 获取字典数据 - 在寝状态代码ZQZTDM
 * @returns 字典选项列表
 */
export function getZqztdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/ZQZTDM",
  );
}

// 学生选项
export interface StudentOption {
  xh: string;
  label: string;
  xsxm: string;
  bjmc: string;
  ssbh: string;
}

/**
 * 获取学生信息选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<StudentOption[]>>(
    "/code/code/code-base/zygxs/ods-xshxsj/student/options",
    { params: { keyword } }
  );
}
 