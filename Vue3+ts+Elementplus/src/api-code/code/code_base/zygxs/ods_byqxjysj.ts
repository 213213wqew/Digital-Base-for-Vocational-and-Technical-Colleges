import { request } from "@/utils/request-code.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 毕业去向【就业】数据接口
 */

// 毕业去向【就业】数据表单数据
export interface OdsByqxjysjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xm?: string; // 姓名
  zyh?: string; // 专业号
  zymc?: string; // 专业名称
  jydwsfxqhzdw?: string; // 就业单位是否校企合作单位
  jydwmc?: string; // 就业单位名称
  jydwhym?: string; // 就业单位行业码
  jydwxzm?: string; // 就业单位性质码
  jydwgmm?: string; // 就业单位规模码
  qxx?: number; // 起薪线
  sfdk?: string; // 是否对口
  jyqysjgbm?: string; // 就业区域省机构编码
  jyqysjgmc?: string; // 就业区域省机构名称
  jyqyshjgbm?: string; // 就业区域市机构编码
  jyqyshjgmc?: string; // 就业区域市机构名称
  jyrq?: string; // 就业日期
  sfzzcy?: string; // 是否自主创业
  cyxmmc?: string; // 创业项目名称
  sflhjy?: string; // 是否灵活就业
  gzgwmc?: string; // 工作岗位名称
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 毕业去向【就业】数据详情
export interface OdsByqxjysjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xm: string; // 姓名
  zyh: string; // 专业号
  zymc: string; // 专业名称
  jydwsfxqhzdw: string; // 就业单位是否校企合作单位
  jydwmc: string; // 就业单位名称
  jydwhym: string; // 就业单位行业码
  jydwxzm: string; // 就业单位性质码
  jydwgmm: string; // 就业单位规模码
  qxx: number; // 起薪线
  sfdk: string; // 是否对口
  jyqysjgbm: string; // 就业区域省机构编码
  jyqysjgmc: string; // 就业区域省机构名称
  jyqyshjgbm: string; // 就业区域市机构编码
  jyqyshjgmc: string; // 就业区域市机构名称
  jyrq: string; // 就业日期
  sfzzcy: string; // 是否自主创业
  cyxmmc: string; // 创业项目名称
  sflhjy: string; // 是否灵活就业
  gzgwmc: string; // 工作岗位名称
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  jydwsfxqhzdwText?: string; // 就业单位是否校企合作单位文本
  jydwhymText?: string; // 就业单位行业码文本
  jydwxzmText?: string; // 就业单位性质码文本
  jydwgmmText?: string; // 就业单位规模码文本
  sfdkText?: string; // 是否对口文本
  sfzzcyText?: string; // 是否自主创业文本
  sflhjyText?: string; // 是否灵活就业文本
}

// 毕业去向【就业】数据查询参数
export interface OdsByqxjysjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xm?: string;
  zyh?: string;
  zymc?: string;
  jydwsfxqhzdw?: string;
  jydwmc?: string;
  jydwhym?: string;
  jydwxzm?: string;
  jydwgmm?: string;
  sfdk?: string;
  jyqysjgbm?: string;
  jyqysjgmc?: string;
  jyqyshjgbm?: string;
  jyqyshjgmc?: string;
  jyrqStart?: string;
  jyrqEnd?: string;
  sfzzcy?: string;
  cyxmmc?: string;
  sflhjy?: string;
  gzgwmc?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 毕业去向【就业】数据分页结果
export interface OdsByqxjysjPageResult {
  records: OdsByqxjysjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 字典选项（后端返回格式）
export interface DictOption {
  value: string; // 提交的值：基础代码名称
  label: string; // 显示的文本：数据源名称
}

/**
 * 分页查询毕业去向【就业】数据
 * @param query 查询参数
 * @returns 毕业去向【就业】数据列表
 */
export function getOdsByqxjysjPage(query: OdsByqxjysjQuery) {
  return request.post<ApiResponse<OdsByqxjysjPageResult>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/page",
    query,
  );
}

/**
 * 根据ID查询毕业去向【就业】数据详情
 * @param id 主键ID
 * @returns 毕业去向【就业】数据详情
 */
export function getOdsByqxjysjById(id: number) {
  return request.get<ApiResponse<OdsByqxjysjInfo>>(
    `/code/code/code-base/zygxs/ods-byqxjysj/${id}`,
  );
}

/**
 * 根据唯一性标识查询毕业去向【就业】数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 毕业去向【就业】数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsByqxjysjInfo>>(
    `/code/code/code-base/zygxs/ods-byqxjysj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增毕业去向【就业】数据
 * @param data 毕业去向【就业】数据信息
 * @returns 结果
 */
export function addOdsByqxjysj(data: OdsByqxjysjForm) {
  return request.post<ApiResponse<number>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/add",
    data,
  );
}

/**
 * 修改毕业去向【就业】数据
 * @param data 毕业去向【就业】数据信息
 * @returns 结果
 */
export function updateOdsByqxjysj(data: OdsByqxjysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/update",
    data,
  );
}

/**
 * 删除毕业去向【就业】数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsByqxjysj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-byqxjysj/${id}`,
  );
}

/**
 * 批量删除毕业去向【就业】数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsByqxjysj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出毕业去向【就业】数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsByqxjysj(query: OdsByqxjysjQuery) {
  return request.post("/code/code/code-base/zygxs/ods-byqxjysj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据 - 是否标志代码 (SFBZDM)
 * @returns 字典选项列表
 */
export function getSfOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 就业单位是否校企合作单位 (JYDWSFXQHZDM)
 * @returns 字典选项列表
 */
export function getJydwsfxqhzdmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 就业单位行业码 (HYDM)
 * @returns 字典选项列表
 */
export function getJydwhymOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/HYDM",
  );
}

/**
 * 获取字典数据 - 就业单位性质码 (DWXZDM)
 * @returns 字典选项列表
 */
export function getJydwxzmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/DWXZDM",
  );
}

/**
 * 获取字典数据 - 就业单位规模码 (JYDWGMDM)
 * @returns 字典选项列表
 */
export function getJydwgmmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/code/code-base-source/options/JYDWGMDM",
  );
}

/**
 * 批量修改上报状态
 * @param ids ID数组
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function batchUpdateReportStatus(ids: number[], reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/batch/report-status",
    {
      ids,
      reportStatus,
    },
  );
}

/**
 * 批量修改启用状态
 * @param ids ID数组
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function batchUpdateEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/code/code/code-base/zygxs/ods-byqxjysj/batch/enable-status",
    {
      ids,
      enableStatus,
    },
  );
}

/**
 * 修改单条记录上报状态
 * @param id 记录ID
 * @param reportStatus 上报状态
 * @returns 操作结果
 */
export function updateSingleReportStatus(id: number, reportStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-byqxjysj/${id}/report-status`,
    {
      reportStatus,
    },
  );
}

/**
 * 修改单条记录启用状态
 * @param id 记录ID
 * @param enableStatus 启用状态
 * @returns 操作结果
 */
export function updateSingleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/code/code/code-base/zygxs/ods-byqxjysj/${id}/enable-status`,
    {
      enableStatus,
    },
  );
}
/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/code/code/code-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}
 /**
 * 获取学生综合信息选项列表（包含专业信息）
 * 从学生画像数据中获取学号、姓名、专业号、专业名称
 * @param keyword 搜索关键字（学号或姓名）
 */
 export function getStudentOptions(keyword?: string) {
  return request.get<ApiResponse<Array<{
    value: string;  // 学号作为选择值
    label: string;  // 学号 - 姓名
    xh: string;     // 学号
    xsxm: string;   // 学生姓名
    zyh: string;    // 专业号
    zymc: string;   // 专业名称
  }>>>(
    "/code/code/code-base/zygxs/ods-xshxsj/student/comprehensive-options",
    {
      keyword 
    }
  );
}
