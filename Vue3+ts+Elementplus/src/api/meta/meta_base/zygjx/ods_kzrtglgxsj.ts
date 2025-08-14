import request from "@/utils/request";

// API响应类型
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

// 课程基本信息接口（用于下拉选择）
export interface CourseBasicInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  kclxm?: string; // 课程类型码
  kcsxm?: string; // 课程属性码
  kcxzm?: string; // 课程性质码
  createTime?: string;
  updateTime?: string;
}

// 证书基本信息接口（用于下拉选择）
export interface CertificateBasicInfo {
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
  createTime?: string;
  updateTime?: string;
}

// 课证融通关联关系数据查询参数
export interface OdsKzrtglgxsjQuery {
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  kcmc?: string; // 课程名称
  kch?: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsjStart?: string; // 数据采集时间开始
  sjcjsjEnd?: string; // 数据采集时间结束
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
  pageNum?: number; // 页码
  pageSize?: number; // 每页数量
}

// 课证融通关联关系数据DTO
export interface OdsKzrtglgxsjDTO {
  id?: number; // 主键ID
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsj: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 课证融通关联关系数据VO
export interface OdsKzrtglgxsjVO {
  id: number; // 主键ID
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  kcmc: string; // 课程名称
  kch: string; // 课程号
  zsh?: string; // 证书号
  zsmc?: string; // 证书名称
  sjcjsj: string; // 数据采集时间
  sjcjsjDisplay: string; // 数据采集时间显示格式
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  reportStatusText: string; // 上报状态文本
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  enableStatusText: string; // 启用状态文本
  createTime: string; // 创建时间
  updateTime: string; // 更新时间
}

// 分页查询课证融通关联关系数据
export function getOdsKzrtglgxsjPage(params: OdsKzrtglgxsjQuery) {
  return request.post<ApiResponse<any>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/page",
    params,
  );
}

// 根据ID查询课证融通关联关系数据详情
export function getOdsKzrtglgxsjById(id: number) {
  return request.get<ApiResponse<OdsKzrtglgxsjVO>>(
    `/api/meta/meta-base/zygjx/ods-kzrtglgxsj/${id}`,
  );
}

// 新增课证融通关联关系数据
export function addOdsKzrtglgxsj(data: OdsKzrtglgxsjDTO) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/add",
    data,
  );
}

// 修改课证融通关联关系数据
export function updateOdsKzrtglgxsj(data: OdsKzrtglgxsjDTO) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/update",
    data,
  );
}

// 删除课证融通关联关系数据
export function deleteOdsKzrtglgxsj(ids: string) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygjx/ods-kzrtglgxsj/${ids}`,
  );
}

// 导出课证融通关联关系数据
export function exportOdsKzrtglgxsj(params: OdsKzrtglgxsjQuery) {
  return request.post<ArrayBuffer>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/export",
    params,
    {
      responseType: "arraybuffer",
    },
  );
}

// 批量更新上报状态
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/batch/report-status",
    {
      ids: ids,
      status: reportStatus,
    },
  );
}

// 批量更新启用状态
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/batch/enable-status",
    {
      ids: ids,
      status: enableStatus,
    },
  );
}

// 根据唯一性标识查询课证融通关联关系数据
export function getOdsKzrtglgxsjByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsKzrtglgxsjVO>>(
    `/api/meta/meta-base/zygjx/ods-kzrtglgxsj/unique/${zjsjwyxbs}`,
  );
}

// 导入课证融通关联关系数据
export function importOdsKzrtglgxsj(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return request.post<ApiResponse<string>>(
    "/api/meta/meta-base/zygjx/ods-kzrtglgxsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 120000, // 2分钟超时
    },
  );
}
/**
 * 模糊搜索课程基本信息
 * 从课程基本数据表中获取课程号和课程名称
 * @param keyword 搜索关键词
 * @param limit 返回结果数量限制
 * @returns 课程基本信息列表
 */
export function searchCourses(keyword?: string, limit: number = 20) {
  const params = new URLSearchParams();
  if (keyword !== undefined && keyword !== null) {
    params.append("keyword", keyword);
  }
  params.append("limit", limit.toString());

  return request.get<ApiResponse<CourseBasicInfo[]>>(
    `/api/meta/meta-base/zygjx/ods-kcjbs/search?${params.toString()}`,
  );
}

/**
 * 模糊搜索证书信息
 * 从1+X证书数据表中获取证书号和证书名称
 * @param keyword 搜索关键词，不传则获取所有数据
 * @param limit 返回结果数量限制，不传则使用后端默认值
 * @returns 证书信息列表
 */
export function searchCertificates(keyword?: string, limit?: number) {
  const params = new URLSearchParams();

  // 只有当keyword有值且不为空字符串时才添加
  if (keyword && keyword.trim() !== "") {
    params.append("keyword", keyword.trim());
  }

  // 只有当limit有值时才添加，否则使用后端默认值
  if (limit !== undefined && limit !== null) {
    params.append("limit", limit.toString());
  }

  return request.get<ApiResponse<CertificateBasicInfo[]>>(
    `/api/meta/meta-base/zygxs/ods-gzxzssj/search?${params.toString()}`,
  );
}
