<template>
  <div class="role-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <div class="search-item">
          <span class="label">角色名称</span>
          <el-input
            v-model="searchForm.roleName"
            placeholder="请输入角色名称"
            clearable
          />
        </div>
        <div class="search-item">
          <span class="label">角色编码</span>
          <el-input
            v-model="searchForm.roleCode"
            placeholder="请输入角色编码"
            clearable
          />
        </div>
        <div class="search-item">
          <span class="label">状态</span>
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </div>
        <div class="search-buttons">
          <el-button type="primary" @click="handleSearch" :icon="Search"
            >搜索</el-button
          >
          <el-button @click="handleReset" :icon="Refresh">重置</el-button>
        </div>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card
      class="table-card"
      style="height: calc(100vh - 230px)"
      shadow="never"
    >
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd" :icon="Plus"
            >新增角色</el-button
          >
          <el-button
            type="danger"
            @click="handleBatchDelete"
            :disabled="selectedIds.length === 0"
            :icon="Delete"
          >
            批量删除
          </el-button>
        </div>
        <div class="header-title">角色列表</div>
        <div class="placeholder"></div>
      </div>

      <div class="table-body">
        <el-table
          :data="tableData"
          :loading="loading"
          @selection-change="handleSelectionChange"
          stripe
          border
          :height="'calc(73vh - 100px)'"
          style="width: 100%"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          />
          <el-table-column
            prop="roleName"
            label="角色名称"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="roleCode"
            label="角色编码"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="description"
            label="描述"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dataScope"
            label="数据权限"
            width="120"
            align="center"
          >
            <template #default="{ row }">
              <el-tag v-if="row.dataScope === 1" type="danger" size="small"
                >全部</el-tag
              >
              <el-tag
                v-else-if="row.dataScope === 2"
                type="warning"
                size="small"
                >本部门及以下</el-tag
              >
              <el-tag
                v-else-if="row.dataScope === 3"
                type="success"
                size="small"
                >本部门</el-tag
              >
              <el-tag v-else-if="row.dataScope === 4" type="info" size="small"
                >仅本人</el-tag
              >
              <el-tag
                v-else-if="row.dataScope === 5"
                type="primary"
                size="small"
                >自定义</el-tag
              >
              <el-tag v-else size="small">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-switch
                v-model="row.status"
                :active-value="1"
                :inactive-value="0"
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            min-width="180"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ formatDate(row.createTime) }}
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            width="170"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="编辑" placement="top">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleEdit(row)"
                    :icon="Edit"
                    circle
                  />
                </el-tooltip>
                <el-tooltip content="分配权限" placement="top">
                  <el-button
                    size="small"
                    type="warning"
                    @click="handleAssignPermissions(row)"
                    :icon="Menu"
                    circle
                  />
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(row)"
                    :icon="Delete"
                    circle
                  />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">共 {{ pagination.total }} 条</div>
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 角色表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="formData.roleCode" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="数据权限" prop="dataScope">
          <el-select
            v-model="formData.dataScope"
            placeholder="请选择数据权限范围"
            style="width: 100%"
          >
            <el-option :value="1" label="全部数据权限" />
            <el-option :value="2" label="本部门及以下数据权限" />
            <el-option :value="3" label="本部门数据权限" />
            <el-option :value="4" label="仅本人数据权限" />
            <el-option :value="5" label="自定义数据权限" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入描述"
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
    <!-- 权限分配弹窗 (占位，后续实现) -->
    <el-dialog
      v-model="permissionDialogVisible"
      title="分配权限"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="permission-dialog-content">
        <div class="role-info">
          <span class="label">当前角色：</span>
          <span class="value">{{ currentRole?.roleName }}</span>
        </div>
        <div class="tree-container">
          <el-input
            v-model="menuFilterText"
            placeholder="输入关键字过滤"
            clearable
            style="margin-bottom: 10px"
          />
          <el-tree
            ref="menuTreeRef"
            :data="menuTreeData"
            :props="{
              label: 'name',
              children: 'children',
            }"
            node-key="id"
            show-checkbox
            default-expand-all
            :filter-node-method="filterMenuNode"
            @check="handleMenuCheck"
          >
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>
                  <el-icon v-if="data.icon" class="menu-icon"
                    ><component :is="data.icon"
                  /></el-icon>
                  {{ node.label }}
                </span>
                <span class="menu-type-tag">
                  <el-tag
                    v-if="data.type === 1 || data.type === 'catalog'"
                    size="small"
                    type="success"
                    >目录</el-tag
                  >
                  <el-tag
                    v-else-if="data.type === 2 || data.type === 'menu'"
                    size="small"
                    type="primary"
                    >菜单</el-tag
                  >
                  <el-tag
                    v-else-if="data.type === 3 || data.type === 'button'"
                    size="small"
                    type="warning"
                    >按钮</el-tag
                  >
                </span>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <template #footer>
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handlePermissionAssignConfirm"
          :loading="permissionAssignLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type ElTree,
} from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Edit,
  Menu,
} from "@element-plus/icons-vue";
import {
  roleApi,
  type RoleQuery,
  type RoleFormData,
  type RoleInfo,
} from "@/api/role";
import { menuApi } from "@/api/menu";
import type { PageResult } from "@/types";
import type { MenuItem } from "@/types/menu";

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const permissionAssignLoading = ref(false);
const dialogVisible = ref(false);
const permissionDialogVisible = ref(false);
const isEdit = ref(false);
const tableData = ref<RoleInfo[]>([]);
const selectedIds = ref<number[]>([]);
const currentRole = ref<RoleInfo>();
const formRef = ref<FormInstance>();
const menuTreeRef = ref<InstanceType<typeof ElTree>>();
const menuTreeData = ref<MenuItem[]>([]); // 菜单树数据
const menuFilterText = ref(""); // 菜单过滤文本
const checkedMenuIds = ref<string[]>([]); // 选中的菜单ID列表

// 搜索表单
const searchForm = reactive<RoleQuery>({
  current: 1,
  size: 10,
  roleName: "",
  roleCode: "",
  status: undefined,
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 表单数据
const formData = reactive<RoleFormData>({
  roleName: "",
  roleCode: "",
  description: "",
  dataScope: 1,
  status: 1,
});

// 表单验证规则
const formRules = reactive({
  roleName: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, max: 50, message: "角色名称长度在2-50个字符", trigger: "blur" },
  ],
  roleCode: [
    { required: true, message: "请输入角色编码", trigger: "blur" },
    { min: 2, max: 50, message: "角色编码长度在2-50个字符", trigger: "blur" },
  ],
  dataScope: [
    { required: true, message: "请选择数据权限范围", trigger: "change" },
  ],
  status: [{ required: true, message: "请选择状态", trigger: "change" }],
});

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? "编辑角色" : "新增角色"));

// API方法
const loadRoleList = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      current: pagination.current,
      size: pagination.size,
    };
    const result: PageResult<RoleInfo> = await roleApi.getRoleList(params);
    tableData.value = result.records;
    pagination.total = result.total;
  } catch (error) {
    ElMessage.error("获取角色列表失败");
  } finally {
    loading.value = false;
  }
};

// 事件处理方法
const handleSearch = () => {
  pagination.current = 1;
  loadRoleList();
};

const handleReset = () => {
  Object.assign(searchForm, {
    current: 1,
    size: 10,
    roleName: "",
    roleCode: "",
    status: undefined,
  });
  pagination.current = 1;
  loadRoleList();
};

const handleAdd = () => {
  isEdit.value = false;
  dialogVisible.value = true;
  resetForm();
};

const handleEdit = (row: RoleInfo) => {
  isEdit.value = true;
  dialogVisible.value = true;
  Object.assign(formData, {
    id: row.id,
    roleName: row.roleName,
    roleCode: row.roleCode,
    description: row.description,
    dataScope: row.dataScope,
    status: row.status,
  });
};

const handleDelete = async (row: RoleInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.roleName}" 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    try {
      await roleApi.deleteRole(row.id);
      ElMessage.success("删除成功");
      loadRoleList();
    } catch (error: any) {
      // 处理后端返回的具体错误信息
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error("删除失败");
      }
    }
  } catch (error) {
    // 用户取消操作，不需要提示
    if (error !== "cancel") {
      console.error("删除角色出错:", error);
    }
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个角色吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    try {
      await roleApi.batchDeleteRoles(selectedIds.value);
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      loadRoleList();
    } catch (error: any) {
      // 处理后端返回的具体错误信息
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        ElMessage.error(error.response.data.message);
      } else {
        ElMessage.error("批量删除失败");
      }
    }
  } catch (error) {
    // 用户取消操作，不需要提示
    if (error !== "cancel") {
      console.error("批量删除角色出错:", error);
    }
  }
};

const handleStatusChange = async (row: RoleInfo) => {
  try {
    await roleApi.changeRoleStatus(row.id, row.status);
    ElMessage.success(`${row.status === 1 ? "启用" : "禁用"}成功`);
  } catch (error) {
    // 回滚状态
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error("状态修改失败");
  }
};

const handleAssignPermissions = async (row: RoleInfo) => {
  currentRole.value = row;
  permissionDialogVisible.value = true;

  // 先加载菜单树数据（如果还没加载）
  if (menuTreeData.value.length === 0) {
    await loadMenuTree();
  }

  // 获取角色已分配的菜单ID
  try {
    checkedMenuIds.value = await roleApi.getRoleMenuIds(row.id);
    // 设置选中状态
    menuTreeRef.value?.setCheckedKeys(checkedMenuIds.value);
  } catch (error) {
    ElMessage.error("获取角色菜单权限失败");
  }
};

const handlePermissionAssignConfirm = async () => {
  if (!currentRole.value) return;

  permissionAssignLoading.value = true;
  try {
    const success = await roleApi.assignRoleMenus(
      currentRole.value.id,
      checkedMenuIds.value,
    );
    if (success) {
      ElMessage.success("权限分配成功");
      permissionDialogVisible.value = false;
    } else {
      ElMessage.error("权限分配失败");
    }
  } catch (error) {
    ElMessage.error("权限分配失败");
  } finally {
    permissionAssignLoading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (isEdit.value) {
      if (!formData.id) {
        throw new Error("角色ID不能为空");
      }
      await roleApi.updateRole(formData.id, formData);
      ElMessage.success("更新成功");
    } else {
      await roleApi.createRole(formData);
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadRoleList();
  } catch (error) {
    ElMessage.error(isEdit.value ? "更新失败" : "创建失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleSelectionChange = (selection: RoleInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  loadRoleList();
};

const handleCurrentChange = (current: number) => {
  pagination.current = current;
  loadRoleList();
};

const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    roleName: "",
    roleCode: "",
    description: "",
    dataScope: 1,
    status: 1,
  });
  formRef.value?.clearValidate();
};

// 加载菜单树数据
const loadMenuTree = async () => {
  try {
    menuTreeData.value = await menuApi.getMenuList();
  } catch (error) {
    ElMessage.error("获取菜单列表失败");
  }
};

// 过滤菜单节点
const filterMenuNode = (value: string, data: any) => {
  if (!value) return true;
  return data.name.includes(value);
};

// 处理菜单节点选中
const handleMenuCheck = (
  _: any,
  checked: {
    checkedKeys: string[];
    checkedNodes: any[];
    halfCheckedKeys: string[];
    halfCheckedNodes: any[];
  },
) => {
  checkedMenuIds.value = [...checked.checkedKeys];
  console.log("当前选中的菜单ID:", checkedMenuIds.value);
};

// 监听菜单过滤文本变化
watch(menuFilterText, (val) => {
  menuTreeRef.value?.filter(val);
});

// 格式化日期
const formatDate = (dateString: any) => {
  if (!dateString) return "";
  return dateString.replace("T", " "); // 替换T为空格
};

// 生命周期
onMounted(() => {
  loadRoleList();
  loadMenuTree(); // 预加载菜单数据
});
</script>

<style scoped lang="scss">
.role-management {
  padding: 0px;
  color: var(--el-text-color-primary);

  .search-card,
  .table-card {
    margin-top: -12px;
    display: flex;
    flex-direction: column;
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color-light);
  }

  .table-card {
    :deep(.el-card__body) {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 15px;
      background-color: var(--el-bg-color);
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 8px 0;
    border-bottom: 1px solid var(--el-border-color-light);
    margin-bottom: 8px;
  }

  .table-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: auto;
    min-height: 0;

    :deep(.el-table) {
      height: 100%;
      background-color: var(--el-table-bg-color);

      // 表格通用样式
      .el-table__header-wrapper {
        th.el-table__cell {
          background-color: var(--el-table-header-bg-color) !important;
          color: var(--el-table-header-text-color) !important;
          .cell {
            text-align: center !important;
            font-weight: 400;
          }
        }
      }
      // 固定左侧的选择列样式
      .el-table__fixed-left {
        th.el-table__cell.is-leaf {
          .cell {
            display: flex;
            justify-content: center;
          }
        }
      }

      // 表格行高度统一
      .el-table__row {
        height: 40px;
      }
    }
  }

  .operation-buttons {
    display: flex;
    gap: 10px;
    flex: 1;
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .placeholder {
    flex: 1;
  }

  .search-bar {
    margin-top: -6px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .search-item {
    display: flex;
    align-items: center;

    .label {
      margin-right: 8px;
      white-space: nowrap;
      font-size: 14px;
      color: var(--el-text-color-regular);
    }

    .el-input,
    .el-select {
      width: 180px;

      :deep(.el-input__wrapper) {
        background-color: var(--el-input-bg-color);
        border-color: var(--el-input-border-color);

        &:hover {
          border-color: var(--el-input-hover-border-color);
        }
      }

      :deep(.el-input__inner) {
        color: var(--el-text-color-primary);

        &::placeholder {
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }

  .search-buttons {
    display: flex;
    gap: 10px;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
    background-color: var(--el-bg-color);

    .pagination-info {
      font-size: 14px;
      color: var(--el-text-color-regular);
      font-weight: 500;
    }

    :deep(.el-pagination) {
      .el-pager li,
      .btn-prev,
      .btn-next {
        background-color: var(--el-pagination-button-bg-color);
        color: var(--el-pagination-button-color);
        border-color: var(--el-border-color-light);

        &:hover:not(.disabled) {
          color: var(--el-pagination-hover-color);
          background-color: var(--el-fill-color-light);
        }

        &.is-active {
          background-color: var(--el-color-primary);
          color: #ffffff;
          border-color: var(--el-color-primary);
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  .action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;

    .el-button {
      &--primary {
        background-color: var(--el-color-primary);
        border-color: var(--el-color-primary);

        &:hover {
          background-color: var(--el-color-primary-light-3);
          border-color: var(--el-color-primary-light-3);
        }
      }

      &--warning {
        background-color: var(--el-color-warning);
        border-color: var(--el-color-warning);

        &:hover {
          background-color: var(--el-color-warning-light-3);
          border-color: var(--el-color-warning-light-3);
        }
      }

      &--danger {
        background-color: var(--el-color-danger);
        border-color: var(--el-color-danger);

        &:hover {
          background-color: var(--el-color-danger-light-3);
          border-color: var(--el-color-danger-light-3);
        }
      }
    }
  }

  // 权限分配弹窗样式
  .permission-dialog-content {
    .role-info {
      margin-bottom: 16px;

      .label {
        font-weight: 600;
        margin-right: 8px;
      }

      .value {
        color: var(--el-color-primary);
      }
    }

    .tree-container {
      height: 400px;
      overflow-y: auto;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      padding: 10px;

      .custom-tree-node {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .menu-icon {
          margin-right: 4px;
        }

        .menu-type-tag {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
