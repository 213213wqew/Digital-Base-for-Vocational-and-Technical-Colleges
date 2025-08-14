<template>
  <div class="national-platform-resource-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="资源编号" prop="zybh">
            <el-input
              v-model="queryParams.zybh"
              placeholder="请输入资源编号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="资源名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入资源名称"
              clearable
              @keyup.enter="handleQuery"
              style="width: 140px"
            />
          </el-form-item>
          <el-form-item label="资源级别" prop="zyjbm">
            <el-select
              v-model="queryParams.zyjbm"
              placeholder="请选择资源级别"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in resourceLevelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="资源类型" prop="gjzhjxptzylxm">
            <el-select
              v-model="queryParams.gjzhjxptzylxm"
              placeholder="请选择资源类型"
              clearable
              style="width: 140px"
            >
              <el-option
                v-for="item in resourceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
              style="width: 140px"
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
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
          <el-button type="primary" @click="handleImport">
            <el-icon><Upload /></el-icon>导入Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">国家平台资源对接数据子类表</div>
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
          :height="'calc(75vh - 100px)'"
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
            prop="zybh"
            label="资源编号"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            label="资源名称"
            min-width="200"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyjbmText"
            label="资源级别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="gjzhjxptzylxmText"
            label="资源类型"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyfwlj"
            label="资源访问链接"
            min-width="200"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-link
                v-if="scope.row.zyfwlj"
                :href="scope.row.zyfwlj"
                target="_blank"
                type="primary"
              >
                {{ scope.row.zyfwlj }}
              </el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="djrqDisplay"
            label="对接日期"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="updateTime"
            label="更新时间"
            min-width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.updateTime) }}
            </template>
          </el-table-column>
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增国家平台资源对接数据'
          : '编辑国家平台资源对接数据'
      "
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 630px"
      class="resource-dialog"
      destroy-on-close
    >
      <div class="resource-form">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          class="form-container dialog-form"
          inline-message
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="formData.zjsjwyxbs"
                    placeholder="可选填写，不填由系统自动生成"
                    maxlength="32"
                    show-word-limit
                    style="text-transform: uppercase"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input
                    v-model="formData.xxdm"
                    placeholder="系统自动获取学校代码"
                    maxlength="10"
                    readonly
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="资源编号" prop="zybh">
                  <div class="input-with-icon">
                    <el-select
                      v-model="formData.zybh"
                      placeholder="请选择或搜索资源编号"
                      filterable
                      remote
                      clearable
                      :remote-method="handleResourceNumberSearch"
                      :loading="resourceSearchLoading"
                      style="width: 100%"
                      @change="handleResourceNumberChange"
                      @focus="handleResourceNumberFocus"
                    >
                      <el-option
                        v-for="item in resourceOptions"
                        :key="item.zybh"
                        :label="item.zybh"
                        :value="item.zybh"
                      />
                    </el-select>
                    <el-tooltip
                      content="数据来源：数字资源基本数据子类表"
                      placement="top"
                      effect="dark"
                    >
                      <el-icon class="info-icon-after">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="资源名称" prop="zymc">
                  <div class="input-with-icon">
                    <el-select
                      v-model="formData.zymc"
                      placeholder="请选择或搜索资源名称"
                      filterable
                      remote
                      clearable
                      :remote-method="handleResourceNameSearch"
                      :loading="resourceSearchLoading"
                      style="width: 100%"
                      @change="handleResourceNameChange"
                      @focus="handleResourceNameFocus"
                    >
                      <el-option
                        v-for="item in resourceOptions"
                        :key="item.zymc"
                        :label="item.zymc"
                        :value="item.zymc"
                      />
                    </el-select>
                    <el-tooltip
                      content="数据来源：数字资源基本数据子类表"
                      placement="top"
                      effect="dark"
                    >
                      <el-icon class="info-icon-after">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="资源级别" prop="zyjbm">
                  <el-select
                    v-model="formData.zyjbm"
                    placeholder="请选择资源级别"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in resourceLevelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="资源类型" prop="gjzhjxptzylxm">
                  <el-select
                    v-model="formData.gjzhjxptzylxm"
                    placeholder="请选择资源类型"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in resourceTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 详细信息 -->
          <div class="form-section">
            <div class="section-title">详细信息</div>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="资源访问链接" prop="zyfwlj">
                  <el-input
                    v-model="formData.zyfwlj"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入资源访问链接"
                    maxlength="300"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="对接日期" prop="djrq">
                  <el-date-picker
                    v-model="formData.djrq"
                    type="date"
                    placeholder="请选择对接日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker
                    v-model="formData.sjcjsj"
                    type="datetime"
                    placeholder="请选择数据采集时间"
                    value-format="YYYYMMDD HHmmss"
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select
                    v-model="formData.reportStatus"
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
                    v-model="formData.enableStatus"
                    placeholder="请选择启用状态"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>

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
      title="国家平台资源对接数据详情"
      width="900px"
      :close-on-click-modal="false"
      append-to-body
      class="detail-dialog"
      destroy-on-close
    >
      <div v-if="currentRecord" class="resource-detail">
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="主键数据唯一性标识">
            <span class="detail-value">{{
              currentRecord.zjsjwyxbs || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ currentRecord.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源编号">
            <span class="detail-value">{{ currentRecord.zybh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源名称">
            <span class="detail-value">{{ currentRecord.zymc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源级别">
            <span class="detail-value">{{
              currentRecord.zyjbmText || currentRecord.zyjbm || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源类型">
            <span class="detail-value">{{
              currentRecord.gjzhjxptzylxmText ||
              currentRecord.gjzhjxptzylxm ||
              "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源访问链接" :span="2">
            <el-link
              v-if="currentRecord.zyfwlj"
              :href="currentRecord.zyfwlj"
              target="_blank"
              type="primary"
              class="detail-link"
            >
              {{ currentRecord.zyfwlj }}
            </el-link>
            <span v-else class="detail-value">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="对接日期">
            <span class="detail-value">{{
              currentRecord.djrqDisplay || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <span class="detail-value">{{
              currentRecord.sjcjsjDisplay || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(currentRecord.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{
              formatDateTime(currentRecord.createTime)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{
              formatDateTime(currentRecord.updateTime)
            }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入国家平台资源对接数据"
      v-model="importDialogVisible"
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
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
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
import type { FormInstance } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  InfoFilled,
  Upload,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";
import {
  getOdsGjptzydjsjPage,
  getOdsGjptzydjsjById,
  addOdsGjptzydjsj,
  updateOdsGjptzydjsj,
  deleteOdsGjptzydjsj,
  batchDeleteOdsGjptzydjsj,
  exportOdsGjptzydjsj,
  importOdsGjptzydjsj,
  getResourceLevelOptions,
  getResourceTypeOptions,
  getSystemSchoolCode,
  getResourceOptions,
  type OdsGjptzydjsjQuery,
  type OdsGjptzydjsjForm,
  type OdsGjptzydjsjInfo,
} from "@/api/meta/meta_base/zygjx/ods_gjptzydjsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsGjptzydjsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const uploadRef = ref();
const formRef = ref<FormInstance>();
const queryForm = ref<FormInstance>();
const submitLoading = ref(false);
const dialogType = ref<"add" | "edit">("add");
const viewDialogVisible = ref(false);

// 查询参数
const queryParams = reactive<OdsGjptzydjsjQuery>({
  pageNum: 1,
  pageSize: 10,
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  zyjbm: "",
  gjzhjxptzylxm: "",
  djrqStart: "",
  djrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
});

// 表单数据
const formData = reactive<OdsGjptzydjsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  zyjbm: "",
  gjzhjxptzylxm: "",
  zyfwlj: "",
  djrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 当前查看记录
const currentRecord = ref<OdsGjptzydjsjInfo | null>(null);

// 字典选项
const resourceLevelOptions = ref<Array<{ label: string; value: string }>>([]);
const resourceTypeOptions = ref<Array<{ label: string; value: string }>>([]);

// 资源选项（从数字资源基本数据表获取）
const resourceOptions = ref<
  Array<{ value: string; label: string; zybh: string; zymc: string }>
>([]);

// 资源搜索加载状态
const resourceSearchLoading = ref(false);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "如果填写，请输入32位大写字母+数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { len: 10, message: "学校代码必须是10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码只能是数字", trigger: "blur" },
  ],
  zybh: [
    { required: true, message: "请输入资源编号", trigger: "blur" },
    { max: 50, message: "长度不能超过50个字符", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    { max: 100, message: "长度不能超过100个字符", trigger: "blur" },
  ],
  zyjbm: [
    { required: true, message: "请输入资源级别码", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
  ],
  gjzhjxptzylxm: [
    {
      required: true,
      message: "请输入国家智慧教学平台资源类型码",
      trigger: "blur",
    },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
  ],
  zyfwlj: [
    { required: true, message: "请输入资源服务链接", trigger: "blur" },
    { max: 200, message: "长度不能超过200个字符", trigger: "blur" },
  ],
  djrq: [{ required: true, message: "请选择对接日期", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取下拉选项数据
const loadOptions = async () => {
  try {
    const [levelRes, typeRes, schoolRes] = await Promise.all([
      getResourceLevelOptions(),
      getResourceTypeOptions(),
      getSystemSchoolCode(),
    ]);
    resourceLevelOptions.value = levelRes.data;
    resourceTypeOptions.value = typeRes.data;
    systemSchoolCode.value = schoolRes.data;
  } catch (error: any) {
    ElMessage.error(error.message || "获取选项数据失败");
  }
};

// 获取资源选项
const loadResourceOptions = async (query = "") => {
  try {
    const res = await getResourceOptions(query);
    resourceOptions.value = res.data;
  } catch (error: any) {
    ElMessage.error(error.message || "获取资源选项失败");
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsGjptzydjsjPage(queryParams);
    // 正确处理API响应格式
    const responseData = (response as any)?.data?.data || {};
    dataList.value = responseData.records || [];
    total.value = responseData.total || 0;
  } catch (error) {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    zybh: "",
    zymc: "",
    zyjbm: "",
    gjzhjxptzylxm: "",
    zyfwlj: "",
    djrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryForm.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  dialogType.value = "add";
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    formData.xxdm = systemSchoolCode.value;
  }
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsGjptzydjsjInfo) => {
  dialogType.value = "edit";
  resetForm();
  try {
    const response = await getOdsGjptzydjsjById(row.id);
    // 正确处理API响应格式
    const data = (response as any)?.data?.data || {};
    Object.assign(formData, data);
    // 加载相关的资源选项以确保下拉框能正确显示当前选中的值
    if (data.zybh || data.zymc) {
      await loadResourceOptions(data.zybh || data.zymc);
    }
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsGjptzydjsjInfo) => {
  try {
    const response = await getOdsGjptzydjsjById(row.id);
    // 正确处理API响应格式
    const data = (response as any)?.data?.data || {};
    currentRecord.value = data;
    viewDialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsGjptzydjsjInfo) => {
  try {
    await ElMessageBox.confirm("确认删除该数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 调用删除接口
    await deleteOdsGjptzydjsj(row.id);
    ElMessage.success("删除成功");
    await getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的 ${selectedIds.value.length} 条数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      await batchDeleteOdsGjptzydjsj(selectedIds.value);
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } catch (error) {
      ElMessage.error("批量删除失败");
    }
  });
};

// 导出
const handleExport = () => {
  ElMessageBox.confirm("确认导出国家平台资源对接数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(async () => {
    try {
      const response = await exportOdsGjptzydjsj(queryParams);
      // 处理Blob响应
      let blob: Blob;
      if (response instanceof Blob) {
        blob = response;
      } else if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `国家平台资源对接数据_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(link.href);
      ElMessage.success("导出成功");
    } catch (error) {
      ElMessage.error("导出失败");
    }
  });
};

// 导入
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 采集时间将统一设置为当前时间
5. 支持.xls和.xlsx格式文件`;

// 文件上传前校验
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

// 自定义文件上传处理
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importOdsGjptzydjsj(file)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importDialogVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    ElMessage.error(error.message || "导入失败，请重试");
    onError(error);
  }
};

// 表单提交
const handleFormSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        // 准备提交数据，确保日期格式正确
        const submitData = { ...formData };

        // 确保对接日期格式：YYYYMMDD
        if (submitData.djrq && submitData.djrq.length !== 8) {
          // 如果不是8位格式，可能需要转换
          const date = new Date(submitData.djrq);
          if (!isNaN(date.getTime())) {
            submitData.djrq =
              date.getFullYear() +
              String(date.getMonth() + 1).padStart(2, "0") +
              String(date.getDate()).padStart(2, "0");
          }
        }

        // 确保数据采集时间格式：YYYYMMDD hhmmss （15位）
        if (submitData.sjcjsj && submitData.sjcjsj.length !== 15) {
          // 如果不是15位格式，可能需要转换
          const datetime = new Date(submitData.sjcjsj);
          if (!isNaN(datetime.getTime())) {
            submitData.sjcjsj =
              datetime.getFullYear() +
              String(datetime.getMonth() + 1).padStart(2, "0") +
              String(datetime.getDate()).padStart(2, "0") +
              " " +
              String(datetime.getHours()).padStart(2, "0") +
              String(datetime.getMinutes()).padStart(2, "0") +
              String(datetime.getSeconds()).padStart(2, "0");
          }
        }

        if (dialogType.value === "add") {
          await addOdsGjptzydjsj(submitData);
          ElMessage.success("新增成功");
        } else {
          await updateOdsGjptzydjsj(submitData);
          ElMessage.success("修改成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error) {
        ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 关闭详情对话框
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 选择改变
const handleSelectionChange = (selection: OdsGjptzydjsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 行点击
const handleRowClick = () => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsGjptzydjsjInfo) => {
  handleView(row);
};

// 分页大小改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

// 当前页改变
const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info"; // 未上报
    case "1":
      return "success"; // 已上报
    case "2":
      return "danger"; // 上报失败
    default:
      return "info";
  }
};

// 上报状态文本
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

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString();
};

// 资源编号搜索方法
const handleResourceNumberSearch = async (query: string) => {
  resourceSearchLoading.value = true;
  await loadResourceOptions(query); // 支持空查询，显示全部
  resourceSearchLoading.value = false;
};

// 资源名称搜索方法
const handleResourceNameSearch = async (query: string) => {
  resourceSearchLoading.value = true;
  await loadResourceOptions(query); // 支持空查询，显示全部
  resourceSearchLoading.value = false;
};

// 资源编号选择改变事件
const handleResourceNumberChange = (value: string) => {
  const selectedOption = resourceOptions.value.find(
    (item) => item.zybh === value,
  );
  if (selectedOption) {
    formData.zymc = selectedOption.zymc;
  }
};

// 资源名称选择改变事件
const handleResourceNameChange = (value: string) => {
  const selectedOption = resourceOptions.value.find(
    (item) => item.zymc === value,
  );
  if (selectedOption) {
    formData.zybh = selectedOption.zybh;
  }
};

// 资源编号获得焦点时加载全部选项
const handleResourceNumberFocus = () => {
  if (resourceOptions.value.length === 0) {
    handleResourceNumberSearch("");
  }
};

// 资源名称获得焦点时加载全部选项
const handleResourceNameFocus = () => {
  if (resourceOptions.value.length === 0) {
    handleResourceNameSearch("");
  }
};

// 组件挂载
onMounted(() => {
  getList();
  loadOptions();
});
</script>

<style scoped lang="scss">
.national-platform-resource-management {
  .search-card {
    margin-bottom: 12px;

    :deep(.el-card__body) {
      padding: 15px;
    }
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
      width: 90px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 180px;
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
    margin-top: 0;

    :deep(.el-card__body) {
      padding: 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
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

  .placeholder {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
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

  .resource-dialog {
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
      position: static;
      transform: none;
      width: auto;
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
      padding: 4px 0 0 0;
      margin: 0;
      line-height: 1.4;
      font-size: 12px;
      color: #f56c6c;
      z-index: 1000;

      &:before {
        content: "!";
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        font-size: 10px;
        margin-right: 5px;
        font-weight: bold;
        vertical-align: top;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.resource-form {
  .form-container {
    max-height: 480px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  .form-section {
    margin-bottom: 25px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 15px;

      border-bottom: 1px solid #dcdfe6;
      position: relative;
    }
  }

  :deep(.el-row) {
    margin-bottom: 5px;
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
    height: 32px;
    border-radius: 3px;
  }

  :deep(.el-select) {
    font-size: 13px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 3px;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 13px;
    padding: 5px 11px;
  }
}

/* 详情样式 */
.resource-detail {
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

  .detail-link {
    font-size: 14px;
    word-break: break-all;
  }
}

/* 输入框与图标组合样式 */
.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-select {
    flex: 1;
  }
}

/* 信息图标样式 */
.info-icon-after {
  color: #409eff;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: #66b1ff;
  }
}

.import-tip-icon {
  margin-left: 5px;
  font-size: 16px;
  color: #909399;
  cursor: pointer;
}
</style>
