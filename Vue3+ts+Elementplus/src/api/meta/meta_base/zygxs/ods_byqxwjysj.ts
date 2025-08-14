import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 毕业去向【未就业】数据接口
 */

// 毕业去向【未就业】数据表单数据
export interface OdsByqxwjysjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xh?: string; // 学号
  xm?: string; // 姓名
  zyh?: string; // 专业号
  zymc?: string; // 专业名称
  wjylxm?: string; // 未就业类型码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
  bz?: string; // 备注
}

// 毕业去向【未就业】数据详情
export interface OdsByqxwjysjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xh: string; // 学号
  xm: string; // 姓名
  zyh: string; // 专业号
  zymc: string; // 专业名称
  wjylxm: string; // 未就业类型码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  wjylxmText?: string; // 未就业类型名称
}

// 毕业去向【未就业】数据查询参数
export interface OdsByqxwjysjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xh?: string;
  xm?: string;
  zyh?: string;
  zymc?: string;
  wjylxm?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  reportStatus?: string;
  enableStatus?: string;
  pageNum: number;
  pageSize: number;
}

// 毕业去向【未就业】数据分页结果
export interface OdsByqxwjysjPageResult {
  records: OdsByqxwjysjInfo[];
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
 * 分页查询毕业去向【未就业】数据
 * @param query 查询参数
 * @returns 毕业去向【未就业】数据列表
 */
export function getOdsByqxwjysjPage(query: OdsByqxwjysjQuery) {
  return request.post<ApiResponse<OdsByqxwjysjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-byqxwjysj/page",
    query,
  );
}

/**
 * 根据ID查询毕业去向【未就业】数据详情
 * @param id 主键ID
 * @returns 毕业去向【未就业】数据详情
 */
export function getOdsByqxwjysjById(id: number) {
  return request.get<ApiResponse<OdsByqxwjysjInfo>>(
    `/api/meta/meta-base/zygxs/ods-byqxwjysj/${id}`,
  );
}

/**
 * 根据唯一性标识查询毕业去向【未就业】数据
 * @param zjsjwyxbs 主键数据唯一性标识
 * @returns 毕业去向【未就业】数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsByqxwjysjInfo>>(
    `/api/meta/meta-base/zygxs/ods-byqxwjysj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增毕业去向【未就业】数据
 * @param data 毕业去向【未就业】数据信息
 * @returns 结果
 */
export function addOdsByqxwjysj(data: OdsByqxwjysjForm) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxwjysj/add",
    data,
  );
}

/**
 * 修改毕业去向【未就业】数据
 * @param data 毕业去向【未就业】数据信息
 * @returns 结果
 */
export function updateOdsByqxwjysj(data: OdsByqxwjysjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxwjysj/update",
    data,
  );
}

/**
 * 删除毕业去向【未就业】数据
 * @param id 主键ID
 * @returns 结果
 */
export function deleteOdsByqxwjysj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-byqxwjysj/${id}`,
  );
}

/**
 * 批量删除毕业去向【未就业】数据
 * @param ids 主键ID数组
 * @returns 结果
 */
export function batchDeleteOdsByqxwjysj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxwjysj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出毕业去向【未就业】数据
 * @param query 查询条件
 * @returns Excel文件
 */
export function exportOdsByqxwjysj(query: OdsByqxwjysjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-byqxwjysj/export", query, {
    responseType: "blob",
  });
}

  
/**
 * 获取未就业类型选项
 */
export function getWjylxOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/api/meta/data-base-source/options/WJYLXDM",
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
    `/api/meta/meta-base/zygxs/ods-byqxwjysj/${id}/status`,
    enableStatus,
  );
}

/**
 * 批量上报数据
 * @param ids ID数组
 * @returns 操作结果
 */
export function batchReport(ids: number[]) {
  return request.post<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-byqxwjysj/batch-report",
    ids,
  );
}
/**
 * 获取当前系统学校代码
 * @returns 学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>(
    "/api/meta/meta-base/zygxx/ods-xxhxtjssj/system-school-code",
  );
}

// 学生选项
export interface StudentOption {
  value: string;  // 学号作为选择值
  label: string;  // 学号 - 姓名
  xh: string;     // 学号
  xsxm: string;   // 学生姓名
  zyh: string;    // 专业号
  zymc: string;   // 专业名称
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
    "/api/meta/meta-base/zygxs/ods-xshxsj/student/comprehensive-options",
    {
      keyword 
    }
  );
}

