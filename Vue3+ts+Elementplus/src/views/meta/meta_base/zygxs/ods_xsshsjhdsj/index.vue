<template>
  <div class="student-practice-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
           
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="实践单位" prop="sjdw">
            <el-input
              v-model="queryParams.sjdw"
              placeholder="请输入实践单位"
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
        <div class="header-title">学生社会实践活动数据管理</div>
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
            prop="sjdw"
            label="实践单位"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjdd"
            label="实践地点"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjxm"
            label="实践项目"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjnr"
            label="实践内容"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjqsrq"
            label="实践起始日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjzzrq"
            label="实践终止日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjlbm"
            label="实践类别"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getSjlbmText(row.sjlbm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sjcg"
            label="实践成果"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zdjsgh"
            label="指导教师工号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjpj"
            label="实践评价"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="130"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            min-width="100"
            align="center"
            sortable="custom"
          >
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 680px"
      class="practice-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
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
          <el-col :span="12">
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
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select v-model="form.xh" 
                placeholder="请输入学号/姓名关键字搜索"
                clearable
                filterable
                remote
                :remote-method="getOdsXshxsjStudentOptionsData"
                :loading="loading"
          
                style="width: 100%"
                >
                  <el-option v-for="item in odsXshxsjStudentOptionsCode"
                  :key="item.xh"
                  :label="item.label"
                  :value="item.xh"
                   />
                </el-select>
           
                <el-tooltip content="数据来源于ODS_XSHXSJ学生画像数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="指导教师工号" prop="zdjsgh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select v-model="form.zdjsgh" 
                placeholder="请输入指导教师工号关键字搜索"
                clearable
                filterable
                remote
                :remote-method="getZdjsghOptionsData"
                :loading="loading"
                style="width: 100%"
              >
                <el-option v-for="item in zdjsghOptionsCode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源于ODS_JSHXSJ教师信息数据子类表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
              </el-tooltip>
              </div> 
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践单位" prop="sjdw">
              <el-input
                v-model="form.sjdw"
                placeholder="请输入实践单位"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践地点" prop="sjdd">
              <el-input
                v-model="form.sjdd"
                placeholder="请输入实践地点"
                maxlength="300"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践项目" prop="sjxm">
              <el-input
                v-model="form.sjxm"
                placeholder="请输入实践项目"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践类别码" prop="sjlbm">
              <el-select
                v-model="form.sjlbm"
                placeholder="请选择实践类别码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in sjlbmOptionsCode"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践起始日期" prop="sjqsrq">
              <el-date-picker
                v-model="form.sjqsrq"
                type="date"
                placeholder="请选择实践起始日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践终止日期" prop="sjzzrq">
              <el-date-picker
                v-model="form.sjzzrq"
                type="date"
                placeholder="请选择实践终止日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实践内容" prop="sjnr">
              <el-input
                v-model="form.sjnr"
                type="textarea"
                :rows="3"
                placeholder="请输入实践内容（最多500字符）"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实践成果" prop="sjcg">
              <el-input
                v-model="form.sjcg"
                type="textarea"
                :rows="3"
                placeholder="请输入实践成果（最多500字符）"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实践评价" prop="sjpj">
              <el-input
                v-model="form.sjpj"
                type="textarea"
                :rows="3"
                placeholder="请输入实践评价（最多500字符）"
                maxlength="500"
                show-word-limit
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
      <div v-else class="practice-detail">
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
          <el-descriptions-item label="指导教师工号">
            <div class="detail-value">{{ form.zdjsgh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践单位">
            <div class="detail-value">{{ form.sjdw || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践地点">
            <div class="detail-value">{{ form.sjdd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践项目">
            <div class="detail-value">{{ form.sjxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践类别">
            <div class="detail-value">{{ getSjlbmText(form.sjlbm) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践起始日期">
            <div class="detail-value">{{ formatDisplayTime(form.sjqsrq) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践终止日期">
            <div class="detail-value">{{ formatDisplayTime(form.sjzzrq) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ formatDisplayTime(form.sjcjsj) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实践内容" :span="2">
            <div class="detail-value">{{ form.sjnr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践成果" :span="2">
            <div class="detail-value">{{ form.sjcg || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实践评价" :span="2">
            <div class="detail-value">{{ form.sjpj || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
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
  getOdsXsshsjhdsjPage,
  getOdsXsshsjhdsjById,
  addOdsXsshsjhdsj,
  updateOdsXsshsjhdsj,
  deleteOdsXsshsjhdsj,
  batchDeleteOdsXsshsjhdsj,
  getSjlbdmOptions,
  getSystemSchoolCode,
  getStudentOptions,
  exportOdsXsshsjhdsj,
  getTeacherOptions,
  type TeacherOption,
  type StudentOption,
  type DictOption,
  type OdsXsshsjhdsjInfo,
  type OdsXsshsjhdsjQuery,
  type OdsXsshsjhdsjForm,
} from "@/api/meta/meta_base/zygxs/ods_xsshsjhdsj";

// 搜索条件
const queryParams = reactive<OdsXsshsjhdsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  sjdw: "",
  sjxm: "",
  sjlbm: "",
  zdjsgh: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsXsshsjhdsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const systemSchoolCode = ref("");
const sjlbmOptionsCode = ref<DictOption[]>([]);
const odsXshxsjStudentOptionsCode = ref<StudentOption[]>([]);
const zdjsghOptionsCode = ref<TeacherOption[]>([]);
// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXsshsjhdsjForm & { enableStatus?: string }>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  sjdw: "",
  sjdd: "",
  sjxm: "",
  sjnr: "",
  sjqsrq: "",
  sjzzrq: "",
  sjlbm: "",
  sjcg: "",
  zdjsgh: "",
  sjpj: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增学生社会实践活动数据",
    edit: "编辑学生社会实践活动数据",
    view: "查看学生社会实践活动数据详情",
  };
  return titleMap[dialogMode.value];
});

 

// 获取实践类别码文本
const getSjlbmText = (code: string | undefined): string => {
  if (!code) return "";
  const option = sjlbmOptionsCode.value.find(item => item.value === code);
  return option ? option.label : code;
};

// 上报状态标签类型
const getReportStatusTagType = (status: string): "success" | "warning" | "info" | "danger" => {
  const statusMap: Record<string, "success" | "warning" | "info" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "warning",
    "3": "danger",
  };
  return statusMap[status] || "info";
};

// 上报状态文本
const getReportStatusText = (status: string): string => {
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
  if (time.length === 8) {
    const year = time.substring(0, 4);
    const month = time.substring(4, 6);
    const day = time.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
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

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { validator: (rule: any, value: string, callback: Function) => {
      if (!value) {
        callback(); // 为空时通过验证
      } else if (!/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" }
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" }
  ],
  sjdw: [
    { required: true, message: "请输入实践单位", trigger: "blur" },
    { max: 150, message: "实践单位长度不能超过150位", trigger: "blur" }
  ],
  sjdd: [
    { required: true, message: "请输入实践地点", trigger: "blur" },
    { max: 300, message: "实践地点长度不能超过300位", trigger: "blur" }
  ],
  sjxm: [
    { required: true, message: "请输入实践项目", trigger: "blur" },
    { max: 200, message: "实践项目长度不能超过200位", trigger: "blur" }
  ],
  sjnr: [
    { required: true, message: "请输入实践内容", trigger: "blur" },
    { max: 500, message: "实践内容长度不能超过500位", trigger: "blur" }
  ],
  sjqsrq: [
    { required: true, message: "请选择实践起始日期", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "实践起始日期格式必须为YYYYMMDD", trigger: "blur" }
  ],
  sjzzrq: [
    { required: true, message: "请选择实践终止日期", trigger: "blur" },
    { pattern: /^\d{8}$/, message: "实践终止日期格式必须为YYYYMMDD", trigger: "blur" }
  ],
  sjlbm: [
    { required: true, message: "请选择实践类别码", trigger: "blur" },
    { max: 1, message: "实践类别码长度不能超过1位", trigger: "blur" }
  ],
  sjcg: [
    { required: true, message: "请输入实践成果", trigger: "blur" },
    { max: 500, message: "实践成果长度不能超过500位", trigger: "blur" }
  ],
  zdjsgh: [
    { required: true, message: "请输入指导教师工号", trigger: "blur" },
    { max: 20, message: "指导教师工号长度不能超过20位", trigger: "blur" }
  ],
  sjpj: [
    { max: 500, message: "实践评价长度不能超过500位", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "blur" },
    { pattern: /^\d{8} \d{6}$/, message: "数据采集时间格式必须为YYYYMMDD hhmmss", trigger: "blur" }
  ]
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXsshsjhdsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生社会实践活动数据失败:", error);
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
    xxdm: systemSchoolCode.value,
    xh: "",
    sjdw: "",
    sjxm: "",
    sjlbm: "",
    zdjsgh: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    sjdw: "",
    sjdd: "",
    sjxm: "",
    sjnr: "",
    sjqsrq: "",
    sjzzrq: "",
    sjlbm: "",
    sjcg: "",
    zdjsgh: "",
    sjpj: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsXsshsjhdsjInfo) => {
  try {
    const response: any = await getOdsXsshsjhdsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生社会实践活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXsshsjhdsjInfo) => {
  try {
    const response: any = await getOdsXsshsjhdsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生社会实践活动数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXsshsjhdsjInfo) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这条学生社会实践活动数据吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await deleteOdsXsshsjhdsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生社会实践活动数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条学生社会实践活动数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXsshsjhdsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生社会实践活动数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = await exportOdsXsshsjhdsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生社会实践活动数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生社会实践活动数据失败:", error);
    ElMessage.error("导出失败");
  }
};
// 获取指导教师下拉选项
const getZdjsghOptionsData = async (keyword: string) => {
  const response: any = await getTeacherOptions(keyword);
  zdjsghOptionsCode.value = response.data.data;
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsXsshsjhdsj(form);
    } else {
      response = await updateOdsXsshsjhdsj(form);
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
    console.error("提交学生社会实践活动数据失败:", error);
    ElMessage.error("提交失败");
  }
};

// 选择变化
const handleSelectionChange = (selection: OdsXsshsjhdsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = (row: OdsXsshsjhdsjInfo) => {
  console.log("Row clicked:", row);
};

// 行双击
const handleRowDblClick = (row: OdsXsshsjhdsjInfo) => {
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

// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  if (response.data.code === 200) {

    systemSchoolCode.value = response.data.data;
  }
};
//
// 获取实践类别码
const getSjlbdmOptionsData = async () => {
  const response: any = await getSjlbdmOptions();
  sjlbmOptionsCode.value = response.data.data;
};
//
// 获取学生选项
const getOdsXshxsjStudentOptionsData = async () => {
  const response: any = await getStudentOptions();
  odsXshxsjStudentOptionsCode.value = response.data.data;
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getSjlbdmOptionsData();
  getList();
});
</script>

<style lang="scss" scoped>
/* 主容器样式 */
.student-practice-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 搜索卡片样式 */
.search-card {
  height: 60px;
  flex-shrink: 0;
}

.search-bar {
  margin-top: -5px;
}

/* 表格卡片样式 */
.table-card {
  margin-top: -28px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1);

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
.practice-dialog {
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
  margin-bottom:12px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 16px !important;
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
.practice-detail {
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
