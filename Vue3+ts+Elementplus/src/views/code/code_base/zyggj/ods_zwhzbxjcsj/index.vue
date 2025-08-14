<template>
  <div class="cooperation-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="机构/项目名称" prop="hzbxmc">
            <el-input
              v-model="queryParams.hzbxmc"
              placeholder="请输入合作办学机构/项目名称"
              clearable
              style="width: 240px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="外方院校名称" prop="wfyxmc">
            <el-input
              v-model="queryParams.wfyxmc"
              placeholder="请输入外方院校名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="合作国家" prop="hzgjmc">
            <el-input
              v-model="queryParams.hzgjmc"
              placeholder="请输入合作国家名称"
              clearable
              style="width: 200px;"
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
        <div class="header-title">中外合作办学基础数据编码管理</div>
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
            prop="hzbxlbText"
            label="合作办学类别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hzbxmc"
            label="合作办学机构/项目名称"
            min-width="250"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="wfyxmc"
            label="外方院校名称"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="hzgjmc"
            label="合作国家"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kszymc"
            label="开设专业"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zxss"
            label="在校生数"
            min-width="100"
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
      width="1000px"
      :close-on-click-modal="false"
      append-to-body
      class="cooperation-dialog"
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
            <el-form-item label="合作办学类别" prop="hzbxlb">
              <el-select
                v-model="form.hzbxlb"
                placeholder="请选择合作办学类别"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in dictData.hzbxlbOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作国家代码" prop="hzgjdm">
              <el-input
                v-model="form.hzgjdm"
                placeholder="请输入合作国家代码"
                maxlength="6"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="合作办学机构/项目名称" prop="hzbxmc">
              <el-input
                v-model="form.hzbxmc"
                placeholder="请输入合作办学机构/项目名称"
                maxlength="350"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="外方院校名称" prop="wfyxmc">
              <el-input
                v-model="form.wfyxmc"
                placeholder="请输入外方院校名称"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作国家名称" prop="hzgjmc">
              <el-input
                v-model="form.hzgjmc"
                placeholder="请输入合作国家名称"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作国家所属大洲" prop="hzgjssdz">
              <el-input
                v-model="form.hzgjssdz"
                placeholder="请输入合作国家所属大洲"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="招生开始年份" prop="zsksnf">
              <el-date-picker
                v-model="form.zsksnf"
                type="year"
                placeholder="请选择招生开始年份"
                format="YYYY"
                value-format="YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="招生截止年份" prop="zsjznf">
              <el-date-picker
                v-model="form.zsjznf"
                type="year"
                placeholder="请选择招生截止年份"
                format="YYYY"
                value-format="YYYY"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="开办期数" prop="kbqs">
              <el-input-number
                v-model="form.kbqs"
                :min="0"
                :max="99"
                controls-position="right"
                style="width: 100%"
                placeholder="请输入开办期数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="每期招生人数" prop="mqzsrs">
              <el-input-number
                v-model="form.mqzsrs"
                :min="0"
                :max="99999999"
                controls-position="right"
                style="width: 100%"
                placeholder="请输入每期招生人数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="在校生数" prop="zxss">
              <el-input-number
                v-model="form.zxss"
                :min="0"
                :max="99999999"
                controls-position="right"
                style="width: 100%"
                placeholder="请输入在校生数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="开设专业号" prop="kszys">  
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.kszys"
                placeholder="请选择开设专业号"
                style="width: 100%"
                :remote-method="getZyOptionsData"
                filterable
                clearable
                remote
                @change="handleKszysChange"
                :loading="zyLoading"
              >
                <el-option v-for="option in zyOptions" :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
              <el-tooltip content="数据来源于专业数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px;">
            <el-form-item label="开设专业名称" prop="kszymc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.kszymc"
                placeholder="请选择开设专业名称"
                style="width: 100%"
                :remote-method="getZyOptionsData"
                filterable
                clearable
                remote
                @change="handleKszysChange"
                :loading="zyLoading"
              >
                <el-option v-for="option in zyOptions" :key="option.value" :label="option.label" :value="option.value" />
              </el-select>
              <el-tooltip content="数据来源于专业数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
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
      <div v-else class="cooperation-detail">
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
          <el-descriptions-item label="合作办学类别">
            <div class="detail-value">{{ form.hzbxlbText || form.hzbxlb || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="合作国家代码">
            <div class="detail-value">{{ form.hzgjdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="合作办学机构/项目名称" :span="2">
            <div class="detail-value">{{ form.hzbxmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="外方院校名称" :span="2">
            <div class="detail-value">{{ form.wfyxmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="合作国家名称">
            <div class="detail-value">{{ form.hzgjmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="合作国家所属大洲">
            <div class="detail-value">{{ form.hzgjssdz || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="招生开始年份">
            <div class="detail-value">{{ form.zsksnf || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="招生截止年份">
            <div class="detail-value">{{ form.zsjznf || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开办期数">
            <div class="detail-value">{{ form.kbqs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="每期招生人数">
            <div class="detail-value">{{ form.mqzsrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="在校生数">
            <div class="detail-value">{{ form.zxss || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开设专业号">
            <div class="detail-value">{{ form.kszys || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开设专业名称" :span="2">
            <div class="detail-value">{{ form.kszymc || "-" }}</div>
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
  getOdsZwhzbxjcsjPage,
  getOdsZwhzbxjcsjById,
  addOdsZwhzbxjcsj,
  updateOdsZwhzbxjcsj,
  deleteOdsZwhzbxjcsj,
  batchDeleteOdsZwhzbxjcsj,
  exportOdsZwhzbxjcsj,
  getDictOptions,
  getZyOptions,
  getSystemSchoolCode,
  type ZyOption,
  type OdsZwhzbxjcsjInfo,
  type OdsZwhzbxjcsjQuery,
  type OdsZwhzbxjcsjForm,
} from "@/api-code/code/code_base/zyggj/ods_zwhzbxjcsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsZwhzbxjcsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增中外合作办学基础数据";
    case "edit":
      return "编辑中外合作办学基础数据";
    case "view":
      return "查看中外合作办学基础数据";
    default:
      return "中外合作办学基础数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsZwhzbxjcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  hzbxlb: "",
  hzbxmc: "",
  wfyxmc: "",
  hzgjdm: "",
  hzgjmc: "",
  kszymc: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsZwhzbxjcsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  hzbxlb: "",
  hzbxmc: "",
  wfyxmc: "",
  hzgjdm: "",
  hzgjmc: "",
  hzgjssdz: "",
  zsksnf: "",
  zsjznf: "",
  kbqs: undefined,
  mqzsrs: undefined,
  zxss: undefined,
  kszys: "",
  kszymc: "",
  sjcjsj: "",
  enableStatus: "1",
});

const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);

// 系统学校代码
const systemSchoolCode = ref("");
// 专业选项
const zyOptions = ref<ZyOption[]>([]);
// 获取专业选项
const getZyOptionsData = async (keyword?: string) => {
  const response = await getZyOptions(keyword) as any;
   
  if (response.data.code === 200) {
    zyOptions.value = response.data.data;
  }
};

// 专业号改变
const handleKszysChange = (value: string) => {
  form.kszymc = zyOptions.value.find(item => item.value === value)?.zymc|| "";
  form.kszys = zyOptions.value.find(item => item.value === value)?.zyh || "";
  console.log("value", value);
};
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
  hzbxlb: [
    { required: true, message: "请选择合作办学类别", trigger: "change" }
  ],
  hzbxmc: [
    { required: true, message: "请输入合作办学机构/项目名称", trigger: "blur" },
    { max: 350, message: "长度不能超过350位", trigger: "blur" }
  ],
  wfyxmc: [
    { required: true, message: "请输入外方院校名称", trigger: "blur" },
    { max: 300, message: "长度不能超过300位", trigger: "blur" }
  ],
  hzgjdm: [
    { required: true, message: "请输入合作国家代码", trigger: "blur" },
    { max: 6, message: "长度不能超过6位", trigger: "blur" }
  ],
  hzgjmc: [
    { required: true, message: "请输入合作国家名称", trigger: "blur" },
    { max: 60, message: "长度不能超过60位", trigger: "blur" }
  ],
  hzgjssdz: [
    { required: true, message: "请输入合作国家所属大洲", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" }
  ],
  zsksnf: [
    { required: true, message: "请选择招生开始年份", trigger: "change" }
  ],
  zsjznf: [
    { required: true, message: "请选择招生截止年份", trigger: "change" }
  ],
  kbqs: [
    { required: true, message: "请输入开办期数", trigger: "blur" }
  ],
  mqzsrs: [
    { required: true, message: "请输入每期招生人数", trigger: "blur" }
  ],
  zxss: [
    { required: true, message: "请输入在校生数", trigger: "blur" }
  ],
  kszys: [
    { required: true, message: "请输入开设专业号", trigger: "blur" },
    { max: 64, message: "长度不能超过64位", trigger: "blur" }
  ],
  kszymc: [
    { required: true, message: "请输入开设专业名称", trigger: "blur" },
    { max: 60, message: "长度不能超过60位", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ]
});

// 字典数据
const dictData = reactive({
  hzbxlbOptions: [], // 中外合作办学类别代码选项
});

// 获取字典数据
const loadDictData = async () => {
  try {
    const [hzbxlbRes] = await Promise.all([
      getDictOptions('ZWHZBXLBDM') as any, // 中外合作办学类别代码
    ]);
    
    if (hzbxlbRes.data.code === 200) {
      dictData.hzbxlbOptions = hzbxlbRes.data.data || [];
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
    const response: any = await getOdsZwhzbxjcsjPage(queryParams);
    if (response.data.code === 200) {
      // 转换字典显示文本
      const transformedData = response.data.data.records.map((item: any) => ({
        ...item,
        hzbxlbText: getDictLabel(dictData.hzbxlbOptions, item.hzbxlb),
      }));
      dataList.value = transformedData;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询中外合作办学基础数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// 获取字典标签
const getDictLabel = (options: any[], value: any) => {
  const option = options.find(item => item.value == value);
  return option ? option.label : value;
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
  console.log("handleAdd called"); // 调试信息
  console.log("dialogVisible before:", dialogVisible.value); // 调试信息
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
  console.log("dialogVisible after:", dialogVisible.value); // 调试信息
  console.log("dialogMode:", dialogMode.value); // 调试信息
};

// 编辑
const handleEdit = async (row: OdsZwhzbxjcsjInfo) => {
  try {
    const response: any = await getOdsZwhzbxjcsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取中外合作办学基础数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsZwhzbxjcsjInfo) => {
  try {
    const response: any = await getOdsZwhzbxjcsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取中外合作办学基础数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsZwhzbxjcsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条中外合作办学基础数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsZwhzbxjcsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除中外合作办学基础数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条中外合作办学基础数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsZwhzbxjcsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除中外合作办学基础数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsZwhzbxjcsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `中外合作办学基础数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出中外合作办学基础数据失败:", error);
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
      response = await addOdsZwhzbxjcsj(form);
    } else {
      response = await updateOdsZwhzbxjcsj(form);
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
    xxdm: systemSchoolCode.value,
    hzbxlb: "",
    hzbxmc: "",
    wfyxmc: "",
    hzgjdm: "",
    hzgjmc: "",
    hzgjssdz: "",
    zsksnf: "",
    zsjznf: "",
    kbqs: undefined,
    mqzsrs: undefined,
    zxss: undefined,
    kszys: "",
    kszymc: "",
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
const handleSelectionChange = (selection: OdsZwhzbxjcsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsZwhzbxjcsjInfo) => {
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

// 页面加载时获取字典数据
onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<style scoped>
.cooperation-management {
  padding: 0;
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
.cooperation-dialog {
  border-radius: 8px;
}

.cooperation-detail {
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
:deep(.cooperation-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.cooperation-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.cooperation-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.cooperation-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.cooperation-dialog .el-dialog__body) {
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
