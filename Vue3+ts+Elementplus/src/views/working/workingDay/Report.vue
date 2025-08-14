<template>
  <div class="app-container">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold"
            >数据上报确认 - {{ tableInfo.subsetName }}</span
          >
          <el-button type="success" @click="handleConfirmReport" :loading="submitting">
          <el-icon><Check /></el-icon>确认上报
          </el-button>
          
          <el-button type="warning" @click="handleDataValidation" :loading="validating">
          <el-icon><Warning /></el-icon>引用检验
          </el-button>
     
          <el-button type="primary" @click="goBack">
            <el-icon><Back /></el-icon>返回
          </el-button>
        </div>
      </template>

      <!-- 表信息展示 -->
      <el-descriptions :column="3" border>
        <el-descriptions-item label="数据子集">{{ tableInfo.subsetName }}</el-descriptions-item>
        <el-descriptions-item label="数据类">{{ tableInfo.catalogName }}</el-descriptions-item>
        <el-descriptions-item label="数据子类">{{ tableInfo.subcatalogName }}</el-descriptions-item>
        <el-descriptions-item label="表编码">{{ tableInfo.subsetCode }}</el-descriptions-item>
        <el-descriptions-item label="数据表英文名">{{ tableInfo.tableName }}</el-descriptions-item>
        <el-descriptions-item label="上报部门">{{ tableInfo.deptName }}</el-descriptions-item>
        <el-descriptions-item label="采集日期">{{ tableInfo.reportDate }}</el-descriptions-item>
        <el-descriptions-item label="上报频率">{{ tableInfo.tableReportFrequency }}</el-descriptions-item>
        <el-descriptions-item label="数据状态">
          <el-tag type="success">已迁移</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 迁移后的数据展示 -->
      <div class="data-preview-container">
        <div class="section-header">
          <!-- <h3>迁移后的数据预览 (meta_base_{{ tableInfo.subsetCode }}_{{ tableInfo.tableName }})</h3>
          <p class="text-muted">显示从 data_base 表迁移到 meta_base 表的数据</p> -->.
           <h3>需上传的数据</h3>
        </div>

        <el-table
          v-loading="loading"
          :data="migratedData"
          border
          style="width: 100%"
          height="55vh"
        >
          <el-table-column
            v-for="column in tableColumns"
            :key="column"
            :prop="column"
            :label="getColumnLabel(column)"
            min-width="120"
            show-overflow-tooltip
          />
        </el-table>

        <!-- <div class="data-summary">
          <el-alert
            title="数据迁移完成"
            type="success"
            :closable="false"
            show-icon
          >
            <template #default>
              成功迁移 {{ migratedData.length }} 条数据到 meta_base 表
            </template>
          </el-alert>
        </div> -->
      </div>

      <!-- 操作按钮 -->
       
    </el-card>
    
    <!-- 数据校验结果弹窗 -->
    <ValidationResultDialog
      v-model="showValidationDialogVisible"
      :validation-results="validationResults"
      :table-name="tableInfo.tableName"
      :show-progress="validating"
      :progress-percentage="progressPercentage"
      :progress-status="progressStatus"
      :processed-records="processedRecords"
      :total-records="totalRecords"
      :current-field="currentField"
      :field-count="fieldCount"
      :validated-fields="validatedFields"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Back, Check, Warning } from "@element-plus/icons-vue";
import { workingDayApi, type WorkingDayVO } from "@/api/working/workingDay";
import ValidationResultDialog from "@/views/working/workingDay/ValidationResultDialog.vue";

const route = useRoute();
const router = useRouter();

// 响应式数据
const loading = ref(false);
const submitting = ref(false);
const validating = ref(false);
const showValidationDialogVisible = ref(false);
const validationResults = ref<any[]>([]);
const tableInfo = ref<WorkingDayVO>({} as WorkingDayVO);
const migratedData = ref<any[]>([]);
const tableColumns = ref<string[]>([]);
const columnComments = ref<Record<string, string>>({});

// 进度条相关数据
const progressPercentage = ref(0);
const progressStatus = ref<'success' | 'exception' | 'warning' | undefined>(undefined);
const processedRecords = ref(0);
const totalRecords = ref(0);
const currentField = ref('');
const fieldCount = ref(0);
const validatedFields = ref(0);

// 方法
function goBack() {
  router.back();
}

async function handleConfirmReport() {
  try {
    // 弹出确认弹窗
    await ElMessageBox.confirm(
      `确定要确认上报 ${tableInfo.value.subsetName} 的数据吗？\n\n数据子集：${tableInfo.value.subsetName}\n表编码：${tableInfo.value.subsetCode}\n数据表英文名：${tableInfo.value.tableName}\n采集日期：${tableInfo.value.reportDate}`,
      "确认上报",
      {
        confirmButtonText: "确认上报",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "el-button--warning"
      }
    );
    
    submitting.value = true;
    
    // 构建meta_base表名
    const metaBaseTableName = `meta_base_${tableInfo.value.subsetCode}_${tableInfo.value.tableName}`;
    
    // 调用确认上报API
    const res = await workingDayApi.confirmReport({
      tableId: tableInfo.value.tableId,
      tableName: tableInfo.value.tableName,
      subsetCode: tableInfo.value.subsetCode,
      deptId: tableInfo.value.deptId,
      reportDate: tableInfo.value.reportDate,
      metaBaseTableName: metaBaseTableName
    });
    
    if (res.data && res.data.code === 200) {
      ElMessage.success("确认上报成功");
      // 返回上一页
      goBack();
    } else {
      ElMessage.error((res.data && res.data.message) || "确认上报失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("确认上报失败: " + error.message);
    }
  } finally {
    submitting.value = false;
  }
}

async function handleDataValidation() {
  try {
    validating.value = true;
    showValidationDialogVisible.value = true;
    
    // 重置进度条
    progressPercentage.value = 0;
    progressStatus.value = undefined;
    processedRecords.value = 0;
    totalRecords.value = 0;
    currentField.value = '正在初始化...';
    fieldCount.value = 0;
    validatedFields.value = 0;
    
    // 调用数据校验API
    const res = await workingDayApi.validateData({
      tableName: tableInfo.value.tableName,
      subsetCode: tableInfo.value.subsetCode,
      reportDate: tableInfo.value.reportDate
    });
    
    if (res.data && res.data.code === 200) {
      const result = res.data.data;
      
      // 更新进度信息
      totalRecords.value = result.totalRecords || 0;
      processedRecords.value = result.processedRecords || 0;
      currentField.value = result.currentField || '验证完成';
      progressPercentage.value = result.progressPercentage || 100;
      fieldCount.value = result.fieldCount || 0;
      validatedFields.value = result.validatedFields || 0;
      
      // 设置校验结果
      validationResults.value = result.validationResults || [];
      
      // 延迟隐藏进度条
      setTimeout(() => {
        validating.value = false;
      }, 1000);
    } else {
      progressStatus.value = 'exception';
      ElMessage.error((res.data && res.data.message) || "数据校验失败");
      validating.value = false;
    }
  } catch (error: any) {
    progressStatus.value = 'exception';
    ElMessage.error("数据校验失败: " + error.message);
    validating.value = false;
  }
}

async function loadColumnComments() {
  try {
    // 获取字段注释信息
    const res = await workingDayApi.getColumnComments({
      subsetCode: tableInfo.value.subsetCode,
      tableName: tableInfo.value.tableName
    });
    
    if (res.data && res.data.code === 200) {
      columnComments.value = res.data.data || {};
      console.log("获取到字段注释:", columnComments.value);
    }
  } catch (error: any) {
    console.error("获取字段注释失败:", error);
  }
}

function getColumnLabel(columnName: string): string {
  // 优先使用字段注释，如果没有注释则使用字段名
  return columnComments.value[columnName] || columnName;
}

async function loadMigratedData() {
  loading.value = true;
  try {
    // 先加载字段注释
    await loadColumnComments();
    
    // 调用真实API获取meta_base表中的数据
    const res = await workingDayApi.getMigratedData({
      subsetCode: tableInfo.value.subsetCode,
      tableName: tableInfo.value.tableName,
      reportDate: tableInfo.value.reportDate
    });
    
    if (res.data && res.data.code === 200) {
      migratedData.value = res.data.data || [];
      
      // 动态生成表格列
      if (migratedData.value.length > 0) {
        tableColumns.value = Object.keys(migratedData.value[0]);
      }
      
      console.log("获取到迁移数据:", migratedData.value);
    } else {
      ElMessage.error((res.data && res.data.message) || "获取迁移数据失败");
    }
    
  } catch (error: any) {
    ElMessage.error("加载迁移数据失败: " + error.message);
  } finally {
    loading.value = false;
  }
}

function loadTableInfo() {
  const tableId = route.query.tableId;
  const tableName = route.query.tableName;
  const subsetCode = route.query.subsetCode;
  const deptId = route.query.deptId;
  const reportDate = route.query.reportDate;
  const subsetName = route.query.subsetName;
  const catalogName = route.query.catalogName;
  const subcatalogName = route.query.subcatalogName;
  const tableReportFrequency = route.query.tableReportFrequency;
  const reportStatus = route.query.reportStatus;
  const deptName = route.query.deptName;

  if (!tableId || !tableName || !subsetCode) {
    ElMessage.error("缺少必要参数");
    goBack();
    return;
  }

  console.log("tableInfo111111111111111", tableInfo.value);
  // 从路由参数构建表信息
  tableInfo.value = {
    tableId: Number(tableId),
    tableName: String(tableName),
    subsetCode: String(subsetCode),
    subsetName: String(subsetName),
    catalogCode: String(reportStatus),
    catalogName: String(catalogName),
    subcatalogCode: String(tableReportFrequency),
    subcatalogName: String(subcatalogName),
    deptId: Number(deptId || 0),
    deptName: String(deptName),
    tableReportFrequency: String(tableReportFrequency),
    reportStatus: Number(reportStatus),
    reportDate: String(reportDate || new Date().toISOString().split("T")[0])
  };
}

// 生命周期钩子
onMounted(() => {
  loadTableInfo();
  loadMigratedData();
});
</script>

<style scoped>
.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.text-lg {
  font-size: 18px;
}

.font-bold {
  font-weight: bold;
}

.data-preview-container {
  margin-top: 20px;
}

.section-header {
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
}

.text-muted {
  color: #6c757d;
  margin: 0;
}

.data-summary {
  margin-top: 16px;
}

.action-buttons {
  margin-top: 24px;
  text-align: center;
}

.action-buttons .el-button {
  margin: 0 8px;
}


</style>
