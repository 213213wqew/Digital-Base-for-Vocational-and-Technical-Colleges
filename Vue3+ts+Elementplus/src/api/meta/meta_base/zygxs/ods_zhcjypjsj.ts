import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";

/**
 * 综合成绩与评价数据接口
 */

// 综合成绩与评价数据表单数据
export interface OdsZhcjypjsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  xn?: string; // 学年（度）
  xqm?: string; // 学期码
  zyh?: string; // 专业号
  zymc?: string; // 专业名称
  xh?: string; // 学号
  xsxm?: string; // 学生姓名
  ggjckyhxf?: number; // 公共基础课已获学分
  zyjckyhxf?: number; // 专业基础课已获学分
  zyhxkyhxf?: number; // 专业核心课已获学分
  zytzkyhxf?: number; // 专业拓展课已获学分
  ggjckcj?: number; // 公共基础课成绩
  zyjckcj?: number; // 专业基础课成绩
  zyhxkcj?: number; // 专业核心课成绩
  zytzkcj?: number; // 专业拓展课成绩
  gwsxcj?: number; // 岗位实习成绩
  lrrq?: string; // 录入日期
  sjcjsj?: string; // 数据采集时间
}

// 综合成绩与评价数据详情
export interface OdsZhcjypjsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  xn: string; // 学年（度）
  xqm: string; // 学期码
  zyh: string; // 专业号
  zymc: string; // 专业名称
  xh: string; // 学号
  xsxm: string; // 学生姓名
  ggjckyhxf: number; // 公共基础课已获学分
  zyjckyhxf: number; // 专业基础课已获学分
  zyhxkyhxf: number; // 专业核心课已获学分
  zytzkyhxf: number; // 专业拓展课已获学分
  ggjckcj: number; // 公共基础课成绩
  zyjckcj: number; // 专业基础课成绩
  zyhxkcj: number; // 专业核心课成绩
  zytzkcj: number; // 专业拓展课成绩
  gwsxcj: number; // 岗位实习成绩
  lrrq: string; // 录入日期
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xqmText?: string; // 学期码文本
}

// 综合成绩与评价数据查询参数
export interface OdsZhcjypjsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  xn?: string;
  xqm?: string;
  zyh?: string;
  zymc?: string;
  xh?: string;
  xsxm?: string;
  lrrqStart?: string;
  lrrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 综合成绩与评价数据分页结果
export interface OdsZhcjypjsjPageResult {
  records: OdsZhcjypjsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

/**
 * 分页查询综合成绩与评价数据
 */
export function getOdsZhcjypjsjPage(query: OdsZhcjypjsjQuery) {
  return request.post<ApiResponse<OdsZhcjypjsjPageResult>>(
    "/api/meta/meta-base/zygxs/ods-zhcjypjsj/page",
    query,
  );
}

/**
 * 根据ID查询综合成绩与评价数据详情
 */
export function getOdsZhcjypjsjById(id: number) {
  return request.get<ApiResponse<OdsZhcjypjsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-zhcjypjsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询综合成绩与评价数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsZhcjypjsjInfo>>(
    `/api/meta/meta-base/zygxs/ods-zhcjypjsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增综合成绩与评价数据
 */
export function addOdsZhcjypjsj(data: OdsZhcjypjsjForm) {
  return request.post<ApiResponse<number>>(
    "/api/meta/meta-base/zygxs/ods-zhcjypjsj/add",
    data,
  );
}

/**
 * 修改综合成绩与评价数据
 */
export function updateOdsZhcjypjsj(data: OdsZhcjypjsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-zhcjypjsj/update",
    data,
  );
}

/**
 * 删除综合成绩与评价数据
 */
export function deleteOdsZhcjypjsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/api/meta/meta-base/zygxs/ods-zhcjypjsj/${id}`,
  );
}

/**
 * 批量删除综合成绩与评价数据
 */
export function batchDeleteOdsZhcjypjsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/api/meta/meta-base/zygxs/ods-zhcjypjsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出综合成绩与评价数据
 */
export function exportOdsZhcjypjsj(query: OdsZhcjypjsjQuery) {
  return request.post("/api/meta/meta-base/zygxs/ods-zhcjypjsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDicts(dictType: string) {
  return request.get<ApiResponse<{ label: string; value: string }[]>>(
    `/api/meta/data-base-source/options/XQDM`
  );
}

/**
 * 获取学生综合信息选项列表（包含专业信息）
 * 从学生画像数据中获取学号、姓名、专业号、专业名称
 * @param keyword 搜索关键字（学号或姓名）
 */
export function getStudentComprehensiveOptions(keyword?: string) {
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
