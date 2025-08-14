<template>
  <div class="smart-mapping-test">
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="header-title">智能映射测试</span>
          <div class="table-info" v-if="tableName">
            <el-tag type="info">当前表：{{ tableName }}</el-tag>
          </div>
        </div>
      </template>

      <div v-if="!tableName" class="no-table-selected">
        <el-empty description="请先在导入配置页面选择一个表进行智能映射测试" />
      </div>

      <div v-else>
        <!-- 测试输入区域 -->
        <el-row :gutter="16">
          <el-col :span="12">
            <el-card shadow="never" class="test-input-card">
              <template #header>
                <span>Excel表头输入测试</span>
              </template>
              
              <el-form label-width="120px">
                <el-form-item label="测试表头">
                  <el-input
                    v-model="testHeader"
                    placeholder="输入Excel表头进行匹配测试"
                    @keyup.enter="testSingleMapping"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="testSingleMapping" :loading="singleLoading">
                    测试单个匹配
                  </el-button>
                  <el-button @click="clearSingleTest">清空</el-button>
                </el-form-item>
              </el-form>

              <!-- 单个匹配结果 -->
              <div v-if="singleResult.length > 0" class="single-result">
                <el-divider>匹配结果</el-divider>
                <el-table :data="singleResult" size="small" border>
                  <el-table-column prop="fieldLabel" label="系统字段" />
                  <el-table-column prop="confidence" label="置信度" width="100" align="center">
                    <template #default="{ row }">
                      <el-progress
                        :percentage="row.confidence"
                        :color="getProgressColor(row.confidence)"
                        :stroke-width="6"
                        text-inside
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="matchStrategy" label="匹配策略" width="100" align="center">
                    <template #default="{ row }">
                      <el-tag :type="getStrategyType(row.matchStrategy)" size="small">
                        {{ getStrategyLabel(row.matchStrategy) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="matchedPattern" label="匹配模式" />
                </el-table>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card shadow="never" class="batch-test-card">
              <template #header>
                <span>批量表头测试</span>
              </template>
              
              <el-form label-width="120px">
                <el-form-item label="批量表头">
                  <el-input
                    v-model="batchHeaders"
                    type="textarea"
                    :rows="4"
                    placeholder="输入多个Excel表头，每行一个"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="testBatchMapping" :loading="batchLoading">
                    批量智能映射
                  </el-button>
                  <el-button @click="clearBatchTest">清空</el-button>
                </el-form-item>
              </el-form>

              <!-- 批量映射统计 -->
              <div v-if="batchResult" class="batch-stats">
                <el-divider>映射统计</el-divider>
                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-statistic title="总表头数" :value="batchResult.totalHeaders" />
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="成功映射" :value="batchResult.matchedHeaders" />
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="匹配率" :value="batchResult.matchRate" suffix="%" />
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 批量映射结果详情 -->
        <div v-if="batchResult && batchMappingDetails.length > 0" class="batch-result-details">
          <el-card shadow="never" style="margin-top: 16px;">
            <template #header>
              <span>批量映射详情</span>
            </template>
            
            <el-table :data="batchMappingDetails" border stripe>
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="excelHeader" label="Excel表头" min-width="150" />
              <el-table-column label="映射结果" min-width="200">
                <template #default="{ row }">
                  <div v-if="row.bestMatch">
                    <div class="best-match">
                      <el-tag type="success" size="small">{{ row.bestMatch.fieldLabel }}</el-tag>
                      <span class="confidence">{{ row.bestMatch.confidence }}%</span>
                    </div>
                  </div>
                  <div v-else class="no-match">
                    <el-tag type="info" size="small">未匹配</el-tag>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="其他建议" min-width="300">
                <template #default="{ row }">
                  <div v-if="row.otherSuggestions.length > 0" class="other-suggestions">
                    <el-tag
                      v-for="suggestion in row.otherSuggestions"
                      :key="suggestion.fieldName"
                      size="small"
                      type="warning"
                      style="margin-right: 4px; margin-bottom: 4px;"
                    >
                      {{ suggestion.fieldLabel }} ({{ suggestion.confidence }}%)
                    </el-tag>
                  </div>
                  <span v-else class="no-other">无其他建议</span>
                </template>
              </el-table-column>
              <el-table-column prop="processingTime" label="处理时间" width="100" align="center">
                <template #default="{ row }">
                  <span class="processing-time">{{ row.processingTime }}ms</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>

        <!-- 预设测试用例 -->
        <el-card shadow="never" style="margin-top: 16px;">
          <template #header>
            <span>预设测试用例</span>
          </template>
          
          <div class="preset-tests">
            <el-button-group>
              <el-button @click="loadPresetTest('school')" size="small">学校信息测试</el-button>
              <el-button @click="loadPresetTest('student')" size="small">学生信息测试</el-button>
              <el-button @click="loadPresetTest('teacher')" size="small">教师信息测试</el-button>
              <el-button @click="loadPresetTest('course')" size="small">课程信息测试</el-button>
            </el-button-group>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getMatchingSuggestions,
  batchGetMappingSuggestions,
  type MatchingSuggestion,
  type AutoMappingResult
} from '@/api-data/data/data_base/common/smart-mapping'

// Props定义
interface Props {
  tableName: string
}

const props = defineProps<Props>()

// 响应式数据
const testHeader = ref('')
const batchHeaders = ref('')
const singleResult = ref<MatchingSuggestion[]>([])
const batchResult = ref<AutoMappingResult | null>(null)
const singleLoading = ref(false)
const batchLoading = ref(false)

// 计算属性
const batchMappingDetails = computed(() => {
  if (!batchResult.value) return []
  
  const headers = batchHeaders.value.split('\n').filter(h => h.trim())
  return headers.map(header => {
    const suggestions = batchResult.value!.mappingResults[header] || []
    const bestMatch = batchResult.value!.autoMappedFields[header] || null
    const otherSuggestions = suggestions.filter(s => s.fieldName !== bestMatch?.fieldName).slice(0, 3)
    
    return {
      excelHeader: header,
      bestMatch,
      otherSuggestions,
      processingTime: Math.round(Math.random() * 50 + 10) // 模拟处理时间
    }
  })
})

// 监听tableName变化
watch(() => props.tableName, (newTableName) => {
  if (newTableName) {
    clearAllTests()
  }
})

// 测试单个映射
const testSingleMapping = async () => {
  if (!testHeader.value.trim()) {
    ElMessage.warning('请输入测试表头')
    return
  }
  
  if (!props.tableName) {
    ElMessage.warning('请先选择表名')
    return
  }
  
  singleLoading.value = true
  try {
    const result = await getMatchingSuggestions(props.tableName, testHeader.value.trim())
    singleResult.value = result.data || []
    
    if (singleResult.value.length > 0) {
      ElMessage.success(`找到 ${singleResult.value.length} 个匹配建议`)
    } else {
      ElMessage.info('未找到匹配的系统字段')
    }
  } catch (error: any) {
    ElMessage.error('单个映射测试失败：' + (error.message || '未知错误'))
    singleResult.value = []
  } finally {
    singleLoading.value = false
  }
}

// 测试批量映射
const testBatchMapping = async () => {
  const headers = batchHeaders.value.split('\n').filter(h => h.trim())
  
  if (headers.length === 0) {
    ElMessage.warning('请输入批量测试表头')
    return
  }
  
  if (!props.tableName) {
    ElMessage.warning('请先选择表名')
    return
  }
  
  batchLoading.value = true
  try {
    const result = await batchGetMappingSuggestions(props.tableName, headers)
    batchResult.value = result.data
    
    ElMessage.success(`批量映射完成！匹配率：${batchResult.value.matchRate.toFixed(1)}%`)
  } catch (error: any) {
    ElMessage.error('批量映射测试失败：' + (error.message || '未知错误'))
    batchResult.value = null
  } finally {
    batchLoading.value = false
  }
}

// 清空单个测试
const clearSingleTest = () => {
  testHeader.value = ''
  singleResult.value = []
}

// 清空批量测试
const clearBatchTest = () => {
  batchHeaders.value = ''
  batchResult.value = null
}

// 清空所有测试
const clearAllTests = () => {
  clearSingleTest()
  clearBatchTest()
}

// 加载预设测试用例
const loadPresetTest = (type: string) => {
  const presetTests: Record<string, string[]> = {
    school: [
      '学校代码*',
      '学校名称*',
      '学校类型*',
      '省份代码*',
      '省份名称*',
      '城市代码',
      '城市名称',
      '学校地址',
      '建校日期',
      '学生人数',
      '教师人数',
      '联系电话',
      '学校网站'
    ],
    student: [
      '学号*',
      '学生姓名*',
      '性别',
      '出生日期',
      '身份证号',
      '专业代码*',
      '专业名称*',
      '班级',
      '年级',
      '联系电话',
      '邮箱地址'
    ],
    teacher: [
      '教师编号*',
      '教师姓名*',
      '性别',
      '出生日期',
      '职称',
      '学历',
      '所属部门*',
      '联系电话',
      '邮箱地址',
      '入职日期'
    ],
    course: [
      '课程代码*',
      '课程名称*',
      '课程类型',
      '学分',
      '学时',
      '开课学期',
      '任课教师',
      '课程简介'
    ]
  }
  
  const headers = presetTests[type] || []
  batchHeaders.value = headers.join('\n')
  ElMessage.success(`已加载${type}测试用例，共${headers.length}个表头`)
}

// 获取进度条颜色
const getProgressColor = (confidence: number) => {
  if (confidence >= 90) return '#67c23a'
  if (confidence >= 70) return '#e6a23c'
  return '#f56c6c'
}

// 获取策略类型
const getStrategyType = (strategy: string) => {
  const typeMap: Record<string, string> = {
    exact: 'success',
    fuzzy: 'warning',
    pinyin: 'info',
    semantic: 'danger'
  }
  return typeMap[strategy] || 'info'
}

// 获取策略标签
const getStrategyLabel = (strategy: string) => {
  const labelMap: Record<string, string> = {
    exact: '精确',
    fuzzy: '模糊',
    pinyin: '拼音',
    semantic: '语义'
  }
  return labelMap[strategy] || strategy
}
</script>

<style lang="scss" scoped>
.smart-mapping-test {
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
    
    .table-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .no-table-selected {
    padding: 40px 0;
  }
  
  .test-input-card,
  .batch-test-card {
    height: 100%;
  }
  
  .single-result {
    margin-top: 16px;
  }
  
  .batch-stats {
    margin-top: 16px;
  }
  
  .batch-result-details {
    .best-match {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .confidence {
        font-weight: 600;
        color: #67c23a;
      }
    }
    
    .no-match {
      color: #909399;
    }
    
    .other-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .no-other {
      color: #c0c4cc;
      font-size: 12px;
    }
    
    .processing-time {
      color: #909399;
      font-size: 12px;
    }
  }
  
  .preset-tests {
    .el-button-group {
      .el-button {
        margin-right: 8px;
        margin-bottom: 8px;
      }
    }
  }
}
</style>