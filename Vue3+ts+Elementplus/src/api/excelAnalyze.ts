import { http } from "@/utils/request-data";
import type { AxiosResponse } from "axios";
import { log } from "vxe-table";

// 定义后端API返回的数据结构
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 文件上传请求参数
export interface FileUploadRequest {
  tableName: string;
  tableLabel?: string;
}

// 文件上传响应数据
export interface FileUploadResponse {
  sessionId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  totalRows: number;
  totalColumns: number;
  headers: string[];
  uploadTime: string;
}

// 表头匹配请求参数
export interface HeaderMatchingRequest {
  sessionId: string;
  tableName: string;
}

// 字段匹配结果
export interface FieldMatchResult {
  headerName: string;
  headerIndex: number;
  suggestedFieldName?: string;
  suggestedFieldLabel?: string;
  matchScore: number;
  alternatives: FieldSuggestion[];
  isMatched: boolean;
  isRequired: boolean;
  dictType?: string;
  allowManualEdit: boolean;
}

// 字段建议
export interface FieldSuggestion {
  fieldName: string;
  fieldLabel: string;
  matchScore: number;
  dictType?: string;
}

// 表头匹配响应数据
export interface HeaderMatchingResponse {
  sessionId: string;
  matchResults: FieldMatchResult[];
  totalHeaders: number;
  matchedHeaders: number;
  unmatchedHeaders: number;
}

// 字段映射请求参数
export interface FieldMappingRequest {
  sessionId: string;
  mappings: FieldMapping[];
  customRules?: Record<string, string>;
}

// 字段映射
export interface FieldMapping {
  headerName: string;
  headerIndex: number;
  fieldName: string;
  fieldLabel: string;
  isRequired: boolean;
  dictType?: string;
}

// 数据转换请求参数
export interface DataTransformRequest {
  sessionId: string;
  fieldMappings: FieldMappingDTO[];
  validateOnly?: boolean;
  startRow?: number;
  rowCount?: number;
  applyTransformRules?: boolean;
}

// 字段映射DTO
export interface FieldMappingDTO {
  excelHeader: string;
  headerIndex: number;
  targetField: string;
  fieldType?: string;
  isRequired?: boolean;
  dictType?: string;
  validationRules?: string;
  transformRules?: string;
  skip?: boolean;
}

// 转换结果
export interface TransformResult {
  rowIndex: number;
  originalData: Record<string, any>;
  transformedData: Record<string, any>;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// 验证错误
export interface ValidationError {
  field: string;
  fieldLabel: string;
  value: any;
  errorType: string;
  errorMessage: string;
  suggestions?: string[];
}

// 数据转换响应数据
export interface DataTransformResponse {
  sessionId: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  warningRows: number;
  results: TransformResult[];
  errors: ValidationError[];
  statistics: Record<string, any>;
}

// 数据预览响应数据
export interface DataPreviewResponse {
  sessionId: string;
  totalRows: number;
  totalColumns: number;
  previewData: Record<string, any>[];
  originalData?: Record<string, any>[];
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  fieldMappings?: any[];
  statistics?: {
    successRows: number;
    errorRows: number;
    warningRows: number;
    fieldStats: Record<string, {
      totalCount: number;
      validCount: number;
      errorCount: number;
      warningCount: number;
    }>;
  };
}

// 导入确认请求参数
export interface ImportConfirmRequest {
  sessionId: string;
  skipErrors?: boolean;
  skipWarnings?: boolean;
}

// 导入结果响应数据
export interface ImportResultResponse {
  sessionId: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  skippedRows: number;
  importTime: string;
  errors: ValidationError[];
  importId?: string;
}

// 导入配置
export interface ImportConfigVO {
  id: string;
  tableName: string;
  tableLabel: string;
  moduleName: string;
  importMode: string;
  status: number;
  fieldCount?: number;
  lastImportTime?: string;
  createTime: string;
  updateTime: string;
}

// 数据验证VO
export interface DataValidationVO {
  sessionId: string;
  tableName: string;
  totalRows: number;
  validRows: number;
  errorRows: number;
  warningRows: number;
  successRate: number;
  validationTime: string;
  errors: ValidationErrorVO[];
  validationStatus: string;
  validationMessage: string;
}

// 验证错误VO
export interface ValidationErrorVO {
  rowNumber: number;
  columnName: string;
  fieldName: string;
  fieldLabel: string;
  value: string;
  errorType: string;
  errorMessage: string;
  errorLevel: string;
  suggestion?: string;
}

/**
 * Excel解析相关API - 对应后端控制器接口
 */
export const excelAnalyzeApi = {
  /**
   * 获取支持的表配置列表
   * 对应: ExcelAnalyzeController.getSupportedTables()
   */
  getImportConfigs: async (params?: {
    moduleName?: string;
    enableStatus?: number;
  }): Promise<ImportConfigVO[]> => {
    try {
      const response: AxiosResponse<any[]> =
        await http.get("/data/api/excel-analyze/tables", { params });

      // 后端直接返回数组，不是包装在ApiResponse中
      const tables = response.data || [];
      return tables.map((table: any) => ({
        id: table.tableName,
        tableName: table.tableName,
        tableLabel: table.tableLabel,
        moduleName: table.moduleName,
        importMode: table.importModes || 'INSERT',
        status: table.enableStatus || 1,
        createTime: table.createTime,
        updateTime: table.updateTime,
        description: table.description || '',
        fieldCount: table.fieldCount || 0,
        lastImportTime: table.lastImportTime || ''
      }));
    } catch (error) {
      console.error("获取导入配置失败:", error);
      throw error;
    }
  },

  /**
   * 上传Excel文件
   * 对应: ExcelAnalyzeController.uploadFile()
   */
  uploadExcelFile: async (
    file: File,
    params: FileUploadRequest
  ): Promise<FileUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tableName", params.tableName);
      if (params.tableLabel) {
        formData.append("tableLabel", params.tableLabel);
      }

      const response: AxiosResponse<FileUploadResponse> =
        await http.post("/data/api/excel-analyze/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

      console.log("文件上传响应:", response.data);

      // 后端直接返回数据对象，不是包装在ApiResponse中
      if (!response.data) {
        throw new Error("上传文件失败：接口返回数据异常");
      }
      return response.data;
    } catch (error) {
      console.error("上传Excel文件失败:", error);
      throw error;
    }
  },

  /**
   * 获取表头匹配建议
   * 对应: HeaderMatchingController.getMatchingSuggestions()
   */
  matchHeaders: async (
    params: HeaderMatchingRequest & { headers: any[] }
  ): Promise<HeaderMatchingResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.post("/data/api/excel-analyze/header-matching/suggestions", params);

      // 后端直接返回HeaderMatchingVO对象，不是包装在ApiResponse中
      if (!response.data) {
        throw new Error("获取表头匹配失败：接口返回数据异常");
      }

      // 转换后端返回的HeaderMatchingVO格式为前端期望的HeaderMatchingResponse格式
      const headerMatchingVO = response.data;
      return {
        sessionId: headerMatchingVO.sessionId || params.sessionId,
        matchResults: headerMatchingVO.fieldMappings?.map((mapping: any) => ({
          headerName: mapping.excelHeader || mapping.headerName,
          headerIndex: mapping.headerIndex,
          suggestedFieldName: mapping.targetField,
          suggestedFieldLabel: mapping.targetFieldLabel,
          matchScore: mapping.matchScore || 0,
          alternatives: (mapping.alternatives || []).map((alt: any) => ({
            fieldName: alt.fieldName,
            fieldLabel: alt.fieldLabel,
            matchScore: alt.matchScore || 0,
            dictType: alt.dictType
          })),
          isMatched: mapping.isMatched || !!mapping.targetField,
          isRequired: mapping.isRequired || false,
          dictType: mapping.dictType,
          allowManualEdit: mapping.allowManualEdit !== false
        })) || [],
        totalHeaders: headerMatchingVO.totalHeaders || 0,
        matchedHeaders: headerMatchingVO.matchedCount || 0,
        unmatchedHeaders: (headerMatchingVO.totalHeaders || 0) - (headerMatchingVO.matchedCount || 0)
      };
    } catch (error) {
      console.error("获取表头匹配失败:", error);
      throw error;
    }
  },

  /**
   * 保存字段映射配置
   * 对应: HeaderMatchingController.saveFieldMappings()
   */
  saveFieldMapping: async (params: FieldMappingRequest): Promise<boolean> => {
    try {
      // 转换前端FieldMapping格式为后端期望的FieldMappingRequest格式
      const requestData = {
        sessionId: params.sessionId,
        mappings: params.mappings.map(mapping => ({
          excelHeader: mapping.headerName,
          headerIndex: mapping.headerIndex,
          targetField: mapping.fieldName,
          targetFieldLabel: mapping.fieldLabel,
          fieldType: mapping.dictType || 'VARCHAR',
          isRequired: mapping.isRequired,
          dictType: mapping.dictType,
          mappingType: 'MANUAL',
          matchScore: 1.0,
          skip: false
        })),
        customRules: params.customRules || {}
      };

      const response: AxiosResponse<any> =
        await http.post("/data/api/excel-analyze/header-matching/field-mappings", requestData);

      // 后端直接返回Map<String, Object>格式，包含success字段
      return response.data?.success || false;
    } catch (error) {
      console.error("保存字段映射失败:", error);
      throw error;
    }
  },

  /**
   * 执行数据转换和验证
   * 对应: DataTransformController.transformData()
   */
  transformData: async (
    params: DataTransformRequest & {
      startRow?: number;
      rowCount?: number;
      applyTransformRules?: boolean;
    }
  ): Promise<DataTransformResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.post("/data/api/excel-analyze/data-transform/transform", params);

      if (!response.data) {
        throw new Error("数据转换失败：接口返回数据异常");
      }

      // 后端可能直接返回数据或包装在data字段中
      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      console.error("数据转换失败:", error);
      throw error;
    }
  },

  /**
   * 预览处理结果
   * 对应: DataTransformController.getDataPreview()
   */
  previewData: async (
    sessionId: string,
    params?: {
      page?: number;
      size?: number;
      includeOriginal?: boolean;
    }
  ): Promise<DataPreviewResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.get(`/data/api/excel-analyze/data-transform/preview/${sessionId}`, params);

      if (!response.data) {
        throw new Error("获取数据预览失败：接口返回数据异常");
      }

      // 后端可能直接返回数据或包装在data字段中
      const data = response.data.data || response.data;
      return data;
    } catch (error) {
      console.error("获取数据预览失败:", error);
      throw error;
    }
  },

  /**
   * 插入新数据
   * 对应: DataImportController.insertNewData()
   */
  insertNewData: async (
    sessionId: string,
    params?: {
      ignoreErrors?: boolean;
    }
  ): Promise<ImportResultResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.post(`/data/api/excel-analyze/data-import/insert/${sessionId}`, null, { params });

      if (!response.data) {
        throw new Error("插入新数据失败：接口返回数据异常");
      }

      // 正确解析DataApiResponse结构
      const result = response.data.data || response.data.importResult || response.data;
      return {
        sessionId,
        totalRows: result.totalRows || 0,
        successRows: result.successCount || result.successRows || 0,
        errorRows: result.errorCount || result.errorRows || 0,
        skippedRows: result.skippedRows || 0,
        importTime: result.importTime || new Date().toISOString(),
        errors: result.errors || [],
        importId: result.importId
      };
    } catch (error) {
      console.error("插入新数据失败:", error);
      throw error;
    }
  },

  /**
   * 更新现有数据
   * 对应: DataImportController.updateExistingData()
   */
  updateExistingData: async (
    sessionId: string,
    params?: {
      ignoreErrors?: boolean;
    }
  ): Promise<ImportResultResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.post(`/data/api/excel-analyze/data-import/update/${sessionId}`, null, { params });

      if (!response.data) {
        throw new Error("更新现有数据失败：接口返回数据异常");
      }

      // 正确解析DataApiResponse结构
      const result = response.data.data || response.data.importResult || response.data;
      return {
        sessionId,
        totalRows: result.totalRows || 0,
        successRows: result.successCount || result.successRows || 0,
        errorRows: result.errorCount || result.errorRows || 0,
        skippedRows: result.skippedRows || 0,
        importTime: result.importTime || new Date().toISOString(),
        errors: result.errors || [],
        importId: result.importId
      };
    } catch (error) {
      console.error("更新现有数据失败:", error);
      throw error;
    }
  },

  /**
   * 确认并执行最终导入（保留兼容性）
   * 对应: DataTransformController.confirmImport()
   */
  confirmImport: async (
    sessionId: string,
    params?: {
      importMode?: string;
      ignoreErrors?: boolean;
    }
  ): Promise<ImportResultResponse> => {
    try {
      const response: AxiosResponse<any> =
        await http.post(`/data/api/excel-analyze/data-transform/confirm-import/${sessionId}`, null, { params });

      if (!response.data) {
        throw new Error("确认导入失败：接口返回数据异常");
      }

      // 正确解析DataApiResponse结构
      const result = response.data.data || response.data.importResult || response.data;
      return {
        sessionId,
        totalRows: result.totalRows || 0,
        successRows: result.successCount || result.successRows || 0,
        errorRows: result.errorCount || result.errorRows || 0,
        skippedRows: result.skippedRows || 0,
        importTime: result.importTime || new Date().toISOString(),
        errors: result.errors || [],
        importId: result.importId
      };
    } catch (error) {
      console.error("确认导入失败:", error);
      throw error;
    }
  },

  /**
   * 获取会话信息
   * 对应: ExcelAnalyzeController.getSessionInfo()
   */
  getSessionInfo: async (sessionId: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> =
        await http.get(`/data/api/excel-analyze/sessions/${sessionId}`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("获取会话信息失败:", error);
      throw error;
    }
  },

  /**
   * 删除会话
   * 对应: ExcelAnalyzeController.deleteSession()
   */
  deleteSession: async (sessionId: string): Promise<boolean> => {
    try {
      const response: AxiosResponse<any> =
        await http.delete(`/data/api/excel-analyze/sessions/${sessionId}`);
      return response.data?.success || false;
    } catch (error) {
      console.error("删除会话失败:", error);
      throw error;
    }
  },

  /**
   * 获取表字段配置
   * 对应: ExcelAnalyzeController.getTableFieldConfig()
   */
  getTableFieldConfig: async (tableName: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> =
        await http.get(`/data/api/excel-analyze/tables/${tableName}/fields`);
      return response.data?.data || response.data;
    } catch (error) {
      console.error("获取表字段配置失败:", error);
      throw error;
    }
  },

  /**
   * 下载原始上传文件
   * 对应: FileDownloadController.downloadOriginalFile()
   */
  downloadOriginalFile: async (
    sessionId: string,
    params?: {
      fileName?: string;
    }
  ): Promise<Blob> => {
    try {
      const response = await http.get(
        `/data/api/excel-analyze/download/${sessionId}`,
         params ,
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      console.error("下载原始文件失败:", error);
      throw error;
    }
  },

  /**
   * 下载转换后的文件
   * 对应: FileDownloadController.downloadTransformedFile()
   */
  downloadTransformedFile: async (
    sessionId: string,
    params?: {
      fileName?: string;
    }
  ): Promise<Blob> => {
    try {
      const response = await http.get(
        `/data/api/excel-analyze/download/transformed/${sessionId}`,
         params ,
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      console.error("下载转换后文件失败:", error);
      throw error;
    }
  },

  /**
   * 下载处理结果Excel文件
   * 对应: FileDownloadController.downloadResultFile()
   */
  downloadResult: async (
    sessionId: string,
    params?: {
      fileName?: string;
      includeOriginal?: boolean;
    }
  ): Promise<Blob> => {
    try {
      const response = await http.get(
        `/data/api/excel-analyze/download/result/${sessionId}`,
         params ,
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      console.error("下载处理结果失败:", error);
      throw error;
    }
  },

  /**
   * 下载错误数据报告
   * 对应: FileDownloadController.downloadErrorReport()
   */
  downloadErrorReport: async (
    sessionId: string,
    params?: {
      validationTypes?: string[];
      errorLevel?: string;
      fileName?: string;
    }
  ): Promise<Blob> => {
    try {
      const response = await http.get(
        `/data/api/excel-analyze/download/error-report/${sessionId}`,
        { params },
        { responseType: "blob" }
      );
      return response.data;
    } catch (error) {
      console.error("下载错误报告失败:", error);
      throw error;
    }
  },

  /**
   * 获取系统状态
   * 对应: ExcelAnalyzeController.getSystemStatus()
   */
  getSystemStatus: async (): Promise<any> => {
    try {
      const response: AxiosResponse<any> =
        await http.get("/data/api/excel-analyze/status");
      return response.data?.data || response.data;
    } catch (error) {
      console.error("获取系统状态失败:", error);
      throw error;
    }
  },

  /**
   * 检查数据读取状态
   * 对应: ExcelAnalyzeController.checkUploadStatus()
   */
  checkUploadStatus: async (sessionId: string): Promise<{
    sessionId: string;
    status: string;
    hasData: boolean;
    dataCount: number;
    isReady: boolean;
  }> => {
    try {
      const response: AxiosResponse<any> =
        await http.get(`/data/api/excel-analyze/upload-status/${sessionId}`);

      if (!response.data) {
        throw new Error("检查上传状态失败：接口返回数据异常");
      }

      return response.data.data || response.data;
    } catch (error) {
      console.error("检查上传状态失败:", error);
      throw error;
    }
  },

  /**
   * 获取字典数据
   * 对应: ExcelAnalyzeController.getDictData()
   */
  getDictData: async (tableName: string, fieldName: string): Promise<{
    tableName: string;
    fieldName: string;
    dictType: string;
    fieldLabel: string;
    dictDataList: any[];
  }> => {
    console.log("22222222222222222222222222222222222");
    console.log(tableName, fieldName);
    try {
      const response: AxiosResponse<any> =
        await http.get("/data/api/excel-analyze/dict-data", {
           tableName, fieldName 
        });

      if (!response.data) {
        throw new Error("获取字典数据失败：接口返回数据异常");
      }

      return response.data.data || response.data;
    } catch (error) {
      console.error("获取字典数据失败:", error);
      throw error;
    }
  },

  /**
   * 数据验证
   * 对应: DataValidationController.validateExcelData()
   */
  validateImportData: async (sessionId: string, fileName?: string, hasTransformedData?: boolean): Promise<DataValidationVO> => {
    try {
      const params = {
        ...(fileName && { fileName }),
        ...(hasTransformedData !== undefined && { hasTransformedData })
      }
      const response: AxiosResponse<any> =
        await http.post(`/data/data/api/excel-analyze/data-validation/validate/${sessionId}`, params);

      if (!response.data) {
        throw new Error("数据验证失败：接口返回数据异常");
      }

      return response.data;
    } catch (error) {
      console.error("数据验证失败:", error);
      throw error;
    }
  },
};

// 默认导出
export default excelAnalyzeApi;