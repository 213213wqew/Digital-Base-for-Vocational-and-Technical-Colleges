<template>
  <div class="textbook-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="教材名称" prop="jcmc">
            <el-input
              v-model="queryParams.jcmc"
              placeholder="请输入教材名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="出版社" prop="cbs">
            <el-input
              v-model="queryParams.cbs"
              placeholder="请输入出版社"
              clearable
            />
          </el-form-item>
          <el-form-item label="作者" prop="zz">
            <el-input
              v-model="queryParams.zz"
              placeholder="请输入作者"
              clearable
            />
          </el-form-item>
          <el-form-item >
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
        <div class="header-title">教材基本数据子类表</div>
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
            prop="jcbh"
            label="教材编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jcmc"
            label="教材名称"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="jclxmText"
            label="教材类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="cbs"
            label="出版社"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zz"
            label="作者"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dj"
            label="定价"
            width="80"
            align="right"
            sortable="custom"
          >
            <template #default="{ row }">
              <span v-if="row.dj">{{ row.dj.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sfgjghjcText"
            label="国家规划教材"
            width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus || '')"
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 600px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                readonly
                disabled
              >
                <template #suffix>
                  <el-tooltip content="学校代码由系统自动获取，无需手动输入" placement="top">
                    <el-icon class="el-input__icon"><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版号" prop="cbh">
              <el-input
                v-model="form.cbh"
                placeholder="ISBN等标准出版号（必填）"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教材编号" prop="jcbh">
              <el-input
                v-model="form.jcbh"
                placeholder="请输入教材编号（必填）"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教材名称" prop="jcmc">
              <el-input
                v-model="form.jcmc"
                placeholder="请输入教材名称（必填）"
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教材类型码" prop="jclxm">
              <el-select
                v-model="form.jclxm"
                placeholder="请选择教材类型码（必填）"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="option in jclxmOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="zz">
              <el-input
                v-model="form.zz"
                placeholder="包括编者和著者，多个用逗号隔开（必填）"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版次" prop="bc">
              <el-input
                v-model="form.bc"
                placeholder="请输入版次（可选）"
                maxlength="30"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="cbs">
              <el-input
                v-model="form.cbs"
                placeholder="多个出版社用逗号隔开（可选）"
                maxlength="180"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="编著者总数" prop="bzzzs">
              <el-input-number
                v-model="form.bzzzs"
                :min="0"
                :max="99999999"
                placeholder="请输入编著者总数（可选）"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类号" prop="flh">
              <el-input
                v-model="form.flh"
                placeholder="按《中国图书馆分类法》分类（可选）"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版日期" prop="cbrq">
              <el-date-picker
                v-model="form.cbrq"
                type="date"
                placeholder="格式：YYYYMMDD（可选）"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定价" prop="dj">
              <el-input-number
                v-model="form.dj"
                :min="0"
                :precision="2"
                placeholder="单位：元（可选）"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规划教材批次" prop="ghjcpc">
              <el-input
                v-model="form.ghjcpc"
                placeholder="例如：十三五规划（可选）"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="国家规划教材" prop="sfgjghjc">
              <el-select
                v-model="form.sfgjghjc"
                placeholder="请选择是否国家规划教材（可选）"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="option in sfgjghjcOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="校企合作教材" prop="sfxqhzkfjc">
              <el-select
                v-model="form.sfxqhzkfjc"
                placeholder="请选择是否校企合作开发教材（必填）"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="option in sfxqhzkfjcOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="格式：YYYYMMDD hhmmss（必填）"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
      <div v-else class="textbook-detail">
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
          <el-descriptions-item label="教材编号">
            <div class="detail-value">{{ form.jcbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教材名称">
            <div class="detail-value">{{ form.jcmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教材类型">
            <div class="detail-value">
              {{ getJclxmText(form.jclxm || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="版次">
            <div class="detail-value">{{ form.bc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="出版号">
            <div class="detail-value">{{ form.cbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="出版社">
            <div class="detail-value">{{ form.cbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="作者">
            <div class="detail-value">{{ form.zz || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="出版日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.cbrq || "") || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="定价">
            <div class="detail-value">{{ form.dj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="国家规划教材">
            <el-tag
              :type="form.sfgjghjc === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sfgjghjc === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="校企合作教材">
            <el-tag
              :type="form.sfxqhzkfjc === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sfxqhzkfjc === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj || "") || "-" }}
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsJcjbsjPage,
  getOdsJcjbsjById,
  addOdsJcjbsj,
  updateOdsJcjbsj,
  deleteOdsJcjbsj,
  batchDeleteOdsJcjbsj,
  exportOdsJcjbsj,
  getSystemSchoolCode,
  type OdsJcjbsjInfo,
  type OdsJcjbsjQuery,
  type OdsJcjbsjForm,
} from "@/api/meta/meta_base/zygjx/ods_jcjbsj";

// 字典接口导入
import { getDictOptions } from "@/api/meta/meta_base/zygxx/ods_xxjbsj";

// 搜索条件
const queryParams = reactive<OdsJcjbsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  jcbh: "",
  jcmc: "",
  jclxm: "",
  cbs: "",
  zz: "",
  sfgjghjc: "",
  sfxqhzkfjc: "",
  reportStatus: "",
  enableStatus: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsJcjbsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsJcjbsjInfo[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增教材基本数据";
  if (dialogMode.value === "edit") return "编辑教材基本数据";
  return "查看教材基本数据详情";
});

const form = reactive<OdsJcjbsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  cbh: "",
  jcbh: "",
  jcmc: "",
  jclxm: "",
  bc: "",
  cbs: "",
  bzzzs: undefined,
  cbrq: "",
  zz: "",
  flh: "",
  dj: undefined,
  sfgjghjc: "",
  ghjcpc: "",
  sfxqhzkfjc: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 字典数据
const jclxmOptions = ref<Array<{label: string, value: string}>>([]);
const sfgjghjcOptions = ref<Array<{label: string, value: string}>>([]);
const sfxqhzkfjcOptions = ref<Array<{label: string, value: string}>>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单验证规则
const formRules = reactive({
  // 主键数据唯一性标识（可选，后端自动生成）
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value && value.trim()) {
          if (!/^[A-Z0-9]{32}$/.test(value.trim())) {
            callback(new Error('主键数据唯一性标识必须为32位大写字母和数字组合'));
          }
        }
        callback();
      }, 
      trigger: "blur" 
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空，请检查系统配置", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    { 
      pattern: /^\d{10}$/, 
      message: "学校代码必须为10位数字", 
      trigger: "blur" 
    },
  ],
  cbh: [
    { required: true, message: "请输入出版号", trigger: "blur" },
    { max: 30, message: "出版号长度不能超过30位", trigger: "blur" },
  ],
  jcbh: [
    { required: true, message: "请输入教材编号", trigger: "blur" },
    { max: 60, message: "教材编号长度不能超过60位", trigger: "blur" },
  ],
  jcmc: [
    { required: true, message: "请输入教材名称", trigger: "blur" },
    { max: 80, message: "教材名称长度不能超过80位", trigger: "blur" },
  ],
  jclxm: [
    { required: true, message: "请选择教材类型码", trigger: "change" },
    { max: 2, message: "教材类型码长度不能超过2位", trigger: "blur" },
  ],
  zz: [
    { required: true, message: "请输入作者", trigger: "blur" },
    { max: 100, message: "作者长度不能超过100位", trigger: "blur" },
  ],
  sfxqhzkfjc: [
    { required: true, message: "请选择是否校企合作开发教材", trigger: "change" },
    { max: 1, message: "是否校企合作开发教材长度不能超过1位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "blur" },
    { max: 15, message: "数据采集时间长度不能超过15位", trigger: "blur" },
  ],
  
  // 可选字段（O标记）
  bc: [{ max: 30, message: "版次长度不能超过30位", trigger: "blur" }],
  cbs: [{ max: 180, message: "出版社长度不能超过180位", trigger: "blur" }],
  bzzzs: [
    { validator: (rule: any, value: any, callback: any) => {
        if (value !== null && value !== undefined && value !== '') {
          if (!Number.isInteger(value) || value < 0) {
            callback(new Error('编著者总数必须为非负整数'));
          } else if (value > 99999999) {
            callback(new Error('编著者总数不能超过8位'));
          }
        }
        callback();
      }, trigger: "blur" 
    },
  ],
  cbrq: [{ max: 8, message: "出版日期长度不能超过8位", trigger: "blur" }],
  flh: [{ max: 32, message: "分类号长度不能超过32位", trigger: "blur" }],
  dj: [
    { validator: (rule: any, value: any, callback: any) => {
        if (value !== null && value !== undefined && value !== '') {
          if (isNaN(value) || value < 0) {
            callback(new Error('定价必须为非负数字'));
          }
        }
        callback();
      }, trigger: "blur" 
    },
  ],
  sfgjghjc: [
    { max: 1, message: "是否国家规划教材长度不能超过1位", trigger: "blur" },
  ],
  ghjcpc: [
    { max: 60, message: "规划教材批次长度不能超过60位", trigger: "blur" },
  ],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsJcjbsjPage(queryParams) as any; 
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询教材基本数据失败:", error);
    ElMessage.error("查询失败");
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
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: "",
    jcbh: "",
    jcmc: "",
    jclxm: "",
    cbs: "",
    zz: "",
    sfgjghjc: "",
    sfxqhzkfjc: "",
    reportStatus: "",
    enableStatus: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsJcjbsjInfo) => {
  try {
    const response = await getOdsJcjbsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取教材基本数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsJcjbsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条教材基本数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsJcjbsj(row.id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除教材基本数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 条教材基本数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = selectedRows.value.map(row => row.id);
    const response = await batchDeleteOdsJcjbsj(ids);
    if (response) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error("批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除教材基本数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsJcjbsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教材基本数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出教材基本数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 查看详情
const handleView = async (row: OdsJcjbsjInfo) => {
  try {
    const response = await getOdsJcjbsjById(row.id) as any;
    Object.assign(form, response.data.data);
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    console.error("获取教材基本数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsJcjbsjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = (row: OdsJcjbsjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsJcjbsjInfo) => {
  handleView(row);
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    cbh: "",
    jcbh: "",
    jcmc: "",
    jclxm: "",
    bc: "",
    cbs: "",
    bzzzs: undefined,
    cbrq: "",
    zz: "",
    flh: "",
    dj: undefined,
    sfgjghjc: "",
    ghjcpc: "",
    sfxqhzkfjc: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response;
    if (dialogMode.value === "add") {
      response = await addOdsJcjbsj(form);
    } else {
      response = await updateOdsJcjbsj(form);
    }

    if (response) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error(dialogMode.value === "add" ? "新增失败" : "修改失败");
  } finally {
    submitLoading.value = false;
  }
};

// 获取教材类型文本
const getJclxmText = (jclxm: string) => {
  const options = {
    "01": "纸质教材",
    "02": "数字教材", 
    "03": "活页式教材",
    "04": "工作手册式教材",
    "05": "融媒体教材"
  };
  return options[jclxm as keyof typeof options] || jclxm;
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const options = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败"
  };
  return options[status as keyof typeof options] || status;
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  const types = {
    "0": "info",
    "1": "success", 
    "2": "danger"
  };
  return types[status as keyof typeof types] || "info";
};

// 格式化显示时间
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "";
  if (timeStr.length === 8) {
    // YYYYMMDD格式
    return `${timeStr.substring(0, 4)}-${timeStr.substring(4, 6)}-${timeStr.substring(6, 8)}`;
  } else if (timeStr.length === 15) {
    // YYYYMMDD HHmmss格式
    return `${timeStr.substring(0, 4)}-${timeStr.substring(4, 6)}-${timeStr.substring(6, 8)} ${timeStr.substring(9, 11)}:${timeStr.substring(11, 13)}:${timeStr.substring(13, 15)}`;
  }
  return timeStr;
};

// 加载字典数据
const loadDictData = async () => {
  try {
    // 获取教材类型代码字典 (JCLXDM)
    const jclxdmRes: any = await getDictOptions("JCLXDM");

      jclxmOptions.value = jclxdmRes.data.data;


    // 获取是否标志代码字典 (SFBZDM)
    const sfbzdmRes: any = await getDictOptions("SFBZDM");
    if (sfbzdmRes.data.data) {
      sfgjghjcOptions.value = sfbzdmRes.data.data;
      sfxqhzkfjcOptions.value = sfbzdmRes.data.data;
    } else {
      // 设置默认选项
      sfgjghjcOptions.value = [
        { label: "否", value: "0" },
        { label: "是", value: "1" }
      ];
      sfxqhzkfjcOptions.value = [
        { label: "否", value: "0" },
        { label: "是", value: "1" }
      ];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
    // 设置默认选项
    jclxmOptions.value = [
      { label: "纸质教材", value: "01" },
      { label: "数字教材", value: "02" },
      { label: "活页式教材", value: "03" },
      { label: "工作手册式教材", value: "04" },
      { label: "融媒体教材", value: "05" }
    ];
    sfgjghjcOptions.value = [
      { label: "否", value: "0" },
      { label: "是", value: "1" }
    ];
    sfxqhzkfjcOptions.value = [
      { label: "否", value: "0" },
      { label: "是", value: "1" }
    ];
  }
};

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn("获取系统学校代码失败:", response.data.msg);
      ElMessage.warning("获取系统学校代码失败，请手动输入");
    }
  } catch (error) {
    console.error("获取系统学校代码异常:", error);
    ElMessage.warning("获取系统学校代码失败，请手动输入");
  }
};

// 页面加载
onMounted(() => {
  loadDictData();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped>
.textbook-management {

}

/* 搜索区域样式 */
.search-card {
 
 
  height: 60px;

  
}

.search-bar {
 height: 60px;
}

/* 表格卡片样式 */
.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: -10px;

  :deep(.el-card__body) {
    padding: 0;
  }
}

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
.textbook-detail {
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
