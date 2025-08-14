import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 毕业去向【升学】数据接口
 */

// 毕业去向【升学】数据表单数据
export interface OdsByqxsxsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xm?: string; // 姓名
  xslxm?: string; // 学生类型码
  zyh?: string; // 专业号
  zymc?: string; // 专业名称
  sxqdm?: string; // 升学渠道码
  lqxxmc?: string; // 录取学校名称
  lqzymc?: string; // 录取专业名称
  fs?: number; // 分数
  sxccm?: string; // 升学层次码
  sslxm?: string; // 硕士类型码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 毕业去向【升学】数据详情
export interface OdsByqxsxsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xm: string; // 姓名
  xslxm: string; // 学生类型码
  zyh: string; // 专业号
  zymc: string; // 专业名称
  sxqdm: string; // 升学渠道码
  lqxxmc: string; // 录取学校名称
  lqzymc: string; // 录取专业名称
  fs: number; // 分数
  sxccm: string; // 升学层次码
  sslxm: string; // 硕士类型码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xslxmText?: string; // 学生类型名称
  sxqdmText?: string; // 升学渠道名称
  sxccmText?: string; // 升学层次名称
  sslxmText?: string; // 硕士类型名称
}

// 毕业去向【升学】数据查询参数
export interface OdsByqxsxsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xm?: string;
  xslxm?: string;
  sxqdm?: string;
  lqxxmc?: string;
  sxccm?: string;
  sslxm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}
// 学生选项
export interface StudentOption {
  xh: string; // xh
  label: string; // xh - xsxm
  xsxm: string;
  zyh: string;
}
// 毕业去向【升学】数据分页结果
export interface OdsByqxsxsjPageResult {
  records: OdsByqxsxsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}


/**
 * 分页查询毕业去向【升学】数据
 * @param query 查询参数
 * @returns 毕业去向【升学】数据列表
 */
export function getOdsByqxsxsjPage(query: OdsByqxsxsjQuery) {
  return request.post<ApiResponse<OdsByqxsxsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/page",
    query,
  );
}

/**
 * 根据ID查询毕业去向【升学】数据详情
 * @param id 主键ID
 * @returns 毕业去向【升学】数据详情
 */
export function getOdsByqxsxsjById(id: number) {
  return request.get<ApiResponse<OdsByqxsxsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-byqxsxsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询毕业去向【升学】数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 毕业去向【升学】数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsByqxsxsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-byqxsxsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增毕业去向【升学】数据
 * @param data 毕业去向【升学】数据信息
 * @returns 结果
 */
export function addOdsByqxsxsj(data: OdsByqxsxsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/add",
    data,
  );
}

/**
 * 修改毕业去向【升学】数据
 * @param data 毕业去向【升学】数据信息
 * @returns 结果
 */
export function updateOdsByqxsxsj(data: OdsByqxsxsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/update",
    data,
  );
}

/**
 * 删除毕业去向【升学】数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsByqxsxsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-byqxsxsj/${id}`,
  );
}

/**
 * 批量删除毕业去向【升学】数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsByqxsxsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出毕业去向【升学】数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsByqxsxsj(query: OdsByqxsxsjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-byqxsxsj/export", query, {
    responseType: "blob",
  });
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}


/**
 * 获取字典数据 - 学生类型 (XSLXDM)
 * @returns 字典选项列表
 */
export function getStudentTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/GZXSLXDM",
  );
}

/**
 * 获取字典数据 - 升学渠道 (SXQDM)
 * @returns 字典选项列表
 */
export function getEnrollmentChannelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SXQDDM",
  );
}

/**
 * 获取字典数据 - 升学层次 (SXCCM)
 * @returns 字典选项列表
 */
export function getEnrollmentLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SXCCDM",
  );
}

/**
 * 获取字典数据 - 硕士类型 (SSLXM)
 * @returns 字典选项列表
 */
export function getMasterTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/SSLXDM",
  );
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/batch/report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxsxsj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单条记录上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-byqxsxsj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单条记录启用状态
 * @param id 记录ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-byqxsxsj/${id}/enable-status`,
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
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
 


 /**
 * 获取学生综合信息选项列表（包含专业信息）
 * 从学生画像数据中获取学号、姓名、专业号、专业名称
 * @param keyword 搜索关键字（学号或姓名）
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{
    value: string;  // 学号作为选择值
    label: string;  // 学号 - 姓名
    xh: string;     // 学号
    xsxm: string;   // 学生姓名
    zyh: string;    // 专业号
    zymc: string;   // 专业名称
  }>>>(
    "/api/meta/meta-base/zygxs/ods-xshxsj/student/comprehensive-options",
    {
      keyword 
    }
  );
}
