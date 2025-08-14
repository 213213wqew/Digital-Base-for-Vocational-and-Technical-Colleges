import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 学生技能证书数据接口
 */

// 学生技能证书数据表单数据
export interface OdsXsjnzssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  fzjgbm?: string; // 发证机构编码
  zsdj?: string; // 证书等级
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  fzrq?: string; // 发证日期
  sfzcdzzs?: string; // 是否支持电子证书
  xzdycs?: number; // 下载/打印次数
  sjcjsj?: string; // 数据采集时间
}

// 学生技能证书数据详情
export interface OdsXsjnzssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xsxm: string; // 学生姓名
  fzjgbm: string; // 发证机构编码
  zsdj: string; // 证书等级
  zsh: string; // 证书号
  zsmc: string; // 证书名称
  fzrq: string; // 发证日期
  sfzcdzzs: string; // 是否支持电子证书
  xzdycs: number; // 下载/打印次数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zsdjText?: string; // 证书等级文本
  sfzcdzsText?: string; // 是否支持电子证书文本
}

// 学生技能证书数据查询参数
export interface OdsXsjnzssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xsxm?: string;
  zsh?: string;
  zsmc?: string;
  zsdj?: string;
  sfzcdzzs?: string;
  fzrqStart?: string;
  fzrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 学生技能证书数据分页结果
export interface OdsXsjnzssjPageResult {
  records: OdsXsjnzssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询学生技能证书数据
 */
export function getOdsXsjnzssjPage(query: OdsXsjnzssjQuery) {
  return request.post<ApiResponse<OdsXsjnzssjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-xsjnzssj/page",
    query,
  );
}

/**
 * 根据ID查询学生技能证书数据详情
 */
export function getOdsXsjnzssjById(id: number) {
  return request.get<ApiResponse<OdsXsjnzssjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xsjnzssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询学生技能证书数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsXsjnzssjInfo>>(
    `/api/meta/meta-base/zygxs/ods-xsjnzssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增学生技能证书数据
 */
export function addOdsXsjnzssj(data: OdsXsjnzssjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-xsjnzssj/add",
    data,
  );
}

/**
 * 修改学生技能证书数据
 */
export function updateOdsXsjnzssj(data: OdsXsjnzssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xsjnzssj/update",
    data,
  );
}

/**
 * 删除学生技能证书数据
 */
export function deleteOdsXsjnzssj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-xsjnzssj/${id}`,
  );
}

/**
 * 批量删除学生技能证书数据
 */
export function batchDeleteOdsXsjnzssj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-xsjnzssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出学生技能证书数据
 */
export function exportOdsXsjnzssj(query: OdsXsjnzssjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-xsjnzssj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

/**
 * 获取学号学生姓名选项列表
 */
export function getStudentOptions(keyword?: string) {
  return request.get<
    ApiResponse<Array<{ value: string; label: string; xsxm: string }>>
  >("/api/meta/meta-base/zygxs/ods-xshxsj/student/options", {
     keyword 
  });
}

/**
 * 根据字典代码获取选项列表
 * @param dictCode 字典代码
 */
export function getDictOptions(dictCode: string) {
  return request.get<ApiResponse<Array<{ value: string; label: string }>>>(
    `/api/meta/data-base-source/options/${dictCode}`
  );
}
