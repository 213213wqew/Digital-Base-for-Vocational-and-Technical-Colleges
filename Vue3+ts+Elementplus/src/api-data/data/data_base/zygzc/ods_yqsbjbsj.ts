import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 仪器设备基本数据接口
 */

// 仪器设备基本数据表单数据
export interface OdsYqsbjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  yqh?: string; // 仪器号
  yqmc?: string; // 仪器名称
  yqywmc?: string; // 仪器英文名称
  xxdwccm?: string; // 学校单位层次码
  cqm?: string; // 产权码
  syzkm?: string; // 使用状况码
  gxzcflm?: string; // 高校资产分类码
  yqxh?: string; // 仪器型号
  ccrq?: string; // 出厂日期
  scgbdqm?: string; // 生产国别/地区码
  jfkmm?: string; // 经费科目码
  gzrq?: string; // 购置日期
  sccj?: string; // 生产厂家
  cch?: string; // 出厂号
  djh?: string; // 单据号
  tp?: string; // 图片
  fjh?: string; // 房间号
  fjmc?: string; // 房间名称
  sbfzrh?: string; // 设备负责人号
  sbfzrxm?: string; // 设备负责人姓名
  jszb?: string; // 技术指标
  yqpz?: string; // 仪器配置
  jgbz?: string; // 价格币种
  yqjg?: number; // 仪器价格
  yqsm?: string; // 仪器说明
  cwzh?: string; // 财务账号
  cwglrxm?: string; // 财务管理人姓名
  ghs?: string; // 供货商
  bxjzrq?: string; // 保修截止日期
  sblym?: string; // 设备来源码
  jzqydm?: string; // 捐赠企业统一社会信用代码
  jzqymc?: string; // 捐赠企业名称
  sfjmgzyq?: string; // 是否精密贵重仪器
  zcjcflm?: string; // 资产基础分类码
  sjcjsj?: string; // 数据采集时间
  reportStatus?: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus?: string; // 启用状态(0-禁用,1-启用)
}

// 仪器设备基本数据详情
export interface OdsYqsbjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  yqh: string; // 仪器号
  yqmc: string; // 仪器名称
  yqywmc: string; // 仪器英文名称
  xxdwccm: string; // 学校单位层次码
  cqm: string; // 产权码
  syzkm: string; // 使用状况码
  gxzcflm: string; // 高校资产分类码
  yqxh: string; // 仪器型号
  ccrq: string; // 出厂日期
  scgbdqm: string; // 生产国别/地区码
  jfkmm: string; // 经费科目码
  gzrq: string; // 购置日期
  sccj: string; // 生产厂家
  cch: string; // 出厂号
  djh: string; // 单据号
  tp: string; // 图片
  fjh: string; // 房间号
  fjmc: string; // 房间名称
  sbfzrh: string; // 设备负责人号
  sbfzrxm: string; // 设备负责人姓名
  jszb: string; // 技术指标
  yqpz: string; // 仪器配置
  jgbz: string; // 价格币种
  yqjg: number; // 仪器价格
  yqsm: string; // 仪器说明
  cwzh: string; // 财务账号
  cwglrxm: string; // 财务管理人姓名
  ghs: string; // 供货商
  bxjzrq: string; // 保修截止日期
  sblym: string; // 设备来源码
  jzqydm: string; // 捐赠企业统一社会信用代码
  jzqymc: string; // 捐赠企业名称
  sfjmgzyq: string; // 是否精密贵重仪器
  zcjcflm: string; // 资产基础分类码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态(0-未上报,1-已上报,2-上报失败)
  enableStatus: string; // 启用状态(0-禁用,1-启用)
  createBy: string;    // 创建人
  updateBy: string;    // 更新人
  remark: string;      // 备注
  delFlag: string;     // 删除标志（0代表存在 1代表删除）
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  xxdwccmText?: string; // 学校单位层次名称
  cqmText?: string; // 产权名称
  syzkmText?: string; // 使用状况名称
  gxzcflmText?: string; // 高校资产分类名称
  scgbdqmText?: string; // 生产国别/地区名称
  jfkmmText?: string; // 经费科目名称
  jgbzText?: string; // 价格币种名称
  sblymText?: string; // 设备来源名称
  sfjmgzyqText?: string; // 是否精密贵重仪器名称
  zcjcflmText?: string; // 资产基础分类名称
}

// 仪器设备基本数据查询参数
export interface OdsYqsbjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  yqh?: string;
  yqmc?: string;
  yqywmc?: string;
  xxdwccm?: string;
  cqm?: string;
  syzkm?: string;
  gxzcflm?: string;
  sccj?: string;
  sbfzrxm?: string;
  sblym?: string;
  sfjmgzyq?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  gzrqStart?: string;
  gzrqEnd?: string;
  pageNum: number;
  pageSize: number;
  createTimeStart?: string;  // 创建时间开始
  createTimeEnd?: string;    // 创建时间结束
  updateTimeStart?: string;  // 更新时间开始
  updateTimeEnd?: string;    // 更新时间结束
  createBy?: string;         // 创建人
  updateBy?: string;         // 更新人
  remark?: string;          // 备注
  delFlag?: string;         // 删除标志
  reportStatus?: string;    // 上报状态
  enableStatus?: string;    // 启用状态
}

// 仪器设备基本数据分页结果
export interface OdsYqsbjbsjPageResult {
  records: OdsYqsbjbsjInfo[];
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
 * 分页查询仪器设备基本数据
 */
export function getOdsYqsbjbsjPage(query: OdsYqsbjbsjQuery) {
  return request.post<ApiResponse<OdsYqsbjbsjPageResult>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/page",
    query,
  );
}

/**
 * 根据ID查询仪器设备基本数据详情
 */
export function getOdsYqsbjbsjById(id: number) {
  return request.get<ApiResponse<OdsYqsbjbsjInfo>>(
    `/data/data/data-base/zygzc/ods-yqsbjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询仪器设备基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsYqsbjbsjInfo>>(
    `/data/data/data-base/zygzc/ods-yqsbjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增仪器设备基本数据
 */
export function addOdsYqsbjbsj(data: OdsYqsbjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/add",
    data,
  );
}

/**
 * 修改仪器设备基本数据
 */
export function updateOdsYqsbjbsj(data: OdsYqsbjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/update",
    data,
  );
}

/**
 * 删除仪器设备基本数据
 */
export function deleteOdsYqsbjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygzc/ods-yqsbjbsj/${id}`,
  );
}

/**
 * 批量删除仪器设备基本数据
 */
export function batchDeleteOdsYqsbjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出仪器设备基本数据
 */
export function exportOdsYqsbjbsj(query: OdsYqsbjbsjQuery) {
  return request.post("/data/data/data-base/zygzc/ods-yqsbjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取仪器设备基本数据列表（不分页）
 */
export function getOdsYqsbjbsjList(query: OdsYqsbjbsjQuery) {
  return request.post<ApiResponse<OdsYqsbjbsjInfo[]>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/list",
    query
  );
}

/**
 * 上报仪器设备基本数据
 */
export function reportOdsYqsbjbsj(ids: number[]) {
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/report",
    ids
  );
}

/**
 * 启用/禁用仪器设备基本数据
 */
export function toggleEnableStatus(id: number, enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    `/data/data/data-base/zygzc/ods-yqsbjbsj/toggle-status/${id}/${enableStatus}`
  );
}

/**
 * 批量启用/禁用仪器设备基本数据
 */
export function batchToggleEnableStatus(ids: number[], enableStatus: string) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/batch-toggle-status",
    {
      ids,
      enableStatus
    }
  );
}

/**
 * 导入仪器设备基本数据
 */
export function importOdsYqsbjbsj(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request.post<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-yqsbjbsj/import",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/**
 * 下载导入模板
 */
export function downloadTemplate() {
  return request.get("/data/data/data-base/zygzc/ods-yqsbjbsj/template", {
    responseType: "blob"
  });
}

/**
 * 获取字典数据 - 学校单位层次码 (XXDWCCDM)
 */
export function getXxdwccmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/XXDWCCDM",
  );
}

/**
 * 获取字典数据 - 产权码 (CQDM)
 */
export function getCqmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/CQDM",
  );
}

/**
 * 获取字典数据 - 使用状况码 (SYZKDM)
 */
export function getSyzkmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SYZKDM",
  );
}

/**
 * 获取字典数据 - 高校资产分类码 (GXZCFLDM)
 */
export function getGxzcflmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/GDXXGDZCFLYDM",
  );
}

/**
 * 获取字典数据 - 生产国别/地区码 (SCGBDQDM)
 */
export function getScgbdqmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SJGGHDQMCDM",
  );
}

/**
 * 获取字典数据 - 经费科目码 (JFKMDM)
 */
export function getJfkmmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/JFKMDM",
  );
}

/**
 * 获取字典数据 - 价格币种 (HBHZJDM)
 */
export function getJgbzOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/HBHZJDM",
  );
}

/**
 * 获取字典数据 - 设备来源码 (SBLYDM)
 */
export function getSblymOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SBLYDM",
  );
}

/**
 * 获取字典数据 - 是否精密贵重仪器 (SFBZDM)
 */
export function getSfjmgzyqOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/SFBZDM",
  );
}

/**
 * 获取字典数据 - 资产基础分类码 (GDZCDZCJCFLYDM)
 */
export function getZcjcflmOptions() {
  return request.get<ApiResponse<DictOption[]>>(
    "/data/data/data-base-source/options/GDZCDZCJCFLYDM",
  );
}
