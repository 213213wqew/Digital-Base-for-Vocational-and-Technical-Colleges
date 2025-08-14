<template>
  <div class="match-rule-manager">

    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="query" @submit.prevent class="search-form">
        <div class="search-row">
          <el-form-item label="表名">
            <el-input v-model="query.tableName" placeholder="请输入表名" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="表中文名">
            <el-input v-model="query.tableChineseName" placeholder="请输入表中文名" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item label="字段名">
            <el-input v-model="query.fieldName" placeholder="请输入字段名" clearable style="width: 200px" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getList">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </div>
        <div class="action-row">
          <el-form-item>
            <el-button type="success" icon="Plus" @click="openDialog()">新增规则</el-button>
            <el-button type="warning" icon="Refresh" @click="handleUpdateRules">更新规则</el-button>
            <!-- <el-button type="warning" icon="Upload" @click="handleBatchImport">批量导入</el-button>
            <el-button type="info" icon="Download" @click="handleBatchExport">批量导出</el-button> -->
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div style="text-align: center;font-size: 18px;margin-bottom: 10px" >
        智能匹配规则
      </div>
      <el-table :data="list"
      height="calc(75vh - 150px)"
      border stripe style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="tableName" label="表名" min-width="120" />
        <el-table-column prop="tableChineseName" label="表中文名" min-width="120" />
        <el-table-column prop="fieldName" label="字段名" min-width="120" />
        <el-table-column prop="fieldLabel" label="字段中文名" min-width="120" />
        <el-table-column prop="matchPatterns" label="匹配模式" min-width="200">
          <template #default="{ row }">
            <el-tag v-for="pattern in parsePatterns(row.matchPatterns)" :key="pattern" size="small" style="margin-right: 4px">{{ pattern }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="matchPriority" label="优先级" width="80" align="center" />
        <el-table-column prop="exactMatch" label="精确" width="70" align="center">
          <template #default="{ row }">
            <el-tag :type="row.exactMatch ? 'success' : 'info'" size="small">{{ row.exactMatch ? '是' : '否' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="matchStrategy" label="策略" width="100" align="center" />
        <el-table-column prop="confidenceThreshold" label="置信度" width="90" align="center" />
        <el-table-column prop="enableStatus" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-switch v-model="row.enableStatus" :active-value="1" :inactive-value="0" @change="updateStatus(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="openDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 16px; display: flex; justify-content: flex-end;">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[100, 200, 500, 800]"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>

    <MatchRuleDialog
      v-model:visible="dialogVisible"
      :edit-data="editData"
      @success="getList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import matchRuleApi, { MatchRule } from '@/api-data/data/data_base/common/match-rule'
// 修正路径，确保组件路径正确，避免找不到模块错误
import MatchRuleDialog from './components/MatchRuleDialog.vue'
const query = reactive({ tableName: '', tableChineseName: '', fieldName: '' })
const list = ref<MatchRule[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editData = ref<MatchRule | null>(null)
const pageNum = ref(1)
const pageSize = ref(100)
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const res:any = await matchRuleApi.pageMatchRule({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      tableName: query.tableName,
      tableChineseName: query.tableChineseName,
      fieldName: query.fieldName
    })
    console.log(res);
    
    list.value = res.data.data.records
    total.value = res.data.data.total
  } catch (e) {
    ElMessage.error('获取规则列表失败')
  } finally {
    loading.value = false
  }
}

const resetQuery = () => {
  query.tableName = ''
  query.tableChineseName = ''
  query.fieldName = ''
  getList()
}

const openDialog = (row?: MatchRule) => {
  editData.value = row ? { ...row } : null
  dialogVisible.value = true
}

const handleDelete = async (row: MatchRule) => {
  try {
    await ElMessageBox.confirm(`确定要删除该规则吗？`, '提示', { type: 'warning' })
    await matchRuleApi.delete(row.id!)
    ElMessage.success('删除成功')
    getList()
  } catch (e) {
    if (e !== 'cancel') ElMessage.error('删除失败')
  }
}

const updateStatus = async (row: MatchRule) => {
  try {
    await matchRuleApi.edit(row)
    ElMessage.success('状态更新成功')
  } catch (e) {
    ElMessage.error('状态更新失败')
    row.enableStatus = row.enableStatus === 1 ? 0 : 1
  }
}

const handleBatchImport = () => {
  ElMessage.info('批量导入功能开发中...')
}
const handleBatchExport = () => {
  ElMessage.info('批量导出功能开发中...')
}

const handleUpdateRules = async () => {
  try {
    await ElMessageBox.confirm('确定要更新匹配规则吗？这将根据字段配置表重新生成规则。', '提示', { 
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    if(!query.tableChineseName){
      ElMessage.error('请输入表中文名，输入不可更新')
      return
    }
    
    loading.value = true
    await matchRuleApi.updateByTableChineseName(query.tableChineseName)
    ElMessage.success('更新成功')
    getList() // 刷新列表
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error('更新失败：' + (e.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

const handlePageChange = (val: number) => {
  pageNum.value = val
  getList()
}
const handleSizeChange = (val: number) => {
  pageSize.value = val
  pageNum.value = 1
  getList()
}

const parsePatterns = (patterns: any) => {
  // 调试输出
  console.log('matchPatterns:', patterns)
  if (!patterns) return []
  if (Array.isArray(patterns)) return patterns
  if (typeof patterns === 'string') {
    try {
      const arr = JSON.parse(patterns)
      if (Array.isArray(arr)) return arr
    } catch {}
    // 兜底：逗号/中文逗号分隔
    return patterns.split(/,|，/).map(s => s.trim()).filter(Boolean)
  }
  return []
}

onMounted(getList)
</script>

<style lang="scss" scoped>
.match-rule-manager {
  .search-card {
    margin-bottom: 20px;
  }
  .table-card {
    margin-bottom: 20px;
  }
  .search-form {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    
    .search-row {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
    }
    
    .action-row {
      display: flex;
      align-items: center;
      
      .el-form-item {
        margin-bottom: 0;
        margin-right: 0;
      }
    }
  }
  
  // 确保表单项对齐
  :deep(.el-form-item) {
    margin-bottom: 0;
    margin-right: 0;
    
    .el-form-item__label {
      line-height: 32px;
    }
    
    .el-input {
      .el-input__wrapper {
        height: 32px;
      }
    }
    
    .el-button {
      height: 32px;
      line-height: 1;
    }
  }
}
</style> 