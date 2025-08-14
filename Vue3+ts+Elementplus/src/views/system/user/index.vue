<template>
  <div class="user-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <div class="search-item">
          <span class="label">用户名</span>
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 180px"
          />
        </div>
        <div class="search-item">
          <span class="label">昵称</span>
          <el-input
            v-model="searchForm.nickname"
            placeholder="请输入昵称"
            clearable
            style="width: 180px"
          />
        </div>
        <div class="search-item">
          <span class="label">状态</span>
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="启用" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </div>
        <div class="search-item">
          <span class="label">部门</span>
          <el-select
            v-model="searchForm.deptId"
            placeholder="请选择部门"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="dept in deptOptions"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
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
            >新增用户</el-button
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
        <div class="header-title">用户列表</div>
        <div class="placeholder"></div>
      </div>

      <div class="table-body">
        <el-table
          :data="tableData"
          :loading="loading"
          @selection-change="handleSelectionChange"
          :height="'calc(73vh - 100px)'"
          stripe
          border
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
            prop="username"
            label="用户名"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="nickname"
            label="昵称"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="email"
            label="邮箱"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="phone"
            label="手机号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column label="头像" width="90" align="center">
            <template #default="{ row }">
              <el-image
                v-if="row.avatar"
                :src="row.avatar"
                fit="cover"
                style="width: 40px; height: 40px"
              />
            </template>
          </el-table-column>
          <el-table-column label="性别" width="70" align="center">
            <template #default="{ row }">
              <el-tag :type="getSexTagType(row.sex)" size="small">
                {{ getSexText(row.sex) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="部门" min-width="120" show-overflow-tooltip>
            <template #default="{ row }">
              <template v-if="row.depts && row.depts.length > 0">
                <el-tag
                  v-for="dept in row.depts"
                  :key="dept.id"
                  size="small"
                  style="margin-right: 4px; margin-bottom: 2px"
                >
                  {{ dept.name || dept.deptName }}
                </el-tag>
              </template>
              <span v-else>{{ row.deptName || "未分配" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色" min-width="150" show-overflow-tooltip>
            <template #default="{ row }">
              <el-tag
                v-for="role in row.roles"
                :key="role.id"
                size="small"
                style="margin-right: 4px"
              >
                {{ role.roleName }}
              </el-tag>
              <span
                v-if="!row.roles || row.roles.length === 0"
                class="text-gray-400"
                >未分配</span
              >
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
                <el-tooltip content="分配角色" placement="top">
                  <el-button
                    size="small"
                    type="info"
                    @click="handleAssignRoles(row)"
                    :icon="UserFilled"
                    circle
                  />
                </el-tooltip>
                <el-tooltip content="重置密码" placement="top">
                  <el-button
                    size="small"
                    type="warning"
                    @click="handleResetPassword(row)"
                    :icon="Key"
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

    <!-- 用户表单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="650px"
      :close-on-click-modal="false"
      class="user-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="user-form"
      >
        <el-row :gutter="20">
          <!-- 左侧主要信息 -->
          <el-col :span="16">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
              />
            </el-form-item>

            <el-form-item label="昵称" prop="nickname">
              <el-input v-model="formData.nickname" placeholder="请输入昵称" />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input v-model="formData.phone" placeholder="请输入手机号" />
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>

            <el-form-item label="密码" prop="password" v-if="!isEdit">
              <el-input
                v-model="formData.password"
                type="password"
                placeholder="请输入密码"
                show-password
              />
            </el-form-item>

            <el-form-item label="部门" prop="deptIds">
              <el-select
                v-model="formData.deptIds"
                multiple
                placeholder="请选择部门"
                style="width: 100%"
              >
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="formData.roleIds"
                multiple
                placeholder="请选择角色"
                style="width: 100%"
              >
                <el-option
                  v-for="role in roleOptions"
                  :key="role.id"
                  :label="role.roleName"
                  :value="role.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 右侧辅助信息 -->
          <el-col :span="8" class="right-column">
            <div class="avatar-box">
              <p class="title">头像</p>
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="handleAvatarUpload"
              >
                <img
                  v-if="formData.avatar"
                  :src="formData.avatar"
                  class="avatar"
                />
                <div v-else class="avatar-placeholder">
                  <el-icon><Plus /></el-icon>
                </div>
              </el-upload>
              <p class="tip">支持JPG、PNG格式，小于2MB</p>
            </div>
            <div class="status-box">
              <el-form-item label="性别">
                <el-radio-group v-model="formData.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="0">未知</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="状态">
                <el-radio-group v-model="formData.status">
                  <el-radio :label="1">启用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（选填）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>
    <!-- 角色分配弹窗 -->
    <el-dialog
      v-model="roleDialogVisible"
      title="分配角色"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form label-width="80px">
        <el-form-item label="用户">
          <el-input :value="currentUser?.nickname" disabled />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="selectedRoleIds"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.id"
              :label="role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleRoleAssignConfirm"
          :loading="roleAssignLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog v-model="importVisible" title="导入用户" width="500px">
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :limit="1"
        accept=".xlsx,.xls"
        :on-change="handleFileChange"
        drag
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">将文件拖拽到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 xlsx/xls 文件，且不超过 10MB
          </div>
        </template>
      </el-upload>

      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleImportConfirm"
          :loading="importLoading"
        >
          确定导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import {
  ElMessage,
  ElMessageBox,
  type FormInstance,
  type UploadFile,
  type UploadRequestOptions,
} from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Edit,
  Key,
  UploadFilled,
  UserFilled,
} from "@element-plus/icons-vue";
import { userApi, type UserQueryParams, type UserFormData } from "@/api/user";
import type { UserInfo, PageResult, DeptInfo } from "@/types";
import { roleApi } from "@/api/role";
import { deptApi } from "@/api/dept";

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const importLoading = ref(false);
const roleAssignLoading = ref(false);
const dialogVisible = ref(false);
const importVisible = ref(false);
const roleDialogVisible = ref(false);
const isEdit = ref(false);
const tableData = ref<UserInfo[]>([]);
const selectedIds = ref<string[]>([]);
const selectedRoleIds = ref<string[]>([]);
const currentUser = ref<UserInfo>();
const formRef = ref<FormInstance>();
const uploadRef = ref();
const importFile = ref<File>();
const dateRange = ref<[string, string] | undefined>(undefined);

// 选项数据
const roleOptions = ref<Array<{ id: string; roleName: string }>>([]);
const deptOptions = ref<DeptInfo[]>([]);

// 搜索表单
const searchForm = reactive<UserQueryParams>({
  current: 1,
  size: 10,
  username: "",
  nickname: "",
  email: "",
  phone: "",
  status: undefined,
  roleId: "",
  deptId: "",
  startTime: "",
  endTime: "",
});

// 分页信息
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
});

// 表单数据
const formData = reactive<UserFormData & { sex?: number }>({
  username: "",
  nickname: "",
  email: "",
  phone: "",
  avatar: "",
  sex: 0,
  password: "",
  status: 1,
  roleIds: [],
  deptId: "",
  deptIds: [] as number[],
  remark: "",
});

// 表单验证规则
const formRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, max: 20, message: "用户名长度在3-20个字符", trigger: "blur" },
  ],
  nickname: [
    { required: true, message: "请输入昵称", trigger: "blur" },
    { min: 2, max: 20, message: "昵称长度在2-20个字符", trigger: "blur" },
  ],
  email: [
    {
      type: "email" as const,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  phone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  password: [
    { required: !isEdit.value, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在6-20个字符", trigger: "blur" },
  ],
  roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
  deptIds: [
    { required: true, message: "请选择部门", trigger: "change" },
    {
      type: "array" as const,
      min: 1,
      message: "请至少选择一个部门",
      trigger: "change",
    },
  ],
});

// 计算属性
const dialogTitle = computed(() => (isEdit.value ? "编辑用户" : "新增用户"));

// 工具方法
const getSexText = (sex: number) => {
  const sexMap = { 0: "未知", 1: "男", 2: "女" };
  return sexMap[sex as keyof typeof sexMap] || "未知";
};

const getSexTagType = (sex: number) => {
  if (sex === 1) return "success";
  if (sex === 2) return "warning";
  return undefined;
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  return dateString.replace("T", " "); // 替换T为空格
};

// API方法
const loadUserList = async () => {
  loading.value = true;
  try {
    const params = {
      ...searchForm,
      current: pagination.current,
      size: pagination.size,
    };
    console.log("加载用户列表，参数:", params);

    const result: PageResult<UserInfo> = await userApi.getUserList(params);

    // 确保返回数据有效
    if (result && Array.isArray(result.records)) {
      tableData.value = result.records;
      pagination.total = result.total || 0;

      // 如果部门数据为空但返回了deptName，构造一个模拟的depts数组
      tableData.value.forEach((user) => {
        if (!user.depts && user.deptName && user.mainDeptId) {
          user.depts = [
            {
              id: user.mainDeptId,
              name: user.deptName,
            },
          ];
        }
      });

      console.log("用户列表加载成功:", tableData.value);
    } else {
      console.error("用户列表数据格式异常:", result);
      tableData.value = [];
      pagination.total = 0;
    }
  } catch (error) {
    console.error("获取用户列表失败:", error);
    ElMessage.error(
      "获取用户列表失败：" +
        (error instanceof Error ? error.message : String(error)),
    );
    tableData.value = [];
    pagination.total = 0;
  } finally {
    loading.value = false;
  }
};

const loadRoleOptions = async () => {
  try {
    // 从后端API获取角色列表，而不是使用静态数据
    const roles = await roleApi.getAllActiveRoles();
    roleOptions.value = roles.map((role) => ({
      id: String(role.id), // 确保ID是字符串类型
      roleName: role.roleName,
    }));
    console.log("加载角色列表成功:", roleOptions.value);
  } catch (error) {
    console.error("获取角色列表失败:", error);
    ElMessage.error("获取角色列表失败");
  }
};

const loadDeptOptions = async () => {
  try {
    // 使用部门API获取部门列表
    const depts = await deptApi.getDeptList({});
    deptOptions.value = depts.map((dept) => ({
      id: dept.id, // 保持数字类型
      name: dept.deptName,
    }));
    console.log("加载部门列表成功:", deptOptions.value);
  } catch (error) {
    console.error("获取部门列表失败:", error);
    ElMessage.error("获取部门列表失败");
  }
};

// 事件处理方法
const handleSearch = () => {
  pagination.current = 1;
  loadUserList();
};

const handleReset = () => {
  Object.assign(searchForm, {
    current: 1,
    size: 10,
    username: "",
    nickname: "",
    email: "",
    phone: "",
    status: undefined,
    roleId: "",
    deptId: "",
    startTime: "",
    endTime: "",
  });
  dateRange.value = undefined;
  pagination.current = 1;
  loadUserList();
};

const handleAdd = () => {
  isEdit.value = false;
  dialogVisible.value = true;
  resetForm();
};

const handleEdit = (row: UserInfo) => {
  isEdit.value = true;
  dialogVisible.value = true;

  // 添加调试日志
  console.log("编辑用户数据:", row);
  console.log("用户部门数据:", row.depts);

  // 处理部门数据，确保兼容性
  let userDepts = row.depts || [];
  if (userDepts.length === 0 && row.deptName && row.mainDeptId) {
    // 如果没有depts数据但有主部门信息，构造一个部门对象
    userDepts = [
      {
        id: Number(row.mainDeptId),
        name: row.deptName,
        deptName: row.deptName,
        isMain: 1,
      },
    ];
  }

  // 确保每个部门都有name字段
  userDepts.forEach((dept) => {
    if (!dept.name && dept.deptName) {
      dept.name = dept.deptName;
    }
  });

  const deptIds = userDepts.map((dept) => Number(dept.id));
  console.log("转换后的部门ID数组:", deptIds);

  Object.assign(formData, {
    id: row.id,
    username: row.username,
    nickname: row.nickname,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar,
    sex: row.sex || 0,
    status: row.status,
    roleIds: row.roles?.map((role) => role.id) || [],
    deptId: row.mainDeptId || "",
    deptIds: deptIds,
    remark: "",
  });

  console.log("最终表单数据:", formData);
};

const handleDelete = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 "${row.nickname}" 吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await userApi.deleteUser(row.id);
    ElMessage.success("删除成功");
    loadUserList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 个用户吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await userApi.batchDeleteUser(selectedIds.value);
    ElMessage.success("批量删除成功");
    selectedIds.value = [];
    loadUserList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

const handleStatusChange = async (row: UserInfo) => {
  try {
    await userApi.changeUserStatus(row.id, row.status);
    ElMessage.success(`${row.status === 1 ? "启用" : "禁用"}成功`);
  } catch (error) {
    // 回滚状态
    row.status = row.status === 1 ? 0 : 1;
    ElMessage.error("状态修改失败");
  }
};

const handleResetPassword = async (row: UserInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要重置用户 "${row.nickname}" 的密码吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await userApi.resetUserPassword(row.id);
    ElMessage.success("密码重置成功");
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("密码重置失败");
    }
  }
};

const handleAssignRoles = async (row: UserInfo) => {
  currentUser.value = row;
  roleAssignLoading.value = true;

  try {
    // 先获取该用户已分配的角色ID列表
    selectedRoleIds.value = await userApi.getUserRoles(row.id);
    console.log("当前用户已分配角色ID:", selectedRoleIds.value);

    // 确保角色选项已加载
    if (roleOptions.value.length === 0) {
      await loadRoleOptions();
    }

    // 打开角色分配对话框
    roleDialogVisible.value = true;
  } catch (error) {
    console.error("获取用户角色失败:", error);
    ElMessage.error("获取用户角色失败");
  } finally {
    roleAssignLoading.value = false;
  }
};

const handleRoleAssignConfirm = async () => {
  if (!currentUser.value) return;

  roleAssignLoading.value = true;
  try {
    // 记录选中的角色 ID
    console.log("分配角色：", selectedRoleIds.value);

    // 调用 API 分配角色
    await userApi.assignUserRoles(currentUser.value.id, selectedRoleIds.value);
    ElMessage.success("角色分配成功");
    roleDialogVisible.value = false;

    // 直接重新加载用户列表，获取最新的用户角色数据
    await loadUserList();
  } catch (error) {
    console.error("角色分配失败：", error);
    ElMessage.error("角色分配失败");
  } finally {
    roleAssignLoading.value = false;
  }
};

const handleFileChange = (file: UploadFile) => {
  importFile.value = file.raw;
};

const handleImportConfirm = async () => {
  if (!importFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  importLoading.value = true;
  try {
    const result = await userApi.importUserData(importFile.value);
    ElMessage.success(
      `导入完成：成功 ${result.successCount} 条，失败 ${result.failCount} 条`,
    );
    importVisible.value = false;
    loadUserList();
  } catch (error) {
    ElMessage.error("导入失败");
  } finally {
    importLoading.value = false;
  }
};

const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === "image/jpeg" || file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("头像只能是 JPG/PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("头像大小不能超过 2MB!");
    return false;
  }
  return true;
};

const handleAvatarUpload = async (options: UploadRequestOptions) => {
  try {
    // 直接将文件转换为Base64格式
    const file = options.file as File;
    const reader = new FileReader();

    reader.onload = (e) => {
      // 设置表单中的头像为Base64数据
      formData.avatar = e.target?.result as string;
      ElMessage.success("头像上传成功");
    };

    // 读取文件为DataURL (Base64格式)
    reader.readAsDataURL(file);
  } catch (error) {
    ElMessage.error("头像上传失败");
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 准备表单数据
    const submitData = { ...formData };

    // 如果选择了多个部门，确保第一个部门为主部门
    if (submitData.deptIds && submitData.deptIds.length > 0) {
      submitData.mainDeptId = submitData.deptIds[0];
      // 保持deptId用于兼容
      submitData.deptId = String(submitData.deptIds[0]);
    }

    if (isEdit.value) {
      // 编辑模式下移除password字段，避免后端验证
      delete submitData.password;
      await userApi.updateUser(formData.id!, submitData);
      ElMessage.success("更新成功");
    } else {
      await userApi.createUser(submitData);
      ElMessage.success("创建成功");
    }

    dialogVisible.value = false;
    loadUserList();
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error(isEdit.value ? "更新失败" : "创建失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleSelectionChange = (selection: UserInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleSizeChange = (size: number) => {
  pagination.size = size;
  loadUserList();
};

const handleCurrentChange = (current: number) => {
  pagination.current = current;
  loadUserList();
};

const resetForm = () => {
  Object.assign(formData, {
    id: "",
    username: "",
    nickname: "",
    email: "",
    phone: "",
    avatar: "",
    sex: 0,
    password: "",
    status: 1,
    roleIds: [],
    deptId: "",
    deptIds: [],
    remark: "",
  });
  formRef.value?.clearValidate();
};

// 生命周期
onMounted(() => {
  loadUserList();
  loadRoleOptions();
  loadDeptOptions();
});
</script>

<style scoped lang="scss">
.user-management {
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
            font-weight: 600;
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
        height: 54px;
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

  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color-base);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      background-color: var(--el-fill-color-light);

      &:hover {
        border-color: var(--el-color-primary);
        background-color: var(--el-fill-color);
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: var(--el-text-color-placeholder);
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    height: 180px;
    background-color: var(--el-fill-color-light);
    border: 1px dashed var(--el-border-color-base);

    .el-icon--upload {
      color: var(--el-text-color-placeholder);
    }

    .el-upload__text {
      color: var(--el-text-color-regular);

      em {
        color: var(--el-color-primary);
      }
    }
  }

  :deep(.el-upload-dragger:hover) {
    border-color: var(--el-color-primary);
    background-color: var(--el-fill-color);
  }

  :deep(.el-upload__tip) {
    color: var(--el-text-color-secondary);
  }

  // 标签样式优化
  :deep(.el-tag) {
    background-color: var(--el-fill-color);
    border-color: var(--el-border-color-light);
    color: var(--el-text-color-primary);
  }

  :deep(.el-tag--success) {
    background-color: rgba(82, 196, 26, 0.1);
    border-color: var(--el-color-success);
    color: var(--el-color-success);
  }

  :deep(.el-tag--warning) {
    background-color: rgba(250, 173, 20, 0.1);
    border-color: var(--el-color-warning);
    color: var(--el-color-warning);
  }

  :deep(.el-tag--danger) {
    background-color: rgba(255, 77, 79, 0.1);
    border-color: var(--el-color-danger);
    color: var(--el-color-danger);
  }

  :deep(.el-tag--info) {
    background-color: rgba(24, 144, 255, 0.1);
    border-color: var(--el-color-info);
    color: var(--el-color-info);
  }

  // 开关样式优化
  :deep(.el-switch) {
    .el-switch__core {
      background-color: var(--el-fill-color-dark);
      border-color: var(--el-border-color-base);

      .el-switch__action {
        background-color: #ffffff;
      }
    }
  }

  :deep(.el-switch.is-checked .el-switch__core) {
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
  }

  // 头像组件优化
  :deep(.el-avatar) {
    background-color: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    border: 1px solid var(--el-border-color-light);
  }

  // 工具提示优化
  :deep(.el-tooltip__popper) {
    background-color: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    border: 1px solid var(--el-border-color-base);
  }

  // 操作按钮样式
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

      &--info {
        background-color: var(--el-color-info);
        border-color: var(--el-color-info);

        &:hover {
          background-color: var(--el-color-info-light-3);
          border-color: var(--el-color-info-light-3);
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

  // 用户表单弹窗样式
  .user-dialog {
    :deep(.el-dialog) {
      background-color: var(--el-dialog-bg-color);
      border: 1px solid var(--el-border-color-light);
    }

    :deep(.el-dialog__body) {
      padding: 20px;
      background-color: var(--el-dialog-bg-color);
    }

    :deep(.el-dialog__header) {
      margin-right: 0;
      border-bottom: 1px solid var(--el-border-color-light);
      padding: 15px 20px;
      background-color: var(--el-dialog-bg-color);

      .el-dialog__title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .el-dialog__headerbtn .el-dialog__close {
        color: var(--el-text-color-regular);

        &:hover {
          color: var(--el-text-color-primary);
        }
      }
    }

    :deep(.el-dialog__footer) {
      border-top: 1px solid var(--el-border-color-light);
      padding: 10px 20px;
      background-color: var(--el-dialog-bg-color);
    }
  }

  .user-form {
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: var(--el-text-color-regular);
    }

    :deep(.el-input__wrapper) {
      background-color: var(--el-input-bg-color);
      border-color: var(--el-input-border-color);

      &:hover {
        border-color: var(--el-input-hover-border-color);
      }

      &.is-focus {
        border-color: var(--el-input-focus-border-color);
      }
    }

    :deep(.el-input__inner) {
      color: var(--el-text-color-primary);

      &::placeholder {
        color: var(--el-text-color-placeholder);
      }
    }

    :deep(.el-select .el-input__wrapper) {
      background-color: var(--el-input-bg-color);
    }

    :deep(.el-textarea__inner) {
      background-color: var(--el-input-bg-color);
      border-color: var(--el-input-border-color);
      color: var(--el-text-color-primary);

      &::placeholder {
        color: var(--el-text-color-placeholder);
      }

      &:hover {
        border-color: var(--el-input-hover-border-color);
      }

      &:focus {
        border-color: var(--el-input-focus-border-color);
      }
    }

    .right-column {
      .avatar-box {
        text-align: center;
        margin-bottom: 20px;

        .title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 15px;
          text-align: left;
          color: var(--el-text-color-regular);
        }

        .avatar-uploader {
          display: inline-block;

          :deep(.el-upload) {
            border: 1px dashed var(--el-border-color-base);
            background-color: var(--el-fill-color-light);

            &:hover {
              border-color: var(--el-color-primary);
              background-color: var(--el-fill-color);
            }
          }

          .avatar {
            width: 100px;
            height: 100px;
            border-radius: 4px;
            display: block;
            object-fit: cover;
          }

          .avatar-placeholder {
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            border: 1px dashed var(--el-border-color-base);
            border-radius: 4px;
            cursor: pointer;
            background-color: var(--el-fill-color-light);

            &:hover {
              border-color: var(--el-color-primary);
              color: var(--el-color-primary);
              background-color: var(--el-fill-color);
            }

            .el-icon {
              font-size: 28px;
              color: var(--el-text-color-placeholder);
            }
          }
        }

        .tip {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin-top: 8px;
        }
      }

      .status-box {
        :deep(.el-form-item) {
          margin-bottom: 18px;
        }

        :deep(.el-radio) {
          margin-right: 8px;
          color: var(--el-text-color-regular);

          &:last-child {
            margin-right: 0;
          }
        }

        :deep(.el-radio__label) {
          font-size: 13px;
          color: var(--el-text-color-regular);
        }

        :deep(.el-radio__input.is-checked .el-radio__inner) {
          background-color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
