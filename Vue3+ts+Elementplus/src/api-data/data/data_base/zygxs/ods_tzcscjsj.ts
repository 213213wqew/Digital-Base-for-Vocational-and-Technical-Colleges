import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 体质测试成绩数据接口
 */

// 体质测试成绩数据表单数据
export interface OdsTzcscjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  csxmmc?: string; // 测试项目名称
  csrq?: string; // 测试日期
  cscj?: number; // 测试成绩
  csdj?: string; // 测试等级
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
}

// 体质测试成绩数据详情
export interface OdsTzcscjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  csxmmc: string; // 测试项目名称
  csrq: string; // 测试日期
  cscj: number; // 测试成绩
  csdj: string; // 测试等级
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  csdjText?: string; // 测试等级文本
}

// 体质测试成绩数据查询参数
export interface OdsTzcscjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  csxmmc?: string;
  csrq?: string;
  cscj?: number;
  csdj?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 体质测试成绩数据分页结果
export interface OdsTzcscjsjPageResult {
  records: OdsTzcscjsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询体质测试成绩数据
 */
export function getOdsTzcscjsjPage(query: OdsTzcscjsjQuery) {
  return request.post<ApiResponse<OdsTzcscjsjPageResult>>(
    "/data/data/data-base/zygxs/ods-tzcscjsj/page",
    query,
  );
}

/**
 * 根据ID查询体质测试成绩数据详情
 */
export function getOdsTzcscjsjById(id: number) {
  return request.get<ApiResponse<OdsTzcscjsjInfo>>(
    `/data/data/data-base/zygxs/ods-tzcscjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询体质测试成绩数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsTzcscjsjInfo>>(
    `/data/data/data-base/zygxs/ods-tzcscjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增体质测试成绩数据
 */
export function addOdsTzcscjsj(data: OdsTzcscjsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygxs/ods-tzcscjsj/add",
    data,
  );
}

/**
 * 修改体质测试成绩数据
 */
export function updateOdsTzcscjsj(data: OdsTzcscjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-tzcscjsj/update",
    data,
  );
}

/**
 * 删除体质测试成绩数据
 */
export function deleteOdsTzcscjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygxs/ods-tzcscjsj/${id}`,
  );
}

/**
 * 批量删除体质测试成绩数据
 */
export function batchDeleteOdsTzcscjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygxs/ods-tzcscjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出体质测试成绩数据
 */
export function exportOdsTzcscjsj(query: OdsTzcscjsjQuery) {
  return request.post("/data/data/data-base/zygxs/ods-tzcscjsj/export", query, {
    responseType: "blob",
  });
}
//
/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    "/data/data/data-base/zygxs/ods-xshxsj/student/options",
    {
     
        keyword
      
    }
  );
}
/**
 * 获取系统学校代码
 * @returns Promise<ApiResponse<string>>
 */
export function getSystemSchoolCode(): Promise<ApiResponse<string>> {
  return request.get(
    "/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}
