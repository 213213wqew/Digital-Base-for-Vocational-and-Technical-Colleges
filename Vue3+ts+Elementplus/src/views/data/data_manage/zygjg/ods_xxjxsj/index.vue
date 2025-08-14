<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <!-- <el-form-item label="教工号" prop="jgh">
            <el-input
              v-model="queryParams.jgh"
              placeholder="请输入教工号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item> -->
          <el-form-item label="教工号/教师姓名" prop="jsxm">
            <el-input
              v-model="queryParams.jsxm"
              placeholder="请输入教师姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="培训名称" prop="jxpxmc">
            <el-input
              v-model="queryParams.jxpxmc"
              placeholder="请输入进修培训名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              style="width: 100px"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              style="width: 100px"
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: -25px;">
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
        </div>
        <div class="header-title">学习进修数据表数据清洗</div>
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
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column prop="xxdm" label="学校代码" min-width="100" />
          <el-table-column prop="jgh" label="教工号" min-width="120" />
          <el-table-column prop="jsxm" label="教师姓名" min-width="120" />
          <el-table-column
            prop="jxpxmc"
            label="培训名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="pxlbm"
            label="培训类别"
            min-width="120"
          >
           <template #default="{ row }">
              {{ getPxlbText(row.pxlbm) }}
            </template>
          </el-table-column>
           <el-table-column
            prop="pxxsm"
            label="培训形式"
            min-width="120"
          >
           <template #default="{ row }">
              {{ getPxxsText(row.pxxsm) }}
            </template>
          </el-table-column>
          <el-table-column prop="jxpxksrq" label="开始日期" min-width="120" />
          <el-table-column prop="jxpxjzrq" label="结束日期" min-width="120" />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)" size="small">
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
                @change="handleStatusChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="160" />
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
            @size-change="getList"
            @current-change="getList"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 新的统一对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="professional-dialog"
      destroy-on-close
    >
      <!-- 查看模式 -->
      <div v-if="dialogMode === 'view'">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="教工号">{{ form.jgh }}</el-descriptions-item>
          <el-descriptions-item label="教师姓名">{{ form.jsxm }}</el-descriptions-item>
          <el-descriptions-item label="进修学习地点码">{{ form.jxxxddm }}</el-descriptions-item>
          <el-descriptions-item label="进修培训编号">{{ form.jxpxbh }}</el-descriptions-item>
          <el-descriptions-item label="培训名称" :span="2">{{ form.jxpxmc }}</el-descriptions-item>
          <el-descriptions-item label="培训主题" :span="2">{{ form.jxpxzt }}</el-descriptions-item>
          <el-descriptions-item label="内容简介" :span="2">{{ form.jxpxnrjj }}</el-descriptions-item>
          <el-descriptions-item label="主讲人姓名">{{ form.jxpxzjrxm }}</el-descriptions-item>
          <el-descriptions-item label="开始日期">{{ form.jxpxksrq }}</el-descriptions-item>
          <el-descriptions-item label="结束日期">{{ form.jxpxjzrq }}</el-descriptions-item>
          <el-descriptions-item label="出国日期">{{ form.cgrq }}</el-descriptions-item>
          <el-descriptions-item label="出国目的码">{{ form.cgmdm }}</el-descriptions-item>
          <el-descriptions-item label="派出单位">{{ form.pcdw }}</el-descriptions-item>
          <el-descriptions-item label="审批单位">{{ form.spdw }}</el-descriptions-item>
          <el-descriptions-item label="审批日期">{{ form.sprq }}</el-descriptions-item>
          <el-descriptions-item label="应回国日期">{{ form.yhgrq }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">{{ form.sjcjsj }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 新增/编辑模式 -->
      <el-form
        v-else
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="留空则自动生成" maxlength="32" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取" disabled />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="教工号" prop="jgh">
               <el-select v-model="form.jgh" filterable remote reserve-keyword placeholder="请输入教师姓名或工号" :remote-method="remoteMethod" :loading="teacherLoading" @change="handleTeacherChange" style="width: 100%">
                <el-option v-for="item in teacherOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="jsxm">
              <el-input v-model="form.jsxm" placeholder="选择教工号后自动填充" disabled />
            </el-form-item>
          </el-col>
           <el-col :span="12">
            <el-form-item label="进修学习地点码" prop="jxxxddm">
              <el-input v-model="form.jxxxddm" placeholder="请输入学习地点码" maxlength="2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进修培训编号" prop="jxpxbh">
              <el-input v-model="form.jxpxbh" placeholder="请输入培训编号" maxlength="32" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="进修培训名称" prop="jxpxmc">
              <el-input v-model="form.jxpxmc" placeholder="请输入培训名称" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
           <el-col :span="24">
            <el-form-item label="进修培训主题" prop="jxpxzt">
              <el-input v-model="form.jxpxzt" placeholder="请输入培训主题" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="进修培训内容简介" prop="jxpxnrjj">
              <el-input v-model="form.jxpxnrjj" type="textarea" :rows="3" placeholder="请输入内容简介" maxlength="2000" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主讲人姓名" prop="jxpxzjrxm">
              <el-input v-model="form.jxpxzjrxm" placeholder="请输入主讲人姓名" maxlength="36" />
            </el-form-item>
          </el-col>
           <el-col :span="12">
             <el-form-item label="是否出国学习" prop="isAbroad">
              <el-radio-group v-model="isAbroad">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始日期" prop="jxpxksrq">
              <el-date-picker v-model="form.jxpxksrq" type="date" placeholder="选择开始日期" style="width: 100%" value-format="YYYYMMDD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束日期" prop="jxpxjzrq">
              <el-date-picker v-model="form.jxpxjzrq" type="date" placeholder="选择结束日期" style="width: 100%" value-format="YYYYMMDD" />
            </el-form-item>
          </el-col>

          <template v-if="isAbroad">
             <el-col :span="12">
              <el-form-item label="出国(境)日期" prop="cgrq">
                <el-date-picker v-model="form.cgrq" type="date" placeholder="选择出国日期" style="width: 100%" value-format="YYYYMMDD" />
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="出国(境)目的码" prop="cgmdm">
                <el-input v-model="form.cgmdm" placeholder="请输入出国目的码" maxlength="3" />
              </el-form-item>
            </el-col>
             <el-col :span="24">
              <el-form-item label="派出单位" prop="pcdw">
                <el-input v-model="form.pcdw" placeholder="请输入派出单位" maxlength="60" show-word-limit/>
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="审批单位" prop="spdw">
                <el-input v-model="form.spdw" placeholder="请输入审批单位" maxlength="60" show-word-limit />
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="审批日期" prop="sprq">
                <el-date-picker v-model="form.sprq" type="date" placeholder="选择审批日期" style="width: 100%" value-format="YYYYMMDD" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="应回国日期" prop="yhgrq">
                <el-date-picker v-model="form.yhgrq" type="date" placeholder="选择应回国日期" style="width: 100%" value-format="YYYYMMDD" />
              </el-form-item>
            </el-col>
          </template>
          
          <el-col :span="24">
            <el-form-item label="数据采集时间" prop="sjcjsj">
               <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" value-format="YYYYMMDD HHmmss" format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
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
import {
  getOdsXxjxsjPage,
  getOdsXxjxsjById,
  addOdsXxjxsj,
  updateOdsXxjxsj,
  deleteOdsXxjxsj,
  batchDeleteOdsXxjxsj,
  exportOdsXxjxsj,
  getSystemSchoolCode,
  getTeacherOptions,
  type OdsXxjxsjInfo,
  type OdsXxjxsjQuery,
  type OdsXxjxsjForm,
  type TeacherOption,
} from "@/api-data/data/data_base/zygjg/ods_xxjxsj";

// 状态定义
const loading = ref(false);
const dataList = ref<OdsXxjxsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsXxjxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
  jxpxmc: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 对话框状态
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  if (dialogMode.value === "add") return "新增学习进修数据";
  if (dialogMode.value === "edit") return "编辑学习进修数据";
  if (dialogMode.value === "view") return "查看学习进修数据";
  return "";
});

// 表单相关
const isAbroad = ref(false);
const form = reactive<OdsXxjxsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  jgh: "",
  jsxm: "",
  jxxxddm: "",
  jxpxbh: "",
  jxpxmc: "",
  jxpxzt: "",
  jxpxnrjj: "",
  jxpxzjrxm: "",
  jxpxksrq: "",
  jxpxjzrq: "",
  cgrq: "",
  cgmdm: "",
  pcdw: "",
  spdw: "",
  sprq: "",
  yhgrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

const rules = reactive({
  zjsjwyxbs: [
    {
      validator: (_rule: any, value: string, callback: Function) => {
        // 如果值为空，允许通过（后端会自动生成）
        if (!value || value.trim() === "") {
          callback();
          return;
        }
        // 如果有值，则验证格式
        if (value.length !== 32) {
          callback(new Error("主键数据唯一性标识必须是32位字符"));
          return;
        }
        if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("主键数据唯一性标识只能包含大写字母和数字"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  jgh: [{ required: true, message: "教工号不能为空", trigger: "change" }],
  jxxxddm: [{ required: true, message: "进修学习地点码不能为空", trigger: "blur" }],
  jxpxbh: [{ required: true, message: "进修培训编号不能为空", trigger: "blur" }],
  jxpxmc: [{ required: true, message: "进修培训名称不能为空", trigger: "blur" }],
  jxpxksrq: [{ required: true, message: "开始日期不能为空", trigger: "change" }],
  jxpxjzrq: [{ required: true, message: "结束日期不能为空", trigger: "change" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "change" }],
});

watch(isAbroad, (is) => {
  if (!is) {
    // 清空非必填的出国相关字段
    form.cgrq = "";
    form.cgmdm = "";
    form.pcdw = "";
    form.spdw = "";
    form.sprq = "";
    form.yhgrq = "";
  }
  // 触发表单重新验证
  formRef.value?.clearValidate();
});

// 教师选择
const teacherLoading = ref(false);
const teacherOptions = ref<TeacherOption[]>([]);

// 培训类别/形式 选项
const pxlbOptions = ref([
  { value: "1", label: "国家级" },
  { value: "2", label: "省级" },
  { value: "3", label: "市级" },
  { value: "4", label: "校级" },
  { value: "9", label: "其他" },
]);
const pxxsOptions = ref([
  { value: "10", label: "脱产或集中" },
  { value: "20", label: "网络" },
  { value: "30", label: "在职自学" },
  { value: "99", label: "其他" },
]);

// 辅助函数
const getPxlbText = (code: string | undefined) => !code ? '' : pxlbOptions.value.find(o => o.value === code)?.label || code;
const getPxxsText = (code: string | undefined) => !code ? '' : pxxsOptions.value.find(o => o.value === code)?.label || code;
const getReportStatusText = (status: string | undefined) => {
  if (status === '1') return '已上报';
  if (status === '2') return '上报失败';
  return '未上报';
}
const getReportStatusTagType = (status: string | undefined) => {
  if (status === '1') return 'success';
  if (status === '2') return 'danger';
  return 'info';
}

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsXxjxsjPage(queryParams);
    const resData = response.data as any;
    if (resData.code === 200) {
      dataList.value = resData.data.records;
      total.value = resData.data.total;
    } else {
      ElMessage.error(resData.message || "获取列表失败");
    }
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  isAbroad.value = false;
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    jgh: "",
    jsxm: "",
    jxxxddm: "",
    jxpxbh: "",
    jxpxmc: "",
    jxpxzt: "",
    jxpxnrjj: "",
    jxpxzjrxm: "",
    jxpxksrq: "",
    jxpxjzrq: "",
    cgrq: "",
    cgmdm: "",
    pcdw: "",
    spdw: "",
    sprq: "",
    yhgrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 新增
const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";
  try {
    const res = await getSystemSchoolCode();
    const resData = res.data as any;
    if (resData.code === 200) {
      form.xxdm = resData.data;
    }
  } catch(e) {
    console.error("获取学校代码失败", e);
  }
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsXxjxsjInfo) => {
  resetForm();
  dialogMode.value = "edit";
  try {
    const response = await getOdsXxjxsjById(row.id);
    const resData = response.data as any;
    if (resData.code === 200) {
      Object.assign(form, resData.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(resData.message || "获取数据失败");
    }
  } catch (e) {
     ElMessage.error("获取数据失败");
  }
};

// 查看
const handleView = async (row: OdsXxjxsjInfo) => {
  resetForm();
  dialogMode.value = "view";
   try {
    const response = await getOdsXxjxsjById(row.id);
    const resData = response.data as any;
    if (resData.code === 200) {
      Object.assign(form, resData.data);
      dialogVisible.value = true;
    } else {
      ElMessage.error(resData.message || "获取数据失败");
    }
  } catch (e) {
     ElMessage.error("获取数据失败");
  }
};

// 提交
const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate();
  
  const action = dialogMode.value === 'add' ? addOdsXxjxsj : updateOdsXxjxsj;
  const message = dialogMode.value === 'add' ? '新增成功' : '修改成功';

  try {
    const response = await action(form);
    const resData = response.data as any;
    if(resData.code === 200) {
      ElMessage.success(message);
      dialogVisible.value = false;
      // 刷新列表
      await getList();
    } else {
      ElMessage.error(resData.message || '操作失败');
    }
  } catch(e) {
    console.error('操作失败', e);
    ElMessage.error('操作失败');
  }
};

// 教师远程搜索
const remoteMethod = async (query: string) => {
  if (query) {
    teacherLoading.value = true;
    try {
      const response = await getTeacherOptions(query);
      const resData = response.data as any;
      if (resData.code === 200) {
        teacherOptions.value = resData.data;
      } else {
        teacherOptions.value = [];
      }
    } finally {
      teacherLoading.value = false;
    }
  } else {
    teacherOptions.value = [];
  }
};

// 教师选择后填充姓名
const handleTeacherChange = (jgh: string) => {
  const selectedTeacher = teacherOptions.value.find((t: TeacherOption) => t.value === jgh);
  if (selectedTeacher) {
    form.jsxm = selectedTeacher.label.split('(')[0].trim();
  }
};

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  queryForm.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection: OdsXxjxsjInfo[]) {
  selectedIds.value = selection.map((item) => item.id);
}

/** 行点击事件 */
function handleRowClick(row: OdsXxjxsjInfo) {
  // 行点击逻辑
}

/** 行双击事件 */
function handleRowDblClick(row: OdsXxjxsjInfo) {
  handleView(row);
}

/** 删除按钮操作 */
function handleDelete(row: OdsXxjxsjInfo) {
  ElMessageBox.confirm("是否确认删除该条数据？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await deleteOdsXxjxsj(row.id);
      const resData = response.data as any;
      if (resData.code === 200) {
        ElMessage.success("删除成功");
        // 清空选中状态
        selectedIds.value = [];
        // 刷新列表
        await getList();
      } else {
        ElMessage.error(resData.message || "删除失败");
      }
    } catch (error) {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  });
}

/** 批量删除按钮操作 */
function handleBatchDelete() {
  ElMessageBox.confirm("是否确认删除选中的数据？", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await batchDeleteOdsXxjxsj(selectedIds.value);
      const resData = response.data as any;
      if (resData.code === 200) {
        ElMessage.success("删除成功");
        // 清空选中状态
        selectedIds.value = [];
        // 刷新列表
        await getList();
      } else {
        ElMessage.error(resData.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  });
}

/** 导出按钮操作 */
async function handleExport() {
  try {
    const response = await exportOdsXxjxsj(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `学习进修数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(link.href);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
}

/** 状态切换 */
async function handleStatusChange(row: OdsXxjxsjInfo) {
  try {
    const response = await updateOdsXxjxsj(row);
    const resData = response.data as any;
    if (resData.code === 200) {
      ElMessage.success("状态更新成功");
      // 刷新列表以确保数据同步
      await getList();
    } else {
      ElMessage.error(resData.message || "状态更新失败");
      // 恢复原状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error) {
    console.error("状态更新失败:", error);
    ElMessage.error("状态更新失败");
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  }
}

onMounted(() => {
  getList();
});
</script>

<style lang="scss" scoped>
.professional-development-management {
  padding: 16px;

  .search-card {
    margin-bottom: 16px;
    :deep(.el-card__body) {
      padding-bottom: 0;
    }
  }

  .search-bar {
    /* padding-top: 20px; */ /* Removed to reduce height */
  }

  .table-card {
    margin-bottom: 16px;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0px;
  }

  .operation-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  
  .header-title {
    font-size: 16px;
    font-weight: 500;
  }

  .placeholder {
     width: auto;
  }
  
  .table-body {
    //
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
  }

  .total-info {
    color: #606266;
    font-size: 14px;
  }
}

.professional-dialog {
  .el-dialog__body {
    padding: 20px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
