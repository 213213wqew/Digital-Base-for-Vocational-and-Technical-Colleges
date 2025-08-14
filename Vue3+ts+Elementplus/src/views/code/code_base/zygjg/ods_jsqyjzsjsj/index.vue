<template>
  <div class="teacher-part-time-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item label="教师姓名" prop="jsxm">
          <el-input
            v-model="queryParams.jsxm"
            placeholder="请输入教师姓名"
            clearable
            maxlength="36"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="企业名称" prop="qymc">
          <el-input
            v-model="queryParams.qymc"
            placeholder="请输入企业名称"
            clearable
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        <el-form-item style="margin-top: -25px;"  >
          <el-button type="primary" @click="handleQuery">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetQuery">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
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
        <div class="header-title">教师企业兼职/实践数据管理</div>
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
          :height="'calc(75vh - 135px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="55" fixed="left" />
          <el-table-column prop="jsxm" label="教师姓名" width="120" />
          <el-table-column
            prop="qymc"
            label="企业名称"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="qydllxmText"
            label="企业锻炼类型"
            width="120"
          />
          <el-table-column prop="qyxzmText" label="企业性质" width="120" />
          <el-table-column prop="zqysjjzksrq" label="开始日期" width="120" />
          <el-table-column prop="zqysjjzzzrq" label="终止日期" width="120" />
          <el-table-column
            prop="qysjjzgw"
            label="兼职岗位"
            width="150"
            show-overflow-tooltip
          />
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
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
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
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleUpdate(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">
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
            @size-change="getList"
            @current-change="getList"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="teacher-part-time-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialog.mode !== 'view'"
        ref="dataForm"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取" disabled maxlength="10" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="教工号" prop="jgh">
              <el-select
                v-model="form.jgh"
                filterable
                remote
                reserve-keyword
                placeholder="请输入教师姓名或工号"
                :remote-method="remoteMethod"
                :loading="teacherLoading"
                @change="handleTeacherChange"
                style="width: 100%"
              >
                <el-option
                  v-for="item in teacherOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师姓名" prop="jsxm">
              <el-input v-model="form.jsxm" placeholder="选择教师后自动填充" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="企业锻炼类型码" prop="qydllxm">
              <el-select v-model="form.qydllxm" placeholder="请选择企业锻炼类型码" clearable style="width: 100%">
                <el-option v-for="item in qydllxmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业机构代码" prop="qyjgdm">
              <el-input v-model="form.qyjgdm" placeholder="请输入企业机构代码" maxlength="18" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="企业名称" prop="qymc">
              <el-input v-model="form.qymc" placeholder="请输入企业名称" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业性质码" prop="qyxzm">
              <el-select v-model="form.qyxzm" placeholder="请选择企业性质码" clearable style="width: 100%">
                <el-option v-for="item in qyxzmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="企业所属行业码" prop="qysshym">
              <el-select v-model="form.qysshym" placeholder="请选择企业所属行业码" clearable style="width: 100%">
                <el-option v-for="item in qysshymOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="在企业实践/兼职开始日期" prop="zqysjjzksrq">
              <el-date-picker v-model="form.zqysjjzksrq" type="date" placeholder="选择日期" style="width:100%" value-format="YYYYMMDD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="12">
            <el-form-item label="在企业实践/兼职终止日期" prop="zqysjjzzzrq">
              <el-date-picker v-model="form.zqysjjzzzrq" type="date" placeholder="选择日期" style="width:100%" value-format="YYYYMMDD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业实践/兼职岗位" prop="qysjjzgw">
              <el-input v-model="form.qysjjzgw" placeholder="请输入企业实践/兼职岗位" maxlength="60" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-input v-model="form.sjcjsj" placeholder="请输入数据采集时间" maxlength="15" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width:100%">
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 20px;" >
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width:100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="view-mode">
         <el-descriptions :column="2" border>
            <el-descriptions-item label="主键数据唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
            <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
            <el-descriptions-item label="教师姓名">{{ form.jsxm }}</el-descriptions-item>
            <el-descriptions-item label="企业锻炼类型码">{{ form.qydllxm }}</el-descriptions-item>
            <el-descriptions-item label="企业机构代码">{{ form.qyjgdm }}</el-descriptions-item>
            <el-descriptions-item label="企业名称">{{ form.qymc }}</el-descriptions-item>
            <el-descriptions-item label="企业性质码">{{ form.qyxzm }}</el-descriptions-item>
            <el-descriptions-item label="在企业实践/兼职开始日期">{{ form.zqysjjzksrq }}</el-descriptions-item>
            <el-descriptions-item label="在企业实践/兼职终止日期">{{ form.zqysjjzzzrq }}</el-descriptions-item>
            <el-descriptions-item label="企业实践/兼职岗位">{{ form.qysjjzgw }}</el-descriptions-item>
            <el-descriptions-item label="企业所属行业码">{{ form.qysshym }}</el-descriptions-item>
            <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
            <el-descriptions-item label="上报状态">
              <el-tag :type="getReportStatusTagType(form.reportStatus)" size="small">
                {{ getReportStatusText(form.reportStatus) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="启用状态">
              <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ form.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button v-if="dialog.mode !== 'view'" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from 'element-plus'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
} from "@element-plus/icons-vue";
import {
  getOdsJsqyjzsjsjPage,
  getOdsJsqyjzsjsjById,
  addOdsJsqyjzsjsj,
  updateOdsJsqyjzsjsj,
  getOptionsByCode,
  batchDeleteOdsJsqyjzsjsj,
  exportOdsJsqyjzsjsj,
  type OdsJsqyjzsjsjInfo,
  type OdsJsqyjzsjsjQuery,
  type OdsJsqyjzsjsjForm,
  getJsOptions,
} from "@/api-code/code/code_base/zygjg/ods_jsqyjzsjsj";
import { getSystemSchoolCode } from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";
 

const data = reactive<{
  loading: boolean;
  dataList: OdsJsqyjzsjsjInfo[];
  total: number;
  queryParams: OdsJsqyjzsjsjQuery;
  form: OdsJsqyjzsjsjForm;
  rules: Record<string, any>;
  dialog: {
    visible: boolean;
    title: string;
    mode: 'add' | 'edit' | 'view';
  };
  selectedIds: (number | undefined)[];
  teacherOptions: any[];
  teacherLoading: boolean;
}>({
  loading: false,
  dataList: [],
  total: 0,
  queryParams: {
    pageNum: 1,
    pageSize: 100,
    jsxm: undefined,
    qymc: undefined,
  },
  form: {} as OdsJsqyjzsjsjForm,
  rules: {
    zjsjwyxbs: [
      { max: 32, message: "主键数据唯一性标识长度不能超过32个字符", trigger: "blur" }
    ],
    xxdm: [
        { required: true, message: "学校代码不能为空", trigger: "blur" },
        { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" }
    ],
    jgh: [
        { required: true, message: "教工号不能为空", trigger: "blur" },
        { max: 20, message: "教工号长度不能超过20个字符", trigger: "blur" }
    ],
    jsxm: [
        { required: true, message: "教师姓名不能为空", trigger: "blur" },
        { max: 36, message: "教师姓名长度不能超过36个字符", trigger: "blur" }
    ],
    qydllxm: [
        { required: true, message: "企业锻炼类型码不能为空", trigger: "blur" },
        { max: 2, message: "企业锻炼类型码长度不能超过2个字符", trigger: "blur" }
    ],
    qyjgdm: [
        { required: true, message: "企业机构代码不能为空", trigger: "blur" },
        { max: 18, message: "企业机构代码长度不能超过18个字符", trigger: "blur" }
    ],
    qymc: [
        { required: true, message: "企业名称不能为空", trigger: "blur" },
        { max: 200, message: "企业名称长度不能超过200个字符", trigger: "blur" }
    ],
    qyxzm: [
        { max: 2, message: "企业性质码长度不能超过2个字符", trigger: "blur" }
    ],
    zqysjjzksrq: [
        { required: true, message: "在企业实践/兼职开始日期不能为空", trigger: "change" }
    ],
    zqysjjzzzrq: [
        { required: true, message: "在企业实践/兼职终止日期不能为空", trigger: "change" }
    ],
    qysjjzgw: [
        { required: true, message: "企业实践/兼职岗位不能为空", trigger: "blur" },
        { max: 60, message: "企业实践/兼职岗位长度不能超过60个字符", trigger: "blur" }
    ],
    qysshym: [
        { max: 4, message: "企业所属行业码长度不能超过4个字符", trigger: "blur" }
    ],
    sjcjsj: [
        { required: true, message: "数据采集时间不能为空", trigger: "change" }
    ],
  },
  dialog: {
    visible: false,
    title: "",
    mode: "add",
  },
  selectedIds: [],
  teacherOptions: [],
  teacherLoading: false,
});

const {
  loading,
  dataList,
  total,
  queryParams,
  form,
  rules,
  dialog,
  selectedIds,
  teacherOptions,
  teacherLoading,
} = toRefs(data);

const queryForm = ref<FormInstance | null>(null);
const dataForm = ref<FormInstance | null>(null);

// 字典选项
const qydllxmOptions = ref<any[]>([]);
const qyxzmOptions = ref<any[]>([]);
const qysshymOptions = ref<any[]>([]);

/**
 * 获取下拉选项
 */
const fetchOptions = async () => {
  try {
    const [qydllxmRes, qyxzmRes, qysshymRes] = await Promise.all([
    getOptionsByCode('QYDLLXDM'),
    getOptionsByCode('DWXZDM'),
    getOptionsByCode('HYDM')
    ]);
    qydllxmOptions.value = qydllxmRes.data.data;
    qyxzmOptions.value = qyxzmRes.data.data;
    qysshymOptions.value = qysshymRes.data.data;
  } catch (error) {
    console.error("Failed to fetch options:", error);
  }
};

onMounted(() => {
  getList();
  getSystemSchoolCode().then(res => {
    const result = res.data as any
    if (result?.code === 200) {
      data.form.xxdm = result.data;
    }
  });
});

function getList() {
  data.loading = true;
  getOdsJsqyjzsjsjPage(data.queryParams  ).then((res:any) => {
    data.dataList = res.data.data.records;
    data.total = res.data.data.total;
    data.loading = false;
  });
}

function handleQuery() {
  data.queryParams.pageNum = 1;
  getList();
}

function resetQuery() {
  queryForm.value?.resetFields();
  handleQuery();
}

function handleAdd() {
  resetForm();
  dialog.value = {
    visible: true,
    title: "新增教师企业兼职/实践数据",
    mode: "add",
  };
  fetchOptions(); // 新增时获取下拉选项
}

function handleUpdate(row: OdsJsqyjzsjsjInfo) {
  resetForm();
  const id = row.id;
  getOdsJsqyjzsjsjById(id).then((res:any) => {
    form.value = res.data.data;
    dialog.value = {
      visible: true,
      title: "编辑教师企业兼职/实践数据",
      mode: "edit",
    };
    fetchOptions(); // 编辑时获取下拉选项
  });
}

function handleView(row: OdsJsqyjzsjsjInfo) {
    resetForm();
    const id = row.id;
    getOdsJsqyjzsjsjById(id).then((res:any) => {
        form.value = res.data.data  ;
        dialog.value = {
            visible: true,
            title: "查看教师企业兼职/实践数据",
            mode: "view",
        };
    });
}

function submitForm() {
  dataForm.value?.validate(valid => {
    if (valid) {
      if (dialog.value.mode === "edit") {
        updateOdsJsqyjzsjsj(form.value).then(() => {
          ElMessage.success("修改成功");
          closeDialog();
          getList();
        });
      } else {
        addOdsJsqyjzsjsj(form.value).then(() => {
          ElMessage.success("新增成功");
          closeDialog();
          getList();
        });
      }
    }
  });
}

function handleDelete(row: Partial<OdsJsqyjzsjsjInfo>) {
  const ids = row.id ? [row.id] : selectedIds.value;
  ElMessageBox.confirm('是否确认删除选中的数据项?', "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(function() {
      return batchDeleteOdsJsqyjzsjsj(ids as number[]);
    }).then(() => {
      getList();
      ElMessage.success("删除成功");
    }).catch(() => {});
}

function handleBatchDelete() {
    handleDelete({});
}

function handleExport() {
    exportOdsJsqyjzsjsj(queryParams.value).then(response => {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `教师企业兼职实践数据_${new Date().getTime()}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(link.href);
        ElMessage.success("导出成功");
    }).catch(error => {
        console.error('导出失败:', error);
        ElMessage.error("导出失败：" + (error.response?.data?.message || error.message || "未知错误"));
    });
}

function handleSelectionChange(selection: OdsJsqyjzsjsjInfo[]) {
  selectedIds.value = selection.map(item => item.id);
}

function closeDialog() {
  dialog.value.visible = false;
  resetForm();
}

function resetForm() {
    const schoolCode = form.value.xxdm;
    form.value = {
        id: undefined,
        zjsjwyxbs: undefined,
        xxdm: schoolCode,
        jgh: undefined,
        jsxm: undefined,
        qymc: undefined,
        qydllxm: undefined,
        qyxzm: undefined,
        qyjgdm: undefined,
        qysshym: undefined,
        zqysjjzksrq: undefined,
        zqysjjzzzrq: undefined,
        qysjjzgw: undefined,
        sjcjsj: undefined,
        reportStatus: '0',
        enableStatus: '1'
    } as OdsJsqyjzsjsjForm;
    if (dataForm.value) {
        dataForm.value.resetFields();
    }
}

const getReportStatusText = (status: string | undefined) => {
  if (status === '1') return '已上报';
  if (status === '2') return '上报失败';
  return '未上报';
};

const getReportStatusTagType = (status: string | undefined) => {
  if (status === '1') return 'success';
  if (status === '2') return 'danger';
  return 'info';
};

const remoteMethod = (query: string) => {
  if (query) {
    teacherLoading.value = true;
    getJsOptions(query).then((response: any) => {
      if (response.data && Array.isArray(response.data.data)) {
        teacherOptions.value = response.data.data.map((item: any) => ({
          value: item.value,
          label: `${item.label} (${item.value})`,
          jsxm: item.label // 保存教师姓名，用于后续填充
        }));
      }
      teacherLoading.value = false;
    });
  } else {
    teacherOptions.value = [];
  }
}

const handleTeacherChange = (selectedJgh: string) => {
  console.log('选中的教工号:', selectedJgh);
  
  const selectedTeacher = teacherOptions.value.find(
    (teacher) => teacher.value === selectedJgh
  );
  if (selectedTeacher) {
    // 设置教工号和教师姓名
    form.value.jgh = selectedTeacher.value;
    form.value.jsxm = selectedTeacher.jsxm;
  }
};
  

const dynamicRules = computed(() => {
  return {
    // ... existing data ...
  };
});
</script>

<style lang="scss" scoped>
.teacher-part-time-management {
 
  flex-direction: column;
 
}

.search-card {
   
 height: 60px;
}

.table-card {
  .table-header {
 
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    border-bottom: 1px solid #e9e9e9;
    .header-title {
      font-size: 16px;
      font-weight: 600;
    }
    .operation-buttons, .placeholder {
        display: flex;
        align-items: center;
        gap: 8px;
    }
  }

  .table-body {
    padding: 15px;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 8px;
    border-top: 1px solid #e9e9e9;
    .total-info {
        font-size: 14px;
        color: #606266;
    }
  }
}

.action-buttons .el-button {
    margin: 0 4px;
}

.teacher-part-time-dialog {
  .el-dialog__body {
    padding: 25px 30px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .el-form-item {
    margin-bottom: 0x;
  }
}

.view-mode {
    .el-descriptions {
        :deep(.el-descriptions__label) {
            font-weight: 600;
        }
    }
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

:deep(.el-dialog__body .el-form .el-row) {
  margin-bottom: 0;
}

</style>
