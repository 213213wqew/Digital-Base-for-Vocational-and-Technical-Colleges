<template>
  <div class="graduation-enrollment-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
            />
          </el-form-item>
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="姓名" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="学生类型" prop="xslxm">
            <el-select
              v-model="queryParams.xslxm"
              placeholder="请选择学生类型"
              clearable
            >
              <el-option
                v-for="item in studentTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
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
        <div class="header-title">毕业去向【升学】数据表</div>
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
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
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
            min-width="100"
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
            prop="xm"
            label="姓名"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="学生类型"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getStudentTypeText(row.xslxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="zyh"
            label="专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            label="专业名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="升学渠道"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getEnrollmentChannelText(row.sxqdm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="lqxxmc"
            label="录取学校"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="lqzymc"
            label="录取专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fs"
            label="分数"
            min-width="80"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="升学层次"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getEnrollmentLevelText(row.sxccm) }}
            </template>
          </el-table-column>
          <el-table-column
            label="硕士类型"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getMasterTypeText(row.sslxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sjcjsj"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
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
                  @click="handleUpdate(row)"
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 650px"
      class="enrollment-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填写，如填写需要符合32位大写字母和数字组合规则"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="请输入学校代码"
                maxlength="10"
                show-word-limit
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
      
              <el-select
              v-model="form.xh"
                placeholder="请输入学号关键字搜索"
                clearable
                filterable
                remote
                :remote-method="getStudentOptionsData"
                :loading="loading"
                @change="changeStudentOptions"
                style="width: 100%"
              >
                <el-option
                  v-for="item in studentOptions"
                  :key="item.xh"
                  :label="item.label"
                  :value="item.xh"
                />
                </el-select>
                <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
                </div>
             
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="姓名" prop="xm">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
                disabled
                v-model="form.xm"
                placeholder="请输入姓名"
                maxlength="36"
                show-word-limit
              />
              <el-tooltip content="数据来源于教师画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          
          <el-col :span="12" style="margin-bottom: 20px;">
              <el-form-item label="专业号" prop="zyh">
                <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                disabled
                v-model="form.zyh"
                placeholder="请输入专业号"
                maxlength="64"
                show-word-limit
              />
              <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="专业名称" prop="zymc">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-input
              disabled
                v-model="form.zymc"
                placeholder="请输入专业名称"
                maxlength="60"
                show-word-limit
              />
              <el-tooltip content="数据来源于学生画像数据表" placement="top"></el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="学生类型" prop="xslxm">
              <el-select
                v-model="form.xslxm"
                placeholder="请选择学生类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in studentTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="升学渠道" prop="sxqdm">
              <el-select
                v-model="form.sxqdm"
                placeholder="请选择升学渠道"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in enrollmentChannelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="升学层次" prop="sxccm">
              <el-select
                v-model="form.sxccm"
                placeholder="请选择升学层次"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in enrollmentLevelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="录取学校名称" prop="lqxxmc">
              <el-input
                v-model="form.lqxxmc"
                placeholder="请输入录取学校名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="录取专业名称" prop="lqzymc">
              <el-input
                v-model="form.lqzymc"
                placeholder="请输入录取专业名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="分数" prop="fs">
              <el-input-number
                v-model="form.fs"
                placeholder="请输入分数"
                :min="0"
                :precision="1"
                :max="999.9"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="硕士类型" prop="sslxm">
              <el-select
                v-model="form.sslxm"
                placeholder="请选择硕士类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in masterTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="24" style="margin-bottom: 20px;">
            <el-form-item label="备注" prop="bz">
              <el-input
                v-model="form.bz"
                type="textarea"
                :rows="3"
                placeholder="请输入备注信息（可选，最多2000字符）"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
              >
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="enrollment-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <div class="detail-value">{{ form.xm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学生类型">
            <div class="detail-value">
              {{ getStudentTypeText(form.xslxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业名称" :span="2">
            <div class="detail-value">{{ form.zymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="升学渠道">
            <div class="detail-value">
              {{ getEnrollmentChannelText(form.sxqdm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="升学层次">
            <div class="detail-value">
              {{ getEnrollmentLevelText(form.sxccm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="录取学校" :span="2">
            <div class="detail-value">{{ form.lqxxmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="录取专业" :span="2">
            <div class="detail-value">{{ form.lqzymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="分数">
            <div class="detail-value">{{ form.fs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="硕士类型">
            <div class="detail-value">
              {{ getMasterTypeText(form.sslxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">
            <div class="detail-value">{{ form.bz || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormRules, FormItemRule } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  View,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
  getOdsByqxsxsjPage,
  getOdsByqxsxsjById,
  addOdsByqxsxsj,
  updateOdsByqxsxsj,
  deleteOdsByqxsxsj,
  batchDeleteOdsByqxsxsj,
  exportOdsByqxsxsj,
  getStudentTypeOptions,
  getSystemSchoolCode,
  getEnrollmentChannelOptions,
  getEnrollmentLevelOptions,
  getMasterTypeOptions,
  getStudentOptions,
  type StudentOption,
  type OdsByqxsxsjInfo,
  type OdsByqxsxsjQuery,
  type OdsByqxsxsjForm,
  type DictOption,
  type OdsByqxsxsjPageResult
} from "@/api-data/data/data_base/zygxs/ods_byqxsxsj";
 
// 修改表单类型，添加bz字段
interface ExtendedForm extends OdsByqxsxsjForm {
  bz?: string;
}

// 响应式数据
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsByqxsxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xm: "",
  xslxm: "",
  sxqdm: "",
  lqxxmc: "",
  sxccm: "",
  sslxm: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsByqxsxsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsByqxsxsjInfo[]>([]);
const systemSchoolCode = ref<string>("");
const studentOptions =  ref<StudentOption[]>([]);
// 对话框相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<ExtendedForm>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xm: "",
  xslxm: "",
  zyh: "",
  zymc: "",
  sxqdm: "",
  lqxxmc: "",
  lqzymc: "",
  fs: undefined,
  sxccm: "",
  sslxm: "",
  sjcjsj: "",
  enableStatus: "1",
  bz: "",
});

// 字典选项
const studentTypeOptions = ref<DictOption[]>([]);
const enrollmentChannelOptions = ref<DictOption[]>([]);
const enrollmentLevelOptions = ref<DictOption[]>([]);
const masterTypeOptions = ref<DictOption[]>([]);

// 修改验证规则类型
const rules = reactive<FormRules>({
  zjsjwyxbs: [
    {
      validator: (_rule: any, value: string, callback: any) => {
        if (!value || value.trim() === '') {
          callback(); // 允许为空
        } else if (value.length !== 32) {
          callback(new Error('唯一编码必须为32位字符'));
        } else if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error('唯一编码只能包含大写字母和数字'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    
  ],
  xh: [
    { required: true, message: "学号不能为空", trigger: "blur" },
    { max: 20, message: "学号不能超过20个字符", trigger: "blur" }
  ],
  xm: [
    { required: false, message: "姓名可以为空", trigger: "blur" },
    { max: 36, message: "姓名不能超过36个字符", trigger: "blur" }
  ],
  xslxm: [
    { required: true, message: "请选择学生类型", trigger: "change" },
   
  ],
  zyh: [
    { required: true, message: "专业号不能为空", trigger: "blur" },
    { max: 64, message: "专业号不能超过64个字符", trigger: "blur" }
  ],
  zymc: [
    { required: true, message: "专业名称不能为空", trigger: "blur" },
    { max: 60, message: "专业名称不能超过60个字符", trigger: "blur" }
  ],
  sxqdm: [
    { required: true, message: "请选择升学渠道", trigger: "change" },
    
  ],
  lqxxmc: [
    { required: true, message: "录取学校名称不能为空", trigger: "blur" },
    { max: 60, message: "录取学校名称不能超过60个字符", trigger: "blur" }
  ],
  lqzymc: [
    { required: false, message: "录取专业名称可以为空", trigger: "blur" },
    { max: 60, message: "录取专业名称不能超过60个字符", trigger: "blur" }
  ],
  fs: [
    { required: false, message: "分数可以为空", trigger: "blur" },
    { type: "number", message: "分数必须为数字", trigger: "blur" }
  ] as FormItemRule[],
  sxccm: [
    { required: false, message: "升学层次可以为空", trigger: "change" },
    
  ],
  sslxm: [
    { required: false, message: "硕士类型可以为空", trigger: "change" },
    
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "blur" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD HHMMSS", trigger: "blur" }
  ]
});

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增毕业去向【升学】数据",
    edit: "编辑毕业去向【升学】数据",
    view: "查看毕业去向【升学】数据详情",
  };
  return titleMap[dialogMode.value];
});

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsByqxsxsjPage(queryParams) as any;
    if (response.data.data) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    }
  } catch (error) {
    console.error("查询失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 查询
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xm: "",
    xslxm: "",
    sxqdm: "",
    lqxxmc: "",
    sxccm: "",
    sslxm: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsByqxsxsjInfo) => {
  try {
    const response = await getOdsByqxsxsjById(row.id) as any;
    Object.assign(form, response);
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看
const handleView = async (row: OdsByqxsxsjInfo) => {
  try {
    const response = await getOdsByqxsxsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsByqxsxsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const result = await deleteOdsByqxsxsj(row.id);
    if (result) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error("删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的记录");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const ids = selectedRows.value.map((item) => item.id);
    const result = await batchDeleteOdsByqxsxsj(ids);
    if (result) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error("批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};
//获取学号学生姓名选项列表
const getStudentOptionsData = async (value: string) => {
  
  const response = await getStudentOptions(value) as any;
  studentOptions.value = response.data.data || [];
};
//学号选择改变时，获取学生姓名
const changeStudentOptions = (value: string) => {
  form.xh = value;
  form.xm = studentOptions.value.find(item => item.xh === value)?.xsxm||"";
  form.zyh = studentOptions.value.find(item => item.xh === value)?.zyh || "";
form.zymc =studentOptions.value.find(item => item.xh === value)?.zymc||"";
 
};

// 导出
const handleExport = async () => {
  try {
    await ElMessageBox.confirm("确定要导出数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "info",
    });

    loading.value = true;
    ElMessage.info("正在导出，请稍候...");
    
    const response = await exportOdsByqxsxsj(queryParams) as any;
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = `毕业去向升学数据_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    ElMessage.success("导出成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("导出失败:", error);
      ElMessage.error("导出失败");
    }
  } finally {
    loading.value = false;
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsByqxsxsjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsByqxsxsjInfo) => {
  // 行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsByqxsxsjInfo) => {
  handleView(row);
};

// 分页
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    if (dialogMode.value === "add") {
      const result = await addOdsByqxsxsj(form);
      if (result) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error("新增失败");
      }
    } else if (dialogMode.value === "edit") {
      const result = await updateOdsByqxsxsj(form);
      if (result) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error("修改失败");
      }
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败");
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xm: "",
    xslxm: "",
    zyh: "",
    zymc: "",
    sxqdm: "",
    lqxxmc: "",
    lqzymc: "",
    fs: undefined,
    sxccm: "",
    sslxm: "",
    sjcjsj: "",
    enableStatus: "1",
    bz: "",
  });
  formRef.value?.clearValidate();
};

// 修改字典文本转换函数
const getStudentTypeText = (value: string | undefined): string => {
  if (!value) return "";
  const option = studentTypeOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

const getEnrollmentChannelText = (value: string | undefined): string => {
  if (!value) return "";
  const option = enrollmentChannelOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

const getEnrollmentLevelText = (value: string | undefined): string => {
  if (!value) return "";
  const option = enrollmentLevelOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

const getMasterTypeText = (value: string | undefined): string => {
  if (!value) return "";
  const option = masterTypeOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 状态标签类型
const getReportStatusTagType = (status: string): "success" | "warning" | "info" | "danger" => {
  const statusMap: Record<string, "success" | "warning" | "info" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "warning",
    "3": "danger",
  };
  return statusMap[status] || "info";
};

const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "待审核",
    "3": "已拒绝",
  };
  return statusMap[status] || "未知";
};

// 时间格式化
const formatDisplayTime = (time: string | undefined): string => {
  if (!time) return "";
  // 如果是 YYYYMMDD HHmmss 格式，转换为 YYYY-MM-DD HH:mm:ss
  if (time.length === 15) {
    const year = time.substring(0, 4);
    const month = time.substring(4, 6);
    const day = time.substring(6, 8);
    const hour = time.substring(9, 11);
    const minute = time.substring(11, 13);
    const second = time.substring(13, 15);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return time;
};

// 修改字典选项处理
const initDictOptions = async () => {
  try {
    const [
      studentTypeResponse,
      enrollmentChannelResponse,
      enrollmentLevelResponse,
      masterTypeResponse,
    ] = await Promise.all([
      getStudentTypeOptions() as any,
      getEnrollmentChannelOptions() as any,
      getEnrollmentLevelOptions() as any,
      getMasterTypeOptions() as any,
    ]);

    studentTypeOptions.value = studentTypeResponse.data.data || [];
    enrollmentChannelOptions.value = enrollmentChannelResponse.data.data || [];
    enrollmentLevelOptions.value = enrollmentLevelResponse.data.data || [];
    masterTypeOptions.value = masterTypeResponse.data.data || [];
  } catch (error) {
    console.error("获取字典选项失败:", error);
  }
};
//获取学校代码
const getSystemSchoolCodeDate= async () => {
  const response = await getSystemSchoolCode() as any;
  systemSchoolCode.value = response.data.data;
};

// 组件挂载
onMounted(() => {
  getSystemSchoolCodeDate();
  getList();
  initDictOptions();
});
</script>

<style scoped>
.graduation-enrollment-management {
 
 
}

.search-card {
  margin-bottom: 0px;
  border-radius: 8px;
}

.search-bar {
  background: #fafafa;
  padding: 16px;
  border-radius: 6px;
}

.search-bar .el-form-item {
  margin-bottom: 0;
}

.table-card {
margin-top: -10px;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 16px;
  flex: 2;
  text-align: center;
}

.placeholder {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.table-body {
  background: white;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 2px;
  justify-content: center;
}

.action-buttons .el-button {
  padding: 2px 4px;
  font-size: 12px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
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

.enrollment-dialog {
  border-radius: 8px;
}

.enrollment-dialog .el-dialog__header {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

.enrollment-dialog .el-dialog__title {
  color: white;
  font-weight: 600;
}

.enrollment-detail {
  padding: 20px;
}

.detail-descriptions {
  margin-top: 16px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0 10px;
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 4px;
}

:deep(.el-table th) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-weight: 500;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table td) {
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: var(--el-fill-color-lighter);
}

:deep(.el-table__row:hover td) {
  background-color: var(--el-fill-color) !important;
}

/* 状态标签样式 */
:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
}

/* 表单标签样式 */
:deep(.el-form-item__label) {
  font-weight: normal;
  color: var(--el-text-color-regular);
}

/* 输入框样式 */
:deep(.el-input__inner),
:deep(.el-textarea__inner) {
  border-radius: 4px;
}

:deep(.el-input__inner:focus),
:deep(.el-textarea__inner:focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 1px var(--el-color-primary-light-8);
}

/* 选择器样式 */
:deep(.el-select) {
  width: 100%;
}

/* 按钮样式 */
 

/* 表格中的操作按钮样式 */
.action-buttons {
  .el-button.el-button--link {
    margin: 0 4px;
    padding: 2px 4px;
    font-size: 12px;

    .el-icon {
      margin-right: 4px;
    }
  }
}

/* Tab样式 */
:deep(.el-tabs__header) {
  margin-bottom: 20px;
}

:deep(.el-tabs__item) {
  color: var(--el-text-color-regular);
}

:deep(.el-tabs__item.is-active) {
  color: var(--el-color-primary);
}

:deep(.el-tabs__active-bar) {
  background-color: var(--el-color-primary);
}

/* 描述列表样式 */
:deep(.el-descriptions) {
  border-radius: 4px;
}

:deep(.el-descriptions__header) {
  padding: 12px 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  color: var(--el-text-color-primary);
}

:deep(.el-descriptions__body) {
  background: var(--el-bg-color);
}

:deep(.el-descriptions-item__label) {
  color: var(--el-text-color-regular);
}

:deep(.el-descriptions-item__content) {
  color: var(--el-text-color-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .graduation-enrollment-management {
    padding: 8px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .operation-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .header-title {
    text-align: center;
    margin: 8px 0;
  }
  
  .pagination-wrapper {
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }
}

/* 动画效果 */
.enrollment-dialog {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 滚动条样式 */
:deep(.el-table__body-wrapper)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-thumb:hover {
  background: var(--el-border-color-darker);
}

:deep(.el-table__body-wrapper)::-webkit-scrollbar-track {
  background: var(--el-fill-color-lighter);
  border-radius: 3px;
}
</style>
