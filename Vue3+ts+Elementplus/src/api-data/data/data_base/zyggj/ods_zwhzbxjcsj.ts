import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 中外合作办学基础数据接口
 */

// 中外合作办学基础数据表单数据
export interface OdsZwhzbxjcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  hzbxlb?: string; // 合作办学类别
  hzbxmc?: string; // 合作办学机构/项目名称
  wfyxmc?: string; // 外方院校名称
  hzgjdm?: string; // 合作国家代码
  hzgjmc?: string; // 合作国家名称
  hzgjssdz?: string; // 合作国家所属大洲
  zsksnf?: string; // 招生开始年份
  zsjznf?: string; // 招生截止年份
  kbqs?: number; // 开办期数
  mqzsrs?: number; // 每期招生人数
  zxss?: number; // 在校生数
  kszys?: string; // 开设专业号
  kszymc?: string; // 开设专业名称
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
}

// 中外合作办学基础数据详情
export interface OdsZwhzbxjcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  hzbxlb: string; // 合作办学类别
  hzbxmc: string; // 合作办学机构/项目名称
  wfyxmc: string; // 外方院校名称
  hzgjdm: string; // 合作国家代码
  hzgjmc: string; // 合作国家名称
  hzgjssdz: string; // 合作国家所属大洲
  zsksnf: string; // 招生开始年份
  zsjznf: string; // 招生截止年份
  kbqs: number; // 开办期数
  mqzsrs: number; // 每期招生人数
  zxss: number; // 在校生数
  kszys: string; // 开设专业号
  kszymc: string; // 开设专业名称
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  hzbxlbText?: string; // 合作办学类别文本
  hzgjdmText?: string; // 合作国家代码文本
}

// 中外合作办学基础数据查询参数
export interface OdsZwhzbxjcsjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  hzbxlb?: string; // 合作办学类别
  hzbxmc?: string; // 合作办学机构/项目名称
  wfyxmc?: string; // 外方院校名称
  hzgjdm?: string; // 合作国家代码
  hzgjmc?: string; // 合作国家名称
  kszymc?: string; // 开设专业名称
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  pageNum: number;
  pageSize: number;
}

// 中外合作办学基础数据分页结果
export interface OdsZwhzbxjcsjPageResult {
  records: OdsZwhzbxjcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询中外合作办学基础数据
 */
export function getOdsZwhzbxjcsjPage(query: OdsZwhzbxjcsjQuery) {
  return request.post<ApiResponse<OdsZwhzbxjcsjPageResult>>(
    "/data/data/data-base/zyggj/ods-zwhzbxjcsj/page",
    query,
  );
}

/**
 * 根据ID查询中外合作办学基础数据详情
 */
export function getOdsZwhzbxjcsjById(id: number) {
  return request.get<ApiResponse<OdsZwhzbxjcsjInfo>>(
    `/data/data/data-base/zyggj/ods-zwhzbxjcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询中外合作办学基础数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZwhzbxjcsjInfo>>(
    `/data/data/data-base/zyggj/ods-zwhzbxjcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增中外合作办学基础数据
 */
export function addOdsZwhzbxjcsj(data: OdsZwhzbxjcsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zyggj/ods-zwhzbxjcsj/add",
    data,
  );
}

/**
 * 修改中外合作办学基础数据
 */
export function updateOdsZwhzbxjcsj(data: OdsZwhzbxjcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zyggj/ods-zwhzbxjcsj/update",
    data,
  );
}

/**
 * 删除中外合作办学基础数据
 */
export function deleteOdsZwhzbxjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zyggj/ods-zwhzbxjcsj/${id}`,
  );
}

/**
 * 批量删除中外合作办学基础数据
 */
export function batchDeleteOdsZwhzbxjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zyggj/ods-zwhzbxjcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出中外合作办学基础数据
 */
export function exportOdsZwhzbxjcsj(query: OdsZwhzbxjcsjQuery) {
  return request.post(
    "/data/data/data-base/zyggj/ods-zwhzbxjcsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典选项
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any[]>>(`/data/data/data-base-source/options/${dictType}`);
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
// 专业选项接口
export interface ZyOption {
  value: string; // 专业号
  label: string; // 专业名称
}

/**
 * 获取专业下拉选项列表
 */
export function getZyOptions(keyword?: string) {
  return request.get<ApiResponse<ZyOption[]>>(
    "/data/data/data-base/zygjx/ods-zyszsj/zy-options",
    {
      keyword 
    }
  );
}
