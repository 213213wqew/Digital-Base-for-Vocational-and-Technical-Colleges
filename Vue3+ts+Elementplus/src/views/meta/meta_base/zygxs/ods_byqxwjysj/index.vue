<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="姓名/学号" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名或学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="专业名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入专业名称"
              clearable
            />
          </el-form-item>
          <el-form-item label-width="100px" label="未就业类型" prop="wjylxm">
            <el-select
              v-model="queryParams.wjylxm"
              placeholder="请选择未就业类型"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in wjylxOptions"
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
        <div class="header-title">毕业去向【未就业】数据管理</div>
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
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xm"
            label="姓名"
            min-width="120"
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
            prop="zymc"
            label="专业名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="wjylxmText"
            label="未就业类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 440px"
      class="professional-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogType !== 'view'"
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
                disabled
                placeholder="系统自动获取学校代码"
                maxlength="10"
                readonly
                
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.xh"
                placeholder="请选择学号/姓名"
                clearable
                filterable
                remote
                :remote-method="getStudentOptionsData"
                @change="handleStudentChange"
                style="width: 100%"
              >
              <el-option
                  v-for="item in studentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="xm">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
                v-model="form.xm"
                placeholder="请输入姓名"
                maxlength="36"
                show-word-limit
              />
              <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业号" prop="zyh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
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
          <el-col :span="12">
            <el-form-item label="专业名称" prop="zymc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-input
                v-model="form.zymc"
                placeholder="请输入专业名称"
                maxlength="60"
                show-word-limit
              />
              <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="未就业类型" prop="wjylxm">
              <el-select
                v-model="form.wjylxm"
                placeholder="请选择未就业类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in wjylxOptions"
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
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
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
          <el-descriptions-item label="学号">
            <div class="detail-value">{{ form.xh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="姓名">
            <div class="detail-value">{{ form.xm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业名称">
            <div class="detail-value">{{ form.zymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="未就业类型">
            <div class="detail-value">
              {{ getWjylxText(form.wjylxm || '') || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj || '') || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || '0') }}
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
          <el-descriptions-item label="备注" :span="2">
            <div class="detail-value">{{ form.bz || "-" }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogType !== 'view'"
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
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  View,
  Edit,
  Upload,
} from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";
import {
  getOdsByqxwjysjPage,
  getOdsByqxwjysjById,
  addOdsByqxwjysj,
  updateOdsByqxwjysj,
  deleteOdsByqxwjysj,
  batchDeleteOdsByqxwjysj,
  updateSingleEnableStatus,
  exportOdsByqxwjysj,
  getWjylxOptions,
  batchReport,
  getSystemSchoolCode,
  getStudentOptions,
  type OdsByqxwjysjInfo,
  type OdsByqxwjysjQuery,
  type OdsByqxwjysjForm,
  type DictOption,
  type StudentOption,
} from "@/api/meta/meta_base/zygxs/ods_byqxwjysj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsByqxwjysjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const systemSchoolCode = ref("");
const studentOptions =  ref<StudentOption[]>([]);
// 字典数据
const wjylxOptions = ref<DictOption[]>([]);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsByqxwjysjQuery>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xm: "",
  zyh: "",
  zymc: "",
  wjylxm: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsByqxwjysjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xm: "",
  zyh: "",
  zymc: "",
  wjylxm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
  bz: "",
});

// 表单验证规则
const formRules = {
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
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  xh: [{ required: true, message: "学号不能为空", trigger: "blur" }],
  xm: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  zymc: [{ required: true, message: "专业名称不能为空", trigger: "blur" }],
  wjylxm: [
    { required: true, message: "未就业类型不能为空", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
  ],
};

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogType.value) {
    case "add":
      return "新增毕业去向【未就业】数据";
    case "edit":
      return "编辑毕业去向【未就业】数据";
    case "view":
      return "查看毕业去向【未就业】数据";
    default:
      return "";
  }
});

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsByqxwjysjPage(queryParams) as any;
    const data = response.data.data || response.data;
    dataList.value = data.records || [];
    total.value = data.total || 0;
  } catch (error: any) {
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

// 重置
const resetQuery = () => {
  Object.assign(queryParams, {
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xm: "",
    zyh: "",
    zymc: "",
    wjylxm: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    reportStatus: "",
    enableStatus: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 表格选择变化
const handleSelectionChange = (selection: OdsByqxwjysjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击事件
const handleRowClick = (row: OdsByqxwjysjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击事件
const handleRowDblClick = (row: OdsByqxwjysjInfo) => {
  handleView(row);
};

// 分页函数
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xm: "",
    zyh: "",
    zymc: "",
    wjylxm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
    bz: "",
  });
  formRef.value?.resetFields();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsByqxwjysjInfo) => {
  try {
    const response: any = await getOdsByqxwjysjById(row.id) as any;
    const data = response.data.data || response.data;
    Object.assign(form, data);
    dialogType.value = "edit";
    dialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsByqxwjysjInfo) => {
  try {
    const response: any = await getOdsByqxwjysjById(row.id) as any;
    const data = response.data.data || response.data;
    Object.assign(form, data);
    dialogType.value = "view";
    dialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error("获取数据失败");
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (dialogType.value === "edit") {
          await updateOdsByqxwjysj(form);
          ElMessage.success("修改成功");
        } else {
          await addOdsByqxwjysj(form);
          ElMessage.success("新增成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error: any) {
        ElMessage.error(dialogType.value === "edit" ? "修改失败" : "新增失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 删除
const handleDelete = (row: OdsByqxwjysjInfo) => {
  ElMessageBox.confirm(`确定要删除学号为"${row.xh}"的数据吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response: any = await deleteOdsByqxwjysj(row.id);
        if(response.code === 200){
          ElMessage.success("删除成功");
          getList();
        }else{
          ElMessage.error(response.message);
        }
      } catch (error: any) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
    "批量删除确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await batchDeleteOdsByqxwjysj(selectedIds.value);
        ElMessage.success("批量删除成功");
        selectedIds.value = [];
        getList();
      } catch (error: any) {
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportOdsByqxwjysj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.ms-excel",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const filename = `毕业去向【未就业】数据_${timestamp}.xlsx`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败: " + (error.message || "未知错误"));
  }
};

// 批量上报
const handleBatchReport = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要上报的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要上报选中的 ${selectedIds.value.length} 条数据吗？`,
    "批量上报确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await batchReport(selectedIds.value);
        ElMessage.success("批量上报成功");
        getList();
      } catch (error: any) {
        ElMessage.error("批量上报失败");
      }
    })
    .catch(() => {
      ElMessage.info("已取消上报");
    });
};

// 状态切换
const handleEnableStatusChange = async (row: OdsByqxwjysjInfo) => {
  try {
    await updateSingleEnableStatus(row.id, row.enableStatus);
    ElMessage.success("状态修改成功");
  } catch (error: any) {
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    ElMessage.error("状态修改失败");
  }
};

// 状态处理函数
const getReportStatusTagType = (status: string | number) => {
  switch (String(status)) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

const getReportStatusText = (status: string | number): string => {
  switch (String(status)) {
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

// 获取未就业类型文本
const getWjylxText = (value: string): string => {
  const option = wjylxOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 格式化显示时间
const formatDisplayTime = (time: string): string => {
  if (!time) return "";
  if (time.length === 14) {
    return `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)} ${time.substring(8, 10)}:${time.substring(10, 12)}:${time.substring(12, 14)}`;
  }
  return time;
};

// 获取字典数据
const loadDictData = async () => {
  try {
    const response = await getWjylxOptions() as any;
    wjylxOptions.value = response.data.data || [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};
// 获取学校代码
const getSystemSchoolCodeData = async () => {
  const response = await getSystemSchoolCode() as any;
  systemSchoolCode.value = response.data.data || "";
};
// 获取学生综合信息选项列表
const getStudentOptionsData = async (query?: string) => {
  try {
    const response = await getStudentOptions(query) as any;
    studentOptions.value = response.data?.data || [];
  } catch (error) {
    console.error('获取学生数据失败:', error);
    ElMessage.error('获取学生数据失败');
  }
};
// 学号选择变化
const handleStudentChange = (value: string) => {
  const selectedOption = studentOptions.value.find(item => item.value === value);
  if (selectedOption) {
    form.xh = selectedOption.xh;
    form.xm = selectedOption.xsxm;
    form.zyh = selectedOption.zyh;
    form.zymc = selectedOption.zymc;
  } else {
    // 清空相关字段
    form.xm = '';
    form.zyh = '';
    form.zymc = '';
  }
};

// 初始化
onMounted(() => {

  getSystemSchoolCodeData();
 
  loadDictData();
  getList();
});
</script>

<style scoped lang="scss">
.professional-development-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    .search-bar {
      :deep(.el-form) {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
      }

      :deep(.el-form-item) {
        margin-bottom: 0;
        margin-right: 10px;
      }

      :deep(.el-form-item__label) {
        width: 70px;
        text-align: right;
        padding-right: 4px;
        font-size: 14px;
      }

      :deep(.el-input__wrapper),
      :deep(.el-select) {
        width: 160px;
        font-size: 14px;
      }

      :deep(.el-button) {
        font-size: 14px;
      }

      :deep(.el-form-item:last-child) {
        margin-left: auto;
        margin-right: 0;
      }
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }
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
</style>
