import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 数据标准与信息系统映射关系数据接口
 */

// 数据标准与信息系统映射关系数据表单数据
export interface OdsSjbzyxxxtysgxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  sjzlywmc?: string; // 数据子类英文名称
  sjzlzwmc?: string; // 数据子类中文名称
  xxhxtbh?: string; // 信息化系统编号
  xxhxtqc?: string; // 信息化系统全称
  sjcjsj?: string; // 数据采集时间
}

// 数据标准与信息系统映射关系数据详情
export interface OdsSjbzyxxxtysgxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  sjzlywmc: string; // 数据子类英文名称
  sjzlzwmc: string; // 数据子类中文名称
  xxhxtbh: string; // 信息化系统编号
  xxhxtqc: string; // 信息化系统全称
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
}

// 数据标准与信息系统映射关系数据查询参数
export interface OdsSjbzyxxxtysgxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  sjzlywmc?: string;
  sjzlzwmc?: string;
  xxhxtbh?: string;
  xxhxtqc?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 数据标准与信息系统映射关系数据分页结果
export interface OdsSjbzyxxxtysgxsjPageResult {
  records: OdsSjbzyxxxtysgxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询数据标准与信息系统映射关系数据
 */
export function getOdsSjbzyxxxtysgxsjPage(query: OdsSjbzyxxxtysgxsjQuery) {
  return request.post<ApiResponse<OdsSjbzyxxxtysgxsjPageResult>>(
    "/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/page",
    query,
  );
}

/**
 * 根据ID查询数据标准与信息系统映射关系数据详情
 */
export function getOdsSjbzyxxxtysgxsjById(id: number) {
  return request.get<ApiResponse<OdsSjbzyxxxtysgxsjInfo>>(
    `/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询数据标准与信息系统映射关系数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSjbzyxxxtysgxsjInfo>>(
    `/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增数据标准与信息系统映射关系数据
 */
export function addOdsSjbzyxxxtysgxsj(data: OdsSjbzyxxxtysgxsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/add",
    data,
  );
}

/**
 * 修改数据标准与信息系统映射关系数据
 */
export function updateOdsSjbzyxxxtysgxsj(data: OdsSjbzyxxxtysgxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/update",
    data,
  );
}

/**
 * 删除数据标准与信息系统映射关系数据
 */
export function deleteOdsSjbzyxxxtysgxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/${id}`,
  );
}

/**
 * 批量删除数据标准与信息系统映射关系数据
 */
export function batchDeleteOdsSjbzyxxxtysgxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出数据标准与信息系统映射关系数据
 */
export function exportOdsSjbzyxxxtysgxsj(query: OdsSjbzyxxxtysgxsjQuery) {
  return request.post(
    "/api/meta/meta-base/zygfw/ods-sjbzyxxxtysgxsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

// 状态常量
export const REPORT_STATUS_OPTIONS = [
  { value: "0", label: "未上报" },
  { value: "1", label: "已上报" },
  { value: "2", label: "上报失败" },
];

export const ENABLE_STATUS_OPTIONS = [
  { value: "0", label: "禁用" },
  { value: "1", label: "启用" },
];

// 定义系统信息选项类型
export interface SystemOption {
  label: string;
  value: string;
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code");
}

/**
 * 远程搜索信息化系统建设数据
 * @param query 搜索关键词
 */
export function searchSystemInfo(query: string) {
  return request.get<ApiResponse<any[]>>("/api/meta/meta-base/zygxx/ods-xxhxtjssj/options", {
    query 
    });
}
