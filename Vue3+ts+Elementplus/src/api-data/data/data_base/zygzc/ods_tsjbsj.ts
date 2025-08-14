import { request } from "@/utils/request-data.ts";
import type { ApiResponse } from "@/utils/request-code.ts";

/**
 * 图书基本数据接口
 */

// 图书基本数据表单数据
export interface OdsTsjbsjForm {
  id?: number;
  zjsjwyxbs?: string; // 主键数据唯一性标识
  xxdm?: string; // 学校代码
  tsbh?: string; // 图书编号
  tstxm?: string; // 图书条形码
  zbt?: string; // 正标题
  blbt?: string; // 并列标题
  fbt?: string; // 副标题
  jsgjz?: string; // 检索关键字
  tscbh?: string; // 图书出版号
  dyzz?: string; // 第一作者
  qtzz?: string; // 其他作者
  jg?: number; // 价格
  wxlxm?: string; // 文献类型码
  zdm?: string; // 装订码
  flh?: string; // 分类号
  zgyzm?: string; // 中国语种码
  yzm?: string; // 语种码
  kb?: string; // 开本
  ys?: number; // 页数
  bc?: string; // 版次
  tsfjmc?: string; // 图书附件名称
  csmc?: string; // 丛书名称
  csbz?: string; // 丛书编者
  cbs?: string; // 出版社
  cbsjbm?: string; // 出版社级别码
  cbd?: string; // 出版地
  cbrq?: string; // 出版日期
  fxdw?: string; // 发行单位
  bz?: string; // 备注
  tsztm?: string; // 图书状态码
  sjcjsj?: string; // 数据采集时间
}

// 图书基本数据详情
export interface OdsTsjbsjInfo {
  id: number;
  zjsjwyxbs: string; // 主键数据唯一性标识
  xxdm: string; // 学校代码
  tsbh: string; // 图书编号
  tstxm: string; // 图书条形码
  zbt: string; // 正标题
  blbt: string; // 并列标题
  fbt: string; // 副标题
  jsgjz: string; // 检索关键字
  tscbh: string; // 图书出版号
  dyzz: string; // 第一作者
  qtzz: string; // 其他作者
  jg: number; // 价格
  wxlxm: string; // 文献类型码
  zdm: string; // 装订码
  flh: string; // 分类号
  zgyzm: string; // 中国语种码
  yzm: string; // 语种码
  kb: string; // 开本
  ys: number; // 页数
  bc: string; // 版次
  tsfjmc: string; // 图书附件名称
  csmc: string; // 丛书名称
  csbz: string; // 丛书编者
  cbs: string; // 出版社
  cbsjbm: string; // 出版社级别码
  cbd: string; // 出版地
  cbrq: string; // 出版日期
  fxdw: string; // 发行单位
  bz: string; // 备注
  tsztm: string; // 图书状态码
  sjcjsj: string; // 数据采集时间
  reportStatus: string; // 上报状态
  enableStatus: string; // 启用状态
  createTime: string;
  updateTime: string;
  // 扩展字段，显示文本值
  wxlxmText?: string; // 文献类型文本
  zdmText?: string; // 装订码文本
  zgyzmText?: string; // 中国语种码文本
  yzmText?: string; // 语种码文本
  cbsjbmText?: string; // 出版社级别码文本
  tsztmText?: string; // 图书状态码文本
}

// 图书基本数据查询参数
export interface OdsTsjbsjQuery {
  zjsjwyxbs?: string;
  xxdm?: string;
  tsbh?: string;
  tstxm?: string;
  zbt?: string;
  dyzz?: string;
  cbs?: string;
  wxlxm?: string;
  zdm?: string;
  tsztm?: string;
  cbrqStart?: string;
  cbrqEnd?: string;
  sjcjsjStart?: string;
  sjcjsjEnd?: string;
  pageNum: number;
  pageSize: number;
}

// 图书基本数据分页结果
export interface OdsTsjbsjPageResult {
  records: OdsTsjbsjInfo[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

// 字典选项
export interface DictOption {
  value: string;
  label: string;
}

/**
 * 分页查询图书基本数据
 */
export function getOdsTsjbsjPage(query: OdsTsjbsjQuery) {
  return request.post<ApiResponse<OdsTsjbsjPageResult>>(
    "/data/data/data-base/zygzc/ods-tsjbsj/page",
    query,
  );
}

/**
 * 根据ID查询图书基本数据详情
 */
export function getOdsTsjbsjById(id: number) {
  return request.get<ApiResponse<OdsTsjbsjInfo>>(
    `/data/data/data-base/zygzc/ods-tsjbsj/${id}`,
  );
}

/**
 * 根据唯一性标识查询图书基本数据
 */
export function getByUniqueId(zjsjwyxbs: string) {
  return request.get<ApiResponse<OdsTsjbsjInfo>>(
    `/data/data/data-base/zygzc/ods-tsjbsj/unique/${zjsjwyxbs}`,
  );
}

/**
 * 新增图书基本数据
 */
export function addOdsTsjbsj(data: OdsTsjbsjForm) {
  return request.post<ApiResponse<number>>(
    "/data/data/data-base/zygzc/ods-tsjbsj/add",
    data,
  );
}

/**
 * 修改图书基本数据
 */
export function updateOdsTsjbsj(data: OdsTsjbsjForm) {
  return request.put<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-tsjbsj/update",
    data,
  );
}

/**
 * 删除图书基本数据
 */
export function deleteOdsTsjbsj(id: number) {
  return request.delete<ApiResponse<boolean>>(
    `/data/data/data-base/zygzc/ods-tsjbsj/${id}`,
  );
}

/**
 * 批量删除图书基本数据
 */
export function batchDeleteOdsTsjbsj(ids: number[]) {
  return request.delete<ApiResponse<boolean>>(
    "/data/data/data-base/zygzc/ods-tsjbsj/batch",
    {
      data: ids,
    },
  );
}

/**
 * 导出图书基本数据
 */
export function exportOdsTsjbsj(query: OdsTsjbsjQuery) {
  return request.post("/data/data/data-base/zygzc/ods-tsjbsj/export", query, {
    responseType: "blob",
  });
}

/**
 * 获取文献类型字典数据
 */
export function getDictWxlxm() {
  return request.get<ApiResponse<DictOption[]>>("/code/system/dict/data/WXLXDM");
}

/**
 * 获取装订码字典数据
 */
export function getDictZdm() {
  return request.get<ApiResponse<DictOption[]>>("/code/system/dict/data/ZDDM");
}

/**
 * 获取中国语种码字典数据
 */
export function getDictZgyzm() {
  return request.get<ApiResponse<DictOption[]>>("/code/system/dict/data/ZGYZDM");
}

/**
 * 获取语种码字典数据
 */
export function getDictYzm() {
  return request.get<ApiResponse<DictOption[]>>("/code/system/dict/data/YZDM");
}

/**
 * 获取出版社级别码字典数据
 */
export function getDictCbsjbm() {
  return request.get<ApiResponse<DictOption[]>>(
    "/code/system/dict/data/CBSJBDM",
  );
}

/**
 * 获取图书状态码字典数据
 */
export function getDictTsztm() {
  return request.get<ApiResponse<DictOption[]>>("/code/system/dict/data/TSZTDM");
}

/**
 * 获取字典数据
 * @param dictType 字典类型
 */
export function getDictOptions(dictType: string) {
  return request.get<ApiResponse<DictOption[]>>(
    `/data/data/data-base-source/options/${dictType}`,
  );
}

/**
 * 获取系统学校代码
 */
export function getSystemSchoolCode() {
  return request.get<ApiResponse<string>>("/data/data/data-base/zygxx/ods-xxtsxxhxtyysj/system-school-code");
}
