import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 课程建设数据接口
 */

// 课程建设数据表单数据
export interface OdsKcjssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  fzrh?: string; // 负责人号
  sqrq?: string; // 申请日期
  lxnd?: string; // 立项年度
  ysrq?: string; // 验收日期
  jflym?: string; // 经费来源码
  lxjf?: number; // 立项经费
  ssdwmc?: string; // 所属单位名称
  kcjslbm?: string; // 课程建设类别码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课程建设数据详情
export interface OdsKcjssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  fzrh: string; // 负责人号
  sqrq: string; // 申请日期
  lxnd: string; // 立项年度
  ysrq: string; // 验收日期
  jflym: string; // 经费来源码
  lxjf: number; // 立项经费
  ssdwmc: string; // 所属单位名称
  kcjslbm: string; // 课程建设类别码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jflymText?: string; // 经费来源文本
  kcjslbmText?: string; // 课程建设类别文本
  reportStatusText?: string; // 上报状态文本
  enableStatusText?: string; // 启用状态文本
}

// 课程建设数据查询参数
export interface OdsKcjssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  kcmc?: string;
  kch?: string;
  fzrh?: string;
  lxnd?: string;
  kcjslbm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 课程建设数据分页结果
export interface OdsKcjssjPageResult {
  [x: string]: any;
  records: OdsKcjssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 课程基本信息接口（用于下拉选择）
export interface CourseBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  createTime?: string;
  updateTime?: string;
}

/**
 * 分页查询课程建设数据
 * @param query 查询参数
 * @returns 课程建设数据列表
 */
export function getCourseConstructionDataPage(query: OdsKcjssjQuery) {
  return request.post<ApiResponse<OdsKcjssjPageResult>>(
    "/code/code/code-base/zygjx/ods-kcjssj/page",
    query,
  );
}

/**
 * 根据ID查询课程建设数据详情
 * @param id 主键ID
 * @returns 课程建设数据详情
 */
export function getCourseConstructionDataById(id: number) {
  return request.get<ApiResponse<OdsKcjssjInfo>>(
    `/code/code/code-base/zygjx/ods-kcjssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询课程建设数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 课程建设数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKcjssjInfo>>(
    `/code/code/code-base/zygjx/ods-kcjssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增课程建设数据
 * @param data 课程建设数据信息
 * @returns 结果
 */
export function addCourseConstructionData(data: OdsKcjssjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygjx/ods-kcjssj/add",
    data,
  );
}

/**
 * 修改课程建设数据
 * @param data 课程建设数据信息
 * @returns 结果
 */
export function updateCourseConstructionData(data: OdsKcjssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-kcjssj/update",
    data,
  );
}

/**
 * 删除课程建设数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteCourseConstructionData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-kcjssj/${id}`,
  );
}

/**
 * 批量删除课程建设数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteCourseConstructionData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygjx/ods-kcjssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出课程建设数据
 * @param query 查询参数
 */
export function exportCourseConstructionData(
  query: OdsKcjssjQuery,
): Promise<void> {
  return request
    .post("/code/code/code-base/zygjx/ods-kcjssj/export", query, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      // 检查响应类型
      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        // 如果返回的是JSON（说明是错误信息）
        return response.data.text().then((text: string) => {
          const error = JSON.parse(text);
          throw new Error(error.message || "导出失败");
        });
      }

      // 正常的Excel文件响应
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `课程建设数据_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    })
    .catch((error) => {
      console.error("导出失败:", error);
      throw error;
    });
}

/**
 * 更新上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-kcjssj/report-status/${id}?reportStatus=${reportStatus}`,
  );
}

/**
 * 更新启用状态
 * @param id 主键ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-kcjssj/enable-status/${id}?enableStatus=${enableStatus}`,
  );
}

/**
 * 批量更新上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-kcjssj/batch/report-status?reportStatus=${reportStatus}`,
    ids,
  );
}

/**
 * 批量更新启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygjx/ods-kcjssj/batch/enable-status?enableStatus=${enableStatus}`,
    ids,
  );
}

/**
 * 获取经费来源选项
 * @returns 经费来源选项列表
 */
export function getFundSourceOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/code/code/code-base-source/options/JFLYDM",
  );
}

/**
 * 获取课程建设类别选项
 * @returns 课程建设类别选项列表
 */
export function getCourseConstructionTypeOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/code/code/code-base-source/options/KCJSLBDM",
  );
}

/**
 * 获取是否选项
 * @returns 是否选项列表
 */
export function getYesNoOptions() {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    "/code/system/dict/data/type/sys_yes_no",
  );
}

/**
 * 获取上报状态选项
 * @returns 上报状态选项列表
 */
export function getReportStatusOptions() {
  return [
    { label: "未上报", value: "0" },
    { label: "已上报", value: "1" },
    { label: "上报失败", value: "2" },
  ];
}

/**
 * 获取启用状态选项
 * @returns 启用状态选项列表
 */
export function getEnableStatusOptions() {
  return [
    { label: "禁用", value: "0" },
    { label: "启用", value: "1" },
  ];
}

/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchCourses(keyword?: string, limit: number = 20) {
  return request.get<ApiResponse<CourseBasicInfo[]>>(
    "/code/code/code-base/zygjx/ods-kcjbs/search",
    {
      keyword,
      limit,
    },
  );
}

/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

/**
 * 导入课程建设数据
 * @param file Excel文件
 * @returns 导入结果
 */
export function importCourseConstructionData(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/code/code/code-base/zygjx/ods-kcjssj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}
