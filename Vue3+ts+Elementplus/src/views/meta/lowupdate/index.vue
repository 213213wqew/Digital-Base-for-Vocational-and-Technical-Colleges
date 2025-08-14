<template>
  <div class="simple-import-page">
    <el-card>
      <template #header>
        <span>Excel数据导入</span>
      </template>

      <!-- 输入表名 -->
      <div class="table-input-section">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <el-form-item label="数据库表名" prop="tableName">
            <el-input v-model="form.tableName" placeholder="请输入数据库表名，如：meta_base_zygdz_ods_dksj" style="width: 400px"
              @keyup.enter="handleNext" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleNext" :disabled="!form.tableName">
              下一步：上传Excel
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 上传弹窗 -->
    <el-dialog title="Excel文件上传" v-model="showUploadDialog" width="1200px" :close-on-click-modal="false">
      <div class="dialog-content">
        <div class="table-info">
          <span>目标表：<strong>{{ form.tableName }}</strong></span>
        </div>

        <!-- 使用独立的上传组件 -->
        <SimpleExcelUpload :table-name="form.tableName" @success="handleImportSuccess" @cancel="handleCancel" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import SimpleExcelUpload from '@/components/SimpleExcelUpload.vue'

// 导入结果类型
interface ImportResult {
  success: boolean
  totalRows: number
  successRows: number
  failedRows: number
  errors: ImportError[]
  processingTime: number
  message: string
}

interface ImportError {
  rowNumber: number
  fieldName: string
  errorMessage: string
  originalValue: string
}

// 表单相关
const formRef = ref<FormInstance>()
const form = ref({
  tableName: ''
})

// 页面状态
const showUploadDialog = ref(false)

// 表单验证规则
const rules: FormRules = {
  tableName: [
    { required: true, message: '请输入数据库表名', trigger: 'blur' },
    { min: 2, message: '表名长度至少2个字符', trigger: 'blur' }
  ]
}

// 处理下一步
const handleNext = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    showUploadDialog.value = true
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 处理取消
const handleCancel = () => {
  showUploadDialog.value = false
}

// 处理导入成功
const handleImportSuccess = (result: ImportResult) => {
  ElMessage.success(`导入完成！成功 ${result.successRows} 条，失败 ${result.failedRows} 条`)
  showUploadDialog.value = false // 关闭弹窗
}
</script>

<style scoped>
.simple-import-page {
  padding: 20px;
}

.table-input-section {
  padding: 20px 0;
}

.table-info {
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #409eff;
}

.table-info strong {
  color: #409eff;
}

.dialog-content {
  padding: 0;
}

.dialog-content .table-info {
  margin-bottom: 20px;
  font-size: 14px;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-form-item) {
  margin-bottom: 22px;
}

:deep(.el-dialog__body) {
  padding: 20px;
}
</style>