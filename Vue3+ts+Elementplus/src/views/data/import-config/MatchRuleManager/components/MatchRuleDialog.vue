<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="val => emit('update:visible', val)"
    :title="editData ? '编辑匹配规则' : '新增匹配规则'"
    width="600px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
      <el-form-item label="表名" prop="tableName" style="margin-bottom: 15px;">
        <el-input v-model="form.tableName" placeholder="请输入表名" :disabled="!!editData" />
      </el-form-item>
      <el-form-item label="字段名" prop="fieldName" style="margin-bottom: 15px;">
        <el-input v-model="form.fieldName" placeholder="请输入字段名" :disabled="!!editData" />
      </el-form-item>
      <el-form-item label="匹配模式" prop="matchPatterns" style="margin-bottom: 15px;">
        <el-input
          v-model="matchPatternsInput"
          placeholder="请输入多个匹配词，用逗号分隔"
          @input="handlePatternsInput"
          clearable
        />
      </el-form-item>
      <el-form-item label="优先级" prop="matchPriority"  style="margin-bottom: 15px;">
        <el-input-number v-model="form.matchPriority" :min="1" :max="10" />
      </el-form-item>
      <el-form-item label="精确匹配" prop="exactMatch"  style="margin-bottom: 15px;">
        <el-switch v-model="form.exactMatch" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否" />
      </el-form-item>
      <el-form-item label="匹配策略" prop="matchStrategy"  style="margin-bottom: 15px;">
        <el-select v-model="form.matchStrategy" placeholder="请选择策略">
          <el-option label="精确" value="exact" />
          <el-option label="模糊" value="fuzzy" />
          <el-option label="拼音" value="pinyin" />
          <el-option label="语义" value="semantic" />
        </el-select>
      </el-form-item>
      <el-form-item label="置信度阈值" prop="confidenceThreshold"  style="margin-bottom: 15px;">
        <el-input-number v-model="form.confidenceThreshold" :min="0" :max="100" />
      </el-form-item>
      <el-form-item label="状态" prop="enableStatus"  style="margin-bottom: 15px;">
        <el-switch v-model="form.enableStatus" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="禁用" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import matchRuleApi, { MatchRule } from '@/api-data/data/data_base/common/match-rule'

const props = defineProps<{
  visible: boolean
  editData?: MatchRule | null
}>()
const emit = defineEmits(['update:visible', 'success'])

const formRef = ref()
const loading = ref(false)
const form = ref<MatchRule>({
  tableName: '',
  fieldName: '',
  matchPatterns: [],
  matchPriority: 1,
  exactMatch: 0,  // 修正为数字类型
  matchStrategy: 'exact',
  confidenceThreshold: 100,
  enableStatus: 1
})

const matchPatternsInput = ref('')

// 编辑时回显
watch(
  () => props.visible,
  (val) => {
    if (val) {
      if (props.editData) {
        form.value = { 
          ...props.editData,
          exactMatch: props.editData.exactMatch || 0  // 确保为数字类型
        }
        if (Array.isArray(props.editData.matchPatterns)) {
          matchPatternsInput.value = props.editData.matchPatterns.join(',')
        } else if (typeof props.editData.matchPatterns === 'string') {
          try {
            const arr = JSON.parse(props.editData.matchPatterns)
            matchPatternsInput.value = Array.isArray(arr) ? arr.join(',') : props.editData.matchPatterns
          } catch {
            matchPatternsInput.value = props.editData.matchPatterns
          }
        } else {
          matchPatternsInput.value = ''
        }
      } else {
        form.value = {
          tableName: '',
          fieldName: '',
          matchPatterns: [],
          matchPriority: 1,
          exactMatch: 0,  // 修正为数字类型
          matchStrategy: 'exact',
          confidenceThreshold: 100,
          enableStatus: 1
        }
        matchPatternsInput.value = ''
      }
    }
  },
  { immediate: true }
)

// 输入时自动分割
const handlePatternsInput = (val: string) => {
  form.value.matchPatterns = val
    .split(/,|，/)
    .map(s => s.trim())
    .filter(Boolean)
}

const rules = {
  tableName: [{ required: true, message: '请输入表名', trigger: 'blur' }],
  fieldName: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  matchPatterns: [{ required: true, message: '请输入匹配模式', trigger: 'change' }],
  matchPriority: [{ required: true, message: '请输入优先级', trigger: 'blur' }],
  matchStrategy: [{ required: true, message: '请选择策略', trigger: 'change' }],
  confidenceThreshold: [{ required: true, message: '请输入置信度', trigger: 'blur' }]
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      // 关键：提交前转成JSON字符串
      if (Array.isArray(form.value.matchPatterns)) {
        form.value.matchPatterns = JSON.stringify(form.value.matchPatterns)
      }
      
      // 确保exactMatch为数字类型，并过滤掉日期时间字段
      const { createTime, updateTime, ...submitData } = {
        ...form.value,
        exactMatch: form.value.exactMatch ? 1 : 0
      }
      
      // 调试：输出提交的数据
      console.log('提交的数据:', JSON.stringify(submitData, null, 2))
      
      if (props.editData && props.editData.id) {
        await matchRuleApi.edit({ ...submitData, id: props.editData.id })
        ElMessage.success('编辑成功')
      } else {
        await matchRuleApi.add(submitData)
        ElMessage.success('新增成功')
      }
      emit('update:visible', false)
      emit('success')
    } catch (e: any) {
      console.error('提交错误:', e)
      console.error('错误详情:', e.response?.data || e.message)
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style> 