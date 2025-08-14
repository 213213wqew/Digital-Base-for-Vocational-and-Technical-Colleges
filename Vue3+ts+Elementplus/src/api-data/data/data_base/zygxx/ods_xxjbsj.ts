import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

// 字典选项类型
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 学校基本数据子类表API
 */

// 学校基本数据表单数据
export interface MetaBaseZygxxOdsXxjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  sjgbm?: string; // 省机构编码
  sjgmc?: string; // 省机构名称
  shjgbm?: string; // 市机构编码
  shjgmc?: string; // 市机构名称
  qxjgbm?: string; // 区县机构编码
  qxjgmc?: string; // 区县机构名称
  xxjgdm?: string; // 学校机构代码
  xxdm?: string; // 学校代码
  xxmc?: string; // 学校名称
  jxny?: string; // 建校年月
  xxjbzmc?: string; // 学校举办者名称
  xxjbzxzm?: string; // 学校举办者性质码
  xxjbzjbm?: string; // 学校举办者级别码
  xxxzm?: string; // 学校性质码
  gspxxxzm?: string; // 高水平学校性质码
  gspxxjbm?: string; // 高水平学校（专业群）级别码
  gspxxlxbmmc?: string; // 高水平学校（专业群）立项部门名称（全称）
  gspxxpzny?: string; // 高水平学校（专业群）批准年月
  zyqsl?: number; // 专业群数量
  xxbxlxm?: string; // 学校办学类型码
  xyjzgzs?: number; // 现有教职工总数
  zjgrs?: number; // 专技岗人数
  glgrs?: number; // 管理岗人数
  gqgrs?: number; // 工勤岗人数
  xyxss?: number; // 现有学生数
  xxtsxxhxts?: number; // 学校特色信息化系统数
  xyckdk?: number; // 校园出口带宽
  xyzgwdk?: number; // 校园主干网带宽
  yxwljrs?: number; // 有线网络接入数
  wxwljrs?: number; // 无线网络接入数
  dmtjss?: number; // 多媒体教室数
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 学校基本数据详情
export interface MetaBaseZygxxOdsXxjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  sjgbm: string; // 省机构编码
  sjgmc: string; // 省机构名称
  shjgbm: string; // 市机构编码
  shjgmc: string; // 市机构名称
  qxjgbm: string; // 区县机构编码
  qxjgmc: string; // 区县机构名称
  xxjgdm: string; // 学校机构代码
  xxdm: string; // 学校代码
  xxmc: string; // 学校名称
  jxny: string; // 建校年月
  xxjbzmc: string; // 学校举办者名称
  xxjbzxzm: string; // 学校举办者性质码
  xxjbzjbm: string; // 学校举办者级别码
  xxxzm: string; // 学校性质码
  gspxxxzm: string; // 高水平学校性质码
  gspxxjbm: string; // 高水平学校（专业群）级别码
  gspxxlxbmmc: string; // 高水平学校（专业群）立项部门名称（全称）
  gspxxpzny: string; // 高水平学校（专业群）批准年月
  zyqsl: number; // 专业群数量
  xxbxlxm: string; // 学校办学类型码
  xyjzgzs: number; // 现有教职工总数
  zjgrs: number; // 专技岗人数
  glgrs: number; // 管理岗人数
  gqgrs: number; // 工勤岗人数
  xyxss: number; // 现有学生数
  xxtsxxhxts: number; // 学校特色信息化系统数
  xyckdk: number; // 校园出口带宽
  xyzgwdk: number; // 校园主干网带宽
  yxwljrs: number; // 有线网络接入数
  wxwljrs: number; // 无线网络接入数
  dmtjss: number; // 多媒体教室数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
}

// 学校基本数据查询参数
export interface MetaBaseZygxxOdsXxjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xxmc?: string;
  sjgbm?: string;
  shjgbm?: string;
  qxjgbm?: string;
  xxxzm?: string;
  xxbxlxm?: string;
  jxnyStart?: string;
  jxnyEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学校基本数据分页结果
export interface MetaBaseZygxxOdsXxjbsjPageResult {
  records: MetaBaseZygxxOdsXxjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学校基本数据
 * @param query 查询参数
 * @returns 学校基本数据列表
 */
export function listSchoolBasicData(query: MetaBaseZygxxOdsXxjbsjQuery) {
  return request.post<ApiResponse<MetaBaseZygxxOdsXxjbsjPageResult>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/list",
    query,
  );
}

/**
 * 获取学校基本数据详情
 * @param id 学校基本数据ID
 * @returns 学校基本数据详情
 */
export function getSchoolBasicData(id: number) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxjbsjInfo>>(
    `/data/data/data-base/zygxx/ods-xxjbsj/${id}`,
  );
}

/**
 * 新增学校基本数据
 * @param data 学校基本数据信息
 * @returns 结果
 */
export function addSchoolBasicData(data: MetaBaseZygxxOdsXxjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygxx/ods-xxjbsj",
    data,
  );
}

/**
 * 修改学校基本数据
 * @param data 学校基本数据信息
 * @returns 结果
 */
export function updateSchoolBasicData(data: MetaBaseZygxxOdsXxjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygxx/ods-xxjbsj",
    data,
  );
}

/**
 * 删除学校基本数据
 * @param id 学校基本数据ID
 * @returns 结果
 */
export function deleteSchoolBasicData(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygxx/ods-xxjbsj/${id}`,
  );
}

/**
 * 批量删除学校基本数据
 * @param ids 学校基本数据ID数组
 * @returns 结果
 */
export function batchDeleteSchoolBasicData(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 根据学校代码获取学校基本数据列表
 * @param xxdm 学校代码
 * @returns 学校基本数据列表
 */
export function getSchoolBasicDataByCode(xxdm: string) {
  return request.get<ApiResponse<MetaBaseZygxxOdsXxjbsjInfo[]>>(
    `/data/data/data-base/zygxx/ods-xxjbsj/by-code/${xxdm}`,
  );
}

/**
 * 导入Excel数据
 * @param formData 包含Excel文件的FormData对象
 * @returns 导入结果
 */
export function importSchoolBasicData(formData: FormData) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
}

/**
 * 导出学校基本数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportSchoolBasicData(query: MetaBaseZygxxOdsXxjbsjQuery) {
  return request.post("/data/data/data-base/zygxx/ods-xxjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典选项
 * @param codePattern 代码模式
 * @returns 字典选项列表
 */
export function getDictOptions(codePattern: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/data/data/data-base-source/options/${codePattern}`,
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
    "/data/data/data-base/zygxx/ods-xxjbsj/batch/report-status",
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
    "/data/data/data-base/zygxx/ods-xxjbsj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

// =========================== 数据同步相关接口 ===========================

/**
 * 同步结果统计类型
 */
export interface SyncResult {
  totalCount: number; // 总数
  successCount: number; // 成功数
  failedCount: number; // 失败数
  skippedCount: number; // 跳过数
}

/**
 * 手动获取学校数据（同步所有数据）
 * @returns 同步结果统计
 */
export function fetchSchoolData() {
  return request.post<ApiResponse<SyncResult>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/sync/fetch-data",
  );
}

/**
 * 异步获取学校数据
 * @returns 任务启动结果
 */
export function fetchSchoolDataAsync() {
  return request.post<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/sync/fetch-data-async",
  );
}

/**
 * 根据学校代码获取数据
 * @param xxdm 学校代码
 * @returns 同步结果
 */
export function fetchSchoolDataByCode(xxdm: string) {
  return request.post<ApiResponse<boolean>>(
    `/data/data/data-base/zygxx/ods-xxjbsj/sync/fetch-by-code/${xxdm}`,
  );
}

/**
 * 保存定时同步设置
 * @param data 同步设置数据
 * @returns 保存结果
 */
export function saveSyncSchedule(data: {
  moduleName: string;
  syncTime: string;
  enabled: boolean;
  remark?: string;
}) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygxx/ods-xxjbsj/sync/save-schedule",
    data,
  );
}
