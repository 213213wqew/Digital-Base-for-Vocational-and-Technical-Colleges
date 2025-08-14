import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 期刊基本数据接口
 */

// 中国语种字典选项
export interface DictOption {
  value: string;
  label: string;
}

// 期刊基本数据表单数据
export interface OdsQkjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  qkbh?: string; // 期刊编号
  qktxm?: string; // 期刊条形码
  qkzwmc?: string; // 期刊中文名称
  qkywmc?: string; // 期刊英文名称
  qkcbh?: string; // 期刊出版号
  bjb?: string; // 编辑部
  zb?: string; // 主编
  mqdj?: number; // 每期单价
  ckny?: string; // 创刊年月
  nh?: string; // 年号
  jh?: string; // 卷号
  qh?: string; // 期号
  zqh?: string; // 总期号
  flh?: string; // 分类号
  zgyzm?: string; // 中国语种码
  sjcjsj?: string; // 数据采集时间
}

// 期刊基本数据详情
export interface OdsQkjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  qkbh: string; // 期刊编号
  qktxm: string; // 期刊条形码
  qkzwmc: string; // 期刊中文名称
  qkywmc: string; // 期刊英文名称
  qkcbh: string; // 期刊出版号
  bjb: string; // 编辑部
  zb: string; // 主编
  mqdj: number; // 每期单价
  ckny: string; // 创刊年月
  nh: string; // 年号
  jh: string; // 卷号
  qh: string; // 期号
  zqh: string; // 总期号
  flh: string; // 分类号
  zgyzm: string; // 中国语种码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zgyzmText?: string; // 中国语种名称
}

// 期刊基本数据查询参数
export interface OdsQkjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  qkbh?: string;
  qktxm?: string;
  qkzwmc?: string;
  qkywmc?: string;
  qkcbh?: string;
  bjb?: string;
  zb?: string;
  ckny?: string;
  nh?: string;
  jh?: string;
  qh?: string;
  zqh?: string;
  flh?: string;
  zgyzm?: string;
  cknyStart?: string;
  cknyEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 期刊基本数据分页结果
export interface OdsQkjbsjPageResult {
  records: OdsQkjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询期刊基本数据
 */
export function getOdsQkjbsjPage(query: OdsQkjbsjQuery) {
  return request.post<ApiResponse<OdsQkjbsjPageResult>>(
    "/code/code/code-base/zygzc/ods-qkjbsj/page",
    query,
  );
}

/**
 * 根据ID查询期刊基本数据详情
 */
export function getOdsQkjbsjById(id: number) {
  return request.get<ApiResponse<OdsQkjbsjInfo>>(
    `/code/code/code-base/zygzc/ods-qkjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询期刊基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsQkjbsjInfo>>(
    `/code/code/code-base/zygzc/ods-qkjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增期刊基本数据
 */
export function addOdsQkjbsj(data: OdsQkjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygzc/ods-qkjbsj/add",
    data,
  );
}

/**
 * 修改期刊基本数据
 */
export function updateOdsQkjbsj(data: OdsQkjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygzc/ods-qkjbsj/update",
    data,
  );
}

/**
 * 删除期刊基本数据
 */
export function deleteOdsQkjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygzc/ods-qkjbsj/${id}`,
  );
}

/**
 * 批量删除期刊基本数据
 */
export function batchDeleteOdsQkjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygzc/ods-qkjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出期刊基本数据
 */
export function exportOdsQkjbsj(query: OdsQkjbsjQuery) {
  return request.post("/code/code/code-base/zygzc/ods-qkjbsj/export", query, {
    responseType: "blob",
  });
}


/**
 * 获取字典选项
 * @param dictType 字典类型
 * @returns 字典选项列表
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/code/code/code-base-source/options/${dictType}`
  );
}

/**
 * 获取系统默认的学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}
