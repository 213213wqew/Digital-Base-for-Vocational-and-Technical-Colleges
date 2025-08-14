import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 贫困生认定数据接口
 */

// 贫困生认定数据表单数据
export interface OdsPksrdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  zzdj?: string; // 资助等级
  rdzt?: string; // 认定状态
  rdrq?: string; // 认定日期
  sjcjsj?: string; // 数据采集时间
}

// 贫困生认定数据详情
export interface OdsPksrdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  zzdj: string; // 资助等级
  rdzt: string; // 认定状态
  rdrq: string; // 认定日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zzdjText?: string; // 资助等级文本
  rdztText?: string; // 认定状态文本
}

// 贫困生认定数据查询参数
export interface OdsPksrdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  zzdj?: string;
  rdzt?: string;
  rdrq?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 贫困生认定数据分页结果
export interface OdsPksrdsjPageResult {
  records: OdsPksrdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询贫困生认定数据
 */
export function getOdsPksrdsjPage(query: OdsPksrdsjQuery) {
  return request.post<ApiResponse<OdsPksrdsjPageResult>>(
    "/code/code/code-base/zygxs/ods-pksrdsj/page",
    query,
  );
}

/**
 * 根据ID查询贫困生认定数据详情
 */
export function getOdsPksrdsjById(id: number) {
  return request.get<ApiResponse<OdsPksrdsjInfo>>(
    `/code/code/code-base/zygxs/ods-pksrdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询贫困生认定数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsPksrdsjInfo>>(
    `/code/code/code-base/zygxs/ods-pksrdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增贫困生认定数据
 */
export function addOdsPksrdsj(data: OdsPksrdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-pksrdsj/add",
    data,
  );
}

/**
 * 修改贫困生认定数据
 */
export function updateOdsPksrdsj(data: OdsPksrdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-pksrdsj/update",
    data,
  );
}

/**
 * 删除贫困生认定数据
 */
export function deleteOdsPksrdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-pksrdsj/${id}`,
  );
}

/**
 * 批量删除贫困生认定数据
 */
export function batchDeleteOdsPksrdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-pksrdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出贫困生认定数据
 */
export function exportOdsPksrdsj(query: OdsPksrdsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-pksrdsj/export", query, {
    responseType: "blob",
  });
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
