import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 奖助贷申请数据接口
 */

// 奖助贷申请数据表单数据
export interface OdsJzdsqsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  jzxmmc?: string; // 奖助项目名称
  jzxmzlm?: string; // 奖助项目种类码
  jzbz?: string; // 奖助标准
  zzdwgr?: string; // 资助单位/个人
  zjlym?: string; // 资金来源码
  sqrq?: string; // 申请日期
  spsj?: string; // 审批时间
  spztm?: string; // 审批状态码
  sjcjsj?: string; // 数据采集时间
}

// 奖助贷申请数据详情
export interface OdsJzdsqsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  jzxmmc: string; // 奖助项目名称
  jzxmzlm: string; // 奖助项目种类码
  jzbz: string; // 奖助标准
  zzdwgr: string; // 资助单位/个人
  zjlym: string; // 资金来源码
  sqrq: string; // 申请日期
  spsj: string; // 审批时间
  spztm: string; // 审批状态码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jzxmzlmText?: string; // 奖助项目种类名称
  zjlymText?: string; // 资金来源名称
  spztmText?: string; // 审批状态名称
}

// 奖助贷申请数据查询参数
export interface OdsJzdsqsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  jzxmmc?: string;
  jzxmzlm?: string;
  zjlym?: string;
  spztm?: string;
  sqrqStart?: string;
  sqrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 奖助贷申请数据分页结果
export interface OdsJzdsqsjPageResult {
  records: OdsJzdsqsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询奖助贷申请数据
 */
export function getOdsJzdsqsjPage(query: OdsJzdsqsjQuery) {
  return request.post<ApiResponse<OdsJzdsqsjPageResult>>(
    "/code/code/code-base/zygxs/ods-jzdsqsj/page",
    query,
  );
}

/**
 * 根据ID查询奖助贷申请数据详情
 */
export function getOdsJzdsqsjById(id: number) {
  return request.get<ApiResponse<OdsJzdsqsjInfo>>(
    `/code/code/code-base/zygxs/ods-jzdsqsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询奖助贷申请数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJzdsqsjInfo>>(
    `/code/code/code-base/zygxs/ods-jzdsqsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增奖助贷申请数据
 */
export function addOdsJzdsqsj(data: OdsJzdsqsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-jzdsqsj/add",
    data,
  );
}

/**
 * 修改奖助贷申请数据
 */
export function updateOdsJzdsqsj(data: OdsJzdsqsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-jzdsqsj/update",
    data,
  );
}

/**
 * 删除奖助贷申请数据
 */
export function deleteOdsJzdsqsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-jzdsqsj/${id}`,
  );
}

/**
 * 批量删除奖助贷申请数据
 */
export function batchDeleteOdsJzdsqsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-jzdsqsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出奖助贷申请数据
 */
export function exportOdsJzdsqsj(query: OdsJzdsqsjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-jzdsqsj/export", query, {
    responseType: "blob",
  });
}
/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code"
  );
}

/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    "/code/code/code-base/zygxs/ods-xshxsj/student/options",
    {
       keyword,

    },
  );
}

/**
 * 获取数字字典选项
 * @param dictCode 字典编码
 */
export function getDictOptions(dictCode: string) {
  return request.get<ApiResponse<Array<{ label: string; value: string }>>>(
    `/code/code/code-base-source/options/${dictCode}`,
  );
}