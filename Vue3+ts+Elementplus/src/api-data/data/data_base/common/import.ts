import request from '@/utils/request-data'

// 导入配置VO
export interface ImportConfigVO {
  tableName: string
  tableLabel: string
  moduleName: string
  apiBasePath: string
  importModes: string[]
  templateExcludeFields: string[]
  defaultValues: Record<string, any>
  fieldConfigs: FieldConfigVO[]
  matchRules: MatchRuleVO[]
  enableStatus: number
}

// 字段配置VO
export interface FieldConfigVO {
  tableName?: string // 表名
  tableChineseName?: string // 表中文名
  fieldName: string
  fieldLabel: string
  fieldType: string
  isRequired: boolean
  isDefault: boolean
  isIdentifier: boolean // 是否标识字段
  maxLength?: number
  dictType?: string
  fieldExample?: string
  validationRules?: any[]
  fieldProcessor?: string
  transformRules?: Record<string, any>
  sortOrder: number
  enableStatus: number
}

// 匹配规则VO
export interface MatchRuleVO {
  fieldName: string
  matchPatterns: string[]
  matchPriority: number
  exactMatch: boolean
  matchStrategy: string
  confidenceThreshold: number
  enableStatus: number
}

// Excel解析结果
export interface ExcelParseResult {
  headers: string[]
  dataPreview: Record<string, any>[]
  totalRows: number
  status: string
  errorMessage?: string
}

// 高级匹配请求
export interface AdvancedMatchRequest {
  headers: string[]
  config: Record<string, any>
  matchThreshold: number
  matchStrategies: string[]
  autoMapping: boolean
}

// 自动映射结果
export interface AutoMappingResult {
  tableName: string
  tableLabel?: string
  mappingResults: Record<string, MatchingSuggestion[]>  // 修正字段名
  autoMappedFields: Record<string, MatchingSuggestion>  // 添加自动映射字段
  totalHeaders: number
  matchedHeaders: number
  matchRate: number
  unmatchedHeaders?: string[]
  processingTime?: number
}

// 匹配建议
export interface MatchingSuggestion {
  fieldName: string
  fieldLabel: string
  confidence: number
  matchStrategy: string
  priority: number
}

// 导入结果
export interface ImportResult {
  success: boolean
  totalRows: number
  successRows: number
  failedRows: number
  errorDetails?: string[]
  importTime: string
  message: string
}

// 导入配置
export interface ImportConfig {
  fieldMapping: Record<string, string>
  unmappedFieldsDefaults: Record<string, any>
  startRow?: number
  autoGenerateId?: boolean
  updateByStudentNumber?: boolean
  updateByResourceNumber?: boolean
}

/**
 * 通用导入API类
 */
export class CommonImportAPI {
  
  /**
   * 获取表导入配置
   */
  static async getImportConfig(tableName: string): Promise<ImportConfigVO> {
    const response = await request.get(`/data/api/common/import/${tableName}/config`)
    return response.data
  }
  
  /**
   * 解析Excel表头
   */
  static async parseExcelHeaders(tableName: string, file: File): Promise<ExcelParseResult> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await request.post(`/data/api/common/import/${tableName}/parseHeaders`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  }
  
  /**
   * 执行高级智能匹配
   */
  static async performAdvancedMatching(
    tableName: string, 
    headers: string[], 
    config: Record<string, any>
  ): Promise<AutoMappingResult> {
    const requestData: AdvancedMatchRequest = {
      headers,
      config,
      matchThreshold: config.matchThreshold || 80,
      matchStrategies: config.matchStrategies || ['exact', 'fuzzy', 'pinyin'],
      autoMapping: config.autoMapping || true
    }
    const response = await request.post(`/data/api/common/import/${tableName}/advancedMatch`, requestData)
    return response.data
  }
  
  /**
   * 执行导入
   */
  static async importWithMapping(
    tableName: string, 
    file: File, 
    config: ImportConfig
  ): Promise<ImportResult> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('config', JSON.stringify(config))
    const response = await request.post(`/data/api/common/import/${tableName}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data.data
  }
  
  /**
   * 下载模板
   */
  static async downloadFieldTemplate(tableName: string, tableChineseName: string): Promise<void> {
    const params = {
      tableName: tableName,
      tableChineseName: tableChineseName
    }
    const response = await request.post(`/data/api/common/import/field-config/template/${tableName}?tableChineseName=${tableChineseName}`, params, {
      responseType: 'blob'
    })
    try {
      console.log(response);
      
  // 创建下载链接
  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${tableChineseName}_(${tableName})_${new Date().getTime()}.xlsx`;
  link.click();
  window.URL.revokeObjectURL(url);

  ElMessage.success("导出成功");
} catch (error) {
  console.error("导出访问教学资源情况数据失败:", error);
  ElMessage.error("导出失败，请重试");
}
};

  /**
   * 获取匹配建议
   */
  static async getMatchingSuggestions(tableName: string, columnName: string): Promise<MatchingSuggestion[]> {
    const response = await request.get(`/data/api/common/import/${tableName}/suggestions`, {
      params: { columnName }
    })
    return response.data
  }
  /**
 * 获取表名
 * 
 * @returns 
 */
  static async  getTableNames(tableName: string): Promise<string[]> {
  const response = await request.get('/data/api/common/import/config/list',{

      tableName: tableName,
      moduleName: '',
      enableStatus: 1
    
  })
  return response.data
}

  /**
   * 获取系统字段及其匹配规则（含is_default=1字段）
   */
  static async getSystemFieldsWithMatchRules(tableName: string): Promise<any[]> {
    const response = await request.get(`/data/api/common/import/field-config/system-fields`, {tableName  })
    return response.data.data
  }

  /**
   * 批量获取字段映射建议（智能自动映射核心方法）
   */
  static async batchGetMappingSuggestions(tableName: string, excelHeaders: string[]): Promise<{data: AutoMappingResult}> {
    const response = await request.post(`/data/api/common/import/smart-mapping/${tableName}/batch-suggestions`, excelHeaders)
    console.log("3333333333333333333",response);
    
    return response.data
  }
  /**
   * 获取字典选项
   */
  static async getDictOptions(dictType: string): Promise<any[]> {
    const response = await request.get(`/data/data/data-base-source/options/${dictType}`)
    return response.data.data || []
  }

  /**
   * 下载转换后的数据
   */
  static async downloadTransformedData(downloadData: {
    tableName: string
    tableLabel: string
    headers: string[]
    fieldMapping: Record<string, string>
    defaultValues: Record<string, any>
  }, file: File): Promise<void> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('config', JSON.stringify(downloadData))
    
    const response = await request.post(`/data/api/common/import/download-transformed-data`, formData, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // 创建下载链接
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${downloadData.tableLabel}_转换后数据_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

/**
 * 
 */
export default CommonImportAPI