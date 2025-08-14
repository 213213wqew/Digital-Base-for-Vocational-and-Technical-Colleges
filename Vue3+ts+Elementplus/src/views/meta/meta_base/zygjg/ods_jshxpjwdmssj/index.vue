<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          
          <el-form-item label="教工号" prop="jgh">
            <el-input
              v-model="queryParams.jgh"
              placeholder="请输入教工号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="评价维度英文名称" prop="pjwdywmc">
            <el-input
              v-model="queryParams.pjwdywmc"
              placeholder="请输入评价维度英文名称"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item> -->
          <el-form-item style="margin-top: -20px;">
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
        <div class="header-title">教师画像评价维度描述数据</div>
        <div class="placeholder">
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
          :height="'calc(75vh - 100px)'"
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
            prop="jgh"
            label="教工号"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdyjzbywmc"
            label="一级指标英文名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdyjzbzwmc"
            label="一级指标中文名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdywmc"
            label="评价维度英文名称"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdzwms"
            label="评价维度中文描述"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pjwdjgms"
            label="评价维度结果描述"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="数据采集时间"
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
          ? '新增教师画像评价维度描述数据'
          : '编辑教师画像评价维度描述数据'
      "
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="180px"
      >
        <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
          <el-input
            v-model="form.zjsjwyxbs"
            placeholder="留空则自动生成32位唯一标识"
            maxlength="32"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="学校代码" prop="xxdm">
          <el-input
            v-model="form.xxdm"
            placeholder="系统自动获取"
            maxlength="10"
            readonly
            disabled
          />
        </el-form-item>
        <el-form-item label="教工号"  prop="jgh">
          <div style="display: flex; align-items: center; gap: 8px;width: 100%">
            <el-select
              v-model="form.jgh"
              placeholder="请搜索并选择教工号"
              filterable
            
              remote
              reserve-keyword
              :remote-method="searchTeacherOptions"
              :loading="teacherLoading"
              
              clearable
              @change="handleTeacherChange"
            >
              <el-option
                v-for="teacher in teacherOptions"
                :key="teacher.value"
                :label="teacher.label"
                :value="teacher.value"
              />
            </el-select>
            <el-tooltip
              content="数据来源：ODS_JSHXSJ 教师画像数据子类表"
              placement="top"
            >
              <el-icon color="#E6A23C" style="cursor: help">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label="评价维度一级指标英文名称" prop="pjwdyjzbywmc">
          <el-input
            v-model="form.pjwdyjzbywmc"
            placeholder="请输入评价维度一级指标英文名称"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评价维度一级指标中文名称" prop="pjwdyjzbzwmc">
          <el-input
            v-model="form.pjwdyjzbzwmc"
            placeholder="请输入评价维度一级指标中文名称"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评价维度英文名称" prop="pjwdywmc">
          <el-input
            v-model="form.pjwdywmc"
            placeholder="请输入评价维度英文名称"
            maxlength="150"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评价维度中文描述" prop="pjwdzwms">
          <el-input
            v-model="form.pjwdzwms"
            type="textarea"
            :rows="3"
            placeholder="请输入评价维度中文描述"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="评价维度结果描述" prop="pjwdjgms">
          <el-input
            v-model="form.pjwdjgms"
            type="textarea"
            :rows="3"
            placeholder="请输入评价维度结果描述"
            maxlength="300"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="数据采集时间" prop="sjcjsj">
          <el-date-picker
            v-model="form.sjcjsj"
            type="datetime"
                placeholder="请选择数据采集时间"
                value-format="YYYYMMDD HHmmss"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="教师画像评价维度描述数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="教工号">{{
            currentRecord.jgh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="评价维度一级指标英文名称">{{
            currentRecord.pjwdyjzbywmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="评价维度一级指标中文名称">{{
            currentRecord.pjwdyjzbzwmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="评价维度英文名称">{{
            currentRecord.pjwdywmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="评价维度中文描述" :span="2">{{
            currentRecord.pjwdzwms || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="评价维度结果描述" :span="2">{{
            currentRecord.pjwdjgms || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            formatDisplayDateTime(currentRecord.sjcjsj)
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus)">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRecord.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRecord.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  Warning,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsJshxpjwdmssjPage,
  getOdsJshxpjwdmssjById,
  addOdsJshxpjwdmssj,
  updateOdsJshxpjwdmssj,
  deleteOdsJshxpjwdmssj,
  batchDeleteOdsJshxpjwdmssj,
  exportOdsJshxpjwdmssj,
  getSystemSchoolCode,
  getJsOptions,
  type OdsJshxpjwdmssjQuery,
  type OdsJshxpjwdmssjInfo,
  type OdsJshxpjwdmssjForm,
  type JsOption,
} from "@/api/meta/meta_base/zygjg/ods_jshxpjwdmssj";

// 状态定义
const loading = ref(false);
const dataList = ref<OdsJshxpjwdmssjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);

// 教师选项相关
const teacherOptions = ref<JsOption[]>([]);
const teacherLoading = ref(false);
const queryParams = reactive<OdsJshxpjwdmssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  pjwdyjzbywmc: "",
  pjwdyjzbzwmc: "",
  pjwdywmc: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const currentRecord = ref<OdsJshxpjwdmssjInfo | null>(null);
const form = reactive<OdsJshxpjwdmssjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  pjwdyjzbywmc: "",
  pjwdyjzbzwmc: "",
  pjwdywmc: "",
  pjwdzwms: "",
  pjwdjgms: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = {
  zjsjwyxbs: [
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "主键数据唯一性标识必须为32位大写字母和数字的组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
  ],
  jgh: [
    { required: true, message: "教工号不能为空", trigger: "change" },
    { max: 20, message: "教工号长度不能超过20个字符", trigger: "blur" },
  ],
  pjwdyjzbywmc: [
    {
      required: true,
      message: "评价维度一级指标英文名称不能为空",
      trigger: "blur",
    },
    {
      max: 150,
      message: "评价维度一级指标英文名称长度不能超过150个字符",
      trigger: "blur",
    },
  ],
  pjwdyjzbzwmc: [
    {
      required: true,
      message: "评价维度一级指标中文名称不能为空",
      trigger: "blur",
    },
    {
      max: 150,
      message: "评价维度一级指标中文名称长度不能超过150个字符",
      trigger: "blur",
    },
  ],
  pjwdywmc: [
    { required: true, message: "评价维度英文名称不能为空", trigger: "blur" },
    {
      max: 150,
      message: "评价维度英文名称长度不能超过150个字符",
      trigger: "blur",
    },
  ],
  pjwdzwms: [
    { required: true, message: "评价维度中文描述不能为空", trigger: "blur" },
    {
      max: 300,
      message: "评价维度中文描述长度不能超过300个字符",
      trigger: "blur",
    },
  ],
  pjwdjgms: [
    { required: true, message: "评价维度结果描述不能为空", trigger: "blur" },
    {
      max: 300,
      message: "评价维度结果描述长度不能超过300个字符",
      trigger: "blur",
    },
  ],
  sjcjsj: [
        { required: true, message: "数据采集时间不能为空", trigger: "change" },
        {
            pattern: /^\d{8} \d{6}$/,
            message: "数据采集时间格式必须为YYYYMMDD HHmmss",
            trigger: "blur",
        },
         
    ],
};

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const submitLoading = ref(false);

// 组件引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsJshxpjwdmssjPage(queryParams);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      dataList.value = responseData.data.records || [];
      total.value = responseData.data.total;

      // 处理显示时间格式
      dataList.value.forEach((item) => {
        item.sjcjsjDisplay = formatDisplayDateTime(item.sjcjsj);
      });
    } else {
      const msg = responseData?.message || "获取列表失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
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
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 多选变化
const handleSelectionChange = (selection: OdsJshxpjwdmssjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsJshxpjwdmssjInfo) => {
  currentRecord.value = row;
};

// 行双击
const handleRowDblClick = (row: OdsJshxpjwdmssjInfo) => {
  handleView(row);
};

// 获取系统学校代码
const fetchSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      return responseData.data;
    } else {
      console.warn("获取学校代码失败:", responseData?.message);
      return "";
    }
  } catch (error: any) {
    console.error("获取学校代码失败:", error);
    return "";
  }
};

// 搜索教师选项
const searchTeacherOptions = async (query: string) => {
  if (query) {
    teacherLoading.value = true;
    try {
      const response = await getJsOptions(query);
      const responseData = response.data as any;
      if (responseData && responseData.code === 200 && responseData.data) {
        teacherOptions.value = responseData.data;
      } else {
        teacherOptions.value = [];
      }
    } catch (error: any) {
      console.error("获取教师选项失败:", error);
      teacherOptions.value = [];
    } finally {
      teacherLoading.value = false;
    }
  } else {
    teacherOptions.value = [];
  }
};

// 处理教师选择变化
const handleTeacherChange = (selectedJgh: string) => {
  const selectedTeacher = teacherOptions.value.find(
    (teacher) => teacher.value === selectedJgh
  );
  if (selectedTeacher) {
    form.jgh = selectedTeacher.value;
    // 这里可以根据需要填充其他相关字段
    console.log("选中的教师:", selectedTeacher);
  }
};

// 新增
const handleAdd = async () => {
  resetForm();
  // 自动获取学校代码
  const schoolCode = await fetchSchoolCode();
  if (schoolCode) {
    form.xxdm = schoolCode;
  }
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsJshxpjwdmssjInfo) => {
  try {
    const response = await getOdsJshxpjwdmssjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      Object.assign(form, responseData.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(responseData?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsJshxpjwdmssjInfo) => {
  try {
    const response = await getOdsJshxpjwdmssjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      currentRecord.value = responseData.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(responseData?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsJshxpjwdmssjInfo) => {
  try {
    await ElMessageBox.confirm(
      "是否确认删除该教师画像评价维度描述数据？",
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteOdsJshxpjwdmssj(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(responseData?.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error(error.message || "删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `是否确认删除选中的 ${selectedIds.value.length} 条数据？`,
      "警告",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsJshxpjwdmssj(selectedIds.value);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(responseData?.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error(error.message || "批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsJshxpjwdmssj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教师画像评价维度描述数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response;
    if (dialogType.value === "add") {
      response = await addOdsJshxpjwdmssj(form);
    } else {
      response = await updateOdsJshxpjwdmssj(form);
    }

    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(responseData?.message || "操作失败");
    }
  } catch (error: any) {
    console.error("表单提交失败:", error);
    ElMessage.error(error.message || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 详情关闭
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    jgh: "",
    pjwdyjzbywmc: "",
    pjwdyjzbzwmc: "",
    pjwdywmc: "",
    pjwdzwms: "",
    pjwdjgms: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 上报状态点击
const handleReportStatusClick = (row: OdsJshxpjwdmssjInfo) => {
  // 可以在这里添加上报状态切换逻辑
  console.log("点击上报状态:", row);
};

// 启用状态变化
const handleEnableStatusChange = (row: OdsJshxpjwdmssjInfo) => {
  // 可以在这里添加启用状态切换逻辑
  console.log("启用状态变化:", row);
};

// 获取上报状态文本
const getReportStatusText = (status: string): string => {
  if (!status && status !== "0") {
    return "未上报";
  }
  switch (String(status)) {
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

// 获取上报状态标签类型
const getReportStatusTagType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "info";
  }
  switch (String(status)) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

// 格式化显示时间
const formatDisplayDateTime = (timeStr: string): string => {
  if (!timeStr) return "-";

  // 如果是14位格式YYYYMMDDhhmmss，转换为可读格式
  if (timeStr.length === 14 && /^\d{14}$/.test(timeStr)) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(8, 10);
    const minute = timeStr.substring(10, 12);
    const second = timeStr.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  return timeStr;
};

// 格式化日期时间
const formatDateTime = (dateTime: string): string => {
  if (!dateTime) return "-";

  try {
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    return dateTime;
  }
};

// 组件挂载时获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped>
.entity-management {
  padding: 0px;
}

.search-card {
  height: 60px;
 
}




.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.placeholder {
  width: 120px;
  display: flex;
  justify-content: flex-end;
}

.table-body {
 margin-top: -10px;
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #ebeef5;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-table .el-table__cell) {
  padding: 8px 0;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-descriptions-item__label) {
  font-weight: 500;
  color: #606266;
  width: 140px;
}
.table-card{
  margin-top: -10px;
}
</style>
