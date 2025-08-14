import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生社会实践活动数据接口
 */

// 学生社会实践活动数据表单数据
export interface OdsXsshsjhdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  sjdw?: string; // 实践单位
  sjdd?: string; // 实践地点
  sjxm?: string; // 实践项目
  sjnr?: string; // 实践内容
  sjqsrq?: string; // 实践起始日期
  sjzzrq?: string; // 实践终止日期
  sjlbm?: string; // 实践类别码
  sjcg?: string; // 实践成果
  zdjsgh?: string; // 指导教师工号
  sjpj?: string; // 实践评价
  sjcjsj?: string; // 数据采集时间
}

// 学生社会实践活动数据详情
export interface OdsXsshsjhdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  sjdw: string; // 实践单位
  sjdd: string; // 实践地点
  sjxm: string; // 实践项目
  sjnr: string; // 实践内容
  sjqsrq: string; // 实践起始日期
  sjzzrq: string; // 实践终止日期
  sjlbm: string; // 实践类别码
  sjcg: string; // 实践成果
  zdjsgh: string; // 指导教师工号
  sjpj: string; // 实践评价
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sjlbmText?: string; // 实践类别名称
}

// 学生社会实践活动数据查询参数
export interface OdsXsshsjhdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  sjdw?: string;
  sjxm?: string;
  sjlbm?: string;
  zdjsgh?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生社会实践活动数据分页结果
export interface OdsXsshsjhdsjPageResult {
  records: OdsXsshsjhdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生社会实践活动数据
 */
export function getOdsXsshsjhdsjPage(query: OdsXsshsjhdsjQuery) {
  return request.post<ApiResponse<OdsXsshsjhdsjPageResult>>(
    "/code/code/code-base/zygxs/ods-xsshsjhdsj/page",
    query,
  );
}

/**
 * 根据ID查询学生社会实践活动数据详情
 */
export function getOdsXsshsjhdsjById(id: number) {
  return request.get<ApiResponse<OdsXsshsjhdsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsshsjhdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生社会实践活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsshsjhdsjInfo>>(
    `/code/code/code-base/zygxs/ods-xsshsjhdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生社会实践活动数据
 */
export function addOdsXsshsjhdsj(data: OdsXsshsjhdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-xsshsjhdsj/add",
    data,
  );
}

/**
 * 修改学生社会实践活动数据
 */
export function updateOdsXsshsjhdsj(data: OdsXsshsjhdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsshsjhdsj/update",
    data,
  );
}

/**
 * 删除学生社会实践活动数据
 */
export function deleteOdsXsshsjhdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-xsshsjhdsj/${id}`,
  );
}

/**
 * 批量删除学生社会实践活动数据
 */
export function batchDeleteOdsXsshsjhdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-xsshsjhdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生社会实践活动数据
 */
export function exportOdsXsshsjhdsj(query: OdsXsshsjhdsjQuery) {
  return request.post(
    "/code/code/code-base/zygxs/ods-xsshsjhdsj/export",
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
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

 /**
 * 获取字典数据 - 实践类别代码SJLBDM
 * @returns 字典选项列表
 */
export function getSjlbdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SJLBDM",
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
// 教师选择下拉框
export interface TeacherOption {
  value: string; // jgh
  label: string; // xm (jgh)
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
    `/code/code/code-base/zygjg/ods-jshxsj/js-options?${params.toString()}`
  );
}