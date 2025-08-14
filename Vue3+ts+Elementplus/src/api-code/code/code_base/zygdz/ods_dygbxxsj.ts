import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 党员干部学习数据接口
 */

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}

// 党员干部学习数据表单数据
export interface OdsDygbxxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dzzmc?: string; // 党组织名称
  dzzbh?: string; // 党组织编号
  dygbxxpxzytjhztm?: string | string[]; // 党员干部学习培训主要途径和载体码
  dygbxxpxnrm?: string | string[]; // 党员干部学习培训内容码
  hdksrq?: string; // 活动开始日期
  hdjsrq?: string; // 活动结束日期
  cyxss?: number; // 参与学生数
  cyjss?: number; // 参与教师数
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 党员干部学习数据详情
export interface OdsDygbxxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzzmc: string; // 党组织名称
  dzzbh: string; // 党组织编号
  dygbxxpxzytjhztm: string; // 党员干部学习培训主要途径和载体码
  dygbxxpxnrm: string; // 党员干部学习培训内容码
  hdksrq: string; // 活动开始日期
  hdjsrq: string; // 活动结束日期
  cyxss: number; // 参与学生数
  cyjss: number; // 参与教师数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  dygbxxpxzytjhztmText?: string; // 党员干部学习培训主要途径和载体文本
  dygbxxpxnrmText?: string; // 党员干部学习培训内容文本
}

// 党员干部学习数据查询参数
export interface OdsDygbxxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dzzmc?: string;
  dzzbh?: string;
  dygbxxpxzytjhztm?: string;
  dygbxxpxnrm?: string;
  hdksrqStart?: string;
  hdksrqEnd?: string;
  hdjsrqStart?: string;
  hdjsrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 党员干部学习数据分页结果
export interface OdsDygbxxsjPageResult {
  records: OdsDygbxxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党员干部学习数据
 */
export function getOdsDygbxxsjPage(query: OdsDygbxxsjQuery) {
  return request.post<ApiResponse<OdsDygbxxsjPageResult>>(
    "/code/code/code-base/zygdz/ods-dygbxxsj/page",
    query,
  );
}

/**
 * 根据ID查询党员干部学习数据详情
 */
export function getOdsDygbxxsjById(id: number) {
  return request.get<ApiResponse<OdsDygbxxsjInfo>>(
    `/code/code/code-base/zygdz/ods-dygbxxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党员干部学习数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDygbxxsjInfo>>(
    `/code/code/code-base/zygdz/ods-dygbxxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党员干部学习数据
 */
export function addOdsDygbxxsj(data: OdsDygbxxsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygdz/ods-dygbxxsj/add",
    data,
  );
}

/**
 * 修改党员干部学习数据
 */
export function updateOdsDygbxxsj(data: OdsDygbxxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dygbxxsj/update",
    data,
  );
}

/**
 * 删除党员干部学习数据
 */
export function deleteOdsDygbxxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygdz/ods-dygbxxsj/${id}`,
  );
}

/**
 * 批量删除党员干部学习数据
 */
export function batchDeleteOdsDygbxxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dygbxxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党员干部学习数据
 */
export function exportOdsDygbxxsj(query: OdsDygbxxsjQuery) {
  return request.post("/code/code/code-base/zygdz/ods-dygbxxsj/export", query, {
    responseType: "blob",
  });
}


/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/code/code/code-base-source/options/${dictType}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
/**
 * 党组织信息选项
 */
export interface OrgOption {
  value: string; // 党组织编号
  label: string; // 党组织名称
  dzzlxm: string; // 党组织类型码
}

/**
 * 模糊查询党组织信息
 * @param keyword 搜索关键字
 */
export function searchOrgInfo(keyword?: string) {
  return request.get<ApiResponse<OrgOption[]>>(
    '/code/code/code-base/zygdz/ods-dzzqkjcsj/search-org-info',
    {
        keyword  
    }
  );
}