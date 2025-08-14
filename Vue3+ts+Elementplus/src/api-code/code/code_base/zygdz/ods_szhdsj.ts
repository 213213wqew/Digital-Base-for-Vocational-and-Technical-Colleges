import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 思政活动数据接口
 */

// 思政活动数据表单数据
export interface OdsSzhdsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  hdbh?: string; // 活动编号
  hdmc?: string; // 活动名称
  sszt?: string; // 所属专题
  hdbk?: string; // 活动板块
  hdzt?: string; // 活动主题
  hdlxm?: string; // 活动类型码
  hdnr?: string; // 活动内容
  zbdw?: string; // 主办单位
  zbdwjbm?: string; // 主办单位级别码
  hdksrq?: string; // 活动开始日期
  hdjsrq?: string; // 活动结束日期
  xxfzr?: string; // 学校负责人
  fzrlxfs?: string; // 负责人联系方式
  bxjscyrs?: number; // 本校教师参与人数
  wxjscyrs?: number; // 外校教师参与人数
  bxxscyrs?: number; // 本校学生参与人数
  xwxscyrs?: number; // 校外学生参与人数
  sjcjsj?: string; // 数据采集时间
}

// 思政活动数据详情
export interface OdsSzhdsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  hdbh: string; // 活动编号
  hdmc: string; // 活动名称
  sszt: string; // 所属专题
  hdbk: string; // 活动板块
  hdzt: string; // 活动主题
  hdlxm: string; // 活动类型码
  hdnr: string; // 活动内容
  zbdw: string; // 主办单位
  zbdwjbm: string; // 主办单位级别码
  hdksrq: string; // 活动开始日期
  hdjsrq: string; // 活动结束日期
  xxfzr: string; // 学校负责人
  fzrlxfs: string; // 负责人联系方式
  bxjscyrs: number; // 本校教师参与人数
  wxjscyrs: number; // 外校教师参与人数
  bxxscyrs: number; // 本校学生参与人数
  xwxscyrs: number; // 校外学生参与人数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  hdlxmText?: string; // 活动类型文本
  zbdwjbmText?: string; // 主办单位级别文本
}

// 思政活动数据查询参数
export interface OdsSzhdsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  hdbh?: string;
  hdmc?: string;
  sszt?: string;
  hdbk?: string;
  hdzt?: string;
  hdlxm?: string;
  zbdw?: string;
  zbdwjbm?: string;
  xxfzr?: string;
  hdksrqStart?: string;
  hdksrqEnd?: string;
  hdjsrqStart?: string;
  hdjsrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 思政活动数据分页结果
export interface OdsSzhdsjPageResult {
  records: OdsSzhdsjInfo[];
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

/**
 * 分页查询思政活动数据
 */
export function getOdsSzhdsjPage(query: OdsSzhdsjQuery) {
  return request.post<ApiResponse<OdsSzhdsjPageResult>>(
    "/code/code/code-base/zygdz/ods-szhdsj/page",
    query,
  );
}

/**
 * 根据ID查询思政活动数据详情
 */
export function getOdsSzhdsjById(id: number) {
  return request.get<ApiResponse<OdsSzhdsjInfo>>(
    `/code/code/code-base/zygdz/ods-szhdsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询思政活动数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsSzhdsjInfo>>(
    `/code/code/code-base/zygdz/ods-szhdsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增思政活动数据
 */
export function addOdsSzhdsj(data: OdsSzhdsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygdz/ods-szhdsj/add",
    data,
  );
}

/**
 * 修改思政活动数据
 */
export function updateOdsSzhdsj(data: OdsSzhdsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-szhdsj/update",
    data,
  );
}

/**
 * 删除思政活动数据
 */
export function deleteOdsSzhdsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygdz/ods-szhdsj/${id}`,
  );
}

/**
 * 批量删除思政活动数据
 */
export function batchDeleteOdsSzhdsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-szhdsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出思政活动数据
 */
export function exportOdsSzhdsj(query: OdsSzhdsjQuery) {
  return request.post("/code/code/code-base/zygdz/ods-szhdsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 活动类型 (HDLXDM)
 */
export function getActivityTypeOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SZHDLXDM",
  );
}

/**
 * 获取字典数据 - 主办单位级别 (ZBDWJBDM)
 */
export function getOrganizerLevelOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SZHDZBDWJBDM",
  );
}

/**
 * 获取系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
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
    `/code/code/code-base-source/options/${dictType}`,
  );
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
