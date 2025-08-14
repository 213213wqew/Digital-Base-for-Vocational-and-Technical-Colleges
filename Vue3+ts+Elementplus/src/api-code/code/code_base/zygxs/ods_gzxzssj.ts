import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 1+X证书数据接口
 */

// 1+X证书数据表单数据
export interface OdsGzxzssjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  zsh?: string; // 证书号
  zyh?: string; // 专业号
  fzjgbm?: string; // 发证机构编码
  fzjgmc?: string; // 发证机构名称
  zsmc?: string; // 证书名称
  zslx?: string; // 证书类型
  zsdj?: string; // 证书等级
  jddd?: string; // 鉴定地点
  sjcjsj?: string; // 数据采集时间
  enableStatus?: string; // 启用状态
  bz?: string; // 备注
}
// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}
export interface ZyOption {
  zyh: string;
  zymc: string;
  zysysxbmc: string;
  label: string;
}

// 1+X证书数据详情
export interface OdsGzxzssjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  zsh: string; // 证书号
  zyh: string; // 专业号
  fzjgbm: string; // 发证机构编码
  fzjgmc: string; // 发证机构名称
  zsmc: string; // 证书名称
  zslx: string; // 证书类型
  zsdj: string; // 证书等级
  jddd: string; // 鉴定地点
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  zslxText?: string; // 证书类型文本
  zsdjText?: string; // 证书等级文本
  jdddText?: string; // 鉴定地点文本
}

// 1+X证书数据查询参数
export interface OdsGzxzssjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  zsh?: string;
  zyh?: string;
  fzjgbm?: string;
  fzjgmc?: string;
  zsmc?: string;
  zslx?: string;
  zsdj?: string;
  jddd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 1+X证书数据分页结果
export interface OdsGzxzssjPageResult {
  records: OdsGzxzssjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询1+X证书数据
 */
export function getOdsGzxzssjPage(query: OdsGzxzssjQuery) {
  return request.post<ApiResponse<OdsGzxzssjPageResult>>(
    "/code/code/code-base/zygxs/ods-gzxzssj/page",
    query,
  );
}

/**
 * 根据ID查询1+X证书数据详情
 */
export function getOdsGzxzssjById(id: number) {
  return request.get<ApiResponse<OdsGzxzssjInfo>>(
    `/code/code/code-base/zygxs/ods-gzxzssj/${id}`,
  );
}

/**
 * 根据唯一性标识查询1+X证书数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsGzxzssjInfo>>(
    `/code/code/code-base/zygxs/ods-gzxzssj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增1+X证书数据
 */
export function addOdsGzxzssj(data: OdsGzxzssjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-gzxzssj/add",
    data,
  );
}

/**
 * 修改1+X证书数据
 */
export function updateOdsGzxzssj(data: OdsGzxzssjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-gzxzssj/update",
    data,
  );
}

/**
 * 删除1+X证书数据
 */
export function deleteOdsGzxzssj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-gzxzssj/${id}`,
  );
}

/**
 * 批量删除1+X证书数据
 */
export function batchDeleteOdsGzxzssj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-gzxzssj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出1+X证书数据
 */
export function exportOdsGzxzssj(query: OdsGzxzssjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-gzxzssj/export", query, {
    responseType: "blob",
  });
}

/**
 * @description 获取系统默认的学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxtsxxhxtyysj/system-school-code",
  );
}

// 获取证书类型、证书等级、鉴定地点的下拉选项
export const getSelectOptions = (code: string) => {
  return request.get<ApiResponse<DictOption[]>>(
    `/code/code/code-base-source/options/${code}`,
  );
};

 
/**
 * 获取专业号列表
 * @param keyword 搜索关键字
 * @returns Promise<ApiResponse<ZyOption[]>>
 */
export function getZyhOptions(
  keyword?: string,
): Promise<ApiResponse<ZyOption[]>> {
  return request.get("/code/code/code-base/zygjx/ods-zyszsj/zy-options", {
    keyword,
  });
}

