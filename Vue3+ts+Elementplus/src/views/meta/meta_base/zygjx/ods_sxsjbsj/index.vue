<template>
  <div class="professional-development-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="实训室号" prop="sxsh">
            <el-input
              v-model="queryParams.sxsh"
              placeholder="请输入实训室号"
              clearable
            />
          </el-form-item>
          <el-form-item label="实训室名称" prop="sxsmc">
            <el-input
              v-model="queryParams.sxsmc"
              placeholder="请输入实训室名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="管理单位" prop="ssgldwmc">
            <el-input
              v-model="queryParams.ssgldwmc"
              placeholder="请输入管理单位"
              clearable
            />
          </el-form-item>
          <el-form-item label="负责人教工号" prop="fzrjgh">
            <el-input
              v-model="queryParams.fzrjgh"
              placeholder="请输入负责人教工号"
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
        <div class="header-title">实习实践基本数据子类表</div>
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
            prop="sxsh"
            label="实训室号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sxsmc"
            label="实训室名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="ssgldwmc"
            label="管理单位"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sssxjdbh"
            label="实训基地编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="fzrjgh"
            label="负责人教工号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="gws"
            label="工位数"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="fjh"
            label="房间号"
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
      style="height: 590px"
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
                placeholder="系统自动获取学校代码"
                :disabled="true"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训室号" prop="sxsh">
              <el-input
                v-model="form.sxsh"
                placeholder="请输入实训室号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地编号" prop="sssxjdbh">
              <el-input
                v-model="form.sssxjdbh"
                placeholder="请输入实训基地编号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训基地名称" prop="sxsmc">
              <el-input
                v-model="form.sxsmc"
                placeholder="请输入实训基地名称"
                maxlength="110"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属管理单位名称" prop="ssgldwmc">
              <el-input
                v-model="form.ssgldwmc"
                placeholder="请输入所属管理单位名称"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人教工号" prop="fzrjgh">
              <el-input
                v-model="form.fzrjgh"
                placeholder="请输入负责人教工号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工位数" prop="gws">
              <el-input-number
                v-model="form.gws"
                placeholder="请输入工位数"
                :min="0"
                :max="9999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房间号" prop="fjh">
              <el-input
                v-model="form.fjh"
                placeholder="请输入房间号"
                maxlength="40"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="房间名称" prop="fjmc">
              <el-input
                v-model="form.fjmc"
                placeholder="请输入房间名称"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实训室建立日期" prop="sxsjlrq">
              <el-date-picker
                v-model="form.sxsjlrq"
                type="date"
                placeholder="请选择实训室建立日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
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
          <el-col :span="24">
            <el-form-item label="基地合作企业" prop="syshzqy">
              <el-input
                v-model="form.syshzqy"
                type="textarea"
                :rows="3"
                placeholder="请输入基地合作企业信息（可选，最多200字符）"
                maxlength="200"
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
          <el-descriptions-item label="实训室号">
            <div class="detail-value">{{ form.sxsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训室名称">
            <div class="detail-value">{{ form.sxsmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属管理单位名称">
            <div class="detail-value">{{ form.ssgldwmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属实训基地编号">
            <div class="detail-value">{{ form.sssxjdbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实训室建立日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.sxsjlrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="负责人教工号">
            <div class="detail-value">{{ form.fzrjgh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="工位数">
            <div class="detail-value">{{ form.gws || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="房间号">
            <div class="detail-value">{{ form.fjh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="房间名称">
            <div class="detail-value">{{ form.fjmc || "-" }}</div>
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
          <el-descriptions-item label="实验室合作企业" :span="2">
            <div class="detail-value">{{ form.syshzqy || "-" }}</div>
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

import {
  getOdsSxsjbsjPage,
  getOdsSxsjbsjById,
  addOdsSxsjbsj,
  updateOdsSxsjbsj,
  deleteOdsSxsjbsj,
  batchDeleteOdsSxsjbsj,
  exportOdsSxsjbsj,
  getSxjdlbmDict,
  getSystemSchoolCode,
  type OdsSxsjbsjInfo,
  type OdsSxsjbsjQuery,
  type DictOption,
} from "@/api/meta/meta_base/zygjx/ods_sxsjbsj";

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const dataList = ref<OdsSxsjbsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);

// 对话框控制
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");

// 表单引用
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsSxsjbsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  sxsh: "",
  sxsmc: "",
  ssgldwmc: "",
  sssxjdbh: "",
  fzrjgh: "",
  fjh: "",
  fjmc: "",
  syshzqy: "",
  sxsjlrqStart: "",
  sxsjlrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<any>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  sxsh: "",
  sxsmc: "",
  ssgldwmc: "",
  sssxjdbh: "",
  sxsjlrq: "",
  fzrjgh: "",
  gws: undefined,
  fjh: "",
  fjmc: "",
  syshzqy: "",
  ytdw: "",
  syzymc: "",
  sxjdlbm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  sssxjdbh: [
    { required: true, message: "请输入实训基地编号", trigger: "blur" },
    { max: 64, message: "实训基地编号长度不能超过64位", trigger: "blur" },
  ],
  sxsh: [
    { required: true, message: "请输入实训室号", trigger: "blur" },
    { max: 64, message: "实训室号长度不能超过64位", trigger: "blur" },
  ],
  sxsmc: [
    { required: true, message: "请输入实训室名称", trigger: "blur" },
    { max: 110, message: "实训室名称长度不能超过110位", trigger: "blur" },
  ],
  ssgldwmc: [
    { max: 50, message: "所属管理单位名称长度不能超过50位", trigger: "blur" },
  ],
  sxsjlrq: [
    { required: true, message: "请选择实训基地建立日期", trigger: "change" },
  ],
  ytdw: [
    { required: true, message: "请输入依托单位", trigger: "blur" },
    { max: 120, message: "依托单位长度不能超过120位", trigger: "blur" },
  ],
  syzymc: [
    { max: 180, message: "适应专业名称长度不能超过180位", trigger: "blur" },
  ],
  syshzqy: [
    { max: 200, message: "基地合作企业长度不能超过200位", trigger: "blur" },
  ],
  sxjdlbm: [
    { required: true, message: "请选择实训基地类别", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 计算属性
const dialogTitle = computed(() => {
  const titleMap = {
    add: "新增实习实践基本数据",
    edit: "编辑实习实践基本数据",
    view: "查看实习实践基本数据",
  };
  return titleMap[dialogMode.value];
});

// 字典数据
const sxjdlbmOptions = ref<DictOption[]>([]);

// 获取字典数据
const loadDictData = async () => {
  try {
    console.log("开始加载字典数据...");
    const response = await getSxjdlbmDict();

    console.log("实训基地类别字典响应:", response);

    const sxjdlbmData = response as unknown as {
      data: { code: number; data: DictOption[]; message?: string };
    };

    if (sxjdlbmData.data.code === 200) {
      sxjdlbmOptions.value = sxjdlbmData.data.data;
      console.log("实训基地类别字典数据:", sxjdlbmOptions.value);
    } else {
      console.error("获取实训基地类别字典失败:", sxjdlbmData.data.message);
      ElMessage.error(sxjdlbmData.data.message || "获取实训基地类别字典失败");
    }
  } catch (error: any) {
    console.error("获取字典数据失败:", error);
    ElMessage.error(error.message || "获取字典数据失败");
  }
};

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const apiResponse = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (apiResponse?.data?.code === 200 && apiResponse.data.data) {
      form.xxdm = apiResponse.data.data;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取学校代码失败");
    }
  } catch (error: any) {
    console.error("获取学校代码失败:", error);
    ElMessage.error(error.message || "获取学校代码失败");
  }
};

// 查询数据列表
const getList = async () => {
  try {
    loading.value = true;
    const response = await getOdsSxsjbsjPage(queryParams);
    const { data } = response as unknown as {
      data: { code: number; data: any; message?: string };
    };

    if (data.code === 200) {
      dataList.value = data.data.records || [];
      total.value = data.data.total || 0;
    } else {
      ElMessage.error(data.message || "查询失败");
    }
  } catch (error: any) {
    console.error("查询失败:", error);
    ElMessage.error(error.message || "查询失败");
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

// 分页处理
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 选择处理
const handleSelectionChange = (selection: OdsSxsjbsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 新增
const handleAdd = async () => {
  resetForm();
  await getSchoolCode(); // 获取并设置学校代码
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsSxsjbsjInfo) => {
  try {
    const response = await getOdsSxsjbsjById(row.id);
    const { data } = response as unknown as {
      data: { code: number; data: any; message?: string };
    };

    if (data.code === 200) {
      Object.assign(form, data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(data.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 查看
const handleView = async (row: OdsSxsjbsjInfo) => {
  try {
    const response = await getOdsSxsjbsjById(row.id);
    const { data } = response as unknown as {
      data: { code: number; data: any; message?: string };
    };

    if (data.code === 200) {
      Object.assign(form, data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(data.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取数据失败:", error);
    ElMessage.error(error.message || "获取数据失败");
  }
};

// 删除
const handleDelete = async (row: OdsSxsjbsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条实训室基本数据吗？", "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsSxsjbsj(row.id);
    const { data } = response as unknown as {
      data: { code: number; message?: string };
    };

    if (data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(data.message || "删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error(error.message || "删除失败");
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
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsSxsjbsj(selectedIds.value);
    const { data } = response as unknown as {
      data: { code: number; message?: string };
    };

    if (data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(data.message || "批量删除失败");
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error(error.message || "批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");

    const response = await exportOdsSxsjbsj(queryParams);

    let blob: Blob;
    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      throw new Error("服务器返回了错误的响应格式");
    }

    if (blob.size === 0) {
      throw new Error("导出的文件为空，请检查数据或联系管理员");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.download = `实训室基本数据_${new Date().getTime()}.xlsx`;

    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败");
  } finally {
    loading.value = false;
  }
};

// 表单提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;
    let response;

    if (dialogMode.value === "add") {
      response = await addOdsSxsjbsj(form);
    } else {
      response = await updateOdsSxsjbsj(form);
    }

    const { data } = response as unknown as {
      data: { code: number; message?: string };
    };

    if (data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      resetForm();
      getList();
    } else {
      ElMessage.error(data.message || "操作失败");
    }
  } catch (error: any) {
    console.error("操作失败:", error);
    ElMessage.error(error.message || "操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    sxsh: "",
    sxsmc: "",
    ssgldwmc: "",
    sssxjdbh: "",
    sxsjlrq: "",
    fzrjgh: "",
    gws: undefined,
    fjh: "",
    fjmc: "",
    syshzqy: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
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
      return "info";
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
      return "未知状态";
  }
};

// 格式化显示时间
const formatDisplayTime = (timeStr: string | undefined) => {
  if (!timeStr) return "-";
  // 如果是14位的时间格式 YYYYMMDD HHmmss
  if (timeStr.length === 15 && timeStr.includes(" ")) {
    const [datePart, timePart] = timeStr.split(" ");
    if (datePart.length === 8 && timePart.length === 6) {
      return `${datePart.slice(0, 4)}-${datePart.slice(4, 6)}-${datePart.slice(6, 8)} ${timePart.slice(0, 2)}:${timePart.slice(2, 4)}:${timePart.slice(4, 6)}`;
    }
  }
  // 如果是8位的日期格式 YYYYMMDD
  if (timeStr.length === 8) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)}`;
  }
  // 如果是14位连续的时间格式 YYYYMMDDHHMMSS
  if (timeStr.length === 14) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)} ${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}`;
  }
  return timeStr;
};

// 表格行点击事件
const handleRowClick = (row: OdsSxsjbsjInfo) => {
  console.log("行点击:", row);
};

const handleRowDblClick = (row: OdsSxsjbsjInfo) => {
  handleView(row);
};

// 生命周期
onMounted(() => {
  getList();
  loadDictData(); // 加载字典数据
});
</script>

<style scoped>
.professional-development-management {
}

.search-card {
  height: 60px;
}

.search-bar {
  :deep(.el-form) {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .el-form-item {
      margin-bottom: 8px !important;
      margin-right: 0;

      .el-form-item__label {
        font-weight: 500;
        color: #606266;
      }

      .el-input {
        width: 200px;
      }

      .el-select {
        width: 200px;
      }
    }
  }
}

.table-card {
  margin-top: -10px;
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
