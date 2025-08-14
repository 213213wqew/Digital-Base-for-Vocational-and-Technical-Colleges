<template>
  <div class="student-leave-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryForm" :inline="true" class="search-form">
        <div class="form-items">
          <!-- 第一行搜索条件 -->
          <div class="form-row">
            <el-form-item label="学号">
              <el-select
                v-model="queryParams.xh"
                placeholder="请输入学号/姓名关键字搜索"
                clearable
                filterable
                remote
                :remote-method="getStudentOptionsData"
                :loading="loading"
              >
                <el-option v-for="item in studentOptions" 
                  :key="item.xh" 
                  :label="item.label"
                  :value="item.xh" />
              </el-select>
            </el-form-item>
            <el-form-item label="班级">
              <el-input
                v-model="queryParams.bjmc"
                placeholder="如101，202等"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="宿舍">
              <el-input
                v-model="queryParams.ssbh"
                placeholder="请输入宿舍编号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
          </div>
          <!-- 第二行搜索条件 -->
          <div class="form-row">
            <el-form-item label="状态">
              <el-select v-model="queryParams.zqzt" placeholder="请选择状态">
                <el-option v-for="item in zqztdmOptions" 
                :key="item.value"
                 :label="item.label"
                 :value="item.value" />
              </el-select>
               
            </el-form-item>
            <div class="form-buttons">
              <el-button type="primary" @click="handleQuery">
                <el-icon><Search /></el-icon>查询
              </el-button>
              <el-button @click="resetQuery">
                <el-icon><Refresh /></el-icon>重置
              </el-button>
            </div>
          </div>
        </div>
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
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">学生住宿查寝数据</div>
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
            prop="bjmc"
            label="班级名称"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="ssbh"
            label="宿舍编号"
            min-width="100"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="cqsj"
            label="查寝时间"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayTime(row.cqsj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cqr"
            label="查寝人"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zqzt"
            label="在寝状态"
              
            align="center"
          >
            <template #default="{ row }">
              <el-tag :type="row.zqzt === '1' ? 'success' : 'danger'">
                {{ row.zqzt === "1" ? "在寝" : "不在寝" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="qksm"
            label="情况说明"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayTime(row.sjcjsj) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportStatus" label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="
                  row.reportStatus === '1'
                    ? 'success'
                    : row.reportStatus === '2'
                    ? 'danger'
                    : 'warning'
                "
                size="small"
              >
                {{
                  row.reportStatus === "1"
                    ? "已上报"
                    : row.reportStatus === "2"
                    ? "上报失败"
                    : "未上报"
                }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enableStatus" label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button
                type="primary"
                size="small"
                @click="handleView(row.id)"
                link
              >
                <el-icon><View /></el-icon>查看
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="handleEdit(row.id)"
                link
              >
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(row.id)"
                link
              >
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <div class="total-info">总共 {{ total }} 条记录</div>
          <div class="pagination-controls">
            <el-pagination
              v-model:current-page="queryParams.pageNum"
              v-model:page-size="queryParams.pageSize"
              :total="total"
              :page-sizes="[10, 20, 50, 100]"
              :small="false"
              :disabled="loading"
              :background="true"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 弹窗：新增/编辑/查看 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      :close-on-click-modal="false"
      append-to-body
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        class="dialog-form"
      >
        <div class="form-row">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="form.zjsjwyxbs"
              placeholder="可留空自动生成，或输入32位大写字母数字组合"
              maxlength="32"
              show-word-limit
              style="text-transform: uppercase"
              @input="handleZjsjwyxbsInput"
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="form.xxdm"
              placeholder="系统自动获取学校代码"
              maxlength="10"
              readonly
              disabled
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="学号" prop="xh">
            <el-select
              v-model="form.xh"
              placeholder="请输入学号/姓名关键字搜索"
              clearable
              filterable
              remote
              :remote-method="getStudentOptionsData"
              :loading="loading"
              style="width: 100%"
            >
              <el-option v-for="item in studentOptions" 
                :key="item.xh" 
                :label="item.label"
                :value="item.xh" />
            </el-select>
          </el-form-item>
          <el-form-item label="班级名称" prop="bjmc">
            <el-input
              v-model="form.bjmc"
              placeholder="如101，202等"
              maxlength="50"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="宿舍编号" prop="ssbh">
            <el-input
              v-model="form.ssbh"
              placeholder="请输入宿舍编号"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="查寝时间" prop="cqsj">
            <el-date-picker
              v-model="form.cqsj"
              type="datetime"
              placeholder="请选择查寝时间"
              value-format="YYYYMMDDHHmmss"
              format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="查寝人" prop="cqr">
            <el-input
              v-model="form.cqr"
              placeholder="请输入查寝人"
              maxlength="20"
            />
          </el-form-item>
        </div>
        <div class="form-row status-row">
          <el-form-item label="在寝状态" prop="zqzt">
            <el-select
              v-model="form.zqzt"
              placeholder="请选择在寝状态"
              style="width: 100%"
            >
              <el-option 
                v-for="item in zqztdmOptions" 
                :key="item.value"
                :label="item.label"
                :value="item.value" 
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="form-row description-row">
          <el-form-item label="情况说明" prop="qksm" class="full-width">
            <el-input
              v-model="form.qksm"
              type="textarea"
              :rows="3"
              placeholder="请输入情况说明"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </div>
        <div class="form-row">
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
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="form.enableStatus"
              placeholder="请选择启用状态"
              style="width: 100%"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="detail-view">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ form.xh }}</el-descriptions-item>
          <el-descriptions-item label="班级名称">{{ form.bjmc }}</el-descriptions-item>
          <el-descriptions-item label="宿舍编号">{{ form.ssbh }}</el-descriptions-item>
          <el-descriptions-item label="查寝时间">{{ form.cqsj || '-' }}</el-descriptions-item>
          <el-descriptions-item label="查寝人">{{ form.cqr }}</el-descriptions-item>
          <el-descriptions-item label="在寝状态">
            <el-tag :type="form.zqzt === '1' ? 'success' : 'danger'">
              {{ form.zqzt === "1" ? "在寝" : "不在寝" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="情况说明">{{ form.qksm }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="
                form.reportStatus === '1'
                  ? 'success'
                  : form.reportStatus === '2'
                  ? 'danger'
                  : 'warning'
              "
              size="small"
            >
              {{
                form.reportStatus === "1"
                  ? "已上报"
                  : form.reportStatus === "2"
                  ? "上报失败"
                  : "未上报"
              }}
            </el-tag>
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
  getOdsXszscqsjPage,
  getOdsXszscqsjById,
  addOdsXszscqsj,
  updateOdsXszscqsj,
  deleteOdsXszscqsj,
  batchDeleteOdsXszscqsj,
  exportOdsXszscqsj,
  getSystemSchoolCode,
  getStudentOptions,  
  getZqztdmOptions,
  type StudentOption,
  type DictOption,
  type OdsXszscqsjInfo,
  type OdsXszscqsjQuery,
  type OdsXszscqsjForm,
} from "@/api-data/data/data_base/zygxs/ods_xszscqsj";
// 在寝状态代码
const zqztdmOptions = ref<DictOption[]>([]);
// 搜索条件
const queryParams = reactive<OdsXszscqsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  bjmc: "",
  ssbh: "",
  zqzt: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXszscqsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const schoolCode = ref("");
const studentOptions = ref<StudentOption[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXszscqsjForm & { enableStatus?: string }>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: schoolCode.value,
  xh: "",
  bjmc: "",
  ssbh: "",
  cqsj: "",
  cqr: "",
  zqzt: "",
  qksm: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { 
      validator: (rule: any, value: string, callback: any) => {
        if (!value) {
          // 如果为空，允许通过（后端会自动生成）
          callback();
          return;
        }
        if (value.length !== 32) {
          callback(new Error("唯一性标识必须为32位字符"));
          return;
        }
        // 验证是否只包含大写字母和数字
        const regex = /^[A-Z0-9]{32}$/;
        if (!regex.test(value)) {
          callback(new Error("唯一性标识只能包含大写字母和数字"));
          return;
        }
        callback();
      }, 
      trigger: "blur" 
    }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "长度不能超过10个字符", trigger: "blur" }
  ],
  xh: [
    { required: true, message: "请选择学号", trigger: "change" }
  ],
  bjmc: [
    { required: true, message: "请输入班级名称", trigger: "blur" },
    { max: 50, message: "长度不能超过50个字符", trigger: "blur" }
  ],
  ssbh: [
    { required: true, message: "请输入宿舍编号", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" }
  ],
  cqsj: [
    { required: true, message: "请选择查寝时间", trigger: "change" }
  ],
  cqr: [
    { required: true, message: "请输入查寝人", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" }
  ],
  zqzt: [
    { required: true, message: "请选择在寝状态", trigger: "change" }
  ],
  qksm: [
    { required: true, message: "请输入情况说明", trigger: "blur" },
    { max: 200, message: "长度不能超过200个字符", trigger: "blur" }
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" }
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" }
  ]
});

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增学生住宿查寝数据",
    edit: "编辑学生住宿查寝数据",
    view: "查看学生住宿查寝数据详情",
  };
  return titleMap[dialogMode.value];
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsXszscqsjPage(queryParams)  as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};


// 获取学生选项
const getStudentOptionsData = async () => {
  const response = await getStudentOptions() as any;
  if (response.data.code === 200) {
    studentOptions.value = response.data.data;
  }
};
// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: schoolCode.value,
    xh: "",
    bjmc: "",
    ssbh: "",
    zqzt: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
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

// 选择
const handleSelectionChange = (selection: OdsXszscqsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 新增
const handleAdd = async () => {
  dialogMode.value = "add";
  resetForm();
  // 确保设置学校代码
  form.xxdm = schoolCode.value;
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (id: number) => {
  dialogMode.value = "edit";
  resetForm();
  
  try {
    const response = await getOdsXszscqsjById(id) as any;
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
      return;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
    return;
  }
  
  dialogVisible.value = true;
};

// 查看
const handleView = async (id: number) => {
  dialogMode.value = "view";
  resetForm();
  
  try {
    const response = await getOdsXszscqsjById(id) as any;
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
      return;
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
    return;
  }
  
  dialogVisible.value = true;
};

// 删除
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsXszscqsj(id) as any;
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请先选择要删除的记录");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    const response = await batchDeleteOdsXszscqsj(selectedIds.value) as any;
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXszscqsj(queryParams);
    
    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生住宿查寝数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const api = dialogMode.value === "add" ? addOdsXszscqsj : updateOdsXszscqsj;
    const response = await api(form) as any;

    if (response.data.code === 200) {
      ElMessage.success(
        dialogMode.value === "add" ? "新增成功" : "更新成功"
      );
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.message || "操作失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("提交失败");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: schoolCode.value, // 重置时也要保持学校代码
    xh: "",
    bjmc: "",
    ssbh: "",
    cqsj: "",
    cqr: "",
    zqzt: "",
    qksm: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 行点击
const handleRowClick = (row: OdsXszscqsjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXszscqsjInfo) => {
  handleView(row.id);
};

// 格式化时间显示
const formatDisplayTime = (time: string) => {
  if (!time) return "-";
  if (time.length === 14) {
    return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12)}`;
  }
  if (time.length === 8) {
    return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}`;
  }
  return time;
};

// 处理唯一性标识输入
const handleZjsjwyxbsInput = (value: string) => {
  // 自动转换为大写并过滤无效字符
  const upperValue = value.toUpperCase();
  // 只保留大写字母和数字
  const filteredValue = upperValue.replace(/[^A-Z0-9]/g, '');
  form.zjsjwyxbs = filteredValue;
};
// 获取学校代码
const getSchoolCodeData = async () => {
  try {
    const response = await getSystemSchoolCode() as any;
    if (response.data.code === 200) {
      schoolCode.value = response.data.data
      
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};
// 获取在寝状态代码
const getZqztdmOptionsData = async () => {
  try {
    const response = await getZqztdmOptions() as any;
    if (response.data.code === 200) {
      zqztdmOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("获取在寝状态代码失败:", error);
  }
};
// 页面加载
onMounted(() => {
  getSchoolCodeData();
  getZqztdmOptionsData();
  getList();
});
</script>

<style scoped>
.student-leave-management {
  padding: 20px;
}

.search-card {
  margin-bottom: 12px;
  
  :deep(.el-card__body) {
    padding: 12px 16px;
  }
}

.search-form {
  .form-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .form-row {
    display: flex;
    align-items: center;
    gap: 16px;
    
  }

  :deep(.el-form-item) {
    margin: 0;
    
    .el-form-item__label {
      width: 48px;
      justify-content: flex-end;
      padding-right: 4px;
      line-height: 32px;
      font-size: 13px;
      color: #606266;
    }

    .el-form-item__content {
      .el-input,
      .el-select {
        width: 180px;

        &.fixed-width {
          width: 100px;
        }
        
        .el-input__wrapper {
          padding: 0 8px;
        }
      }
    }
  }
}

.form-buttons {
  display: flex;
  gap: 8px;
  margin-left: auto;

  .el-button {
    padding: 8px 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    
    .el-icon {
      margin: 0;
    }
  }
}

.table-card {
  min-height: calc(100vh - 200px);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.table-body {
  margin-top: 16px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 4px;
}

.total-info {
  font-size: 14px;
  color: #606266;
}

.pagination-controls {
  display: flex;
  align-items: center;
}

.student-leave-dialog {
  :deep(.el-dialog__body) {
    padding: 20px;
    height: calc(100% - 110px);
    overflow-y: auto;
  }

  :deep(.el-dialog__header) {
    margin: 0;
    padding: 15px 20px;
    border-bottom: 1px solid #dcdfe6;
  }

  :deep(.el-dialog__footer) {
    margin: 0;
    padding: 15px 20px;
    border-top: 1px solid #dcdfe6;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }

  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-date-picker) {
    width: 100%;
  }
}

.student-leave-detail {
  height: 100%;
  overflow-y: auto;
  padding: 0 10px;

  .detail-descriptions {
    margin: 0;
  }

  .detail-value {
    word-break: break-all;
    color: #606266;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* 响应式布局 */
@media screen and (max-width: 1200px) {
  .search-form {
    .form-items {
      flex-direction: column;
      align-items: flex-start;
    }

    .form-item-group {
      flex-wrap: wrap;
      gap: 12px;
    }

    .form-buttons {
      margin-left: 0;
      padding-top: 8px;
      width: 100%;
      justify-content: flex-end;
    }
  }
}

.dialog-form {
  .form-row {
    display: flex;
    gap: 8px;
    margin-bottom: 18px;
    width: 100%;
  }

  .form-row :deep(.el-form-item) {
    flex: 1;
    margin-bottom: 0;
    display: flex;
    min-width: 0;
  }

  .form-row :deep(.el-form-item) .el-form-item__label {
    padding: 0 8px 0 0;
    line-height: 32px;
    font-size: 13px;
    height: 32px;
    width: 120px !important;
    text-align: right;
    flex: none;
  }

  .form-row :deep(.el-form-item) .el-form-item__content {
    flex: 1;
    line-height: 32px;
    margin-left: 0 !important;
    width: 0;
  }

  .form-row :deep(.el-form-item) .el-form-item__content .el-input__wrapper,
  .form-row :deep(.el-form-item) .el-form-item__content .el-select,
  .form-row :deep(.el-form-item) .el-form-item__content .el-date-picker {
    height: 32px;
    width: 100%;
  }

  .form-row :deep(.el-form-item) .el-form-item__content .el-textarea__inner {
    min-height: 50px !important;
  }

  .form-row :deep(.el-form-item) .el-form-item__content .el-input__wrapper {
    padding: 0 8px;
  }

  .form-row.status-row :deep(.el-form-item),
  .form-row.description-row :deep(.el-form-item) {
    flex: 0 0 100%;
  }

  .form-row.status-row :deep(.el-form-item) .el-form-item__content,
  .form-row.description-row :deep(.el-form-item) .el-form-item__content {
    max-width: calc(100% - 120px); /* 减去label宽度 */
  }

  .form-row:last-child {
    margin-bottom: 0;
  }
}

:deep(.el-dialog) .el-dialog__body {
  padding: 16px 20px;
}

:deep(.el-dialog) .el-dialog__header {
  margin: 0;
  padding: 12px 20px;
  border-bottom: 1px solid #dcdfe6;
}

:deep(.el-dialog) .el-dialog__footer {
  margin: 0;
  padding: 12px 20px;
  border-top: 1px solid #dcdfe6;
}
</style>

