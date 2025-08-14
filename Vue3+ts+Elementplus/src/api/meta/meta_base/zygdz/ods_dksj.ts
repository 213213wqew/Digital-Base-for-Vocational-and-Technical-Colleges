import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 党课数据接口
 */

// 党课数据表单数据
export interface OdsDksjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  dzzmc?: string; // 党组织名称
  dzzbh?: string; // 党组织编号
  hdxsm?: string; // 活动形式码
  dkzjr?: string; // 党课主讲人
  hdnr?: string; // 活动内容
  hdksrq?: string; // 活动开始日期
  hdjsrq?: string; // 活动结束日期
  cyxss?: number; // 参与学生数
  cyjss?: number; // 参与教师数
  sjcjsj?: string; // 数据采集时间
}

// 党课数据详情
export interface OdsDksjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzzmc: string; // 党组织名称
  dzzbh: string; // 党组织编号
  hdxsm: string; // 活动形式码
  dkzjr: string; // 党课主讲人
  hdnr: string; // 活动内容
  hdksrq: string; // 活动开始日期
  hdjsrq: string; // 活动结束日期
  cyxss: number; // 参与学生数
  cyjss: number; // 参与教师数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校名称
  hdxsmText?: string; // 活动形式名称
}

// 党课数据查询参数
export interface OdsDksjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dzzmc?: string;
  dzzbh?: string;
  hdxsm?: string;
  dkzjr?: string;
  hdksrqStart?: string;
  hdksrqEnd?: string;
  hdjsrqStart?: string;
  hdjsrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 党课数据分页结果
export interface OdsDksjPageResult {
  records: OdsDksjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党课数据
 */
export function getOdsDksjPage(query: OdsDksjQuery) {
  return request.post<ApiResponse<OdsDksjPageResult>>(
    "/api/meta/meta-base/zygdz/ods-dksj/page",
    query,
  );
}

/**
 * 根据ID查询党课数据详情
 */
export function getOdsDksjById(id: number) {
  return request.get<ApiResponse<OdsDksjInfo>>(
    `/api/meta/meta-base/zygdz/ods-dksj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党课数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDksjInfo>>(
    `/api/meta/meta-base/zygdz/ods-dksj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党课数据
 */
export function addOdsDksj(data: OdsDksjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygdz/ods-dksj/add",
    data,
  );
}

/**
 * 修改党课数据
 */
export function updateOdsDksj(data: OdsDksjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygdz/ods-dksj/update",
    data,
  );
}

/**
 * 删除党课数据
 */
export function deleteOdsDksj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygdz/ods-dksj/${id}`,
  );
}

/**
 * 批量删除党课数据
 */
export function batchDeleteOdsDksj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygdz/ods-dksj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党课数据
 */
export function exportOdsDksj(query: OdsDksjQuery) {
  return request.post("/api/meta/meta-base/zygdz/ods-dksj/export", query, {
    responseType: "blob",
  });
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
    '/api/meta/meta-base/zygdz/ods-dzzqkjcsj/search-org-info',
    {
        keyword  
    }
  );
}
/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/api/meta/data-base-source/options/${dictType}`,
  );
}