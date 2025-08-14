<template>
  <div class="cooperation-data-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="合作企业名称" prop="hzqymc">
            <el-input
              v-model="queryParams.hzqymc"
              placeholder="请输入合作企业名称"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="专业号" prop="zyh">
            <el-input
              v-model="queryParams.zyh"
              placeholder="请输入专业号"
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
        </div>
        <div class="header-title">产学合作数据管理</div>
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
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="hzqymc" label="合作企业名称" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zyh" label="专业号" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="hzqytyshxydm" label="企业信用代码" min-width="180" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="hzksny" label="合作开始年月" min-width="120" align="center" sortable="custom" />
          <el-table-column prop="gtkfkcms" label="共同开发课程门数" min-width="160" align="center" sortable="custom" />
          <el-table-column prop="sjcjsj" label="数据采集时间" min-width="160" align="center" sortable="custom" />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)" size="small">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">
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
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="cooperation-data-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="180px"
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
            <el-form-item label="专业号" prop="zyh">
              <el-select v-model="form.zyh"
              clearable
                filterable
                remote
                :remote-method="remoteMethodZyh"
                :loading="loadingZyh"
              placeholder="请输入学校自编专业号"
              maxlength="64"
               show-word-limit>
                <el-option v-for="item in zyhOptions" 
                :key="item.value" 
                :label="`${item.label} (${item.value})`" 
                :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作企业统一社会信用代码" prop="hzqytyshxydm">
              <el-input v-model="form.hzqytyshxydm" placeholder="请输入18位信用代码" maxlength="18" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作企业名称" prop="hzqymc">
              <el-input v-model="form.hzqymc" placeholder="请输入合作企业名称" maxlength="200" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="合作开始年月" prop="hzksny">
              <el-date-picker
                v-model="form.hzksny"
                type="month"
                placeholder="请选择合作开始年月"
                format="YYYYMM"
                value-format="YYYYMM"
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
            <el-form-item label="订单培养人数" prop="ddpyrs">
               <el-input-number v-model="form.ddpyrs" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="共同开发课程门数" prop="gtkfkcms">
              <el-input-number v-model="form.gtkfkcms" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
           <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="共同开发教材数" prop="gtkfjcs">
              <el-input-number v-model="form.gtkfjcs" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="支持学校兼职教师数" prop="zcxxjzjss">
              <el-input-number v-model="form.zcxxjzjss" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="接受顶岗实习学生数" prop="jsdgsxxss">
              <el-input-number v-model="form.jsdgsxxss" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="接受毕业生就业数" prop="jsbysjys">
              <el-input-number v-model="form.jsbysjys" :min="0" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="学校为企业技术服务年收入" prop="xxwqyjsfwnsr">
              <el-input-number v-model="form.xxwqyjsfwnsr" :min="0" :precision="2" controls-position="right" style="width: 100%" />
            </el-form-item>
          </el-col>
           <el-col :span="12" style="margin-bottom: 18px;">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="cooperation-data-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="专业号"><div class="detail-value">{{ form.zyh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="合作企业统一社会信用代码"><div class="detail-value">{{ form.hzqytyshxydm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="合作企业名称"><div class="detail-value">{{ form.hzqymc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="合作开始年月"><div class="detail-value">{{ form.hzksny || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="订单培养人数"><div class="detail-value">{{ form.ddpyrs }}</div></el-descriptions-item>
          <el-descriptions-item label="共同开发课程门数"><div class="detail-value">{{ form.gtkfkcms }}</div></el-descriptions-item>
          <el-descriptions-item label="共同开发教材数"><div class="detail-value">{{ form.gtkfjcs }}</div></el-descriptions-item>
          <el-descriptions-item label="支持学校兼职教师数"><div class="detail-value">{{ form.zcxxjzjss }}</div></el-descriptions-item>
          <el-descriptions-item label="接受顶岗实习学生数"><div class="detail-value">{{ form.jsdgsxxss }}</div></el-descriptions-item>
          <el-descriptions-item label="接受毕业生就业数"><div class="detail-value">{{ form.jsbysjys }}</div></el-descriptions-item>
          <el-descriptions-item label="学校为企业技术服务年收入"><div class="detail-value">{{ form.xxwqyjsfwnsr }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(form.reportStatus)" size="small">
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间"><div class="detail-value">{{ form.createTime || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="更新时间"><div class="detail-value">{{ form.updateTime || "-" }}</div></el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

import {
  getOdsCxhzsjPage,
  getOdsCxhzsjById,
  addOdsCxhzsj,
  updateOdsCxhzsj,
  deleteOdsCxhzsj,
  batchDeleteOdsCxhzsj,
  exportOdsCxhzsj,
  getZyhOptions,
  type OdsCxhzsjInfo,
  type OdsCxhzsjQuery,
  type OdsCxhzsjForm,
} from "@/api-data/data/data_base/zygxq/ods_cxhzsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxq/ods_cxhzsj";

const loading = ref(false);
const dataList = ref<OdsCxhzsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);

const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增产学合作数据";
    case "edit": return "编辑产学合作数据";
    case "view": return "查看产学合作数据";
    default: return "产学合作数据";
  }
});
//专业号下拉选项
const zyhOptions = ref<DictOption[]>([]);

const queryParams = reactive<OdsCxhzsjQuery>({
  hzqymc: "",
  zyh: "",
  pageNum: 1,
  pageSize: 20,
});

const form = reactive<OdsCxhzsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  zyh: "",
  hzqytyshxydm: "",
  hzqymc: "",
  hzksny: "",
  ddpyrs: 0,
  gtkfkcms: 0,
  gtkfjcs: 0,
  zcxxjzjss: 0,
  jsdgsxxss: 0,
  jsbysjys: 0,
  xxwqyjsfwnsr: 0,
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

const formRules = reactive<FormRules>({
  zjsjwyxbs: [{ validator: (rule: any, value: string, callback: Function) => {
      if (value && !/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur' }],
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  zyh: [{ required: true, message: "专业号不能为空", trigger: "blur" }, { max: 64, message: "长度不能超过64位", trigger: "blur" }],
  hzqytyshxydm: [{ required: true, message: "企业信用代码不能为空", trigger: "blur" }, { pattern: /^[A-Z0-9]{18}$/, message: "必须是18位", trigger: "blur" }],
  hzqymc: [{ required: true, message: "企业名称不能为空", trigger: "blur" }, { max: 200, message: "长度不能超过200位", trigger: "blur" }],
  hzksny: [{ required: true, message: "合作开始年月不能为空", trigger: "change" }],
  gtkfkcms: [{ required: true, message: "共同开发课程门数不能为空", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "change" }],
});

const getReportStatusText = (status: string) => {
  switch (status) {
    case "0": return "未上报";
    case "1": return "已上报";
    case "2": return "上报失败";
    default: return "未知";
  }
};

const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0": return "info";
    case "1": return "success";
    case "2": return "danger";
    default: return "warning";
  }
};
const loadingZyh = ref(false);
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
        zyhOptions.value = response.data.data;
      } else {
        zyhOptions.value = [];
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
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsCxhzsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询数据失败:", error);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsCxhzsjInfo) => {
  try {
    const response: any = await getOdsCxhzsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsCxhzsjInfo) => {
  try {
    const response: any = await getOdsCxhzsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleDelete = async (row: OdsCxhzsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const response: any = await deleteOdsCxhzsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const response: any = await batchDeleteOdsCxhzsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

const handleExport = async () => {
  try {
    const response = await exportOdsCxhzsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `产学合作数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出数据失败:", error);
    ElMessage.error("导出失败");
  }
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    submitLoading.value = true;
    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsCxhzsj(form);
    } else {
      response = await updateOdsCxhzsj(form);
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
  } finally {
    submitLoading.value = false;
  }
};

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    zyh: "",
    hzqytyshxydm: "",
    hzqymc: "",
    hzksny: "",
    ddpyrs: 0,
    gtkfkcms: 0,
    gtkfjcs: 0,
    zcxxjzjss: 0,
    jsdgsxxss: 0,
    jsbysjys: 0,
    xxwqyjsfwnsr: 0,
    sjcjsj: "",
    enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const handleSelectionChange = (selection: OdsCxhzsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleRowDblClick = (row: OdsCxhzsjInfo) => {
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

const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

onMounted(() => {
  getSystemSchoolCodeData();
  getList();
});
</script>

<style scoped>
.cooperation-data-management {
  padding: 0px;
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
.cooperation-data-dialog {
  border-radius: 8px;
}
.cooperation-data-detail {
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
:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}
:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}
:deep(.cooperation-data-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}
:deep(.cooperation-data-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}
:deep(.cooperation-data-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}
:deep(.cooperation-data-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}
:deep(.cooperation-data-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 70vh;
  overflow-y: auto;
}
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
:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}
:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}
:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}
:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}
:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
