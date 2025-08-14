import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 参加社团活动数据接口
 */

// 参加社团活动数据表单数据
export interface OdsCjsthdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  sthdbh?: string; // 社团活动编号
  sthdmc?: string; // 社团活动名称
  sthdlxm?: string; // 社团活动类型码
  cjsthdsj?: string; // 参加社团活动时间
  hjjbm?: string; // 获奖级别码
  hjrq?: string; // 获奖日期
  bjdw?: string; // 颁奖单位
  zdjsxm?: string; // 指导教师姓名
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 参加社团活动数据详情
export interface OdsCjsthdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  sthdbh: string; // 社团活动编号
  sthdmc: string; // 社团活动名称
  sthdlxm: string; // 社团活动类型码
  cjsthdsj: string; // 参加社团活动时间
  hjjbm: string; // 获奖级别码
  hjrq: string; // 获奖日期
  bjdw: string; // 颁奖单位
  zdjsxm: string; // 指导教师姓名
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  sthdlxmText?: string; // 社团活动类型名称
  hjjbmText?: string; // 获奖级别名称
}

// 参加社团活动数据查询参数
export interface OdsCjsthdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  sthdbh?: string;
  sthdmc?: string;
  sthdlxm?: string;
  hjjbm?: string;
  bjdw?: string;
  zdjsxm?: string;
  cjsthdsjStart?: string;
  cjsthdsjEnd?: string;
  hjrqStart?: string;
  hjrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 参加社团活动数据分页结果
export interface OdsCjsthdsjPageResult {
  records: OdsCjsthdsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

// 联合查询结果接口
export interface ActivityStudentJoinInfo {
  xh: string; // 学号
  xsxm: string; // 学生姓名
  sthdbh: string; // 社团活动编号
  sthdmc: string; // 社团活动名称
  sthdlxm: string; // 社团活动类型码
  sthdlxmText: string; // 社团活动类型名称
}

/**
 * 分页查询参加社团活动数据
 * @param query 查询参数
 * @returns 参加社团活动数据列表
 */
export function getOdsCjsthdsjPage(query: OdsCjsthdsjQuery) {
  return request.post<ApiResponse<OdsCjsthdsjPageResult>>(
    "/code/code/code-base/zygxs/ods-cjsthdsj/page",
    query,
  );
}

/**
 * 根据ID查询参加社团活动数据详情
 * @param id 主键ID
 * @returns 参加社团活动数据详情
 */
export function getOdsCjsthdsjById(id: number) {
  return request.get<ApiResponse<OdsCjsthdsjInfo>>(
    `/code/code/code-base/zygxs/ods-cjsthdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询参加社团活动数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 参加社团活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsCjsthdsjInfo>>(
    `/code/code/code-base/zygxs/ods-cjsthdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增参加社团活动数据
 * @param data 参加社团活动数据信息
 * @returns 结果
 */
export function addOdsCjsthdsj(data: OdsCjsthdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-cjsthdsj/add",
    data,
  );
}

/**
 * 修改参加社团活动数据
 * @param data 参加社团活动数据信息
 * @returns 结果
 */
export function updateOdsCjsthdsj(data: OdsCjsthdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-cjsthdsj/update",
    data,
  );
}

/**
 * 删除参加社团活动数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsCjsthdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-cjsthdsj/${id}`,
  );
}

/**
 * 批量删除参加社团活动数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsCjsthdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-cjsthdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出参加社团活动数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsCjsthdsj(query: OdsCjsthdsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-cjsthdsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 社团活动类型 (STHDLXDM)
 * @returns 字典选项列表
 */
export function getActivityTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/STHDLXDM",
  );
}

/**
 * 获取字典数据 - 获奖级别 (HJJBDM)
 * @returns 字典选项列表
 */
export function getAwardLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/JBDM",
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
    "/code/code/code-base/zygxs/ods-cjsthdsj/batch-report-status",
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
    "/code/code/code-base/zygxs/ods-cjsthdsj/batch-enable-status",
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
    `/code/code/code-base/zygxs/ods-cjsthdsj/${id}/report-status/${reportStatus}`,
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
    `/code/code/code-base/zygxs/ods-cjsthdsj/${id}/enable-status/${enableStatus}`,
  );
}

//获取学校代码
export function getSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}



/**
 * 联合查询社团活动和学生参与数据（用于下拉选择）
 * @param keyword 搜索关键字
 * @returns 查询结果
 */
export function getActivityStudentJoinData(keyword?: string) {
  return request.get<ApiResponse<ActivityStudentJoinInfo[]>>(
    "/code/code/code-base/zygxs/ods-jbsthdsj/activity-student-join",
    {
    keyword 
    }
  );
}