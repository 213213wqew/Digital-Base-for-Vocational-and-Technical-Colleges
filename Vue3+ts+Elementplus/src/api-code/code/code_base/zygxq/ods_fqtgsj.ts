import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 访企拓岗数据接口
 */

// 访企拓岗数据表单数据
export interface OdsFqtgsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zfqymc?: string; // 走访企业名称
  zfqydm?: string; // 走访企业统一社会信用代码
  xqzydm?: string; // 需求专业代码
  xqzymc?: string; // 需求专业名称
  xqzycc?: string; // 需求专业层次
  ktggws?: string; // 可提供岗位数
  pjxc?: string; // 平均薪酬（元）
  qtbfr?: string; // 牵头拜访人
  zw?: string; // 职务
  bfsj?: string; // 拜访时间
  qyjdr?: string; // 企业接待人姓名
  jdrzw?: string; // 接待人职务
  ftzyxs?: string; // 访谈成果主要形式
  jssxszydm?: string; // 接受实习生专业代码
  jssxszymc?: string; // 接受实习生专业名称
  jssxszycc?: string; // 接受实习生专业层次
  jssxszyrs?: string; // 接受实习生人数
  jssxszybc?: number; // 接受实习报酬（元）
  jsxsjyzydm?: string; // 接受学生就业专业代码
  jsxsjyzymc?: string; // 接受学生就业专业名称
  jsxsjyzycc?: string; // 接受学生就业专业层次
  jsxsjyrs?: string; // 接受学生就业人数
  jsxsjyqxx?: number; // 接受学生就业起薪线（元/月）
  qtdcyxhz?: string; // 其他达成意向的合作
  sjcjsj?: string; // 数据采集时间
}

// 访企拓岗数据详情
export interface OdsFqtgsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zfqymc: string; // 走访企业名称
  zfqydm: string; // 走访企业统一社会信用代码
  xqzydm: string; // 需求专业代码
  xqzymc: string; // 需求专业名称
  xqzycc: string; // 需求专业层次
  ktggws: string; // 可提供岗位数
  pjxc: string; // 平均薪酬（元）
  qtbfr: string; // 牵头拜访人
  zw: string; // 职务
  bfsj: string; // 拜访时间
  qyjdr: string; // 企业接待人姓名
  jdrzw: string; // 接待人职务
  ftzyxs: string; // 访谈成果主要形式
  jssxszydm: string; // 接受实习生专业代码
  jssxszymc: string; // 接受实习生专业名称
  jssxszycc: string; // 接受实习生专业层次
  jssxszyrs: string; // 接受实习生人数
  jssxszybc: number; // 接受实习报酬（元）
  jsxsjyzydm: string; // 接受学生就业专业代码
  jsxsjyzymc: string; // 接受学生就业专业名称
  jsxsjyzycc: string; // 接受学生就业专业层次
  jsxsjyrs: string; // 接受学生就业人数
  jsxsjyqxx: number; // 接受学生就业起薪线（元/月）
  qtdcyxhz: string; // 其他达成意向的合作
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  xqzydmText?: string; // 需求专业代码文本
  jssxszydmText?: string; // 接受实习生专业代码文本
  jsxsjyzydmText?: string; // 接受学生就业专业代码文本
}

// 访企拓岗数据查询参数
export interface OdsFqtgsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zfqymc?: string;
  zfqydm?: string;
  xqzydm?: string;
  xqzymc?: string;
  qtbfr?: string;
  bfsj?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 访企拓岗数据分页结果
export interface OdsFqtgsjPageResult {
  records: OdsFqtgsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询访企拓岗数据
 */
export function getOdsFqtgsjPage(query: OdsFqtgsjQuery) {
  return request.post<ApiResponse<OdsFqtgsjPageResult>>(
    "/code/code/code-base/zygxq/ods-fqtgsj/page",
    query,
  );
}

/**
 * 根据ID查询访企拓岗数据详情
 */
export function getOdsFqtgsjById(id: number) {
  return request.get<ApiResponse<OdsFqtgsjInfo>>(
    `/code/code/code-base/zygxq/ods-fqtgsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询访企拓岗数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsFqtgsjInfo>>(
    `/code/code/code-base/zygxq/ods-fqtgsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增访企拓岗数据
 */
export function addOdsFqtgsj(data: OdsFqtgsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxq/ods-fqtgsj/add",
    data,
  );
}

/**
 * 修改访企拓岗数据
 */
export function updateOdsFqtgsj(data: OdsFqtgsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-fqtgsj/update",
    data,
  );
}

/**
 * 删除访企拓岗数据
 */
export function deleteOdsFqtgsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxq/ods-fqtgsj/${id}`,
  );
}

/**
 * 批量删除访企拓岗数据
 */
export function batchDeleteOdsFqtgsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-fqtgsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出访企拓岗数据
 */
export function exportOdsFqtgsj(query: OdsFqtgsjQuery) {
  return request.post("/code/code/code-base/zygxq/ods-fqtgsj/export", query, {
    responseType: "blob",
  });
}

// 产学合作企业搜索结果
export interface OdsCxhzCompanyInfo {
  hzqymc: string;
  hzqytyshxydm: string;
}

/**
 * 模糊搜索产学合作企业
 * @param companyName 企业名称关键字
 */
export function searchCxhzCompanies(companyName: string) {
  return request.get<ApiResponse<OdsCxhzCompanyInfo[]>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/search",
    {
       companyName ,
    },
  );
}

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
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
// 专业选项接口
export interface ZyOption {
  value: string; // 专业号
  label: string; // 专业名称
}


/**
 * 获取专业下拉选项列表
 */
export function getZyhOptions(keyword?: string) {
  return request.get<ApiResponse<ZyOption[]>>(
    "/code/code/code-base/zygjx/ods-zyszsj/zy-options",
    {
      keyword 
    }
  );
}