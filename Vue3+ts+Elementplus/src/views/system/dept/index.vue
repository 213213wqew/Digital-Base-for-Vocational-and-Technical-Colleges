<template>
  <div class="dept-management">
    <!-- 工具栏和操作区域 -->
    <div class="toolbar">
      <div class="left">
        <el-button type="primary" @click="handleAddRoot" :icon="Plus">
          新增部门
        </el-button>
      </div>
      <div class="right">
        <el-input
          v-model="searchForm.deptName"
          placeholder="部门名称"
          clearable
          style="width: 180px; margin-right: 8px"
        />
        <el-input
          v-model="searchForm.deptCode"
          placeholder="部门编码"
          clearable
          style="width: 180px; margin-right: 8px"
        />
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          clearable
          style="width: 120px; margin-right: 8px"
        >
          <el-option label="正常" :value="1" />
          <el-option label="停用" :value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch" :icon="Search"
          >搜索</el-button
        >
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
      </div>
    </div>

    <!-- 部门管理主区域 -->
    <el-container class="main-container">
      <!-- 左侧部门树 -->
      <el-aside width="280px" class="dept-tree-container">
        <el-card class="tree-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>部门树</span>
            </div>
          </template>
          <el-tree
            ref="deptTreeRef"
            :data="deptTree"
            node-key="id"
            :props="{ label: 'deptName' }"
            :default-expand-all="true"
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
                &nbsp;
                <el-tag
                  size="small"
                  :type="data.status === 1 ? 'success' : 'danger'"
                >
                  {{ data.status === 1 ? "正常" : "停用" }}
                </el-tag>
                <span class="tree-node-actions">
                  <el-dropdown
                    trigger="click"
                    @command="(command) => handleTreeCommand(command, data)"
                  >
                    <el-button
                      type="primary"
                      size="small"
                      :icon="More"
                      circle
                    />
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item :icon="Plus" command="add"
                          >新增子部门</el-dropdown-item
                        >
                        <el-dropdown-item :icon="Edit" command="edit"
                          >编辑部门</el-dropdown-item
                        >
                        <el-dropdown-item :icon="Delete" command="delete"
                          >删除部门</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-aside>

      <!-- 右侧部门详情 -->
      <el-main class="dept-detail-container">
        <el-card class="details-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>部门详情</span>
              <div v-if="currentDept.id">
                <el-button
                  type="primary"
                  size="small"
                  @click="handleEdit(currentDept)"
                  :icon="Edit"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="handleDelete(currentDept)"
                  :icon="Delete"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>

          <div v-if="currentDept.id" class="dept-detail-content">
            <div class="tabs-header">
              <div
                :class="['tab-item', activeTab === 'basic' ? 'active' : '']"
                @click="activeTab = 'basic'"
              >
                基本信息
              </div>
              <div
                :class="[
                  'tab-item',
                  activeTab === 'metaTables' ? 'active' : '',
                ]"
                @click="activeTab = 'metaTables'"
              >
                关联数据表
              </div>
            </div>

            <div class="tabs-content">
              <div v-if="activeTab === 'basic'" class="tab-pane">
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="部门名称" :span="2">{{
                    currentDept.deptName
                  }}</el-descriptions-item>
                  <el-descriptions-item label="部门编码" :span="2">{{
                    currentDept.deptCode
                  }}</el-descriptions-item>
                  <el-descriptions-item label="上级部门">{{
                    currentDept.parentName || "无"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="排序">{{
                    currentDept.orderNum || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="负责人">{{
                    currentDept.leaderName || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="联系电话">{{
                    currentDept.phone || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="邮箱">{{
                    currentDept.email || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="状态">
                    <el-tag
                      :type="currentDept.status === 1 ? 'success' : 'danger'"
                    >
                      {{ currentDept.status === 1 ? "正常" : "停用" }}
                    </el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="创建时间" :span="2">{{
                    currentDept.createTime || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="更新时间" :span="2">{{
                    currentDept.updateTime || "-"
                  }}</el-descriptions-item>
                  <el-descriptions-item label="备注" :span="2">{{
                    currentDept.remark || "-"
                  }}</el-descriptions-item>
                </el-descriptions>
              </div>
              <div v-else-if="activeTab === 'metaTables'" class="tab-pane">
                <meta-tables :dept-id="currentDept.id" />
              </div>
            </div>
          </div>

          <el-empty v-else description="请选择部门查看详情" />
        </el-card>
      </el-main>
    </el-container>

    <!-- 部门表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="550px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="上级部门">
          <el-tree-select
            v-model="formData.parentId"
            :data="deptTree"
            node-key="id"
            :props="{ label: 'deptName', value: 'id' }"
            check-strictly
            default-expand-all
            placeholder="请选择上级部门"
            style="width: 100%"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input v-model="formData.deptName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门编码" prop="deptCode">
          <el-input v-model="formData.deptCode" placeholder="请输入部门编码" />
        </el-form-item>
        <el-form-item label="显示排序" prop="orderNum">
          <el-input-number
            v-model="formData.orderNum"
            :min="0"
            :max="999"
            controls-position="right"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select
            v-model="formData.leaderId"
            placeholder="请选择负责人"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="user in userOptions"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="formData.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
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
import { ref, reactive, computed, onMounted } from "vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  More,
} from "@element-plus/icons-vue";
import {
  deptApi,
  type DeptQuery,
  type DeptFormData,
  type DeptInfo,
  type UserOption,
} from "@/api/dept";
import MetaTables from "./metaTables.vue";

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const currentDept = ref<DeptInfo>({} as DeptInfo);
const deptTree = ref<DeptInfo[]>([]);
const deptTreeRef = ref();
const formRef = ref<FormInstance>();
const userOptions = ref<UserOption[]>([]);
const activeTab = ref("basic");

// 搜索表单
const searchForm = reactive<DeptQuery>({
  deptName: "",
  deptCode: "",
  status: undefined,
});

// 部门表单数据
const formData = reactive<DeptFormData>({
  deptName: "",
  deptCode: "",
  parentId: undefined,
  orderNum: 0,
  leaderId: "",
  phone: "",
  email: "",
  status: 1,
  remark: "",
});

// 表单验证规则
const formRules = reactive({
  deptName: [
    { required: true, message: "请输入部门名称", trigger: "blur" },
    { min: 2, max: 50, message: "部门名称长度在2-50个字符", trigger: "blur" },
  ],
  deptCode: [
    { required: true, message: "请输入部门编码", trigger: "blur" },
    { min: 2, max: 50, message: "部门编码长度在2-50个字符", trigger: "blur" },
  ],
  orderNum: [{ required: true, message: "请输入显示排序", trigger: "blur" }],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

// 计算属性
const dialogTitle = computed(() => {
  if (isEdit.value) {
    return "编辑部门";
  }
  if (formData.parentId) {
    return "新增子部门";
  }
  return "新增部门";
});

// API方法
const loadDeptTree = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
    };
    deptTree.value = await deptApi.getDeptTree(params);
  } catch (error) {
    ElMessage.error("获取部门树失败");
  } finally {
    loading.value = false;
  }
};

const loadUserOptions = async () => {
  try {
    userOptions.value = await deptApi.getUserList();
  } catch (error) {
    ElMessage.error("获取用户列表失败");
  }
};

// 事件处理方法
const handleSearch = () => {
  loadDeptTree();
};

const handleReset = () => {
  Object.assign(searchForm, {
    deptName: "",
    deptCode: "",
    status: undefined,
  });
  loadDeptTree();
};

const handleNodeClick = (data: DeptInfo) => {
  currentDept.value = data;
};

const handleTreeCommand = (command: string, data: DeptInfo) => {
  switch (command) {
    case "add":
      handleAddChild(data);
      break;
    case "edit":
      handleEdit(data);
      break;
    case "delete":
      handleDelete(data);
      break;
  }
};

const handleAddRoot = () => {
  isEdit.value = false;
  dialogVisible.value = true;
  resetForm();
  formData.parentId = undefined;
};

const handleAddChild = (parentDept: DeptInfo) => {
  isEdit.value = false;
  dialogVisible.value = true;
  resetForm();
  formData.parentId = parentDept.id;
};

const handleEdit = (dept: DeptInfo) => {
  isEdit.value = true;
  dialogVisible.value = true;

  resetForm();
  Object.assign(formData, {
    id: dept.id,
    deptName: dept.deptName,
    deptCode: dept.deptCode,
    parentId: dept.parentId,
    orderNum: dept.orderNum,
    leaderId: dept.leaderId,
    phone: dept.phone,
    email: dept.email,
    status: dept.status,
    remark: dept.remark,
  });
};

const handleDelete = async (dept: DeptInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除部门 "${dept.deptName}" 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await deptApi.deleteDept(dept.id);
    ElMessage.success("删除成功");

    // 刷新数据
    loadDeptTree();
    if (currentDept.value.id === dept.id) {
      currentDept.value = {} as DeptInfo;
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

    if (isEdit.value) {
      if (!formData.id) {
        throw new Error("部门ID不能为空");
      }
      await deptApi.updateDept(formData.id, formData);
      ElMessage.success("更新成功");
    } else {
      await deptApi.createDept(formData);
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadDeptTree();
  } catch (error: any) {
    ElMessage.error(error.message || (isEdit.value ? "更新失败" : "创建失败"));
  } finally {
    submitLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    deptName: "",
    deptCode: "",
    parentId: undefined,
    orderNum: 0,
    leaderId: "",
    phone: "",
    email: "",
    status: 1,
    remark: "",
  });
  formRef.value?.clearValidate();
};

// 生命周期
onMounted(() => {
  loadDeptTree();
  loadUserOptions();
});
</script>

<style scoped lang="scss">
.dept-management {
  height: calc(100vh - 185px);
  padding: 8px;
  display: flex;
  flex-direction: column;

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    background-color: #fff;
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

    .left {
      display: flex;
      align-items: center;
    }

    .right {
      display: flex;
      align-items: center;

      .el-input {
        margin-right: 8px;
      }

      .el-button {
        margin-left: 5px;
      }
    }
  }

  .main-container {
    flex: 1;
    overflow: hidden;
    border-radius: 4px;

    .dept-tree-container {
      height: calc(100vh - 200px);
      overflow: auto;

      .tree-card {
        height: 100%;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

        :deep(.el-card__header) {
          padding: 10px 15px;
          font-weight: 600;
          font-size: 16px;
          border-bottom: 1px solid #ebeef5;
        }

        :deep(.el-card__body) {
          height: calc(100% - 50px);
          overflow: auto;
          padding: 8px;
        }
      }
    }

    .dept-detail-container {
      height: calc(100vh - 150px);
      padding: 0 0 0 12px;
      overflow: auto;

      .details-card {
        height: 100%;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);

        :deep(.el-card__header) {
          padding: 10px 15px;
          font-weight: 600;
          font-size: 16px;
          border-bottom: 1px solid #ebeef5;
        }

        :deep(.el-card__body) {
          height: calc(100% - 50px);
          overflow: auto;
          padding: 8px 12px;
        }

        .dept-detail-content {
          padding: 0;
          height: 100%;

          .tabs-header {
            display: flex;
            border-bottom: 2px solid #ebeef5;
            margin-bottom: 12px;

            .tab-item {
              padding: 0 20px;
              height: 36px;
              line-height: 36px;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s;
              border-bottom: 2px solid transparent;
              margin-bottom: -2px;

              &.active {
                color: #409eff;
                border-bottom-color: #409eff;
                font-weight: 500;
              }

              &:hover {
                color: #409eff;
              }
            }
          }

          .tabs-content {
            height: calc(100% - 50px);
            overflow: auto;

            .tab-pane {
              height: 100%;

              :deep(.el-descriptions) {
                margin-bottom: 0;
              }

              :deep(.el-descriptions__cell) {
                padding: 8px 12px;
              }

              :deep(.el-descriptions__label) {
                width: 100px;
                font-weight: bold;
                color: #606266;
              }
            }
          }
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
    font-size: 14px;

    .tree-node-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      visibility: hidden;
    }

    &:hover .tree-node-actions {
      visibility: visible;
    }
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
}
</style>
