import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 党员发展数据接口
 */

// 党员发展数据表单数据
export interface OdsDyfzsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识，32位全局唯一编码字符串（大写字母+数字组合）
  xxdm?: string; // 学校代码，10位数字码
  dzzlxm?: string; // 党组织类型码，2位，DZZLXDM
  dzzmc?: string; // 党组织名称，最大150位
  dzzbh?: string; // 党组织编号，最大60位，学校自编
  xdylxm?: string; // 新党员类型码，2位，XDYLXDM
  xm?: string; // 姓名，最大36位
  rybh?: string; // 人员编号，最大20位，学号或工号
  dyfzztm?: string; // 党员发展状态码，2位，XDYFZZTDM
  cwjjfzrq?: string; // 成为积极分子日期，格式：YYYYMMDD
  cwybdyrq?: string; // 成为预备党员日期，格式：YYYYMMDD
  cwzsdyrq?: string; // 成为正式党员日期，格式：YYYYMMDD
  sjcjsj?: string; // 数据采集时间，格式：YYYYMMDD hhmmss
  enableStatus?: string; // 启用状态
}

// 党员发展数据详情
export interface OdsDyfzsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  dzzlxm: string; // 党组织类型码
  dzzmc: string; // 党组织名称
  dzzbh: string; // 党组织编号
  xdylxm: string; // 新党员类型码
  xm: string; // 姓名
  rybh: string; // 人员编号
  dyfzztm: string; // 党员发展状态码
  cwjjfzrq: string; // 成为积极分子日期
  cwybdyrq: string; // 成为预备党员日期
  cwzsdyrq: string; // 成为正式党员日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  dzzlxmText?: string; // 党组织类型名称
  xdylxmText?: string; // 新党员类型名称
  dyfzztmText?: string; // 党员发展状态名称
}

// 党员发展数据查询参数
export interface OdsDyfzsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  dzzlxm?: string;
  dzzmc?: string;
  dzzbh?: string;
  xdylxm?: string;
  xm?: string;
  rybh?: string;
  dyfzztm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 党员发展数据分页结果
export interface OdsDyfzsjPageResult {
  records: OdsDyfzsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询党员发展数据
 */
export function getOdsDyfzsjPage(query: OdsDyfzsjQuery) {
  return request.post<ApiResponse<OdsDyfzsjPageResult>>(
    "/code/code/code-base/zygdz/ods-dyfzsj/page",
    query,
  );
}

/**
 * 根据ID查询党员发展数据详情
 */
export function getOdsDyfzsjById(id: number) {
  return request.get<ApiResponse<OdsDyfzsjInfo>>(
    `/code/code/code-base/zygdz/ods-dyfzsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询党员发展数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsDyfzsjInfo>>(
    `/code/code/code-base/zygdz/ods-dyfzsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增党员发展数据
 */
export function addOdsDyfzsj(data: OdsDyfzsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygdz/ods-dyfzsj/add",
    data,
  );
}

/**
 * 修改党员发展数据
 */
export function updateOdsDyfzsj(data: OdsDyfzsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dyfzsj/update",
    data,
  );
}

/**
 * 删除党员发展数据
 */
export function deleteOdsDyfzsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygdz/ods-dyfzsj/${id}`,
  );
}

/**
 * 批量删除党员发展数据
 */
export function batchDeleteOdsDyfzsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygdz/ods-dyfzsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出党员发展数据
 */
export function exportOdsDyfzsj(query: OdsDyfzsjQuery) {
  return request.post("/code/code/code-base/zygdz/ods-dyfzsj/export", query, {
    responseType: "blob",
  });
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
