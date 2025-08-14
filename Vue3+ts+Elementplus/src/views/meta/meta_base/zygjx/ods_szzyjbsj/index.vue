<template>
  <div class="digital-resource-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="资源编号" prop="zybh">
            <el-input
              v-model="queryParams.zybh"
              placeholder="请输入资源编号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="资源名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入资源名称"
              clearable
              @keyup.enter="handleQuery"
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
            :disabled="multipleSelection.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">数字资源基本数据列表</div>
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
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zybh"
            label="资源编号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            label="资源名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sszyh"
            label="所属专业号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyfzrh"
            label="资源负责人号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zyjbm"
            label="资源级别"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZyjbmText(row.zyjbm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="zylxm"
            label="资源类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getZylxmText(row.zylxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="glkch"
            label="关联课程号"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="gjzhjxptzylxm"
            label="平台资源类型"
            min-width="140"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ getGjzhjxptzylxmText(row.gjzhjxptzylxm) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="zycjsj"
            label="创建时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="zygxsj"
            label="更新时间"
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
                  @click.stop="handleView(row)"
                >
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click.stop="handleEdit(row)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button
                  link
                  type="danger"
                  size="small"
                  @click.stop="handleDelete(row)"
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
      style="height: 540px"
      class="digital-resource-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="formData.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
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
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源编号" prop="zybh">
              <el-input
                v-model="formData.zybh"
                placeholder="请输入资源编号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源名称" prop="zymc">
              <el-input
                v-model="formData.zymc"
                placeholder="请输入资源名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="所属专业号" prop="sszyh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="formData.sszyh"
                  placeholder="请选择所属专业"
                  clearable
                  filterable
                  remote
                  :remote-method="handleZySearch"
                  :loading="zyLoading"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in zyOptions"
                    :key="item.zyh"
                    :label="`${item.zyh} - ${item.zymc}`"
                    :value="item.zyh"
                  >
                    <div style="font-size: 14px">
                      {{ item.zyh }} - {{ item.zymc }}
                    </div>
                    <div style="font-size: 12px; color: #999">
                      {{ item.zyssyxbmc }}
                    </div>
                  </el-option>
                </el-select>
                <el-tooltip
                  content="数据来源 专业建设情况数据子类表"
                  placement="top"
                  effect="dark"
                >
                  <el-icon color="#E6A23C" size="16">
                    <InfoFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源负责人号" prop="zyfzrh">
              <el-input
                v-model="formData.zyfzrh"
                placeholder="请输入资源负责人号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源级别码" prop="zyjbm">
              <el-select
                v-model="formData.zyjbm"
                placeholder="请选择资源级别"
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
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源类型码" prop="zylxm">
              <el-select
                v-model="formData.zylxm"
                placeholder="请选择资源类型"
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
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="关联课程号" prop="glkch">
              <el-input
                v-model="formData.glkch"
                placeholder="请输入关联课程号"
                maxlength="64"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="平台资源类型码" prop="gjzhjxptzylxm">
              <el-select
                v-model="formData.gjzhjxptzylxm"
                placeholder="请选择平台资源类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in nationalPlatformResourceTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源创建时间" prop="zycjsj">
              <el-date-picker
                v-model="formData.zycjsj"
                type="datetime"
                placeholder="选择资源创建时间"
                format="YYYY-MM-DD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="资源更新时间" prop="zygxsj">
              <el-date-picker
                v-model="formData.zygxsj"
                type="datetime"
                placeholder="选择资源更新时间"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="formData.sjcjsj"
                type="datetime"
                placeholder="选择数据采集时间"
                format="YYYYMMDD HHmmss"
                value-format="YYYYMMDD HHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="formData.reportStatus"
                placeholder="请选择上报状态"
                style="width: 100%"
              >
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 20px">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="formData.enableStatus"
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
      <div v-else class="digital-resource-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ formData.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ formData.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源编号">
            <div class="detail-value">{{ formData.zybh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源名称">
            <div class="detail-value">{{ formData.zymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="所属专业号">
            <div class="detail-value">{{ formData.sszyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源负责人号">
            <div class="detail-value">{{ formData.zyfzrh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源级别">
            <div class="detail-value">
              {{ getZyjbmText(formData.zyjbm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="资源类型">
            <div class="detail-value">
              {{ getZylxmText(formData.zylxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="关联课程号">
            <div class="detail-value">{{ formData.glkch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="平台资源类型">
            <div class="detail-value">
              {{ getGjzhjxptzylxmText(formData.gjzhjxptzylxm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="资源创建时间">
            <div class="detail-value">{{ formData.zycjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="资源更新时间">
            <div class="detail-value">{{ formData.zygxsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ formData.sjcjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <div class="detail-value">
              <el-tag
                :type="getReportStatusTagType(formData.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(formData.reportStatus) }}
              </el-tag>
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <div class="detail-value">
              <el-tag
                :type="formData.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ formData.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">{{
            dialogMode === "view" ? "关闭" : "取消"
          }}</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleSave"
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
  Edit,
  Delete,
  View,
  Download,
  InfoFilled,
} from "@element-plus/icons-vue";
import {
  getOdsSzzyjbsjPage,
  deleteOdsSzzyjbsj,
  batchDeleteOdsSzzyjbsj,
  exportOdsSzzyjbsj,
  getOdsSzzyjbsjById,
  addOdsSzzyjbsj,
  updateOdsSzzyjbsj,
  getSystemSchoolCode,
  getResourceLevelOptions,
  getResourceTypeOptions,
  getNationalPlatformResourceTypeOptions,
  type MetaBaseZygjxOdsSzzyjbsjInfo,
  type MetaBaseZygjxOdsSzzyjbsjQuery,
  type MetaBaseZygjxOdsSzzyjbsjForm,
} from "@/api/meta/meta_base/zygjx/ods_szzyjbsj";
import {
  getZyOptions,
  type ZyOption,
} from "@/api/meta/meta_base/zygjx/ods_zyszsj";

const loading = ref(false);
const dataList = ref<MetaBaseZygjxOdsSzzyjbsjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<MetaBaseZygjxOdsSzzyjbsjInfo[]>([]);
const submitLoading = ref(false);

// 字典数据
const resourceLevelOptions = ref<{ label: string; value: string }[]>([]); // 资源级别码选项
const resourceTypeOptions = ref<{ label: string; value: string }[]>([]); // 资源类型码选项
const nationalPlatformResourceTypeOptions = ref<
  { label: string; value: string }[]
>([]); // 国家智慧教学平台资源类型码选项

// 专业选项相关
const zyOptions = ref<ZyOption[]>([]);
const zyLoading = ref(false);

// 专业搜索
const handleZySearch = async (query: string) => {
  if (query) {
    zyLoading.value = true;
    try {
      const response = await getZyOptions(query);
      console.log(response);

      if (response.data && response.data.code === 200) {
        zyOptions.value = response.data.data || [];
      } else {
        console.warn("获取专业选项失败:", response.data?.msg || "未知错误");
        zyOptions.value = [];
      }
    } catch (error) {
      console.error("获取专业选项失败:", error);
      zyOptions.value = [];
    } finally {
      zyLoading.value = false;
    }
  } else {
    zyOptions.value = [];
  }
};

// 加载字典数据
const loadDictData = async () => {
  try {
    const [levelRes, typeRes, platformTypeRes] = await Promise.all([
      getResourceLevelOptions(),
      getResourceTypeOptions(),
      getNationalPlatformResourceTypeOptions(),
    ]);

    if (levelRes.data.code === 200) {
      console.log("资源级别码选项:", levelRes.data.data);
      resourceLevelOptions.value = levelRes.data.data;
    }
    if (typeRes.data.code === 200) {
      resourceTypeOptions.value = typeRes.data.data;
    }
    if (platformTypeRes.data.code === 200) {
      nationalPlatformResourceTypeOptions.value = platformTypeRes.data.data;
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
    ElMessage.error("加载字典数据失败");
  }
};

// 系统学校代码
const systemSchoolCode = ref("");

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
      // 如果当前是新增表单，自动设置学校代码
      if (dialogVisible.value && dialogMode.value === "add") {
        formData.value.xxdm = systemSchoolCode.value;
      }
    } else {
      console.warn("获取系统学校代码失败:", response.data.msg || "未知错误");
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 对话框相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增数字资源";
    case "edit":
      return "编辑数字资源";
    case "view":
      return "查看数字资源";
    default:
      return "数字资源";
  }
});

// 表单相关
const formRef = ref();
const formData = ref<MetaBaseZygjxOdsSzzyjbsjForm>({});

const queryParams = reactive<MetaBaseZygjxOdsSzzyjbsjQuery>({
  zybh: "",
  zymc: "",
  pageNum: 1,
  pageSize: 100,
});

// 获取字典文本
const getZyjbmText = (code: string) => {
  const option = resourceLevelOptions.value.find((item) => item.value === code);
  return option ? option.label : code;
};

const getZylxmText = (code: string) => {
  const option = resourceTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code;
};

const getGjzhjxptzylxmText = (code: string) => {
  const option = nationalPlatformResourceTypeOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code;
};

const getReportStatusText = (status: string) => {
  switch (status) {
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

const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "warning";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

// 表单验证规则
const formRules = {
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]*$/,
      message: "主键数据唯一性标识只能包含大写字母和数字",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须是10位数字", trigger: "blur" },
  ],
  zybh: [
    { required: true, message: "请输入资源编号", trigger: "blur" },
    { max: 64, message: "资源编号长度不能超过64个字符", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    { max: 300, message: "资源名称长度不能超过300个字符", trigger: "blur" },
  ],
  sszyh: [
    { max: 64, message: "所属专业号长度不能超过64个字符", trigger: "blur" },
  ],
  zyfzrh: [
    { max: 50, message: "资源负责人号长度不能超过50个字符", trigger: "blur" },
  ],
  zyjbm: [
    { max: 2, message: "资源级别码长度不能超过2个字符", trigger: "blur" },
  ],
  zylxm: [
    { max: 15, message: "资源类型码长度不能超过15个字符", trigger: "blur" },
  ],
  glkch: [
    { max: 50, message: "关联课程号长度不能超过50个字符", trigger: "blur" },
  ],
  gjzhjxptzylxm: [
    {
      max: 2,
      message: "国家智慧教学平台资源类型码长度不能超过2个字符",
      trigger: "blur",
    },
  ],
  zycjsj: [
    {
      pattern: /^\d{8}\s\d{6}$/,
      message: "资源创建时间格式必须为YYYYMMDD HHMMSS",
      trigger: "change",
    },
  ],
  zygxsj: [
    {
      pattern: /^\d{8}\s\d{6}$/,
      message: "资源更新时间格式必须为YYYYMMDD HHMMSS",
      trigger: "change",
    },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
    {
      pattern: /^\d{8}\s\d{6}$/,
      message: "数据采集时间格式必须为YYYYMMDD HHMMSS",
      trigger: "change",
    },
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" },
  ],
};

const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsSzzyjbsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询数字资源数据失败:", error);
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
  Object.assign(queryParams, {
    zybh: "",
    zymc: "",
    pageNum: 1,
    pageSize: 100,
  });
  getList();
};

const handleSelectionChange = (selection: MetaBaseZygjxOdsSzzyjbsjInfo[]) => {
  multipleSelection.value = selection;
};

const handleRowDblClick = (row: MetaBaseZygjxOdsSzzyjbsjInfo) => {
  handleView(row);
};

const handleAdd = () => {
  dialogMode.value = "add";
  dialogVisible.value = true;
  formData.value = {
    enableStatus: "1",
    reportStatus: "0",
    xxdm: systemSchoolCode.value, // 自动设置学校代码
  };
};

const handleEdit = async (row: MetaBaseZygjxOdsSzzyjbsjInfo) => {
  try {
    const response = await getOdsSzzyjbsjById(row.id);
    if (response.data.code === 200) {
      dialogMode.value = "edit";
      dialogVisible.value = true;
      formData.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取数字资源详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: MetaBaseZygjxOdsSzzyjbsjInfo) => {
  loading.value = true;
  try {
    const response = await getOdsSzzyjbsjById(row.id);
    if (response.data.code === 200) {
      dialogMode.value = "view";
      dialogVisible.value = true;
      formData.value = { ...response.data.data };
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取数字资源详情失败:", error);
    ElMessage.error("获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (row: MetaBaseZygjxOdsSzzyjbsjInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除资源"${row.zymc}"吗？`, "删除确认");
    const response = await deleteOdsSzzyjbsj(row.id);
    // 修复：处理API响应
    if (response.data && response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(
        response.data?.message || response.data?.msg || "删除失败",
      );
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条数据吗？`,
    );
    const ids = multipleSelection.value.map((item) => item.id);
    const response = await batchDeleteOdsSzzyjbsj(ids);
    // 修复：处理API响应
    if (response.data && response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(
        response.data?.message || response.data?.msg || "批量删除失败",
      );
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

const handleExport = async () => {
  try {
    loading.value = true;
    const response = await exportOdsSzzyjbsj(queryParams);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `数字资源基本数据_${Date.now()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  } finally {
    loading.value = false;
  }
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

// 处理对话框保存
const handleSave = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    loading.value = true;

    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsSzzyjbsj(formData.value);
    } else if (dialogMode.value === "edit") {
      response = await updateOdsSzzyjbsj(formData.value);
    }

    if (response && response.data && response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        response?.data?.message || response?.data?.msg || "操作失败",
      );
    }
  } catch (error: any) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败");
  } finally {
    loading.value = false;
  }
};

// 处理对话框取消
const handleCancel = () => {
  dialogVisible.value = false;
  formData.value = {};
  formRef.value?.resetFields();
};

onMounted(() => {
  loadSystemSchoolCode(); // 页面加载时获取学校代码
  loadDictData(); // 加载字典数据
  getList();
});
</script>

<style lang="scss" scoped>
.digital-resource-management {
  .search-card {
    height: 60px;
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
  .digital-resource-dialog {
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
  .digital-resource-detail {
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
}
</style>
