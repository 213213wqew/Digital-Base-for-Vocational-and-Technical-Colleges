<template>
  <div class="system-building-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="所属部门名称" prop="bmmc">
            <el-input
              v-model="queryParams.bmmc"
              placeholder="请输入所属部门名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="信息化系统编号" prop="xxhxtbh">
            <el-input
              v-model="queryParams.xxhxtbh"
              placeholder="请输入信息化系统编号"
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
            :disabled="!multipleSelection.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">信息化系统建设数据编码管理</div>
        <div class="right-buttons">
          <!-- 导入按钮 -->
          <el-tooltip content="导入Excel数据" placement="top">
            <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button>
          </el-tooltip>
          <!-- 刷新按钮 -->
          <el-tooltip content="刷新数据" placement="top">
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            show-overflow-tooltip
            label="主键数据唯一性标识"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            show-overflow-tooltip
            label="学校代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="bmmc"
            show-overflow-tooltip
            label="所属部门名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="xxhxtbh"
            show-overflow-tooltip
            label="信息化系统编号"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="xxhxtjc"
            show-overflow-tooltip
            label="信息化系统简称"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="xxhxtqc"
            show-overflow-tooltip
            label="信息化系统全称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column prop="xxhxtfwdz" label="访问地址" min-width="200">
            <template #default="scope">
              <el-link
                v-if="scope.row.xxhxtfwdz"
                :href="scope.row.xxhxtfwdz"
                target="_blank"
                type="primary"
              >
                {{ scope.row.xxhxtfwdz }}
              </el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getEnableStatusType(row.enableStatus)"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数据采集时间"
            min-width="160"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayTime(row.sjcjsj) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            show-overflow-tooltip
            label="更新时间"
            min-width="160"
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      class="system-building-dialog"
      destroy-on-close
    >
      <!-- 表单内容 -->
      <div class="system-building-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="140px"
          class="form-container dialog-form"
          inline-message
        >
          <!-- 基础信息 -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                <el-input
                  v-model="form.zjsjwyxbs"
                  placeholder="请输入主键数据唯一性标识"
                  maxlength="32"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校代码" prop="xxdm">
                <el-input
                  v-model="form.xxdm"
                  placeholder="系统自动获取学校代码"
                  maxlength="10"
                  readonly
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="所属部门名称" prop="bmmc">
                <el-input
                  v-model="form.bmmc"
                  placeholder="请输入所属部门名称"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="信息化系统编号" prop="xxhxtbh">
                <el-input
                  v-model="form.xxhxtbh"
                  placeholder="请输入信息化系统编号"
                  maxlength="60"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="信息化系统简称" prop="xxhxtjc">
                <el-input
                  v-model="form.xxhxtjc"
                  placeholder="请输入信息化系统简称"
                  maxlength="64"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="信息化系统建设类型" prop="xxhxtjslxm">
                <el-select
                  v-model="form.xxhxtjslxm"
                  placeholder="请选择信息化系统建设类型"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in buildingTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 系统配置 -->
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="信息化系统分类" prop="xxhxtflm">
                <el-select
                  v-model="form.xxhxtflm"
                  placeholder="请选择信息化系统分类"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in systemTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否特色信息化系统" prop="sftsxxhxt">
                <el-select
                  v-model="form.sftsxxhxt"
                  placeholder="请选择是否特色信息化系统"
                  style="width: 100%"
                  clearable
                  @change="handleSpecialSystemChange"
                >
                  <el-option
                    v-for="item in isSpecialSystemOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="场景击穿接入方式" prop="cjjcjrfs">
                <el-select
                  v-model="form.cjjcjrfs"
                  placeholder="请选择场景击穿接入方式"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="item in accessModeOptions"
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
                  style="width: 100%"
                  value-format="YYYYMMDD HHmmss"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 状态信息 -->

          <!-- 详细信息 -->
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="信息化系统全称" prop="xxhxtqc">
                <el-input
                  v-model="form.xxhxtqc"
                  placeholder="请输入信息化系统全称"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="信息化系统访问地址" prop="xxhxtfwdz">
                <el-input
                  v-model="form.xxhxtfwdz"
                  placeholder="请输入信息化系统访问地址（如：https://example.com）"
                  maxlength="1500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="信息化系统描述" prop="xxhxtms">
                <el-input
                  v-model="form.xxhxtms"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入信息化系统描述（150字以内）"
                  maxlength="300"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="上报状态" prop="reportStatus">
                <el-select
                  v-model="form.reportStatus"
                  placeholder="请选择上报状态"
                  style="width: 100%"
                  clearable
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
                  clearable
                >
                  <el-option label="禁用" value="0" />
                  <el-option label="启用" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? "保 存" : "确 定" }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="信息化系统建设数据详情"
      width="900px"
      append-to-body
      class="detail-dialog draggable-dialog"
      destroy-on-close
    >
      <!-- 详情内容 -->
      <div class="system-building-detail">
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="主键数据唯一性标识">
            <span class="detail-value">{{ detailData.zjsjwyxbs || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ detailData.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="所属部门名称">
            <span class="detail-value">{{ detailData.bmmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统编号">
            <span class="detail-value">{{ detailData.xxhxtbh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统分类">
            <span class="detail-value">
              {{ getSystemTypeText(detailData.xxhxtflm) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="是否特色信息化系统">
            <el-tag
              :type="detailData.sftsxxhxt === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ getIsSpecialSystemText(detailData.sftsxxhxt) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统简称">
            <span class="detail-value">{{ detailData.xxhxtjc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="场景击穿接入方式">
            <span class="detail-value">
              {{ getAccessModeText(detailData.cjjcjrfs) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统全称" :span="2">
            <span class="detail-value">{{ detailData.xxhxtqc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统访问地址" :span="2">
            <el-link
              v-if="detailData.xxhxtfwdz"
              :href="detailData.xxhxtfwdz"
              target="_blank"
              type="primary"
              class="detail-link"
            >
              {{ detailData.xxhxtfwdz }}
            </el-link>
            <span v-else class="detail-value">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统建设类型">
            <span class="detail-value">
              {{ getBuildingTypeText(detailData.xxhxtjslxm) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <span class="detail-value">{{
              formatDisplayTime(detailData.sjcjsj)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(detailData.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(detailData.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(detailData.enableStatus)"
              size="small"
            >
              {{ getEnableStatusText(detailData.enableStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="信息化系统描述" :span="2">
            <div class="detail-description">
              {{ detailData.xxhxtms || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{ detailData.createTime || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{ detailData.updateTime || "-" }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>

    <!-- 定时同步设置对话框 -->
    <el-dialog
      v-model="showSyncTimeDialog"
      title="定时同步设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="syncTimeForm" label-width="120px">
        <el-form-item label="模块名称">
          <el-input
            v-model="syncTimeForm.moduleName"
            disabled
            placeholder="信息化系统建设数据"
          />
        </el-form-item>
        <el-form-item label="同步时间">
          <el-date-picker
            v-model="syncTimeForm.syncTime"
            type="datetime"
            placeholder="选择同步时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch
            v-model="syncTimeForm.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="syncTimeForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showSyncTimeDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSyncTime">保存</el-button>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入信息化系统建设数据"
      v-model="importVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip
              effect="dark"
              placement="top"
              :content="importTipContent"
            >
              <el-icon class="import-tip-icon">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Upload,
  View,
  Edit,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  getSystemBuildingDataPage,
  deleteSystemBuildingData,
  batchDeleteSystemBuildingData,
  exportSystemBuildingData,
  importSystemBuildingData,
  getSystemBuildingDataById,
  saveSyncSchedule,
  addSystemBuildingData,
  updateSystemBuildingData,
  getSystemTypeOptions,
  getIsSpecialSystemOptions,
  getAccessModeOptions,
  getBuildingTypeOptions,
  getSystemSchoolCode,
  type SyncSchedule,
  type DictOption,
} from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";
import type {
  MetaBaseZygxxOdsXxhxtjssjInfo,
  MetaBaseZygxxOdsXxhxtjssjQuery,
  MetaBaseZygxxOdsXxhxtjssjForm,
} from "@/api-code/code/code_base/zygxx/ods_xxhxtjssj";

// 响应式数据
const loading = ref(false);
const dataList = ref<MetaBaseZygxxOdsXxhxtjssjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<MetaBaseZygxxOdsXxhxtjssjInfo[]>([]);

// 查询表单引用
const queryFormRef = ref<FormInstance>();

// 导入相关
const importVisible = ref(false);
const uploadRef = ref();

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 支持.xls和.xlsx格式文件`;

// 查询参数
const queryParams = reactive<MetaBaseZygxxOdsXxhxtjssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  bmmc: "",
  xxhxtbh: "",
  pageNum: 1,
  pageSize: 100,
});

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const formRef = ref<FormInstance>();

// 详情对话框
const detailVisible = ref(false);
const detailData = ref<MetaBaseZygxxOdsXxhxtjssjInfo>(
  {} as MetaBaseZygxxOdsXxhxtjssjInfo,
);

// 表单数据
const form = reactive<MetaBaseZygxxOdsXxhxtjssjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  bmmc: "",
  xxhxtbh: "",
  xxhxtflm: "",
  xxhxtjc: "",
  xxhxtqc: "",
  xxhxtfwdz: "",
  sftsxxhxt: "",
  cjjcjrfs: "",
  xxhxtms: "",
  xxhxtjslxm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 字典选项
const systemTypeOptions = ref<DictOption[]>([]);
const isSpecialSystemOptions = ref<DictOption[]>([]);
const accessModeOptions = ref<DictOption[]>([]);
const buildingTypeOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单验证规则
const formRules: FormRules = {
  zjsjwyxbs: [
    { required: true, message: "请输入主键数据唯一性标识", trigger: "blur" },
    {
      max: 32,
      message: "主键数据唯一性标识长度不能超过32个字符",
      trigger: "blur",
    },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "主键数据唯一性标识必须为32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
    {
      pattern: /^\d{10}$/,
      message: "学校代码必须为10位数字",
      trigger: "blur",
    },
  ],
  bmmc: [
    { required: true, message: "请输入所属部门名称", trigger: "blur" },
    { max: 200, message: "所属部门名称长度不能超过200个字符", trigger: "blur" },
  ],
  xxhxtbh: [
    { required: true, message: "请输入信息化系统编号", trigger: "blur" },
    { max: 60, message: "信息化系统编号长度不能超过60个字符", trigger: "blur" },
  ],
  xxhxtflm: [
    { required: true, message: "请选择信息化系统分类", trigger: "change" },
  ],
  xxhxtjc: [
    { required: true, message: "请输入信息化系统简称", trigger: "blur" },
    { max: 64, message: "信息化系统简称长度不能超过64个字符", trigger: "blur" },
  ],
  xxhxtqc: [
    { required: true, message: "请输入信息化系统全称", trigger: "blur" },
    {
      max: 200,
      message: "信息化系统全称长度不能超过200个字符",
      trigger: "blur",
    },
  ],
  xxhxtfwdz: [
    { required: true, message: "请输入信息化系统访问地址", trigger: "blur" },
    {
      pattern: /^https?:\/\/.+/,
      message: "请输入有效的URL地址（以http://或https://开头）",
      trigger: "blur",
    },
    { max: 1500, message: "访问地址长度不能超过1500个字符", trigger: "blur" },
  ],
  sftsxxhxt: [
    { required: true, message: "请选择是否特色信息化系统", trigger: "change" },
  ],
  cjjcjrfs: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        // 如果是特色信息化系统，则场景击穿接入方式为必填
        if (form.sftsxxhxt === "1" && (!value || value === "")) {
          callback(new Error("特色信息化系统必须选择场景击穿接入方式"));
        } else {
          callback();
        }
      },
      trigger: "change",
    },
  ],
  xxhxtms: [
    { required: true, message: "请输入信息化系统描述", trigger: "blur" },
    {
      max: 300,
      message: "信息化系统描述长度不能超过300个字符",
      trigger: "blur",
    },
  ],
  xxhxtjslxm: [
    { required: true, message: "请选择信息化系统建设类型", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
};

// 定时同步相关
const showSyncTimeDialog = ref(false);

// 定时同步表单
const syncTimeForm = ref<SyncSchedule>({
  moduleName: "信息化系统建设数据",
  syncTime: "",
  enabled: false,
  remark: "",
});

// 时间格式化显示函数
const formatDisplayTime = (timeStr: string): string => {
  if (!timeStr) return "-";

  // 如果是14位格式YYYYMMDDhhmmss，转换为可读格式
  if (timeStr.length === 14 && /^\d{14}$/.test(timeStr)) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(8, 10);
    const minute = timeStr.substring(10, 12);
    const second = timeStr.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }

  // 其他格式直接返回
  return timeStr;
};

// 上报状态文本映射
const getReportStatusText = (status: string): string => {
  console.log("上报状态值:", status, "类型:", typeof status);
  if (!status && status !== "0") {
    return "未上报"; // 默认为未上报
  }
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

// 上报状态标签类型映射
const getReportStatusType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "info"; // 默认为info
  }
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

// 启用状态文本映射
const getEnableStatusText = (status: string): string => {
  console.log("启用状态值:", status, "类型:", typeof status);
  if (!status && status !== "0") {
    return "启用"; // 默认为启用
  }
  switch (String(status)) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "未知";
  }
};

// 启用状态标签类型映射
const getEnableStatusType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "success"; // 默认为success
  }
  switch (String(status)) {
    case "0":
      return "danger";
    case "1":
      return "success";
    default:
      return "info";
  }
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const response = await getSystemBuildingDataPage(queryParams);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      dataList.value = responseData.data.records || [];
      total.value = responseData.data.total;
    } else {
      const msg = responseData?.message || "获取列表失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.bmmc = "";
  queryParams.xxhxtbh = "";
  queryParams.pageNum = 1;
  getList();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: MetaBaseZygxxOdsXxhxtjssjInfo[]) => {
  multipleSelection.value = selection;
};

/** 新增按钮操作 */
const handleAdd = async () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogTitle.value = "新增信息化系统建设数据";
  isEdit.value = false;
  dialogVisible.value = true;
};

/** 查看操作 */
const handleView = async (row: MetaBaseZygxxOdsXxhxtjssjInfo) => {
  try {
    loading.value = true;
    const response = await getSystemBuildingDataById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      detailData.value = responseData.data;
      detailVisible.value = true;
    } else {
      const msg = responseData?.message || "获取详情失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

/** 修改按钮操作 */
const handleEdit = async (row: MetaBaseZygxxOdsXxhxtjssjInfo) => {
  try {
    loading.value = true;
    const response = await getSystemBuildingDataById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      Object.assign(form, responseData.data);
      dialogTitle.value = "修改信息化系统建设数据";
      isEdit.value = true;
      dialogVisible.value = true;
    } else {
      const msg = responseData?.message || "获取数据失败";
      ElMessage.error(msg);
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取数据失败");
  } finally {
    loading.value = false;
  }
};

/** 删除按钮操作 */
const handleDelete = async (row: MetaBaseZygxxOdsXxhxtjssjInfo) => {
  ElMessageBox.confirm(
    `确定要删除信息化系统"${row.xxhxtjc || row.xxhxtqc}"吗？`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        loading.value = true;
        const response = await deleteSystemBuildingData(row.id);
        const responseData = response.data as any;
        if (responseData && responseData.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          const msg = responseData?.message || "删除失败";
          ElMessage.error(msg);
        }
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

/** 批量删除操作 */
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  const ids = multipleSelection.value.map((item) => item.id);

  ElMessageBox.confirm(`确定要删除选中的 ${ids.length} 条数据吗?`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response = await batchDeleteSystemBuildingData(ids);
        const responseData = response.data as any;
        if (responseData && responseData.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          const msg = responseData?.message || "批量删除失败";
          ElMessage.error(msg);
        }
      } catch (error: any) {
        ElMessage.error(error.message || "批量删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

/** 导出操作 */
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");

    const response = await exportSystemBuildingData(queryParams);

    // 处理文件下载
    let blob: Blob;

    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      blob = new Blob([response.data || response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `信息化系统建设数据_${new Date().toLocaleDateString()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请稍后重试");
  } finally {
    loading.value = false;
  }
};

/** 导入操作 */
const handleImport = () => {
  importVisible.value = true;
};

/** 文件上传前校验 */
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件!");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB!");
    return false;
  }
  return true;
};

/** 自定义文件上传处理 */
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append("file", file);

    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importSystemBuildingData(formData)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);

    let errorMessage = "导入失败";
    if (error?.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 401) {
        errorMessage = "登录已过期，请重新登录";
      } else if (status === 403) {
        errorMessage = "没有权限进行此操作";
      } else if (status === 413) {
        errorMessage = "文件太大，请检查文件大小";
      } else if (status === 415) {
        errorMessage = "不支持的文件格式";
      } else if (data && data.message) {
        errorMessage = data.message;
      } else {
        errorMessage = `服务器错误 (${status})`;
      }
    } else if (error?.message) {
      if (error.message.includes("Network Error")) {
        errorMessage = "网络连接失败，请检查网络连接";
      } else if (error.message.includes("timeout")) {
        errorMessage = "请求超时，请重试";
      } else {
        errorMessage = error.message;
      }
    }

    ElMessage.error(errorMessage);
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

/** 分页大小改变 */
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

/** 当前页改变 */
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

/** 重置表单 */
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "", // 自动设置学校代码
    bmmc: "",
    xxhxtbh: "",
    xxhxtflm: "",
    xxhxtjc: "",
    xxhxtqc: "",
    xxhxtfwdz: "",
    sftsxxhxt: "",
    cjjcjrfs: "",
    xxhxtms: "",
    xxhxtjslxm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const submitData = { ...form };

    if (isEdit.value) {
      const response = await updateSystemBuildingData(submitData);
      if ((response.data as any)?.code === 200) {
        ElMessage.success("更新成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error((response.data as any)?.message || "更新失败");
      }
    } else {
      const response = await addSystemBuildingData(submitData);
      if ((response.data as any)?.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error((response.data as any)?.message || "新增失败");
      }
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败，请稍后重试");
  }
};

/** 表单取消 */
const handleCancel = () => {
  dialogVisible.value = false;
};

/** 处理特色信息化系统变化 */
const handleSpecialSystemChange = () => {
  // 当特色信息化系统状态改变时，重新验证场景击穿接入方式字段
  if (formRef.value) {
    formRef.value.validateField("cjjcjrfs");
  }
};

/** 加载字典数据 */
const loadDictOptions = async () => {
  try {
    const [systemTypeRes, specialSystemRes, accessModeRes, buildingTypeRes] =
      await Promise.all([
        getSystemTypeOptions(),
        getIsSpecialSystemOptions(),
        getAccessModeOptions(),
        getBuildingTypeOptions(),
      ]);

    systemTypeOptions.value =
      (systemTypeRes.data as any)?.code === 200
        ? (systemTypeRes.data as any)?.data || []
        : [];
    isSpecialSystemOptions.value =
      (specialSystemRes.data as any)?.code === 200
        ? (specialSystemRes.data as any)?.data || []
        : [];
    accessModeOptions.value =
      (accessModeRes.data as any)?.code === 200
        ? (accessModeRes.data as any)?.data || []
        : [];
    buildingTypeOptions.value =
      (buildingTypeRes.data as any)?.code === 200
        ? (buildingTypeRes.data as any)?.data || []
        : [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
    ElMessage.warning("字典数据加载失败，部分功能可能受影响");
  }
};

/** 获取系统学校代码 */
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response.data as any;
    if (result?.code === 200 && result?.data) {
      systemSchoolCode.value = result.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn("获取系统学校代码失败:", result?.message || "未知错误");
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 字典项文本获取方法
const getSystemTypeText = (code: string): string => {
  const option = systemTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "-";
};

const getIsSpecialSystemText = (code: string): string => {
  const option = isSpecialSystemOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code || "-";
};

const getAccessModeText = (code: string): string => {
  const option = accessModeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "-";
};

const getBuildingTypeText = (code: string): string => {
  const option = buildingTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "-";
};

// =========================== 数据同步相关方法 ===========================

/** 保存定时同步设置 */
const saveSyncTime = async () => {
  if (!syncTimeForm.value.syncTime) {
    ElMessage.warning("请选择同步时间");
    return;
  }

  try {
    const result = await saveSyncSchedule(syncTimeForm.value);

    if (result) {
      ElMessage.success(
        `定时同步设置已保存！模块：${syncTimeForm.value.moduleName}，时间：${syncTimeForm.value.syncTime}`,
      );
      showSyncTimeDialog.value = false;
    } else {
      ElMessage.error("保存失败，请重试");
    }
  } catch (error) {
    console.error("保存定时同步设置失败:", error);
    ElMessage.error("保存失败：" + (error as any)?.message || "未知错误");
  }
};

// 页面加载时初始化
onMounted(() => {
  getList();
  loadDictOptions();
  loadSystemSchoolCode();
});
</script>

<style scoped lang="scss">
.system-building-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

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
      width: 120px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 210px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 0;

    :deep(.el-card__body) {
      padding: 10px 15px 0;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
  }

  .table-body {
    margin-bottom: 0;

    :deep(.el-table) {
      font-size: 14px;
    }

    :deep(.el-table__header th) {
      padding: 4px 0;
      height: 40px;
      background-color: #f5f7fa;
      font-size: 14px;
    }

    :deep(.el-table__row td) {
      padding: 4px 0;
      font-size: 14px;
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 10px;

    .el-button {
      margin: 0;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-top: 0;

    .total-info {
      font-size: 14px;
      color: #606266;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
    }

    :deep(.el-pagination) {
      justify-content: flex-end;
      font-size: 14px;

      .el-pagination__total {
        display: none;
      }

      .el-pagination__sizes {
        margin-right: 15px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
      }

      .el-select .el-input {
        width: 100px;
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;

    .el-button {
      margin: 0 3px;
      padding: 0 5px;
      font-size: 14px;
    }
  }

  .system-building-dialog {
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

  .detail-dialog {
    :deep(.el-dialog__body) {
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}

/* 弹窗表单错误提示样式 */
:deep(.dialog-form) {
  .el-form-item {
    position: relative;
    margin-bottom: 12px;

    .el-form-item__error {
      position: absolute;
      top: 50%;
      left: calc(100% + 5px);
      transform: translateY(-50%);
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 0;
      margin: 0;
      line-height: 1.2;
      font-size: 11px;
      z-index: 1000;

      &:before {
        content: "!";
        display: inline-block;
        width: 12px;
        height: 12px;
        line-height: 12px;
        text-align: center;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        font-size: 9px;
        margin-right: 3px;
        font-weight: bold;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.system-building-form {
  .form-container {
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
    line-height: 26px;
  }

  :deep(.el-input__wrapper) {
    font-size: 13px;
    height: 26px;
    border-radius: 3px;
  }

  :deep(.el-select) {
    font-size: 13px;

    .el-input__wrapper {
      height: 26px;
      border-radius: 3px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 13px;
    border-radius: 3px;
    line-height: 1.3;
    padding: 5px 8px;
  }

  :deep(.el-date-editor) {
    font-size: 13px;

    .el-input__wrapper {
      height: 26px;
      border-radius: 3px;
    }
  }

  :deep(.el-row) {
    margin-bottom: 0;
  }
}

/* 详情样式 */
.system-building-detail {
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 600;
      color: #303133;
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
    }
  }

  .detail-value {
    color: #606266;
    font-size: 14px;
  }

  .detail-link {
    font-size: 14px;
    word-break: break-all;
  }

  .detail-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
}

/* 上传成功提示样式 */
:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 导入按钮白色背景样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;

  &:hover {
    background-color: #f5f7fa !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
  }

  &:focus {
    background-color: #ffffff !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }

  &:active {
    background-color: #f5f7fa !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}
</style>
