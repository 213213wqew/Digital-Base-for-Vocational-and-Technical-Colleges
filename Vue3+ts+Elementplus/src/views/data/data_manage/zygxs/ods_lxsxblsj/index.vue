<template>
  <div class="ods-lxsxblsj-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学生姓名/学号" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名或学号"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择状态"
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
              placeholder="请选择状态"
              clearable
              style="width: 120px"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
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
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">离校手续办理数据管理</div>
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
          :height="'calc(75vh - 135px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            min-width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xh"
            label="学号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jfqkqrrq"
            label="结费确认日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="xfqrrq"
            label="学分确认日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="tsghqrrq"
            label="图书归还确认日期"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sstsqrrq"
            label="宿舍退宿确认日期"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="byzlqrq"
            label="毕业证领取日期"
            min-width="140"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus) as TagProps['type']"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getEnableStatusType(row.enableStatus) as TagProps['type']"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
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
            :page-sizes="[100, 200, 500, 1000]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 510px"
      class="professional-dialog"
      destroy-on-close
    >
      <!-- 编辑模式 -->
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="formData.zjsjwyxbs"
                placeholder="可不填，系统自动生成32位唯一编码（大写字母+数字组合）"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
                :formatter="(value: string) => value.toUpperCase()"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="formData.xxdm"
                placeholder="10位数字码"
                maxlength="10"
                show-word-limit
                type="number"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select v-model="formData.xh"
              filterable
         
            
          
              :loading="loading"
              @change="handleXhChange"
              :remote-method="getStudentOptionsData"
              placeholder="请选择学号">
                <el-option v-for="item in studentOptions" 
                :key="item.xh" 
                :label="item.label" 
                :value="item.xh" 
                />
              </el-select>
              <el-tooltip content="数据来源于学生画像数据子类" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
 
              
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div style="display: flex; align-items: center; gap: 8px">
            <el-form-item label="学生姓名" prop="xsxm">
              <el-input
              disabled
                v-model="formData.xsxm"
                placeholder="请输入学生姓名（选填）"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
            <el-tooltip content="数据来源于学生画像数据子类" placement="top">  
              <el-icon style="color: #e6a23c"><Warning /></el-icon>
            </el-tooltip>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结费情况确认日期" prop="jfqkqrrq">
              <el-date-picker
                v-model="jfqkqrrqDate"
                type="date"
                placeholder="格式：YYYYMMDD"
                style="width: 100%"
                value-format="YYYYMMDD"
                @change="handleJfqkqrrqChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学分确认日期" prop="xfqrrq">
              <el-date-picker
                v-model="xfqrrqDate"
                type="date"
                placeholder="格式：YYYYMMDD"
                style="width: 100%"
                value-format="YYYYMMDD"
                @change="handleXfqrrqChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图书归还确认日期" prop="tsghqrrq">
              <el-date-picker
                v-model="tsghqrrqDate"
                type="date"
                placeholder="格式：YYYYMMDD"
                style="width: 100%"
                value-format="YYYYMMDD"
                @change="handleTsghqrrqChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="宿舍退宿确认日期" prop="sstsqrrq">
              <el-date-picker
                v-model="sstsqrrqDate"
                type="date"
                placeholder="格式：YYYYMMDD"
                style="width: 100%"
                value-format="YYYYMMDD"
                @change="handleSstsqrrqChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业证领取日期" prop="byzlqrq">
              <el-date-picker
                v-model="byzlqrqDate"
                type="date"
                placeholder="格式：YYYYMMDD（选填）"
                style="width: 100%"
                value-format="YYYYMMDD"
                @change="handleByzlqrqChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="sjcjsjDate"
                type="datetime"
                placeholder="格式：YYYYMMDD HHmmss"
                style="width: 100%"
                value-format="YYYYMMDD HHmmss"
                @change="handleSjcjsjChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="formData.reportStatus"
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
                v-model="formData.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="professional-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ formData.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ formData.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ formData.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生姓名">
            <div class="detail-value">{{ formData.xsxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="结费确认日期">
            <div class="detail-value">
              {{ formatDate(formData.jfqkqrrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="学分确认日期">
            <div class="detail-value">
              {{ formatDate(formData.xfqrrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="图书归还确认日期">
            <div class="detail-value">
              {{ formatDate(formData.tsghqrrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="宿舍退宿确认日期">
            <div class="detail-value">
              {{ formatDate(formData.sstsqrrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="毕业证领取日期">
            <div class="detail-value">
              {{ formatDate(formData.byzlqrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDateTime(formData.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusType(formData.reportStatus)">
              {{ getReportStatusText(formData.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="getEnableStatusType(formData.enableStatus)">
              {{ getEnableStatusText(formData.enableStatus) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="submitForm"
            :loading="submitLoading"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox, FormInstance } from "element-plus";
import type { TagProps } from 'element-plus';
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import {
  getOdsLxsxblsjPage,
  getOdsLxsxblsjById,
  addOdsLxsxblsj,
  updateOdsLxsxblsj,
  deleteOdsLxsxblsj,
  getStudentOptions,
  getSystemSchoolCode,
  batchDeleteOdsLxsxblsj,
  exportOdsLxsxblsj,
  type OdsLxsxblsjForm,
  type OdsLxsxblsjInfo,
  type OdsLxsxblsjQuery,
} from "@/api-data/data/data_base/zygxs/ods_lxsxblsj";
import { ElLoading } from "element-plus";

// 对话框模式
type DialogMode = 'add' | 'edit' | 'view';

// 查询参数
const systemSchoolCode = ref<string>("");
const queryParams = reactive<OdsLxsxblsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",  // 初始化为空字符串
  xh: "",
  xsxm: "",
  jfqkqrrqStart: "",
  jfqkqrrqEnd: "",
  xfqrrqStart: "",
  xfqrrqEnd: "",
  tsghqrrqStart: "",
  tsghqrrqEnd: "",
  sstsqrrqStart: "",
  sstsqrrqEnd: "",
  byzlqrqStart: "",
  byzlqrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsLxsxblsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsLxsxblsjInfo[]>([]);
const studentOptions = ref<any[]>([]);

// 对话框相关
const dialogVisible = ref(false);
const dialogMode = ref<DialogMode>("add");
const dialogTitle = ref("");
const activeTab = ref("basic");
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 表单数据
const formData = reactive<OdsLxsxblsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xsxm: "",
  jfqkqrrq: "",
  xfqrrq: "",
  tsghqrrq: "",
  sstsqrrq: "",
  byzlqrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 日期字段
const jfqkqrrqDate = ref("");
const xfqrrqDate = ref("");
const tsghqrrqDate = ref("");
const sstsqrrqDate = ref("");
const byzlqrqDate = ref("");
const sjcjsjDate = ref("");

// 详情对话框
 

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: false, message: "主键数据唯一性标识可以为空，系统自动生成", trigger: "blur" },
    { pattern: /^[A-Z0-9]{32}$/, message: "必须是32位大写字母和数字组合", trigger: "blur" },
    { max: 32, message: "长度不能超过32个字符", trigger: "blur" }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" },
    { max: 10, message: "长度不能超过10个字符", trigger: "blur" }
  ],
  xh: [
    { required: true, message: "学号不能为空", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" }
  ],
  xsxm: [
    { required: false, message: "学生姓名为选填项", trigger: "blur" },
    { max: 36, message: "长度不能超过36个字符", trigger: "blur" }
  ],
  jfqkqrrq: [
    { required: true, message: "结费情况确认日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式必须是YYYYMMDD", trigger: "blur" }
  ],
  xfqrrq: [
    { required: true, message: "学分确认日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式必须是YYYYMMDD", trigger: "blur" }
  ],
  tsghqrrq: [
    { required: true, message: "图书归还确认日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式必须是YYYYMMDD", trigger: "blur" }
  ],
  sstsqrrq: [
    { required: true, message: "宿舍退宿确认日期不能为空", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式必须是YYYYMMDD", trigger: "blur" }
  ],
  byzlqrq: [
    { required: false, message: "毕业证领取日期为选填项", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "日期格式必须是YYYYMMDD", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" },
    { max: 15, message: "长度不能超过15个字符", trigger: "blur" },
     
  ]
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsLxsxblsjPage(queryParams) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleSearch = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xsxm: "",
    jfqkqrrqStart: "",
    jfqkqrrqEnd: "",
    xfqrrqStart: "",
    xfqrrqEnd: "",
    tsghqrrqStart: "",
    tsghqrrqEnd: "",
    sstsqrrqStart: "",
    sstsqrrqEnd: "",
    byzlqrqStart: "",
    byzlqrqEnd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    reportStatus: "",
    enableStatus: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogTitle.value = "新增离校手续办理数据";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = (row: OdsLxsxblsjInfo) => {
  resetForm();
  dialogMode.value = "edit";
  dialogTitle.value = "编辑离校手续办理数据";

  // 填充表单数据
  Object.assign(formData, row);

  // 转换日期格式
  if (row.jfqkqrrq) jfqkqrrqDate.value = formatDateForPicker(row.jfqkqrrq);
  if (row.xfqrrq) xfqrrqDate.value = formatDateForPicker(row.xfqrrq);
  if (row.tsghqrrq) tsghqrrqDate.value = formatDateForPicker(row.tsghqrrq);
  if (row.sstsqrrq) sstsqrrqDate.value = formatDateForPicker(row.sstsqrrq);
  if (row.byzlqrq) byzlqrqDate.value = formatDateForPicker(row.byzlqrq);
  if (row.sjcjsj) sjcjsjDate.value = formatDateTimeForPicker(row.sjcjsj);

  dialogVisible.value = true;
};

// 查看
const handleView = async (row: OdsLxsxblsjInfo) => {
  try {
    const response = await getOdsLxsxblsjById(row.id) as any;
    if (response.data.code === 200) {
      resetForm();
      dialogMode.value = "view";
      dialogTitle.value = "查看离校手续办理数据";
      
      // 填充表单数据
      Object.assign(formData, response.data.data);

      // 转换日期格式
      if (formData.jfqkqrrq) jfqkqrrqDate.value = formatDateForPicker(formData.jfqkqrrq);
      if (formData.xfqrrq) xfqrrqDate.value = formatDateForPicker(formData.xfqrrq);
      if (formData.tsghqrrq) tsghqrrqDate.value = formatDateForPicker(formData.tsghqrrq);
      if (formData.sstsqrrq) sstsqrrqDate.value = formatDateForPicker(formData.sstsqrrq);
      if (formData.byzlqrq) byzlqrqDate.value = formatDateForPicker(formData.byzlqrq);
      if (formData.sjcjsj) sjcjsjDate.value = formatDateTimeForPicker(formData.sjcjsj);

      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsLxsxblsjInfo) => {
  try {
    const response = await deleteOdsLxsxblsj(row.id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.message || "删除失败");
    }
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  }
};
const getStudentOptionsData = async () => {
  const response = await getStudentOptions() as any;
  if (response.data.code === 200) {
    console.log(response.data.data);
    
    studentOptions.value = response.data.data;
  }
};
const handleXhChange = (value: string) => {
  const option = studentOptions.value.find((item: any) => item.xh === value);
  if (option) {
    formData.xsxm = option.xsxm;
  }
  formData.xh = value;
 
};
// 批量删除
const handleBatchDelete = async () => {
  try {
    const ids = selectedRows.value.map((row) => row.id);
    const response = await batchDeleteOdsLxsxblsj(ids) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.message || "删除失败");
    }
  } catch (error) {
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessageBox.confirm(
      "确定要导出离校手续办理数据吗？",
      "导出确认",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    ).then(async () => {
      const loading = ElLoading.service({
        lock: true,
        text: "正在导出数据，请稍候...",
        background: "rgba(0, 0, 0, 0.7)",
      });

      try {
        const response = await exportOdsLxsxblsj(queryParams);
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `离校手续办理数据_${new Date().getTime()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        ElMessage.success("导出成功");
      } catch (error) {
        console.error("导出失败:", error);
        ElMessage.error("导出失败");
      } finally {
        loading.close();
      }
    });
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        const response = dialogMode.value === "add"
          ? await addOdsLxsxblsj(formData) as any
          : await updateOdsLxsxblsj(formData) as any;

        if (response.data.code === 200) {
          ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(response.message || "操作失败");
        }
      } catch (error) {
        console.error("操作失败:", error);
        ElMessage.error("操作失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xsxm: "",
    jfqkqrrq: "",
    xfqrrq: "",
    tsghqrrq: "",
    sstsqrrq: "",
    byzlqrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });

  // 重置日期字段
  jfqkqrrqDate.value = "";
  xfqrrqDate.value = "";
  tsghqrrqDate.value = "";
  sstsqrrqDate.value = "";
  byzlqrqDate.value = "";
  sjcjsjDate.value = "";

  activeTab.value = "basic";
  formRef.value?.clearValidate();
};

// 日期处理函数
const handleJfqkqrrqChange = (value: string) => {
  formData.jfqkqrrq = value || "";
};

const handleXfqrrqChange = (value: string) => {
  formData.xfqrrq = value || "";
};

const handleTsghqrrqChange = (value: string) => {
  formData.tsghqrrq = value || "";
};

const handleSstsqrrqChange = (value: string) => {
  formData.sstsqrrq = value || "";
};

const handleByzlqrqChange = (value: string) => {
  formData.byzlqrq = value || "";
};

const handleSjcjsjChange = (value: string) => {
  formData.sjcjsj = value || "";
};

// 表格事件
const handleSelectionChange = (rows: OdsLxsxblsjInfo[]) => {
  selectedRows.value = rows;
};

const handleRowClick = (row: OdsLxsxblsjInfo) => {
  // 行点击事件，可以在这里添加逻辑
};

const handleRowDblClick = (row: OdsLxsxblsjInfo) => {
  handleView(row);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 状态处理函数
const getReportStatusText = (status: string | undefined): string => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return status ? statusMap[status] || "未知" : "未知";
};

const getReportStatusType = (status: string | undefined): TagProps['type'] => {
  const typeMap: Record<string, TagProps['type']> = {
    "0": "warning",
    "1": "success",
    "2": "danger",
  };
  return status ? typeMap[status] || "info" : "info";
};

const getEnableStatusText = (status: string | undefined): string => {
  return status === "1" ? "启用" : "禁用";
};

const getEnableStatusType = (status: string | undefined): TagProps['type'] => {
  return status === "1" ? "success" : "danger";
};

// 日期格式化函数
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr || "-";
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr || dateTimeStr.length !== 14) return dateTimeStr || "-";
  return `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)} ${dateTimeStr.substring(8, 10)}:${dateTimeStr.substring(10, 12)}:${dateTimeStr.substring(12, 14)}`;
};

const formatDateForPicker = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.length !== 8) return "";
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
};

const formatDateTimeForPicker = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr || dateTimeStr.length !== 14) return "";
  return `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)} ${dateTimeStr.substring(8, 10)}:${dateTimeStr.substring(10, 12)}:${dateTimeStr.substring(12, 14)}`;
};

// 获取系统学校代码
const getSystemSchoolCodeData = async (): Promise<void> => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      queryParams.xxdm = response.data.data;
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

// 页面加载时获取数据
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
});
</script>

<style scoped>
/* 主容器样式 */
.ods-lxsxblsj-management {
  background-color: #f5f5f5;
}

/* 搜索卡片样式 */
.search-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.search-bar {
  :deep(.el-form) {
    .el-form-item {
      margin-bottom: 16px;
      margin-right: 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-form-item__label {
      font-weight: 500;
      color: #303133;
    }

    .el-input,
    .el-select,
    .el-date-picker {
      width: 200px;
    }
  }
}

/* 表格卡片样式 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  :deep(.el-card__body) {
    padding: 0;
  }
}

/* 表格头部样式 */
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      font-size: 14px;
      height: 32px;
      padding: 0 15px;
    }

    .el-divider--vertical {
      height: 20px;
      margin: 0 12px;
    }
  }

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    flex: 1;
    text-align: center;
  }

  .placeholder {
    width: 100px;
    display: flex;
    justify-content: flex-end;
  }
}

.table-body {
  margin-top: -10px;
  :deep(.el-table) {
    border-radius: 0;

    .el-table__header-wrapper {
      th {
        background-color: #f8f9fa;
        color: #606266;
        font-weight: 600;
        border-bottom: 1px solid #e4e7ed;
      }
    }

    .el-table__body-wrapper {
      tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;

  .total-info {
    font-size: 14px;
    color: #606266;
  }

  .pagination-controls {
    :deep(.el-pagination) {
      .el-pagination__total,
      .el-pagination__jump {
        color: #606266;
        font-size: 13px;
      }

      .el-pagination__sizes .el-select .el-input__wrapper {
        height: 28px;
      }

      .el-pager li {
        font-size: 13px;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
      }

      .el-pagination__jump .el-input__wrapper {
        height: 28px;
      }
    }
  }
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;

  .el-button {
    margin: 0 3px;
    padding: 0 5px;
    font-size: 14px;
  }
}

/* 弹窗样式 */
.professional-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 24px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :deep(.el-dialog__footer) {
    padding: 15px 24px 20px;
    border-top: 1px solid #e4e7ed;
  }
}

/* 统一表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 22px !important;
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body {
    padding: 24px 24px 32px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog__footer {
    padding: 20px 24px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

.dialog-footer {
  text-align: right;
}

/* 详情样式 */
.professional-detail {
  padding: 20px;
  
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 600;
      color: #303133;
      width: 160px;
      font-size: 14px;
      background-color: #fafafa;
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }

  .detail-value {
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
}

/* 按钮间距 */
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

/* 卡片样式 */
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}
</style>
