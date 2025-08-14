<template>
  <div class="professional-certificate-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="证书号" prop="zsh">
            <el-input
              v-model="queryParams.zsh"
              placeholder="请输入证书号"
              clearable
            />
          </el-form-item>
          <el-form-item label="专业号" prop="zyh">
            <el-input
              v-model="queryParams.zyh"
              placeholder="请输入专业号"
              clearable
            />
          </el-form-item>
          <el-form-item label="证书名称" prop="zsmc">
            <el-input
              v-model="queryParams.zsmc"
              placeholder="请输入证书名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="发证机构" prop="fzjgmc">
            <el-input
              v-model="queryParams.fzjgmc"
              placeholder="请输入发证机构名称"
              clearable
            />
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
        <div class="header-title">1+X证书数据编码管理</div>
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
          :height="'calc(70vh - 100px)'"
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
            prop="zsh"
            label="证书号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyh"
            label="专业号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fzjgbm"
            label="发证机构编码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fzjgmc"
            label="发证机构名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsmc"
            label="证书名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="证书类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZslxText(row.zslx) }}
            </template>
          </el-table-column>
          <el-table-column
            label="证书等级"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZsdjText(row.zsdj) }}
            </template>
          </el-table-column>
          <el-table-column
            label="鉴定地点"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getJdddText(row.jddd) }}
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 540px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
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
                placeholder="系统自动获取中..."
                maxlength="10"
                readonly
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书号" prop="zsh">
              <el-input
                v-model="form.zsh"
                placeholder="请输入证书号"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业号" prop="zyh">
              <div style="display: flex; align-items: center; width: 100%"> 
              <el-select
                v-model="form.zyh"
                placeholder="请输入专业名称或代码"
                clearable
                filterable
                remote
                :remote-method="remoteMethodZyh"
                :loading="loadingZyh"
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.zyh"
                  :key="item.value"
                  :label="`${item.label} (${item.value})`"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip
                    content="专业号数据来源于专业建设情况数据子类表"
                    placement="top"
                  >
                    <el-icon
                      style="margin-left: 8px; cursor: help; color: #e6a23c"
                      ><InfoFilled
                    /></el-icon>
                  </el-tooltip>
                </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构编码" prop="fzjgbm">
              <el-input
                v-model="form.fzjgbm"
                placeholder="请输入发证机构编码"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发证机构名称" prop="fzjgmc">
              <el-input
                v-model="form.fzjgmc"
                placeholder="请输入发证机构名称"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书名称" prop="zsmc">
              <el-input
                v-model="form.zsmc"
                placeholder="请输入证书名称"
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书类型" prop="zslx">
              <el-select
                v-model="form.zslx"
                placeholder="请选择证书类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.zslx"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证书等级" prop="zsdj">
              <el-select
                v-model="form.zsdj"
                placeholder="请选择证书等级"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.zsdj"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="鉴定地点" prop="jddd">
              <el-select
                v-model="form.jddd"
                placeholder="请选择鉴定地点"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in selectOptions.jddd"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
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
          <el-col :span="24">
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
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="证书号">
            <div class="detail-value">{{ form.zsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="发证机构编码">
            <div class="detail-value">{{ form.fzjgbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="发证机构名称">
            <div class="detail-value">{{ form.fzjgmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="证书名称">
            <div class="detail-value">{{ form.zsmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="证书类型">
            <div class="detail-value">
              {{ getZslxText(form.zslx) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="证书等级">
            <div class="detail-value">
              {{ getZsdjText(form.zsdj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="鉴定地点">
            <div class="detail-value">
              {{ getJdddText(form.jddd) || "-" }}
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
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, toRefs } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElForm, FormRules } from "element-plus";

// API导入
import {
  getOdsGzxzssjPage,
  getOdsGzxzssjById,
  addOdsGzxzssj,
  updateOdsGzxzssj,
  deleteOdsGzxzssj,
  batchDeleteOdsGzxzssj,
  exportOdsGzxzssj,
  getSystemSchoolCode,
  getSelectOptions,
  getZyhOptions,
} from "@/api-code/code/code_base/zygxs/ods_gzxzssj";
import type { OdsGzxzssjInfo, OdsGzxzssjQuery } from "@/api-code/code/code_base/zygxs/ods_gzxzssj";

// 搜索条件
const queryParams = ref<OdsGzxzssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  zsh: "",
  zyh: "",
  fzjgbm: "",
  fzjgmc: "",
  zsmc: "",
  zslx: "",
  zsdj: "",
  jddd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsGzxzssjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedRows = ref<OdsGzxzssjInfo[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const loadingZyh = ref(false);
const state = reactive({
  form: {} as OdsGzxzssjInfo,
  rules: {
    zjsjwyxbs: [
      {
        validator: (_rule: any, value: any, callback: any) => {
          if (value) {
            if (value.length !== 32) {
              callback(new Error("主键数据唯一性标识必须为32位"));
            } else if (!/^[A-Z0-9]+$/.test(value)) {
              callback(new Error("唯一标识必须由大写字母和数字组成"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        },
        trigger: "blur",
      },
    ],
    xxdm: [
      { required: true, message: "学校代码为必填项", trigger: "blur" },
      { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    ],
    zsh: [
      { required: true, message: "证书号为必填项", trigger: "blur" },
      { max: 32, message: "证书号长度不能超过32位", trigger: "blur" },
    ],
    zyh: [{ max: 64, message: "专业号长度不能超过64位", trigger: "blur" }],
    fzjgbm: [
      { required: true, message: "发证机构编码为必填项", trigger: "blur" },
      { max: 60, message: "发证机构编码长度不能超过60位", trigger: "blur" },
    ],
    fzjgmc: [
      { required: true, message: "发证机构名称为必填项", trigger: "blur" },
      { max: 150, message: "发证机构名称长度不能超过150位", trigger: "blur" },
    ],
    zsmc: [
      { required: true, message: "证书名称为必填项", trigger: "blur" },
      { max: 80, message: "证书名称长度不能超过80位", trigger: "blur" },
    ],
    zslx: [{ required: true, message: "请选择证书类型", trigger: "change" }],
    zsdj: [{ required: true, message: "请选择证书等级", trigger: "change" }],
    jddd: [{ required: true, message: "请选择鉴定地点", trigger: "change" }],
    sjcjsj: [
      { required: true, message: "请选择数据采集时间", trigger: "change" },
    ],
    enableStatus: [
      { required: true, message: "请选择启用状态", trigger: "change" },
    ],
    bz: [{ max: 2000, message: "备注长度不能超过2000字符", trigger: "blur" }],
  } as FormRules,
  selectOptions: {
    zslx: [] as any[],
    zsdj: [] as any[],
    jddd: [] as any[],
    zyh: [] as any[],
  },
});
const { form, rules, selectOptions } = toRefs(state);
const formRef = ref<InstanceType<typeof ElForm>>();
const submitLoading = ref(false);

// 计算对话框标题
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增1+X证书数据";
    case "edit":
      return "编辑1+X证书数据";
    case "view":
      return "查看1+X证书数据";
    default:
      return "";
  }
});

// 证书类型选项
const zslxOptions = ref([
  { value: "1", label: "职业技能等级证书" },
  { value: "2", label: "职业资格证书" },
  { value: "3", label: "专业技术人员职业资格证书" },
  { value: "4", label: "技能人员职业资格证书" },
  { value: "99", label: "其他" },
]);

// 证书等级选项
const zsdjOptions = ref([
  { value: "1", label: "初级" },
  { value: "2", label: "中级" },
  { value: "3", label: "高级" },
  { value: "4", label: "技师" },
  { value: "5", label: "高级技师" },
  { value: "99", label: "其他" },
]);

// 鉴定地点选项
const jdddOptions = ref([
  { value: "1", label: "校内" },
  { value: "2", label: "校外" },
]);

// 获取证书类型文本
const getZslxText = (value?: string) => {
  if (!value) return "";
  const option = zslxOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取证书等级文本
const getZsdjText = (value?: string) => {
  if (!value) return "";
  const option = zsdjOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取鉴定地点文本
const getJdddText = (value?: string) => {
  if (!value) return "";
  const option = jdddOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "warning";
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

// 格式化显示时间
const formatDisplayTime = (timeStr?: string) => {
  if (!timeStr) return "";
  
  // 如果是 YYYYMMDD HHmmss 格式
  if (timeStr.length === 15) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(9, 11);
    const minute = timeStr.substring(11, 13);
    const second = timeStr.substring(13, 15);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  
  return timeStr;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsGzxzssjPage(queryParams.value);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询工作学习证书数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

// 获取学校代码并填充到表单
const fetchAndSetSchoolCode = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200 && response.data.data) {
      form.value.xxdm = response.data.data;
    } else {
      ElMessage.error("获取学校代码失败: " + response.data.msg);
    }
  } catch (error) {
    console.error("获取学校代码接口调用失败:", error);
    ElMessage.error("获取学校代码失败，请检查接口或网络");
  }
};

// 重置查询
const resetQuery = () => {
  Object.assign(queryParams.value, {
    zjsjwyxbs: "",
    xxdm: "",
    zsh: "",
    zyh: "",
    fzjgbm: "",
    fzjgmc: "",
    zsmc: "",
    zslx: "",
    zsdj: "",
    jddd: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  form.value = {} as OdsGzxzssjInfo;
  selectOptions.value.zyh = []; // 清空专业号选项
  formRef.value?.resetFields();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
  fetchAndSetSchoolCode(); // 在弹窗可见后获取并填充学校代码
};

// 编辑
const handleUpdate = async (row: OdsGzxzssjInfo) => {
  resetForm();
  dialogMode.value = "edit";
  try {
    const response: any = await getOdsGzxzssjById(row.id);
    if (response.data.code === 200) {
      form.value = response.data.data;

      // 预加载专业号选项以显示标签
      if (form.value.zyh) {
        await remoteMethodZyh(form.value.zyh);
      }

      // 获取最新的学校代码以覆盖记录中的值
      await fetchAndSetSchoolCode();
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取数据失败");
    }
  } catch (error) {
    console.error("获取工作学习证书数据详情失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看
const handleView = async (row: OdsGzxzssjInfo) => {
  resetForm();
  dialogMode.value = "view";
  try {
    const response: any = await getOdsGzxzssjById(row.id);
    if (response.data.code === 200) {
      form.value = response.data.data;
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取数据失败");
    }
  } catch (error) {
    console.error("获取工作学习证书数据详情失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsGzxzssjInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除证书号为"${row.zsh}"的工作学习证书数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await deleteOdsGzxzssj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除工作学习证书数据失败:", error);
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
      `确定要删除选中的 ${selectedRows.value.length} 条工作学习证书数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = selectedRows.value.map(row => row.id);
    const response: any = await batchDeleteOdsGzxzssj(ids);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedRows.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除工作学习证书数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsGzxzssj(queryParams.value);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `工作学习证书数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出工作学习证书数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择变化
const handleSelectionChange = (selection: OdsGzxzssjInfo[]) => {
  selectedRows.value = selection;
};

// 行点击
const handleRowClick = () => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsGzxzssjInfo) => {
  handleView(row);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.value.pageSize = size;
  queryParams.value.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.value.pageNum = page;
  getList();
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsGzxzssj(form.value);
    } else {
      response = await updateOdsGzxzssj(form.value);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response.data.msg ||
          (dialogMode.value === "add" ? "新增失败" : "修改失败"),
      );
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 获取下拉选项
const fetchSelectOptions = async () => {
  try {
    const resZslx = await getSelectOptions("ZSLXDM");
    if (resZslx.data.code === 200) {
      selectOptions.value.zslx = resZslx.data.data;
    }
    const resZsdj = await getSelectOptions("ZSDJDM");
    if (resZsdj.data.code === 200) {
      selectOptions.value.zsdj = resZsdj.data.data;
    }
    const resJddd = await getSelectOptions("JDDDDM");
    if (resJddd.data.code === 200) {
      selectOptions.value.jddd = resJddd.data.data;
    }
  } catch (error) {
    console.error("获取下拉选项失败:", error);
  }
};

/**
 * 获取专业号远程搜索
 * @param query
 */
const remoteMethodZyh = async (query: string) => {
  if (query) {
    loadingZyh.value = true;
    try {
      const response: any = await getZyhOptions(query);
      if (response.data.code === 200) {
        selectOptions.value.zyh = response.data.data;
      } else {
        selectOptions.value.zyh = [];
      }
    } catch (error) {
      console.error("获取专业号选项失败:", error);
      selectOptions.value.zyh = [];
    } finally {
      loadingZyh.value = false;
    }
  } else {
    selectOptions.value.zyh = [];
  }
};

// 页面加载
onMounted(() => {
  getList();
  handleQuery();
  fetchSelectOptions();
});
</script>

<style scoped>
.professional-certificate-management {
 
}

.search-card {
height: 70px;
 
}

.search-bar {
 padding: 0px 0px 0px 0px;
}

.table-card {
  margin-top: -10px;
  min-height: calc(75vh - 100px);
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
        height: 10px;
      }

      .el-pager li {
        font-size: 13px;
        min-width: 10px;
        height: 10px;
        line-height: 10px;
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

/* 搜索表单样式 */
.search-bar {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-input__wrapper) {
    height: 32px;
  }

  :deep(.el-select .el-input__wrapper) {
    height: 32px;
  }

  :deep(.el-button) {
    height: 32px;
    padding: 0 15px;
    font-size: 14px;
  }
}
</style>
