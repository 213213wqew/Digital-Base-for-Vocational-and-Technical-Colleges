<template>
  <div class="student-practice-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-row :gutter="16">
             
            <el-col :span="4">
              <el-form-item label="党组织名称" prop="dzzmc">
                <el-input
                  v-model="queryParams.dzzmc"
                  placeholder="请输入党组织名称"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="党组织编号" prop="dzzbh">
                <el-input
                  v-model="queryParams.dzzbh"
                  placeholder="请输入党组织编号"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="党内领导姓名" prop="dnldxm">
                <el-input
                  v-model="queryParams.dnldxm"
                  placeholder="请输入党内领导姓名"
                  clearable
                  @keyup.enter="handleQuery"
                />
              </el-form-item>
            </el-col>
            <el-col :span="4" style="display: flex; justify-content: flex-end; align-items: center;">
              <el-form-item>
                <el-button type="primary" @click="handleQuery">
                  <el-icon><Search /></el-icon>搜索
                </el-button>
                <el-button @click="resetQuery">
                  <el-icon><Refresh /></el-icon>重置
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">党组织情况基础数据管理</div>
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
          :height="'calc(75vh - 135px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dzzlxm"
            label="党组织类型码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dzzmc"
            label="党组织名称"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dzzbh"
            label="党组织编号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="lssjdzzmc"
            label="隶属上级党组织"
            width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dnldxm"
            label="党内领导姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dnldjgh"
            label="党内领导教工号"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dnldzwmText"
            label="党内领导职务"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="dzzdyrs"
            label="党员人数"
            width="100"
            align="center"
          />
          <el-table-column
            prop="dzzztText"
            label="党组织状态"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            width="140"
            show-overflow-tooltip
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag v-if="row.reportStatus === '0'" type="info"
                >未上报</el-tag
              >
              <el-tag v-else-if="row.reportStatus === '1'" type="success"
                >已上报</el-tag
              >
              <el-tag v-else-if="row.reportStatus === '2'" type="danger"
                >上报失败</el-tag
              >
              <span v-else>{{ row.reportStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag v-if="row.enableStatus === '1'" type="success"
                >启用</el-tag
              >
              <el-tag v-else-if="row.enableStatus === '0'" type="info"
                >禁用</el-tag
              >
              <span v-else>{{ row.enableStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            show-overflow-tooltip
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增党组织情况基础数据' : '编辑党组织情况基础数据'"
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="practice-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input v-model="form.zjsjwyxbs" maxlength="32" show-word-limit placeholder="请输入32位大写字母+数字组合" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="学校代码" prop="xxdm" required>
              <el-input disabled v-model="form.xxdm" maxlength="10" show-word-limit placeholder="请输入10位数字学校代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党组织类型码" prop="dzzlxm" required>
              <el-select v-model="form.dzzlxm" placeholder="请选择党组织类型码">
                <el-option v-for="item in dzzlxmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党组织状态" prop="dzzzt" required>
              <el-select v-model="form.dzzzt" placeholder="请选择党组织状态">
                <el-option v-for="item in dzzztOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px ">
            <el-form-item label="党组织名称" prop="dzzmc" required>
              <el-input v-model="form.dzzmc" maxlength="150" show-word-limit placeholder="请输入党组织名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px ">
            <el-form-item label="党组织编号" prop="dzzbh" required>
              <el-input v-model="form.dzzbh" maxlength="60" show-word-limit placeholder="请输入党组织编号" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px ">
            <el-form-item label="隶属上级党组织名称" prop="lssjdzzmc">
              <el-input v-model="form.lssjdzzmc" maxlength="150" show-word-limit placeholder="请输入隶属上级党组织名称（可选）" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党内领导姓名" prop="dnldxm" required>
              <el-input v-model="form.dnldxm" maxlength="36" show-word-limit placeholder="请输入党内领导姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党内领导教工号" prop="dnldjgh">
              <el-input v-model="form.dnldjgh" maxlength="20" show-word-limit placeholder="请输入党内领导教工号（可选）" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党内领导职务码" prop="dnldzwm">
              <el-select v-model="form.dnldzwm" multiple placeholder="多选，多个代码用英文逗号分隔">
                <el-option v-for="item in dnldzwmOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px ">
            <el-form-item label="党组织党员人数" prop="dzzdyrs">
              <el-input-number v-model="form.dzzdyrs" :min="0" :max="99999" placeholder="请输入党组织党员人数（可选）" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px ">
            <el-form-item label="数据采集时间" prop="sjcjsj" required>
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                value-format="YYYYMMDD HHmmss"
                format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择数据采集时间（格式：YYYYMMDD hhmmss）"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">取消</el-button>
          <el-button
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="党组织情况基础数据详情"
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="practice-dialog"
      destroy-on-close
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="唯一性标识">{{
            currentRecord.zjsjwyxbs
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm
          }}</el-descriptions-item>
          <el-descriptions-item label="党组织类型">{{
            currentRecord.dzzlxmText || currentRecord.dzzlxm
          }}</el-descriptions-item>
          <el-descriptions-item label="党组织状态">{{
            currentRecord.dzzztText || currentRecord.dzzzt
          }}</el-descriptions-item>
          <el-descriptions-item label="党组织名称" :span="2">{{
            currentRecord.dzzmc
          }}</el-descriptions-item>
          <el-descriptions-item label="党组织编号" :span="2">{{
            currentRecord.dzzbh
          }}</el-descriptions-item>
          <el-descriptions-item label="隶属上级党组织名称" :span="2">{{
            currentRecord.lssjdzzmc
          }}</el-descriptions-item>
          <el-descriptions-item label="党内领导姓名">{{
            currentRecord.dnldxm
          }}</el-descriptions-item>
          <el-descriptions-item label="党内领导教工号">{{
            currentRecord.dnldjgh
          }}</el-descriptions-item>
          <el-descriptions-item label="党内领导职务">{{
            currentRecord.dnldzwmText || currentRecord.dnldzwm
          }}</el-descriptions-item>
          <el-descriptions-item label="党组织党员人数">{{
            currentRecord.dzzdyrs
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">{{
            currentRecord.sjcjsj
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag v-if="currentRecord.reportStatus === '0'" type="info"
              >未上报</el-tag
            >
            <el-tag
              v-else-if="currentRecord.reportStatus === '1'"
              type="success"
              >已上报</el-tag
            >
            <el-tag v-else-if="currentRecord.reportStatus === '2'" type="danger"
              >上报失败</el-tag
            >
            <span v-else>{{ currentRecord.reportStatus }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag v-if="currentRecord.enableStatus === '1'" type="success"
              >启用</el-tag
            >
            <el-tag v-else-if="currentRecord.enableStatus === '0'" type="info"
              >禁用</el-tag
            >
            <span v-else>{{ currentRecord.enableStatus }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            currentRecord.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentRecord.updateTime
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
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
  getOdsDzzqkjcsjPage,
  getOdsDzzqkjcsjById,
  addOdsDzzqkjcsj,
  updateOdsDzzqkjcsj,
  deleteOdsDzzqkjcsj,
  batchDeleteOdsDzzqkjcsj,
  exportOdsDzzqkjcsj,
  getDzzlxmDict,
  getDzzztDict,
  getSystemSchoolCode,  
  getDnldzwmDict,
  type DictOption,
  type OdsDzzqkjcsjInfo,
  type OdsDzzqkjcsjQuery,
  type OdsDzzqkjcsjForm,
} from "@/api/meta/meta_base/zygdz/ods_dzzqkjcsj";

// 搜索条件
const queryParams = reactive<OdsDzzqkjcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  dzzlxm: "",
  dzzmc: "",
  dzzbh: "",
  dnldxm: "",
  dnldjgh: "",
  dzzzt: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsDzzqkjcsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const systemSchoolCode = ref("");
// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<any>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  dzzlxm: "",
  dzzmc: "",
  dzzbh: "",
  lssjdzzmc: "",
  dnldxm: "",
  dnldjgh: "",
  dnldzwm: [],
  dzzdyrs: 0,
  dzzzt: "",
  sjcjsj: "",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsDzzqkjcsjInfo | null>(null);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { validator: (rule: any, value: string, callback: Function) => {
      if (!value) {
        callback(); // 为空时通过
      } else if (!/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  dzzlxm: [
    { required: true, message: "请输入党组织类型码", trigger: "blur" },
    { max: 2, message: "党组织类型码长度不能超过2位", trigger: "blur" },
  ],
  dzzmc: [
    { required: true, message: "请输入党组织名称", trigger: "blur" },
    { max: 150, message: "党组织名称长度不能超过150位", trigger: "blur" },
  ],
  dzzbh: [
    { required: true, message: "请输入党组织编号", trigger: "blur" },
    { max: 60, message: "党组织编号长度不能超过60位", trigger: "blur" },
  ],
  lssjdzzmc: [
    { max: 150, message: "隶属上级党组织名称长度不能超过150位", trigger: "blur" },
  ],
  dnldxm: [
    { required: true, message: "请输入党内领导姓名", trigger: "blur" },
    { max: 36, message: "党内领导姓名长度不能超过36位", trigger: "blur" },
  ],
  dnldjgh: [
    { max: 20, message: "党内领导教工号长度不能超过20位", trigger: "blur" },
  ],
  dnldzwm: [
    { validator: (rule: any, value: any, callback: Function) => {
      if (!value || value.length === 0) {
        callback();
      } else {
        const str = Array.isArray(value) ? value.join(',') : value;
        if (str.length > 60) {
          callback(new Error('党内领导职务码长度不能超过60位'));
        } else {
          callback();
        }
      }
    }, trigger: 'blur' }
  ],
  dzzdyrs: [
    { required: true, message: "请输入党组织党员人数", trigger: "blur" }
  ],
  dzzzt: [
    { required: true, message: "请输入党组织状态", trigger: "blur" },
    { max: 1, message: "党组织状态长度不能超过1位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请输入数据采集时间", trigger: "blur" },
    { max: 15, message: "数据采集时间长度不能超过15位", trigger: "blur" },
  ],
});

// 在<script setup>顶部添加：
const dzzlxmOptions = ref<DictOption[]>([]); // 党组织类型码字典
const dzzztOptions = ref<DictOption[]>([]); // 党组织状态字典
const dnldzwmOptions = ref<DictOption[]>([]); // 党内领导职务码字典
// 后续如需动态加载可补充API调用

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsDzzqkjcsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询党组织情况基础数据失败:", error);
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
    dzzlxm: "",
    dzzmc: "",
    dzzbh: "",
    dnldxm: "",
    dnldjgh: "",
    dzzzt: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsDzzqkjcsjInfo) => {
  try {
    const response: any = await getOdsDzzqkjcsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      if (typeof form.dnldzwm === 'string') {
        form.dnldzwm = form.dnldzwm ? form.dnldzwm.split(',') : [];
      }
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取党组织情况基础数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsDzzqkjcsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条党组织情况基础数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsDzzqkjcsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除党组织情况基础数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 查看详情
const handleView = async (row: OdsDzzqkjcsjInfo) => {
  try {
    const response: any = await getOdsDzzqkjcsjById(row.id);
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      if (typeof response.data.data.dnldzwm === 'string') {
        response.data.data.dnldzwm = response.data.data.dnldzwm ? response.data.data.dnldzwm.split(',') : [];
      }
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取党组织情况基础数据详情失败:", error);
    ElMessage.error("获取详情失败");
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
      `确定要删除选中的 ${selectedIds.value.length} 条党组织情况基础数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsDzzqkjcsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除党组织情况基础数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsDzzqkjcsj(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `党组织情况基础数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出党组织情况基础数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsDzzqkjcsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行双击
const handleRowDblClick = (row: OdsDzzqkjcsjInfo) => {
  handleView(row);
};

// 分页
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (Array.isArray(form.dnldzwm)) {
      form.dnldzwm = form.dnldzwm.join(',');
    }

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsDzzqkjcsj(form);
    } else {
      response = await updateOdsDzzqkjcsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("提交党组织情况基础数据失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 详情关闭
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    dzzlxm: "",
    dzzmc: "",
    dzzbh: "",
    lssjdzzmc: "",
    dnldxm: "",
    dnldjgh: "",
    dnldzwm: [],
    dzzdyrs: 0,
    dzzzt: "",
    sjcjsj: "",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
  activeTab.value = "basic";
};
// 获取党组织类型码字典
const getDzzlxmDictData = async () => {
  const response: any = await getDzzlxmDict();
  if (response.data.code === 200) {
    dzzlxmOptions.value = response.data.data;
  }
};
// 获取党组织状态码字典
const getDzzztDictData = async () => {
  const response: any = await getDzzztDict();
  if (response.data.code === 200) {
    dzzztOptions.value = response.data.data;
  }
};
// 获取党内领导职务码字典
const getDnldzwmDictData = async () => {
  const response: any = await getDnldzwmDict();
  if (response.data.code === 200) {
    dnldzwmOptions.value = response.data.data;
  }
};
// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  console.log("1111111111111111111");
  
  console.log(response.data.data);
  
  if (response.data.code === 200) {
    systemSchoolCode.value = response.data.data;
  }
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  getDzzlxmDictData();
  getDzzztDictData();
  getDnldzwmDictData();
 
});
</script>
<style lang="scss" scoped>
.student-practice-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.search-card {
  height: 60px;
  flex-shrink: 0;
}
.search-bar {
  margin-top: -5px;
}
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
  padding: 20px;
  .el-table {
    border-radius: 8px;
    overflow: hidden;
    :deep(.el-table__header-wrapper) {
      .el-table__header {
        .el-table__cell {
          background-color: #f8f9fa;
          border-bottom: 1px solid #e4e7ed;
          font-weight: 600;
          color: #303133;
        }
      }
    }
    :deep(.el-table__body-wrapper) {
      .el-table__row {
        &:hover {
          background-color: #f5f7fa;
        }
        .el-table__cell {
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
  }
}
.action-buttons {
  display: flex;
  gap: 8px;
}
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;
  .total-info {
    color: #606266;
    font-size: 14px;
  }
  .pagination-controls {
    .el-pagination {
      :deep(.el-pagination__editor.el-input) {
        .el-input__wrapper {
          height: 28px;
        }
      }
      :deep(.el-pagination__sizes) {
        .el-select {
          .el-input__wrapper {
            height: 28px;
          }
        }
      }
    }
  }
}
.practice-dialog {
  .el-dialog__header {
    padding: 20px 20px 10px;
    border-bottom: 1px solid #e4e7ed;
  }
  .el-dialog__body {
    padding: 20px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .el-dialog__footer {
    padding: 10px 20px 20px;
    border-top: 1px solid #e4e7ed;
  }
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
