<template>
  <div class="meta-tables-container">
    <div class="custom-tabs">
      <div class="tabs-header">
        <div
          :class="['tab-item', activeTab === 'related' ? 'active' : '']"
          @click="activeTab = 'related'"
        >
          已关联数据表
        </div>
        <div
          :class="['tab-item', activeTab === 'available' ? 'active' : '']"
          @click="activeTab = 'available'"
        >
          可关联数据表
        </div>
      </div>

      <div class="tabs-content">
        <div v-if="activeTab === 'related'" class="tab-pane">
          <div class="toolbar">
            <div class="left">
              <el-button type="primary" @click="handleAddMetaTable" :icon="Plus"
                >添加数据表</el-button
              >
            </div>
            <div class="right">
              <el-input
                v-model="searchRelated"
                placeholder="搜索数据表"
                clearable
                :prefix-icon="Search"
                style="width: 220px; margin-right: 8px"
                @input="filterRelatedTables"
              />
              <el-select
                v-model="reportFrequencyFilter"
                placeholder="上报频率"
                clearable
                style="width: 120px"
                @change="filterRelatedTables"
              >
                <el-option label="天" value="天" />
                <el-option label="周" value="周" />
                <el-option label="月" value="月" />
                <el-option label="学期" value="学期" />
                <el-option label="年" value="年" />
              </el-select>
            </div>
          </div>

          <el-table
            v-loading="relatedLoading"
            :data="filteredRelatedTables"
            style="width: 100%"
            border
            stripe
            row-key="id"
          >
            <el-table-column type="index" label="#" width="50" />
            <el-table-column
              prop="subsetName"
              label="数据子集"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="catalogName"
              label="数据类"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="subcatalogName"
              label="数据子类"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="subcatalogCode"
              label="表编码"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column label="上报频率" min-width="120">
              <template #default="{ row }">
                <el-tag>{{
                  row.tableReportFrequency || row.defaultReportFrequency || "-"
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleEdit(row)"
                  :icon="Edit"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  link
                  size="small"
                  @click="handleDelete(row)"
                  :icon="Delete"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else-if="activeTab === 'available'" class="tab-pane">
          <div class="toolbar">
            <div class="right">
              <el-input
                v-model="searchAvailable"
                placeholder="搜索数据表"
                clearable
                :prefix-icon="Search"
                style="width: 220px; margin-right: 8px"
                @input="filterAvailableTables"
              />
              <el-select
                v-model="defaultReportFrequencyFilter"
                placeholder="默认上报频率"
                clearable
                style="width: 120px"
                @change="filterAvailableTables"
              >
                <el-option label="天" value="天" />
                <el-option label="周" value="周" />
                <el-option label="月" value="月" />
                <el-option label="学期" value="学期" />
                <el-option label="年" value="年" />
              </el-select>
            </div>
          </div>

          <el-table
            v-loading="availableLoading"
            :data="filteredAvailableTables"
            style="width: 100%"
            border
            stripe
            row-key="id"
          >
            <el-table-column type="index" label="#" width="50" />
            <el-table-column
              prop="subsetName"
              label="数据子集"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="catalogName"
              label="数据类"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column
              prop="subcatalogName"
              label="数据子类"
              min-width="150"
              show-overflow-tooltip
            />
            <el-table-column
              prop="subcatalogCode"
              label="表编码"
              min-width="120"
              show-overflow-tooltip
            />
            <el-table-column label="默认上报频率" min-width="120">
              <template #default="{ row }">
                <el-tag>{{ row.defaultReportFrequency || "-" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button
                  type="primary"
                  link
                  size="small"
                  @click="handleAdd(row)"
                  :icon="Plus"
                >
                  添加
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="数据子集">
          <el-input v-model="formData.subsetName" disabled />
        </el-form-item>
        <el-form-item label="数据类">
          <el-input v-model="formData.catalogName" disabled />
        </el-form-item>
        <el-form-item label="数据子类">
          <el-input v-model="formData.subcatalogName" disabled />
        </el-form-item>
        <el-form-item label="表编码">
          <el-input v-model="formData.subcatalogCode" disabled />
        </el-form-item>
        <el-form-item label="上报频率" prop="tableReportFrequency">
          <el-select
            v-model="formData.tableReportFrequency"
            placeholder="请选择上报频率"
            style="width: 100%"
          >
            <el-option label="天" value="天" />
            <el-option label="周" value="周" />
            <el-option label="月" value="月" />
            <el-option label="学期" value="学期" />
            <el-option label="年" value="年" />
          </el-select>
          <div class="form-tips" v-if="formData.defaultReportFrequency">
            <el-text type="info" size="small"
              >默认上报频率: {{ formData.defaultReportFrequency }}</el-text
            >
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmit"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineProps } from "vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { Search, Plus, Edit, Delete } from "@element-plus/icons-vue";
import { deptApi, type MetaTableInfo } from "@/api/dept";

const props = defineProps<{
  deptId: number;
}>();

// 响应式数据
const activeTab = ref("related");
const relatedLoading = ref(false);
const availableLoading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const relatedTables = ref<MetaTableInfo[]>([]);
const availableTables = ref<MetaTableInfo[]>([]);
const searchRelated = ref("");
const searchAvailable = ref("");
const formRef = ref<FormInstance>();
const reportFrequencyFilter = ref("");
const defaultReportFrequencyFilter = ref("");

// 表单数据
const formData = ref<MetaTableInfo>({
  tableId: 0,
  subcatalogCode: "",
  subcatalogName: "",
  catalogCode: "",
  catalogName: "",
  subsetCode: "",
  subsetName: "",
  tableReportFrequency: "",
  defaultReportFrequency: "",
});

// 表单验证规则
const formRules = {
  tableReportFrequency: [
    { required: true, message: "请选择上报频率", trigger: "change" },
  ],
};

// 计算属性
const dialogTitle = computed(() => {
  return isEdit.value ? "编辑数据表关联" : "添加数据表关联";
});

// 筛选后的关联表
const filteredRelatedTables = computed(() => {
  if (!searchRelated.value && !reportFrequencyFilter.value)
    return relatedTables.value;

  return relatedTables.value.filter((table) => {
    // 文本搜索筛选
    const textMatch =
      !searchRelated.value ||
      table.subcatalogName.includes(searchRelated.value) ||
      table.catalogName.includes(searchRelated.value) ||
      table.subsetName.includes(searchRelated.value) ||
      table.subcatalogCode.includes(searchRelated.value);

    // 上报频率筛选
    const frequencyMatch =
      !reportFrequencyFilter.value ||
      table.tableReportFrequency === reportFrequencyFilter.value;

    return textMatch && frequencyMatch;
  });
});

// 筛选后的可用表
const filteredAvailableTables = computed(() => {
  if (!searchAvailable.value && !defaultReportFrequencyFilter.value)
    return availableTables.value;

  return availableTables.value.filter((table) => {
    // 文本搜索筛选
    const textMatch =
      !searchAvailable.value ||
      table.subcatalogName.includes(searchAvailable.value) ||
      table.catalogName.includes(searchAvailable.value) ||
      table.subsetName.includes(searchAvailable.value) ||
      table.subcatalogCode.includes(searchAvailable.value);

    // 默认上报频率筛选
    const frequencyMatch =
      !defaultReportFrequencyFilter.value ||
      table.defaultReportFrequency === defaultReportFrequencyFilter.value;

    return textMatch && frequencyMatch;
  });
});

// 方法
const loadRelatedMetaTables = async () => {
  if (!props.deptId) return;

  relatedLoading.value = true;
  try {
    relatedTables.value = await deptApi.getDeptMetaTables(props.deptId);
  } catch (error) {
    ElMessage.error("获取关联数据表失败");
  } finally {
    relatedLoading.value = false;
  }
};

const loadAvailableMetaTables = async () => {
  if (!props.deptId) return;

  availableLoading.value = true;
  try {
    availableTables.value = await deptApi.getAvailableMetaTables(props.deptId);
    console.log("获取到可关联的元数据表:", availableTables.value);
  } catch (error) {
    ElMessage.error("获取可关联数据表失败");
    console.error("获取可关联数据表失败:", error);
  } finally {
    availableLoading.value = false;
  }
};

// 监听部门ID变化
watch(
  () => props.deptId,
  (newVal) => {
    if (newVal) {
      loadRelatedMetaTables();
      loadAvailableMetaTables();
    } else {
      relatedTables.value = [];
      availableTables.value = [];
    }
  },
  { immediate: true },
);

const filterRelatedTables = () => {
  // 计算属性会自动处理
};

const filterAvailableTables = () => {
  // 计算属性会自动处理
};

const handleAddMetaTable = () => {
  activeTab.value = "available";
};

const handleAdd = (row: MetaTableInfo) => {
  isEdit.value = false;
  dialogVisible.value = true;

  console.log("添加按钮点击获取到的原始数据:", row);

  // 直接使用服务端返回的数据，不做额外处理
  formData.value = {
    ...row,
    tableReportFrequency: row.defaultReportFrequency || "",
  };

  console.log("准备添加关联的数据:", formData.value);
};

const handleEdit = (row: MetaTableInfo) => {
  isEdit.value = true;
  dialogVisible.value = true;

  // 使用服务端返回的完整数据
  formData.value = { ...row };
  console.log("准备编辑的数据:", formData.value);
};

const handleDelete = async (row: MetaTableInfo) => {
  if (!row.id) return;

  try {
    await ElMessageBox.confirm(
      `确定要删除关联的数据表"${row.subcatalogName}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const success = await deptApi.deleteDeptMetaTables([row.id]);
    if (success) {
      ElMessage.success("删除成功");
      loadRelatedMetaTables();
      loadAvailableMetaTables();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    submitLoading.value = true;

    // 构造提交参数，使用tableId或id作为metaTableId
    const metaTableId = formData.value.tableId || formData.value.id;

    // 前置检查
    if (!metaTableId) {
      ElMessage.error("元数据表ID不能为空");
      submitLoading.value = false;
      return;
    }

    const params = {
      deptId: props.deptId,
      tableRelations: [
        {
          metaTableId: metaTableId,
          tableReportFrequency: formData.value.tableReportFrequency || "",
        },
      ],
    };

    console.log("提交的关联数据:", params);

    const success = await deptApi.saveDeptMetaTables(params);

    if (success) {
      ElMessage.success(isEdit.value ? "更新成功" : "添加成功");
      dialogVisible.value = false;
      loadRelatedMetaTables();
      loadAvailableMetaTables();
    } else {
      ElMessage.error(isEdit.value ? "更新失败" : "添加失败");
    }
  } catch (error: any) {
    console.error("保存关联数据失败:", error);
    ElMessage.error(error.message || (isEdit.value ? "更新失败" : "添加失败"));
  } finally {
    submitLoading.value = false;
  }
};

// 生命周期
onMounted(() => {
  if (props.deptId) {
    loadRelatedMetaTables();
    loadAvailableMetaTables();
  }
});
</script>

<style scoped lang="scss">
.meta-tables-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .custom-tabs {
    height: 100%;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    background-color: #fff;

    .tabs-header {
      display: flex;
      background-color: #f5f7fa;
      border-bottom: 1px solid #dcdfe6;

      .tab-item {
        padding: 0 20px;
        height: 36px;
        line-height: 36px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        border-right: 1px solid #dcdfe6;

        &.active {
          background-color: #fff;
          color: #409eff;
          border-bottom: 2px solid #409eff;
          margin-bottom: -1px;
          font-weight: 500;
        }

        &:hover {
          color: #409eff;
        }
      }
    }

    .tabs-content {
      flex: 1;
      padding: 12px;
      overflow: hidden;

      .tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;

        .toolbar {
          margin-bottom: 12px;
          padding: 6px 0;
        }

        .el-table {
          flex: 1;
          max-height: calc(100vh - 450px);
          overflow: auto;
          font-size: 14px;

          :deep(th.el-table__cell) {
            background-color: #f5f7fa;
            padding: 8px 0;
            font-size: 14px;
          }

          :deep(td.el-table__cell) {
            padding: 6px 0;
          }
        }
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .left {
      display: flex;
      align-items: center;
    }

    .right {
      display: flex;
      align-items: center;

      .el-input,
      .el-select {
        margin-right: 8px;
      }
    }
  }

  .form-tips {
    margin-top: 4px;
    font-size: 12px;
    color: #909399;
  }

  :deep(.el-dialog__body) {
    padding: 10px 20px;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-dialog__footer) {
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
  }

  :deep(.el-tag) {
    font-size: 12px;
  }
}
</style>
