/**
 * API响应类型定义
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export type ApiPageResponse<T> = ApiResponse<PageResult<T>>;
