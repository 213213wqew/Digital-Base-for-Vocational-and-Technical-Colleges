import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生就业意向数据接口
 */

// 学生就业意向数据表单数据
export interface OdsXsjyyxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  zyh?: string; // 专业号
  jyyxm?: string; // 就业意向码
  jyyxsm?: string; // 就业意向说明
  yxsjgbm?: string; // 意向省机构编码
  yxsjgmc?: string; // 意向省机构名称
  yxshjgbm?: string; // 意向市机构编码
  yxshjgmc?: string; // 意向市机构名称
  jydwhym?: string; // 意向机构行业码
  yxdw?: string; // 意向单位名称
  yxlrsj?: string; // 意向录入时间
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
  bz?: string; // 备注
}

// 学生就业意向数据详情
export interface OdsXsjyyxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  zyh: string; // 专业号
  jyyxm: string; // 就业意向码
  jyyxsm: string; // 就业意向说明
  yxsjgbm: string; // 意向省机构编码
  yxsjgmc: string; // 意向省机构名称
  yxshjgbm: string; // 意向市机构编码
  yxshjgmc: string; // 意向市机构名称
  jydwhym: string; // 意向机构行业码
  yxdw: string; // 意向单位名称
  yxlrsj: string; // 意向录入时间
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jyyxmText?: string; // 就业意向名称
  jydwhymText?: string; // 意向机构行业名称
}

// 学生就业意向数据查询参数
export interface OdsXsjyyxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  zyh?: string;
  jyyxm?: string;
  yxdw?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生就业意向数据分页结果
export interface OdsXsjyyxsjPageResult {
  records: OdsXsjyyxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生就业意向数据
 */
export function getOdsXsjyyxsjPage(query: OdsXsjyyxsjQuery) {
  return request.post<ApiResponse<OdsXsjyyxsjPageResult>>(
    "/code/code/code-base/zygxs/ods-xsjyyxsj/page",
    query,
  );
}

/**
 * 根据ID查询学生就业意向数据详情
 */
export function getOdsXsjyyxsjById(id: number) {
  return request.get<ApiResponse<OdsXsjyyxsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsjyyxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生就业意向数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsjyyxsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsjyyxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生就业意向数据
 */
export function addOdsXsjyyxsj(data: OdsXsjyyxsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-xsjyyxsj/add",
    data,
  );
}

/**
 * 修改学生就业意向数据
 */
export function updateOdsXsjyyxsj(data: OdsXsjyyxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsjyyxsj/update",
    data,
  );
}

/**
 * 删除学生就业意向数据
 */
export function deleteOdsXsjyyxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-xsjyyxsj/${id}`,
  );
}

/**
 * 批量删除学生就业意向数据
 */
export function batchDeleteOdsXsjyyxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsjyyxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生就业意向数据
 */
export function exportOdsXsjyyxsj(query: OdsXsjyyxsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-xsjyyxsj/export", query, {
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
  zyh: string;
}
 /**
 * 获取学生综合信息选项列表（包含专业信息）
 * 从学生画像数据中获取学号、姓名、专业号、专业名称
 * @param keyword 搜索关键字（学号或姓名）
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{
    value: string;  // 学号作为选择值
    label: string;  // 学号 - 姓名
    xh: string;     // 学号
    xsxm: string;   // 学生姓名
    zyh: string;    // 专业号
    zymc: string;   // 专业名称
  }>>>(
    "/code/code/code-base/zygxs/ods-xshxsj/student/comprehensive-options",
    {
      keyword 
    }
  );
}