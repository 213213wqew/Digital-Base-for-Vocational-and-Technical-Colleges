import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 学生参与社团数据接口
 */

// 学生参与社团数据表单数据
export interface OdsXscystsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  stbh?: string; // 社团编号
  stmc?: string; // 社团名称
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  cjrq?: string; // 参加日期
  tcrq?: string; // 退出日期
  stzw?: string; // 社团职务
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 学生参与社团数据详情
export interface OdsXscystsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  xh: string; // 学号
  xsxm: string; // 学生姓名
  cjrq: string; // 参加日期
  tcrq: string; // 退出日期
  stzw: string; // 社团职务
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 学生参与社团数据查询参数
export interface OdsXscystsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  stbh?: string;
  stmc?: string;
  xh?: string;
  xsxm?: string;
  cjrqStart?: string;
  cjrqEnd?: string;
  tcrqStart?: string;
  tcrqEnd?: string;
  stzw?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生参与社团数据分页结果
export interface OdsXscystsjPageResult {
  records: OdsXscystsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生参与社团数据
 */
export function getOdsXscystsjPage(query: OdsXscystsjQuery) {
  return request.post<ApiResponse<OdsXscystsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/page",
    query,
  );
}

/**
 * 根据ID查询学生参与社团数据详情
 */
export function getOdsXscystsjById(id: number) {
  return request.get<ApiResponse<OdsXscystsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xscystsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生参与社团数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXscystsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xscystsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生参与社团数据
 */
export function addOdsXscystsj(data: OdsXscystsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/add",
    data,
  );
}

/**
 * 修改学生参与社团数据
 */
export function updateOdsXscystsj(data: OdsXscystsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/update",
    data,
  );
}

/**
 * 删除学生参与社团数据
 */
export function deleteOdsXscystsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xscystsj/${id}`,
  );
}

/**
 * 批量删除学生参与社团数据
 */
export function batchDeleteOdsXscystsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生参与社团数据
 */
export function exportOdsXscystsj(query: OdsXscystsjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-xscystsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 批量修改上报状态
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/batch-report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xscystsj/batch-enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单个记录上报状态
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xscystsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单个记录启用状态
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xscystsj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}
/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
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
// 社团（协会）下拉选择选项
export interface OdsStxhjbsjOption {
  stbh: string; // 社团编号
  stmc: string; // 社团名称
  value: string; // 选择值（社团编号）
  label: string; // 显示标签（社团编号 - 社团名称）
}
// 获取社团（协会）下拉选择选项
export const getStxhjbsjOptions = (keyword?: string): Promise<ApiResponse<OdsStxhjbsjOption[]>> => {
  return request.get('/api/meta/meta-base/zygxs/ods-stxhjbsj/options', {
   keyword 
  });
};
 