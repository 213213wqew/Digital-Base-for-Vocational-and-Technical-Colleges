import { request } from "@/utils/request";
import type { ApiResponse } from "@/utils/request";
import {ImportResult} from "@/types/low-level-import.ts";


/**
 * 低级导入功能API接口
 */

/**
 * 导入Excel数据
 * @param tableName 表名
 * @param file Excel文件
 * @returns 导入结果
 */
export function importData(tableName: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post<ApiResponse<ImportResult>>(
    `/api/low-level-import/${tableName}/import`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}

/**
 * 获取模板下载链接
 * @param tableName 表名
 * @returns 模板文件下载链接
 */
export function getTemplateDownloadUrl(tableName: string): string {
  return `/api/low-level-import/${tableName}/template`
}

/**
 * 下载导入模板
 * @param tableName 表名
 */
export function downloadTemplate(tableName: string) {
  return request.get(
    `/api/low-level-import/${tableName}/template`,
    {
      responseType: 'blob'
    }
  ).then(response => {
    // 创建下载链接
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${tableName}_import_template.xlsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  })
}

/**
 * 低级导入功能API接口
 */

/**
 * 导入Excel数据
 * @param tableName 表名
 * @param file Excel文件
 * @returns 导入结果
 */
export function simpleImportData(tableName: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.post<ApiResponse<ImportResult>>(
    `/api/simple-import/${tableName}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
}