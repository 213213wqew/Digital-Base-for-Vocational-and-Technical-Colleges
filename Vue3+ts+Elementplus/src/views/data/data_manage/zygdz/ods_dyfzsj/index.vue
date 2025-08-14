<template>
  <div class="party-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="党组织名称" prop="dzzmc">
            <el-input
              v-model="queryParams.dzzmc"
              placeholder="请输入党组织名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="姓名" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="人员编号" prop="rybh">
            <el-input
              v-model="queryParams.rybh"
              placeholder="请输入人员编号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item class="search-buttons">
            <el-button type="primary" @click="handleQuery" style="margin-left: 8px;">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" style="margin-left: 8px;">
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">党员发展数据管理</div>
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
          :height="'calc(75vh - 160px)'"
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
            prop="dzzlxmText"
            label="党组织类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dzzmc"
            label="党组织名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dzzbh"
            label="党组织编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xdylxmText"
            label="新党员类型"
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
            prop="rybh"
            label="人员编号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="dyfzztmText"
            label="发展状态"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="cwjjfzrq"
            label="积极分子日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cwybdyrq"
            label="预备党员日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="cwzsdyrq"
            label="正式党员日期"
            min-width="120"
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
            prop="updateTime"
            label="更新时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 500px"
      class="party-development-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            
            <el-form-item label="党组织" prop="dzzmc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.dzzmc"
                filterable
                remote
                reserve-keyword
                placeholder="请输入党组织名称搜索"
                :remote-method="handleOrgSearch"
                :loading="orgSearchLoading"
                @change="handleOrgSelect"
                @clear="handleOrgClear"
                style="width: 100%"
                clearable
                value-key="label"
              >
                <el-option
                  v-for="item in orgOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.label"
                >
                  <div class="org-option-content">
                    <span class="org-name">{{ item.label }}</span>
                    <span class="org-code">({{ item.value }})</span>
                  </div>
                </el-option>
              </el-select>
              <el-tooltip content="数据来源于党组织情况基础数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            
            <el-form-item label="党组织编号" prop="dzzbh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
                v-model="form.dzzbh"
                placeholder="选择党组织后自动填充"
                :disabled="true"
                style="background-color: #f5f7fa;"
              />
              <el-tooltip content="数据来源于教师画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            
            <el-form-item label="党组织类型码" prop="dzzlxm">
               
              <el-select
                v-model="form.dzzlxm"
                placeholder="选择党组织后自动填充或手动选择"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.dzzlxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
             
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="新党员类型码" prop="xdylxm">
              <el-select
                v-model="form.xdylxm"
                placeholder="请选择新党员类型码"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.xdylxmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="姓名" prop="xm">
              <el-input
                v-model="form.xm"
                placeholder="请输入姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="人员编号" prop="rybh">
              <el-input
                v-model="form.rybh"
                placeholder="请输入人员编号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="党员发展状态码" prop="dyfzztm">
              <el-select
                v-model="form.dyfzztm"
                placeholder="请选择党员发展状态码"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.dyfzztmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="成为积极分子日期" prop="cwjjfzrq">
              <el-date-picker
                v-model="form.cwjjfzrq"
                type="date"
                placeholder="请选择成为积极分子日期"
                format="YYYYMMDD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="成为预备党员日期" prop="cwybdyrq">
              <el-date-picker
                v-model="form.cwybdyrq"
                type="date"
                placeholder="请选择成为预备党员日期"
                format="YYYYMMDD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="成为正式党员日期" prop="cwzsdyrq">
              <el-date-picker
                v-model="form.cwzsdyrq"
                type="date"
                placeholder="请选择成为正式党员日期"
                format="YYYYMMDD"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
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
      <div v-else class="party-development-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织类型">
            <div class="detail-value">{{ form.dzzlxmText || form.dzzlxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织名称">
            <div class="detail-value">{{ form.dzzmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="党组织编号">
            <div class="detail-value">{{ form.dzzbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="新党员类型">
            <div class="detail-value">{{ form.xdylxmText || form.xdylxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <div class="detail-value">{{ form.xm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="人员编号">
            <div class="detail-value">{{ form.rybh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="发展状态">
            <div class="detail-value">{{ form.dyfzztmText || form.dyfzztm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="积极分子日期">
            <div class="detail-value">{{ form.cwjjfzrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="预备党员日期">
            <div class="detail-value">{{ form.cwybdyrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="正式党员日期">
            <div class="detail-value">{{ form.cwzsdyrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ form.createTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ form.updateTime || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
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
import { ref, reactive, onMounted, computed } from "vue";
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

// API导入
import {
  getOdsDyfzsjPage,
  getOdsDyfzsjById,
  addOdsDyfzsj,
  updateOdsDyfzsj,
  deleteOdsDyfzsj,
  getDictOptions,
  searchOrgInfo,
  batchDeleteOdsDyfzsj,
  exportOdsDyfzsj,
  getSystemSchoolCode,
  type OdsDyfzsjInfo,
  type OdsDyfzsjQuery,
  type OdsDyfzsjForm,
  type OrgOption
} from "@/api-data/data/data_base/zygdz/ods_dyfzsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsDyfzsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增党员发展数据";
    case "edit":
      return "编辑党员发展数据";
    case "view":
      return "查看党员发展数据";
    default:
      return "党员发展数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsDyfzsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  dzzmc: "",
  xm: "",
  rybh: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsDyfzsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  dzzlxm: "",
  dzzmc: "",
  dzzbh: "",
  xdylxm: "",
  xm: "",
  rybh: "",
  dyfzztm: "",
  cwjjfzrq: "",
  cwybdyrq: "",
  cwzsdyrq: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);
// 系统学校代码
const systemSchoolCode = ref("");
// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 为空时通过验证
        } else if (value.length !== 32) {
          callback(new Error('唯一编码必须是32位'));
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          callback(new Error('只能包含大写字母和数字'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" }
  ],
  dzzmc: [
    { required: true, message: "请选择党组织", trigger: "change" },
    { max: 150, message: "党组织名称长度不能超过150位", trigger: "blur" }
  ],
  dzzbh: [
    { max: 60, message: "党组织编号长度不能超过60位", trigger: "blur" }
  ],
  xdylxm: [
    { required: true, message: "请选择新党员类型码", trigger: "change" }
  ],
  xm: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { max: 36, message: "姓名长度不能超过36位", trigger: "blur" }
  ],
  rybh: [
    { required: true, message: "请输入人员编号", trigger: "blur" },
    { max: 20, message: "人员编号长度不能超过20位", trigger: "blur" }
  ],
  dyfzztm: [
    { required: true, message: "请选择党员发展状态码", trigger: "change" }
  ],
  cwjjfzrq: [
    { required: true, message: "请选择成为积极分子日期", trigger: "change" }
  ],
  cwybdyrq: [
    { required: false, message: "请选择成为预备党员日期", trigger: "change" }
  ],
  cwzsdyrq: [
    { required: false, message: "请选择成为正式党员日期", trigger: "change" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ]
});

// 字典数据
const dictData = reactive({
  dzzlxmOptions: [], // 党组织类型码选项 - DZZLXDM
  xdylxmOptions: [], // 新党员类型码选项 - XDYLXDM
  dyfzztmOptions: [], // 党员发展状态码选项 - XDYFZZTDM
});

// 获取字典数据
const loadDictData = async () => {
  try {
    // 并行获取所有字典数据
    const [dzzlxmRes, xdylxmRes, dyfzztmRes] = await Promise.all([
      getDictOptions('DZZLXDM'), // 党组织类型代码
      getDictOptions('XDYLXDM'), // 新党员类型代码
      getDictOptions('XDYFZZTDM'), // 新党员发展状态代码
    ]);
    
    // 处理返回的数据
    if (dzzlxmRes.data.code === 200) {
      dictData.dzzlxmOptions = dzzlxmRes.data.data || [];
    }
    if (xdylxmRes.data.code === 200) {
      dictData.xdylxmOptions = xdylxmRes.data.data || [];
    }
    if (dyfzztmRes.data.code === 200) {
      dictData.dyfzztmOptions = dyfzztmRes.data.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
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

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsDyfzsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询党员发展数据失败:", error);
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
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsDyfzsjInfo) => {
  try {
    const response: any = await getOdsDyfzsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取党员发展数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsDyfzsjInfo) => {
  try {
    const response: any = await getOdsDyfzsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取党员发展数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsDyfzsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条党员发展数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsDyfzsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除党员发展数据失败:", error);
      ElMessage.error("删除失败");
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
      `确定要删除选中的 ${selectedIds.value.length} 条党员发展数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsDyfzsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除党员发展数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsDyfzsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `党员发展数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出党员发展数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsDyfzsj(form);
    } else {
      response = await updateOdsDyfzsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,  // 使用系统学校代码
    dzzlxm: "",
    dzzmc: "",
    dzzbh: "",
    xdylxm: "",
    xm: "",
    rybh: "",
    dyfzztm: "",
    cwjjfzrq: "",
    cwybdyrq: "",
    cwzsdyrq: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 行点击事件
const handleRowClick = () => {
  // 行点击逻辑
};

// 表格选择变化
const handleSelectionChange = (selection: OdsDyfzsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsDyfzsjInfo) => {
  handleView(row);
};

// 分页大小变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};
// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      // 设置查询参数和表单的学校代码
      queryParams.xxdm = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

// 党组织搜索相关
const orgSearchLoading = ref(false);
const orgOptions = ref<OrgOption[]>([]);

// 搜索党组织信息
const handleOrgSearch = async (query: string) => {
  if (query !== '') {
    orgSearchLoading.value = true;
    try {
      const res = await searchOrgInfo(query);
      if (res.data.code === 200) {
        orgOptions.value = res.data.data;
      } else {
        ElMessage.error(res.data.msg || '查询党组织信息失败');
      }
    } catch (error) {
      console.error('查询党组织信息失败:', error);
      ElMessage.error('查询党组织信息失败');
    } finally {
      orgSearchLoading.value = false;
    }
  } else {
    orgOptions.value = [];
  }
};

// 选择党组织
const handleOrgSelect = (selectedLabel: string) => {
  const selectedOrg = orgOptions.value.find(item => item.label === selectedLabel);
  if (selectedOrg) {
    form.dzzbh = selectedOrg.value;
    form.dzzmc = selectedOrg.label;
    form.dzzlxm = selectedOrg.dzzlxm;
  }
};

// 清除党组织选择
const handleOrgClear = () => {
  form.dzzbh = "";
  form.dzzmc = "";
  form.dzzlxm = "";
  orgOptions.value = [];
};

// 初始化加载部分党组织数据
const initOrgOptions = async () => {
  try {
    const res = await searchOrgInfo("");
    if (res.data.code === 200) {
      orgOptions.value = res.data.data.slice(0, 20); // 只显示前20条
    }
  } catch (error) {
    console.error('初始化党组织选项失败:', error);
  }
};

// 页面加载时获取字典数据
onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData(); // 获取字典数据
  getList();
 
});
</script>

<style scoped>
.party-development-management {
  padding: 0x;
}

.search-card {
  margin-bottom: 8px;
}

.search-bar {
  padding: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.search-buttons {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 8px;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-button) {
  height: 32px;
  padding: 8px 15px;
}

.table-card {
  margin-top: -10px;
 
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 2px;
}

.operation-buttons {
  display: flex;
  gap: 10px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.action-buttons {
  display: flex;
  gap: 2px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 2px 2px;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 新增样式 */
.party-development-dialog {
  border-radius: 8px;
}

.party-development-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}

.detail-value:empty::before {
  content: "-";
  color: #909399;
}

/* 表格行样式调整 */
:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

/* 对话框样式调整 */
:deep(.party-development-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.party-development-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.party-development-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.party-development-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.party-development-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

/* 表单样式调整 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

/* 按钮样式调整 */
:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}

/* Tag样式调整 */
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

.org-option-info {
  float: right;
  color: #8492a6;
  font-size: 13px;
}

.org-option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.org-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.org-code {
  color: #8492a6;
  font-size: 12px;
  margin-left: 8px;
  flex-shrink: 0;
}

/* 禁用状态的输入框样式 */
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
