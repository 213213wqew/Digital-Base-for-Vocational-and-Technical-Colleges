import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 社团（协会）基本数据接口
 */

// 社团（协会）基本数据表单数据
export interface OdsStxhjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  stbh?: string; // 社团编号
  stmc?: string; // 社团名称
  stlxm?: string; // 社团类型码
  stjj?: string; // 社团简介
  clrq?: string; // 成立日期
  gkdwmc?: string; // 挂靠单位名称
  stfzrh?: string; // 社团负责人号
  stfzrxm?: string; // 社团负责人姓名
  zdjsh?: string; // 指导教师工号
  zdjsxm?: string; // 指导教师姓名
  jsrq?: string; // 解散日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}
 // 教师基本信息接口（用于下拉选择）
export interface TeacherBasicInfo {
  jgh: string; // 教工号
  jsxm: string; // 教师姓名
  label: string; // 显示标签：教工号 - 教师姓名
  value: string; // 值：教工号
}
// 社团（协会）基本数据详情
export interface OdsStxhjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  stlxm: string; // 社团类型码
  stjj: string; // 社团简介
  clrq: string; // 成立日期
  gkdwmc: string; // 挂靠单位名称
  stfzrh: string; // 社团负责人号
  stfzrxm: string; // 社团负责人姓名
  zdjsh: string; // 指导教师工号
  zdjsxm: string; // 指导教师姓名
  jsrq: string; // 解散日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  stlxmText?: string; // 社团类型名称
}

// 社团（协会）基本数据查询参数
export interface OdsStxhjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  stbh?: string;
  stmc?: string;
  stlxm?: string;
  gkdwmc?: string;
  stfzrxm?: string;
  zdjsxm?: string;
  reportStatus?: string;
  enableStatus?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  clrqStart?: string;
  clrqEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 社团（协会）基本数据分页结果
export interface OdsStxhjbsjPageResult {
  records: OdsStxhjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询社团（协会）基本数据
 */
export function getOdsStxhjbsjPage(query: OdsStxhjbsjQuery) {
  return request.post<ApiResponse<OdsStxhjbsjPageResult>>(
    "/code/code/code-base/zygxs/ods-stxhjbsj/page",
    query,
  );
}

/**
 * 根据ID查询社团（协会）基本数据详情
 */
export function getOdsStxhjbsjById(id: number) {
  return request.get<ApiResponse<OdsStxhjbsjInfo>>(
    `/code/code/code-base/zygxs/ods-stxhjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询社团（协会）基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsStxhjbsjInfo>>(
    `/code/code/code-base/zygxs/ods-stxhjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增社团（协会）基本数据
 */
export function addOdsStxhjbsj(data: OdsStxhjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-stxhjbsj/add",
    data,
  );
}

/**
 * 修改社团（协会）基本数据
 */
export function updateOdsStxhjbsj(data: OdsStxhjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-stxhjbsj/update",
    data,
  );
}

/**
 * 删除社团（协会）基本数据
 */
export function deleteOdsStxhjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-stxhjbsj/${id}`,
  );
}

/**
 * 批量删除社团（协会）基本数据
 */
export function batchDeleteOdsStxhjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-stxhjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出社团（协会）基本数据
 */
export function exportOdsStxhjbsj(query: OdsStxhjbsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-stxhjbsj/export", query, {
    responseType: "blob",
  });
}
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
 
/**
 * 模糊搜索教师基本信息
 * 从教师画像数据表中获取教工号、教师姓名
 * @param keyword 搜索关键词（教工号或教师姓名）
 * @param limit 返回结果数量限制
 * @returns 教师基本信息列表
 */
export function searchTeachers(keyword?: string, limit: number = 50) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  // 注意：后端已经限制了50条，这里传limit只是为了保持接口一致性
  if (limit !== 50) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<TeacherBasicInfo[]>>(
    `/code/code/code-base/zygjg/ods-jshxsj/js-options?${params.toString()}`,
  );
}


// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取字典数据 - 认证方式 (RZFSDM)
 */
export function getAuthenticationModeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/STLXDM",
  );
}

// 社团（协会）下拉选择选项
export interface OdsStxhjbsjOption {
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  zdjsh: string; // 指导教师工号
  zdjsxm: string; // 指导教师姓名
  value: string; // 选择值（社团编号）
  label: string; // 显示标签（社团编号 - 社团名称 - 指导教师工号 - 指导教师姓名）
}

// 根据唯一性标识查询
export const getOdsStxhjbsjByUniqueId = (zjsjwyxbs: string): Promise<ApiResponse<OdsStxhjbsjInfo>> => {
  return request.get(`/code/code/code-base/zygxs/ods-stxhjbsj/unique/${zjsjwyxbs}`);
};

// 获取社团（协会）下拉选择选项
export const getStxhjbsjOptions = (keyword?: string): Promise<ApiResponse<OdsStxhjbsjOption[]>> => {
  return request.get('/code/code/code-base/zygxs/ods-stxhjbsj/options', {
    params: { keyword }
  });
};
 
