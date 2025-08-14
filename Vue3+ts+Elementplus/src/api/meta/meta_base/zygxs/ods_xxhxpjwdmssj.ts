import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 学生画像评价维度描述数据接口
 */

// 学生画像评价维度描述数据表单数据
export interface OdsXxhxpjwdmssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  pjwdyjzbywmc?: string; // 评价维度一级指标英文名称
  pjwdyjzbzwmc?: string; // 评价维度一级指标中文名称
  pjwdywmc?: string; // 评价维度英文名称
  pjwdzwms?: string; // 评价维度中文描述
  pjwdjgms?: string; // 评价维度结果描述
  sjcjsj?: string; // 数据采集时间
}

// 学生画像评价维度描述数据详情
export interface OdsXxhxpjwdmssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  pjwdyjzbywmc: string; // 评价维度一级指标英文名称
  pjwdyjzbzwmc: string; // 评价维度一级指标中文名称
  pjwdywmc: string; // 评价维度英文名称
  pjwdzwms: string; // 评价维度中文描述
  pjwdjgms: string; // 评价维度结果描述
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
}

// 学生画像评价维度描述数据查询参数
export interface OdsXxhxpjwdmssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  pjwdyjzbywmc?: string;
  pjwdyjzbzwmc?: string;
  pjwdywmc?: string;
  pjwdzwms?: string;
  pjwdjgms?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生画像评价维度描述数据分页结果
export interface OdsXxhxpjwdmssjPageResult {
  records: OdsXxhxpjwdmssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生画像评价维度描述数据
 */
export function getOdsXxhxpjwdmssjPage(query: OdsXxhxpjwdmssjQuery) {
  return request.post<ApiResponse<OdsXxhxpjwdmssjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/page",
    query,
  );
}

/**
 * 根据ID查询学生画像评价维度描述数据详情
 */
export function getOdsXxhxpjwdmssjById(id: number) {
  return request.get<ApiResponse<OdsXxhxpjwdmssjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生画像评价维度描述数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXxhxpjwdmssjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生画像评价维度描述数据
 */
export function addOdsXxhxpjwdmssj(data: OdsXxhxpjwdmssjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/add",
    data,
  );
}

/**
 * 修改学生画像评价维度描述数据
 */
export function updateOdsXxhxpjwdmssj(data: OdsXxhxpjwdmssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/update",
    data,
  );
}

/**
 * 删除学生画像评价维度描述数据
 */
export function deleteOdsXxhxpjwdmssj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/${id}`,
  );
}

/**
 * 批量删除学生画像评价维度描述数据
 */
export function batchDeleteOdsXxhxpjwdmssj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生画像评价维度描述数据
 */
export function exportOdsXxhxpjwdmssj(query: OdsXxhxpjwdmssjQuery) {
  return request.post(
    "/api/meta/meta-base/zygxs/ods-xxhxpjwdmssj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}

/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/student/options",
    {
     
        keyword
      
    }
  );
}
