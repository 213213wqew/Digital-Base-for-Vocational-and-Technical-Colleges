import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 产学合作数据接口
 */

// 产学合作数据表单数据
export interface OdsCxhzsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zyh?: string; // 专业号
  hzqytyshxydm?: string; // 合作企业统一社会信用代码
  hzqymc?: string; // 合作企业名称
  hzksny?: string; // 合作开始年月
  ddpyrs?: number; // 订单培养人数
  gtkfkcms?: number; // 共同开发课程门数
  gtkfjcs?: number; // 共同开发教材数
  zcxxjzjss?: number; // 支持学校兼职教师数
  jsdgsxxss?: number; // 接受顶岗实习学生数
  jsbysjys?: number; // 接受毕业生就业数
  xxwqyjsfwnsr?: number; // 学校为企业技术服务年收入
  sjcjsj?: string; // 数据采集时间
}

// 产学合作数据详情
export interface OdsCxhzsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zyh: string; // 专业号
  hzqytyshxydm: string; // 合作企业统一社会信用代码
  hzqymc: string; // 合作企业名称
  hzksny: string; // 合作开始年月
  ddpyrs: number; // 订单培养人数
  gtkfkcms: number; // 共同开发课程门数
  gtkfjcs: number; // 共同开发教材数
  zcxxjzjss: number; // 支持学校兼职教师数
  jsdgsxxss: number; // 接受顶岗实习学生数
  jsbysjys: number; // 接受毕业生就业数
  xxwqyjsfwnsr: number; // 学校为企业技术服务年收入
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  zyhText?: string; // 专业号文本
}

// 产学合作数据查询参数
export interface OdsCxhzsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zyh?: string;
  hzqytyshxydm?: string;
  hzqymc?: string;
  hzksny?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 产学合作数据分页结果
export interface OdsCxhzsjPageResult {
  records: OdsCxhzsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询产学合作数据
 */
export function getOdsCxhzsjPage(query: OdsCxhzsjQuery) {
  return request.post<ApiResponse<OdsCxhzsjPageResult>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/page",
    query,
  );
}

/**
 * 根据ID查询产学合作数据详情
 */
export function getOdsCxhzsjById(id: number) {
  return request.get<ApiResponse<OdsCxhzsjInfo>>(
    `/code/code/code-base/zygxq/ods-cxhzsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询产学合作数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsCxhzsjInfo>>(
    `/code/code/code-base/zygxq/ods-cxhzsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增产学合作数据
 */
export function addOdsCxhzsj(data: OdsCxhzsjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/add",
    data,
  );
}

/**
 * 修改产学合作数据
 */
export function updateOdsCxhzsj(data: OdsCxhzsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/update",
    data,
  );
}

/**
 * 删除产学合作数据
 */
export function deleteOdsCxhzsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxq/ods-cxhzsj/${id}`,
  );
}

/**
 * 批量删除产学合作数据
 */
export function batchDeleteOdsCxhzsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxq/ods-cxhzsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出产学合作数据
 */
export function exportOdsCxhzsj(query: OdsCxhzsjQuery) {
  return request.post("/code/code/code-base/zygxq/ods-cxhzsj/export", query, {
    responseType: "blob",
  });
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 获取专业号列表
 * @param query 查询条件
 * @returns 专业号列表
 */
export function getZyhOptions(query: string) {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base/zygjx/ods-zyjsqksj/batch/options?query=" + query,
  );
}

/**
 * 获取系统学校代码
 * @returns 系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}