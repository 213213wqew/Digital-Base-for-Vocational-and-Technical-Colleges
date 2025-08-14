import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 科研项目基本数据接口
 */

// 科研项目基本数据表单数据
export interface OdsKyxmjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kyxmbh?: string; // 科研项目编号
  kyxmmc?: string; // 科研项目名称
  kyxmlbm?: string; // 科研项目类别码
  kyxmzt?: string; // 科研项目主题
  kyxmnrjj?: string; // 科研项目内容简介
  ktrq?: string; // 开题日期
  sbrq?: string; // 申报日期
  lxrq?: string; // 立项日期
  jxrq?: string; // 结项日期
  kyxmfzr?: string; // 科研项目负责人
  xmlxjf?: number; // 项目立项经费
  cyxss?: number; // 参与学生数
  cyjss?: number; // 参与教师数
  sjcjsj?: string; // 数据采集时间
}

// 科研项目基本数据详情
export interface OdsKyxmjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kyxmbh: string; // 科研项目编号
  kyxmmc: string; // 科研项目名称
  kyxmlbm: string; // 科研项目类别码
  kyxmzt: string; // 科研项目主题
  kyxmnrjj: string; // 科研项目内容简介
  ktrq: string; // 开题日期
  sbrq: string; // 申报日期
  lxrq: string; // 立项日期
  jxrq: string; // 结项日期
  kyxmfzr: string; // 科研项目负责人
  xmlxjf: number; // 项目立项经费
  cyxss: number; // 参与学生数
  cyjss: number; // 参与教师数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  kyxmlbmText?: string; // 科研项目类别名称
}

// 科研项目基本数据查询参数
export interface OdsKyxmjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kyxmbh?: string;
  kyxmmc?: string;
  kyxmlbm?: string;
  kyxmfzr?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 科研项目基本数据分页结果
export interface OdsKyxmjbsjPageResult {
  records: OdsKyxmjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 字典选项接口
 */
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 分页查询科研项目基本数据
 */
export function getOdsKyxmjbsjPage(query: OdsKyxmjbsjQuery) {
  return request.post<ApiResponse<OdsKyxmjbsjPageResult>>(
    "/data/data/data-base/zygky/ods-kyxmjbsj/page",
    query,
  );
}

/**
 * 根据ID查询科研项目基本数据详情
 */
export function getOdsKyxmjbsjById(id: number) {
  return request.get<ApiResponse<OdsKyxmjbsjInfo>>(
    `/data/data/data-base/zygky/ods-kyxmjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询科研项目基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKyxmjbsjInfo>>(
    `/data/data/data-base/zygky/ods-kyxmjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增科研项目基本数据
 */
export function addOdsKyxmjbsj(data: OdsKyxmjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygky/ods-kyxmjbsj/add",
    data,
  );
}

/**
 * 修改科研项目基本数据
 */
export function updateOdsKyxmjbsj(data: OdsKyxmjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygky/ods-kyxmjbsj/update",
    data,
  );
}

/**
 * 删除科研项目基本数据
 */
export function deleteOdsKyxmjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygky/ods-kyxmjbsj/${id}`,
  );
}

/**
 * 批量删除科研项目基本数据
 */
export function batchDeleteOdsKyxmjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygky/ods-kyxmjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出科研项目基本数据
 */
export function exportOdsKyxmjbsj(query: OdsKyxmjbsjQuery) {
  return request.post("/data/data/data-base/zygky/ods-kyxmjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/data/data/data-base-source/options/${dictType}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
