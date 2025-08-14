import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 图书借阅数据接口
 */

// 字典选项接口
export interface DictOption {
  value: string;
  label: string;
}

// 图书借阅数据表单数据
export interface OdsTsjysjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  jyzbh?: string; // 借阅者编号
  jyzxm?: string; // 借阅者姓名
  jyrylbm?: string; // 借阅人员类别码
  tsbh?: string; // 图书编号
  jyrq?: string; // 借阅日期
  yjghrq?: string; // 预计归还日期
  sjghrq?: string; // 实际归还日期
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 图书借阅数据详情
export interface OdsTsjysjInfo {
  id: number;
  zjsjwyxbs: string;
  xxdm: string;
  jyzbh: string;
  jyzxm: string;
  jyrylbm: string;
  jyrylbmText?: string; // 人员类别文本
  tsbh: string;
  jyrq: string;
  yjghrq: string;
  sjghrq: string;
  sjcjsj: string;
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
}

// 图书借阅数据查询参数
export interface OdsTsjysjQuery {
  jyzbh?: string;
  jyzxm?: string;
  tsbh?: string;
  pageNum: number;
  pageSize: number;
}

// 图书借阅数据分页结果
export interface OdsTsjysjPageResult {
  records: OdsTsjysjInfo[];
  total: number;
}

/**
 * 分页查询图书借阅数据
 */
export function getOdsTsjysjPage(query: OdsTsjysjQuery) {
  return request.post<ApiResponse<OdsTsjysjPageResult>>(
    "/api/meta/meta-base/zygzc/ods-tsjysj/page",
    query,
  );
}

/**
 * 根据ID查询图书借阅数据详情
 */
export function getOdsTsjysjById(id: number) {
  return request.get<ApiResponse<OdsTsjysjInfo>>(
    `/api/meta/meta-base/zygzc/ods-tsjysj/${id}`,
  );
}

/**
 * 新增图书借阅数据
 */
export function addOdsTsjysj(data: OdsTsjysjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygzc/ods-tsjysj/add",
    data,
  );
}

/**
 * 修改图书借阅数据
 */
export function updateOdsTsjysj(data: OdsTsjysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygzc/ods-tsjysj/update",
    data,
  );
}

/**
 * 删除图书借阅数据
 */
export function deleteOdsTsjysj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygzc/ods-tsjysj/${id}`,
  );
}

/**
 * 批量删除图书借阅数据
 */
export function batchDeleteOdsTsjysj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygzc/ods-tsjysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出图书借阅数据
 */
export function exportOdsTsjysj(query: OdsTsjysjQuery) {
  return request.post("/api/meta/meta-base/zygzc/ods-tsjysj/export", query, {
    responseType: "blob",
  });
}

/**
 * 模糊搜索图书信息
 * @param keyword 搜索关键字
 */
export function searchBookInfo(keyword?: string) {
  return request.get<ApiResponse<DictOption[]>>("/api/meta/meta-base/zygzc/ods-tsjbsj/search", {
     keyword ,
  });
}

/**
 * 获取人员类别字典
 */
export function getJyrylbmDict() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/RYLXDM",
  );
}
/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}