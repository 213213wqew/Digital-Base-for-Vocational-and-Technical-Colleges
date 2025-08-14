import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 学生消费数据接口
 */

// 学生消费数据表单数据
export interface OdsXsxfsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xfze?: number; // 消费总额
  xfrc?: number; // 消费人次
  xflbm?: string; // 消费类别码
  xfrq?: string; // 消费日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
}

// 学生消费数据查询条件
export interface OdsXsxfsjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xflbm?: string; // 消费类别码
  xfrqStart?: string; // 消费日期开始
  xfrqEnd?: string; // 消费日期结束
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  reportStatus?: string; // 上报状态
  enableStatus?: string; // 启用状态
  pageNum?: number; // 页码
  pageSize?: number; // 页大小
}

// 学生消费数据展示对象, OdsXsxfsjInfo 是 OdsXsxfsjVO 的别名
export type OdsXsxfsjInfo = OdsXsxfsjVO;
export interface OdsXsxfsjVO {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xfze?: number; // 消费总额
  xfrc?: number; // 消费人次
  xflbm?: string; // 消费类别码
  xflbmText?: string; // 消费类别码文本
  xfrq?: string; // 消费日期
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态
  reportStatusText?: string; // 上报状态文本
  enableStatus?: string; // 启用状态
  enableStatusText?: string; // 启用状态文本
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
}

// 分页结果
export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生消费数据
 */
export const getOdsXsxfsjPage = (
  data: OdsXsxfsjQuery,
): Promise<ApiResponse<PageResult<OdsXsxfsjVO>>> => {
  return request.post("/data/data/data-base/zygfw/ods-xsxfsj/page", data);
};

/**
 * 根据ID查询学生消费数据详情
 */
export const getOdsXsxfsjById = (
  id: number,
): Promise<ApiResponse<OdsXsxfsjVO>> => {
  return request.get(`/data/data/data-base/zygfw/ods-xsxfsj/${id}`);
};

/**
 * 根据唯一性标识查询学生消费数据
 */
export const getOdsXsxfsjByUniqueId = (
  zjsjwyxbs: string,
): Promise<ApiResponse<OdsXsxfsjVO>> => {
  return request.get(
    `/data/data/data-base/zygfw/ods-xsxfsj/unique/${zjsjwyxbs}`,
  );
};

/**
 * 新增学生消费数据
 */
export const addOdsXsxfsj = (
  data: OdsXsxfsjForm,
): Promise<ApiResponse<number>> => {
  return request.post("/data/data/data-base/zygfw/ods-xsxfsj/add", data);
};

/**
 * 修改学生消费数据
 */
export const updateOdsXsxfsj = (
  data: OdsXsxfsjForm,
): Promise<ApiResponse<boolean>> => {
  return request.put("/data/data/data-base/zygfw/ods-xsxfsj/update", data);
};

/**
 * 删除学生消费数据
 */
export const deleteOdsXsxfsj = (id: number): Promise<ApiResponse<boolean>> => {
  return request.delete(`/data/data/data-base/zygfw/ods-xsxfsj/${id}`);
};

/**
 * 批量删除学生消费数据
 */
export const batchDeleteOdsXsxfsj = (
  ids: number[],
): Promise<ApiResponse<boolean>> => {
  return request.delete("/data/data/data-base/zygfw/ods-xsxfsj/batch", ids);
};

/**
 * 导出学生消费数据
 */
export const exportOdsXsxfsj = (data: OdsXsxfsjQuery): Promise<Blob> => {
  return request.post("/data/data/data-base/zygfw/ods-xsxfsj/export", data, {
    responseType: "blob",
  });
};

/**
 * 获取系统默认学校代码
 */
export const getSystemSchoolCode = (): Promise<ApiResponse<string>> => {
  return request.get("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
};

/**
 * 根据字典类型获取字典选项
 */
export const getDictOptions = (dictType: string): Promise<ApiResponse<any[]>> => {
  return request.get(`/data/data/data-base-source/options/${dictType}`);
};
