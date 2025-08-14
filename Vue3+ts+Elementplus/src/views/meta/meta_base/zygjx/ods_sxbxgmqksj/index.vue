<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
              style="width: 120px"
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              style="width: 120px"
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery">
              <el-icon><Refresh /></el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
            type="danger"
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
       
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">实习保险购买情况数据管理</div>
        <div class="placeholder">
          <el-button type="success" @click="handleImport">
            <el-icon><Upload /></el-icon>导入
          </el-button>
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="table-body">
        <el-table
          v-loading="loading"
          :data="dataList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          highlight-current-row
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 70px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xh"
            label="学号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxxzmc"
            label="保险险种名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bdh"
            label="保单号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxfczfmc"
            label="出资方名称"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxgmrqDisplay"
            label="购买日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="bxgmfmText"
            label="购买方"
            width="120"
            align="center"
          />
          <el-table-column
            prop="gmbxzlmText"
            label="保险种类"
            width="120"
            align="center"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            width="160"
            align="center"
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                @click="handleReportStatusClick(row)"
                style="cursor: pointer"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-switch
                v-model="row.enableStatus"
                active-value="1"
                inactive-value="0"
                @change="handleEnableStatusChange(row)"
                :loading="row.statusLoading"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="180"
            fixed="right"
            align="center"
          >
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleView(row)"
                >
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="handleEdit(row)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click="handleDelete(row)"
                >
                  <el-icon><Delete /></el-icon>删除
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <div class="pagination-controls">
          <el-pagination
            v-model:current-page="queryParams.pageNum"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[20, 50, 100, 200, 500]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增实习保险购买情况数据'
          : dialogType === 'edit'
            ? '编辑实习保险购买情况数据'
            : '查看实习保险购买情况数据'
      "
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
      class="insurance-dialog"
    >
      <div class="form-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="120px"
          :disabled="dialogType === 'view'"
          class="insurance-form"
        >
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input
                    v-model="form.xxdm"
                    placeholder="请输入学校代码"
                    maxlength="10"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学号" prop="xh">
                  <el-input
                    v-model="form.xh"
                    placeholder="请输入学号"
                    maxlength="20"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学生姓名" prop="xsxm">
                  <el-input
                    v-model="form.xsxm"
                    placeholder="请输入学生姓名"
                    maxlength="36"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 保险信息区域 -->
          <div class="form-section">
            <div class="section-title">保险信息</div>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="保险险种名称" prop="bxxzmc">
                  <el-input
                    v-model="form.bxxzmc"
                    placeholder="请输入保险险种名称"
                    maxlength="120"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保单号" prop="bdh">
                  <el-input
                    v-model="form.bdh"
                    placeholder="请输入保单号"
                    maxlength="64"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险费出资方名称" prop="bxfczfmc">
                  <el-input
                    v-model="form.bxfczfmc"
                    placeholder="请输入保险费出资方名称"
                    maxlength="200"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险购买日期" prop="bxgmrq">
                  <el-date-picker
                    v-model="form.bxgmrq"
                    type="date"
                    placeholder="请选择保险购买日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险购买方" prop="bxgmfm">
                  <el-select
                    v-model="form.bxgmfm"
                    placeholder="请选择保险购买方"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in bxgmfmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买保险种类" prop="gmbxzlm">
                  <el-select
                    v-model="form.gmbxzlm"
                    placeholder="请选择购买保险种类"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in gmbxzlmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 系统信息区域 -->
          <div class="form-section">
            <div class="section-title">系统信息</div>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    :placeholder="dialogType === 'edit' ? '系统自动生成，不可修改' : '请输入主键数据唯一性标识'"
                    maxlength="32"
                    :clearable="dialogType !== 'edit'"
                    :readonly="dialogType === 'edit'"
                    :disabled="dialogType === 'edit'"
                    :style="dialogType === 'edit' ? 'background-color: #f5f7fa' : ''"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker
                    v-model="form.sjcjsj"
                    type="datetime"
                    placeholder="请选择数据采集时间"
                    value-format="YYYYMMDD HHmmss"
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select
                    v-model="form.reportStatus"
                    placeholder="请选择上报状态"
                    style="width: 100%"
                  >
                    <el-option label="未上报" value="0" />
                    <el-option label="已上报" value="1" />
                    <el-option label="上报失败" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态" prop="enableStatus">
                  <el-select
                    v-model="form.enableStatus"
                    placeholder="请选择启用状态"
                    style="width: 100%"
                  >
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 查看模式下显示创建时间和更新时间 -->
              <template v-if="dialogType === 'view'">
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-input
                      :value="formatDateTime(currentRecord?.createTime)"
                      readonly
                      disabled
                      style="background-color: #f5f7fa"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="更新时间">
                    <el-input
                      :value="formatDateTime(currentRecord?.updateTime)"
                      readonly
                      disabled
                      style="background-color: #f5f7fa"
                    />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose" size="large">
            {{ dialogType === "view" ? "关闭" : "取消" }}
          </el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
            size="large"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入实习保险购买情况数据"
      width="500px"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 20px;">
        <el-alert
          :title="importTipContent"
          type="info"
          :closable="false"
          show-icon
        />
      </div>
      
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        :auto-upload="true"
        :show-file-list="true"
        :limit="1"
        :before-upload="beforeUpload"
        :http-request="customHttpRequest"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            只能上传 .xlsx/.xls 文件，且不超过 10MB
          </div>
        </template>
      </el-upload>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleImportCancel">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  UploadFilled,
} from "@element-plus/icons-vue";
import {
  getOdsSxbxgmqksjPage,
  getOdsSxbxgmqksjById,
  addOdsSxbxgmqksj,
  updateOdsSxbxgmqksj,
  deleteOdsSxbxgmqksj,
  batchDeleteOdsSxbxgmqksj,
  exportOdsSxbxgmqksj,
  importOdsSxbxgmqksj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  getInsuranceBuyerOptions,
  getInsuranceTypeOptions,
  type OdsSxbxgmqksjForm,
  type OdsSxbxgmqksjInfo,
  type OdsSxbxgmqksjQuery,
  type DictOption,
} from "@/api/meta/meta_base/zygjx/ods_sxbxgmqksj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsSxbxgmqksjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsSxbxgmqksjInfo | null>(null);
// 移除activeTab，不再使用标签页

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 字典选项
const bxgmfmOptions = ref<DictOption[]>([
  { value: "01", label: "学校统一购买" },
  { value: "02", label: "学生自行购买" },
  { value: "03", label: "实习单位购买" },
]);
const gmbxzlmOptions = ref<DictOption[]>([
  { value: "01", label: "意外伤害保险" },
  { value: "02", label: "责任保险" },
  { value: "03", label: "其他保险" },
]);

// 查询参数
const queryParams = reactive<OdsSxbxgmqksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  bxxzmc: "",
  bdh: "",
  bxfczfmc: "",
  bxgmfm: "",
  gmbxzlm: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsSxbxgmqksjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  bxxzmc: "",
  bdh: "",
  bxfczfmc: "",
  bxgmrq: "",
  bxgmfm: "",
  gmbxzlm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: true, message: "请输入主键数据唯一性标识", trigger: "blur" },
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsSxbxgmqksjPage(queryParams);
    // 实际API返回结构: response.data.data.records (使用类型断言避免TS错误)
    if (response.data && (response.data as any).data) {
      dataList.value = (response.data as any).data.records || [];
      total.value = (response.data as any).data.total || 0;
    } else {
      console.error("数据格式异常:", response);
      dataList.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("查询失败:", error);
    ElMessage.error("查询失败");
    dataList.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 分页改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 选择改变
const handleSelectionChange = (selection: any[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (_row: any) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: any) => {
  handleView(row);
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: any) => {
  try {
    const response = await getOdsSxbxgmqksjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogType.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 查看
const handleView = async (row: any) => {
  try {
    const response = await getOdsSxbxgmqksjById(row.id);
    const data = (response as any)?.data?.data || (response as any)?.data || response.data;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogType.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除学生"${row.xsxm}"的保险购买记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await deleteOdsSxbxgmqksj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要批量删除选中的 ${selectedIds.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await batchDeleteOdsSxbxgmqksj(selectedIds.value);
    ElMessage.success("批量删除成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsSxbxgmqksj(queryParams);
    // 处理导出的二进制数据
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实习保险购买情况数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 导入功能相关
const importDialogVisible = ref(false);
const uploadRef = ref();

// 处理导入按钮点击
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 采集时间将统一设置为当前时间
5. 支持.xls和.xlsx格式文件`;

// 文件上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件!");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB!");
    return false;
  }
  return true;
};

// 自定义文件上传处理
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importOdsSxbxgmqksj(file)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importDialogVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);

    let errorMessage = "导入失败";
    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = "登录已过期，请重新登录";
      } else if (status === 403) {
        errorMessage = "没有权限进行此操作";
      } else if (status === 413) {
        errorMessage = "文件太大，请检查文件大小";
      } else if (status === 415) {
        errorMessage = "不支持的文件格式";
      } else if (data && data.message) {
        errorMessage = data.message;
      } else {
        errorMessage = `服务器错误 (${status})`;
      }
    } else if (error?.message) {
      if (error.message.includes("Network Error")) {
        errorMessage = "网络连接失败，请检查网络连接";
      } else if (error.message.includes("timeout")) {
        errorMessage = "请求超时，请重试";
      } else {
        errorMessage = error.message;
      }
    }

    ElMessage.error(errorMessage);
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

 

// 上报状态点击
const handleReportStatusClick = async (row: any) => {
  const nextStatus = row.reportStatus === "0" ? "1" : "0";
  const statusText = nextStatus === "1" ? "已上报" : "未上报";

  try {
    await ElMessageBox.confirm(
      `确定要将上报状态修改为"${statusText}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      },
    );

    await updateSingleReportStatus(row.id, nextStatus);
    ElMessage.success("状态修改成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("状态修改失败");
    }
  }
};

// 启用状态改变
const handleEnableStatusChange = async (row: any) => {
  const statusText = row.enableStatus === "1" ? "启用" : "禁用";

  try {
    row.statusLoading = true;
    await updateSingleEnableStatus(row.id, row.enableStatus);
    ElMessage.success(`${statusText}成功`);
  } catch (error) {
    // 失败时恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    ElMessage.error(`${statusText}失败`);
  } finally {
    row.statusLoading = false;
  }
};

// 表单提交
const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;

    if (dialogType.value === "add") {
      await addOdsSxbxgmqksj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsSxbxgmqksj(form);
      ElMessage.success("修改成功");
    }

    dialogVisible.value = false;
    getList();
  } catch (error) {
    // 表单验证失败或请求失败
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    xsxm: "",
    bxxzmc: "",
    bdh: "",
    bxfczfmc: "",
    bxgmrq: "",
    bxgmfm: "",
    gmbxzlm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info"; // 未上报
    case "1":
      return "success"; // 已上报
    case "2":
      return "danger"; // 上报失败
    default:
      return "info";
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未知";
  }
};

// 格式化日期时间（用于创建时间和更新时间）
const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return "-";
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "-";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return "-";
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    // 可以从服务器获取字典数据
    // const [buyerRes, typeRes] = await Promise.all([
    //   getInsuranceBuyerOptions(),
    //   getInsuranceTypeOptions()
    // ])
    // bxgmfmOptions.value = buyerRes.data
    // gmbxzlmOptions.value = typeRes.data
  } catch (error) {
    console.warn("加载字典数据失败，使用默认选项");
  }
};

// 初始化
onMounted(() => {
  getList();
  loadDictOptions();
});
</script>

<style scoped lang="scss">
.entity-management {
  padding: 0px;

  // 强制设置卡片间距，避免被其他样式覆盖
  :deep(.el-card) {
    &:first-child {
      margin-bottom: 1px !important;
    }
    &:last-child {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
    }
  }

  .search-card {
    margin-bottom: 1px !important;

    :deep(.el-card__body) {
      padding: 6px 15px !important;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      gap: 8px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
    }

    :deep(.el-form-item__label) {
      width: 80px;
      text-align: right;
      padding-right: 8px;
      font-size: 14px;
      margin-right: 0;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
      margin-left: 8px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 0 !important;
    margin-top: 0 !important;

    :deep(.el-card__body) {
      padding: 10px 15px 0 !important;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
  }

  .table-body {
    margin-bottom: 0;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
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
    display: flex;
    justify-content: flex-end;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-top: 0;

    .total-info {
      font-size: 14px;
      color: #606266;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 14px;

      .el-pagination__total {
        display: none;
      }

      .el-pagination__sizes {
        margin-right: 15px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
      }

      .el-select .el-input {
        width: 100px;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;

    .el-button {
      margin: 0 3px;
      padding: 0 5px;
      font-size: 14px;
    }
  }
}

// 弹窗样式
.insurance-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    box-shadow:
      0 12px 32px 4px rgba(0, 0, 0, 0.04),
      0 8px 20px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-dialog__header) {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f0f0f0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px 24px;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
  }
}

.form-container {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.insurance-form {
  .form-section {
    margin-bottom: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, #3b82f6, #1d4ed8);
        border-radius: 1px;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;

    .el-form-item__label {
      font-weight: 500;
      color: #374151;
      line-height: 1.5;
    }

    .el-form-item__content {
      .el-input__wrapper {
        border-radius: 8px;
        border: 1px solid #d1d5db;
        transition: all 0.2s ease;

        &:hover {
          border-color: #9ca3af;
        }

        &.is-focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }

      .el-select {
        width: 100%;

        .el-input__wrapper {
          border-radius: 8px;
        }
      }

      .el-date-editor {
        width: 100%;

        .el-input__wrapper {
          border-radius: 8px;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .el-button {
    border-radius: 8px;
    padding: 12px 24px;
    font-weight: 500;

    &--primary {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border: none;

      &:hover {
        background: linear-gradient(135deg, #2563eb, #1e40af);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      }
    }

    &:not(.el-button--primary) {
      border: 1px solid #d1d5db;
      color: #6b7280;

      &:hover {
        border-color: #9ca3af;
        color: #374151;
        background-color: #f9fafb;
      }
    }
  }
}
</style>
