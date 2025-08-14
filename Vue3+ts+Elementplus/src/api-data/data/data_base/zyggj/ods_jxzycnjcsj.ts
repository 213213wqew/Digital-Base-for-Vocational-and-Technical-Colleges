import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 教学资源采纳基础数据接口
 */

// 教学资源采纳基础数据表单数据
export interface OdsJxzycnjcsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  cyjxzylx?: string; // 采用教学资源类型
  cyjxzybh?: string; // 采用教学资源编号
  cyjxzymc?: string; // 采用教学资源名称
  cygjdm?: string; // 采用国家代码
  cygjmc?: string; // 采用国家名称
  cygjssdz?: string; // 采用国家所属大洲
  sfydyl?: string; // 是否一带一路国家
  sfzywg?: string; // 是否中亚五国国家
  sfdmsg?: string; // 是否东盟十国国家
  sfshzz?: string; // 是否上合组织国家
  sfjzgj?: string; // 是否金砖国家
  cysj?: string; // 采用时间
  cyyxjg?: string; // 采用院校(机构)
  cylx?: string; // 采用类型
  sjwfxss?: number; // 涉及外方学生数
  sjcjsj?: string; // 数据采集时间
}

// 教学资源采纳基础数据详情
export interface OdsJxzycnjcsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  cyjxzylx: string; // 采用教学资源类型
  cyjxzybh: string; // 采用教学资源编号
  cyjxzymc: string; // 采用教学资源名称
  cygjdm: string; // 采用国家代码
  cygjmc: string; // 采用国家名称
  cygjssdz: string; // 采用国家所属大洲
  sfydyl: string; // 是否一带一路国家
  sfzywg: string; // 是否中亚五国国家
  sfdmsg: string; // 是否东盟十国国家
  sfshzz: string; // 是否上合组织国家
  sfjzgj: string; // 是否金砖国家
  cysj: string; // 采用时间
  cyyxjg: string; // 采用院校(机构)
  cylx: string; // 采用类型
  sjwfxss: number; // 涉及外方学生数
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdmText?: string; // 学校代码文本
  cyjxzylxText?: string; // 采用教学资源类型文本
  cygjdmText?: string; // 采用国家代码文本
  cylxText?: string; // 采用类型文本
}

// 教学资源采纳基础数据查询参数
export interface OdsJxzycnjcsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  cyjxzylx?: string;
  cyjxzybh?: string;
  cyjxzymc?: string;
  cygjdm?: string;
  cygjmc?: string;
  cyyxjg?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 教学资源采纳基础数据分页结果
export interface OdsJxzycnjcsjPageResult {
  records: OdsJxzycnjcsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询教学资源采纳基础数据
 */
export function getOdsJxzycnjcsjPage(query: OdsJxzycnjcsjQuery) {
  return request.post<ApiResponse<OdsJxzycnjcsjPageResult>>(
    "/data/data/data-base/zyggj/ods-jxzycnjcsj/page",
    query,
  );
}

/**
 * 根据ID查询教学资源采纳基础数据详情
 */
export function getOdsJxzycnjcsjById(id: number) {
  return request.get<ApiResponse<OdsJxzycnjcsjInfo>>(
    `/data/data/data-base/zyggj/ods-jxzycnjcsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询教学资源采纳基础数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsJxzycnjcsjInfo>>(
    `/data/data/data-base/zyggj/ods-jxzycnjcsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增教学资源采纳基础数据
 */
export function addOdsJxzycnjcsj(data: OdsJxzycnjcsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zyggj/ods-jxzycnjcsj/add",
    data,
  );
}

/**
 * 修改教学资源采纳基础数据
 */
export function updateOdsJxzycnjcsj(data: OdsJxzycnjcsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zyggj/ods-jxzycnjcsj/update",
    data,
  );
}

/**
 * 删除教学资源采纳基础数据
 */
export function deleteOdsJxzycnjcsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zyggj/ods-jxzycnjcsj/${id}`,
  );
}

/**
 * 批量删除教学资源采纳基础数据
 */
export function batchDeleteOdsJxzycnjcsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zyggj/ods-jxzycnjcsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出教学资源采纳基础数据
 */
export function exportOdsJxzycnjcsj(query: OdsJxzycnjcsjQuery) {
  return request.post(
    "/data/data/data-base/zyggj/ods-jxzycnjcsj/export",
    query,
    {
      responseType: "blob",
    },
  );
}

/**
 * 获取字典选项
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<any[]>>(`/data/data/data-base-source/options/${dictType}`);
}
 
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/data/data/data-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}