<template>
  <div class="patrol-class-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="排课号" prop="pkh">
            <el-input
              v-model="queryParams.pkh"
              placeholder="请输入排课号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="周次" prop="zc">
            <el-input
              v-model="queryParams.zc"
              placeholder="请输入周次"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="星期几" prop="xqj">
            <el-input
              v-model="queryParams.xqj"
              placeholder="请输入星期几"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="巡课人" prop="xkr">
            <el-input
              v-model="queryParams.xkr"
              placeholder="请输入巡课人"
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
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">巡课数据管理</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="序号" type="index" width="80" align="center">
            <template #default="scope">
              <span>{{
                (queryParams.pageNum - 1) * queryParams.pageSize +
                scope.$index +
                1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="zjsjwyxbs"
            label="主键数据唯一性标识"
            align="center"
            show-overflow-tooltip
            min-width="180"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            align="center"
            show-overflow-tooltip
            min-width="120"
          />
          <el-table-column
            prop="pkh"
            label="排课号"
            align="center"
            show-overflow-tooltip
            min-width="120"
          />
          <el-table-column
            prop="zc"
            label="周次"
            align="center"
            show-overflow-tooltip
            width="80"
          />
          <el-table-column
            prop="xqj"
            label="星期几"
            align="center"
            show-overflow-tooltip
            width="80"
          />
          <el-table-column
            prop="skjc"
            label="上课节次"
            align="center"
            show-overflow-tooltip
            width="100"
          />
          <el-table-column
            prop="ydxsrs"
            label="应到学生人数"
            align="center"
            show-overflow-tooltip
            width="120"
          />
          <el-table-column
            prop="sdxsrs"
            label="实到学生人数"
            align="center"
            show-overflow-tooltip
            width="120"
          />
          <el-table-column
            prop="jsdkqkm"
            label="教师到课情况"
            align="center"
            show-overflow-tooltip
            width="120"
          >
            <template #default="{ row }">
              <span>{{ getJsdkqkmText(row.jsdkqkm) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="kthdqkm"
            label="课堂互动情况"
            align="center"
            show-overflow-tooltip
            width="120"
          >
            <template #default="{ row }">
              <span>{{ getKthdqkmText(row.kthdqkm) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="xkr"
            label="巡课人"
            align="center"
            show-overflow-tooltip
            width="120"
          />
          <el-table-column
            prop="jxtjm"
            label="教学条件"
            align="center"
            show-overflow-tooltip
            width="100"
          >
            <template #default="{ row }">
              <span>{{ getJxtjmText(row.jxtjm) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="xksj"
            label="巡课时间"
            align="center"
            show-overflow-tooltip
            width="100"
          >
            <template #default="{ row }">
              <span>{{ formatDisplayTime(row.xksj) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            align="center"
            show-overflow-tooltip
            width="160"
          >
            <template #default="{ row }">
              <span>{{ formatDisplayTime(row.sjcjsj) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            align="center"
            width="100"
          >
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
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button
                  link
                  type="primary"
                  :icon="View"
                  @click.stop="handleView(row)"
                >
                  查看
                </el-button>
                <el-button
                  link
                  type="primary"
                  :icon="Edit"
                  @click.stop="handleUpdate(row)"
                >
                  编辑
                </el-button>
                <el-button
                  link
                  type="primary"
                  :icon="Delete"
                  @click.stop="handleDelete(row)"
                >
                  删除
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
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 650px"
      class="patrol-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
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
                placeholder="可不填，系统将自动生成唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              >
                <template #append>
                  <el-tooltip
                    content="留空时系统将自动生成唯一编码，如需手动输入请使用大写字母和数字"
                    placement="top"
                  >
                    <el-icon><InfoFilled /></el-icon>
                  </el-tooltip>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.xxdm"
                  placeholder="自动获取学校代码"
                  maxlength="10"
                  show-word-limit
                  style="flex: 1"
                  :readonly="dialogMode === 'add'"
                />
                <el-tooltip
                  content="新增时自动获取系统配置的学校代码"
                  placement="top"
                >
                  <el-icon size="16" color="#E6A23C" style="cursor: help"
                    ><InfoFilled
                  /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排课号" prop="pkh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-select
                  v-model="form.pkh"
                  placeholder="请选择排课信息"
                  clearable
                  filterable
                  remote
                  :remote-method="handlePksjSearch"
                  :loading="pksjLoading"
                  style="flex: 1"
                  @change="handlePksjChange"
                >
                  <el-option
                    v-for="item in pksjOptions"
                    :key="item.id"
                    :label="formatPksjLabel(item)"
                    :value="item.pkh"
                  >
                    <div style="font-size: 14px">
                      {{ item.pkh }} - {{ item.kcmc }}
                    </div>
                    <div style="font-size: 12px; color: #666">
                      {{ item.jsxm }}({{ item.jgh }}) | {{ item.bjmc }} |
                      {{ item.jsmc }}
                    </div>
                  </el-option>
                </el-select>
                <el-tooltip
                  content="数据来源：ODS_PKSJ 排课数据子类表"
                  placement="top"
                >
                  <el-icon size="16" color="#E6A23C" style="cursor: help"
                    ><InfoFilled
                  /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周次" prop="zc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.zc"
                  placeholder="请输入周次"
                  maxlength="4"
                  show-word-limit
                  style="flex: 1"
                  :readonly="!!form.pkh"
                />
                <el-tooltip
                  content="数据来源：ODS_PKSJ 排课数据子类表"
                  placement="top"
                >
                  <el-icon size="16" color="#E6A23C" style="cursor: help"
                    ><InfoFilled
                  /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="星期几" prop="xqj">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.xqj"
                  placeholder="请输入星期几"
                  maxlength="3"
                  show-word-limit
                  style="flex: 1"
                  :readonly="!!form.pkh"
                />
                <el-tooltip
                  content="数据来源：ODS_PKSJ 排课数据子类表"
                  placement="top"
                >
                  <el-icon size="16" color="#E6A23C" style="cursor: help"
                    ><InfoFilled
                  /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上课节次" prop="skjc">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input
                  v-model="form.skjc"
                  placeholder="请输入上课节次"
                  maxlength="5"
                  show-word-limit
                  style="flex: 1"
                  :readonly="!!form.pkh"
                />
                <el-tooltip
                  content="数据来源：ODS_PKSJ 排课数据子类表"
                  placement="top"
                >
                  <el-icon size="16" color="#E6A23C" style="cursor: help"
                    ><InfoFilled
                  /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="应到学生人数" prop="ydxsrs">
              <el-input-number
                v-model="form.ydxsrs"
                :min="0"
                placeholder="请输入应到学生人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实到学生人数" prop="sdxsrs">
              <el-input-number
                v-model="form.sdxsrs"
                :min="0"
                placeholder="请输入实到学生人数"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教师到课情况码" prop="jsdkqkm">
              <el-select
                v-model="form.jsdkqkm"
                placeholder="请选择教师到课情况"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in teacherAttendanceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课堂互动情况码" prop="kthdqkm">
              <el-select
                v-model="form.kthdqkm"
                placeholder="请选择课堂互动情况"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in classInteractionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡课人" prop="xkr">
              <el-input
                v-model="form.xkr"
                placeholder="请输入巡课人"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学条件码" prop="jxtjm">
              <el-select
                v-model="form.jxtjm"
                placeholder="请选择教学条件"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in teachingConditionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="巡课时间" prop="xksj">
              <el-time-picker
                v-model="form.xksj"
                format="HH:mm:ss"
                value-format="HHmmss"
                placeholder="请选择巡课时间"
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
            <el-form-item label="异常说明" prop="ycsm">
              <el-input
                v-model="form.ycsm"
                type="textarea"
                :rows="3"
                placeholder="请输入异常说明（可选，最多2000字符）"
                maxlength="2000"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="patrol-detail">
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
          <el-descriptions-item label="排课号">
            <div class="detail-value">{{ form.pkh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="周次">
            <div class="detail-value">{{ form.zc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="星期几">
            <div class="detail-value">{{ form.xqj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课节次">
            <div class="detail-value">{{ form.skjc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="应到学生人数">
            <div class="detail-value">{{ form.ydxsrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="实到学生人数">
            <div class="detail-value">{{ form.sdxsrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教师到课情况">
            <div class="detail-value">
              {{ getJsdkqkmText(form.jsdkqkm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="课堂互动情况">
            <div class="detail-value">
              {{ getKthdqkmText(form.kthdqkm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="巡课人">
            <div class="detail-value">{{ form.xkr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教学条件">
            <div class="detail-value">
              {{ getJxtjmText(form.jxtjm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="巡课时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.xksj) || "-" }}
            </div>
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
          <el-descriptions-item label="异常说明" :span="2">
            <div class="detail-value">{{ form.ycsm || "-" }}</div>
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
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsXksjPage,
  getOdsXksjById,
  addOdsXksj,
  updateOdsXksj,
  deleteOdsXksj,
  batchDeleteOdsXksj,
  exportOdsXksj,
  getTeacherAttendanceOptions,
  getClassInteractionOptions,
  getTeachingConditionOptions,
  getOdsPksjList,
  type OdsXksjInfo,
  type OdsXksjQuery,
  type OdsXksjForm,
  type DictOption,
  type OdsPksjInfo,
} from "@/api/meta/meta_base/zygjx/ods_xksj";

import { getSystemSchoolCode } from "@/api/meta/meta_base/zygxx/ods_xxtsxxhxtyysj";

// 搜索条件
const queryParams = reactive<OdsXksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  pkh: "",
  zc: "",
  xqj: "",
  skjc: "",
  jsdkqkm: "",
  kthdqkm: "",
  xkr: "",
  jxtjm: "",
  xksj: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXksjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增巡课数据";
    case "edit":
      return "编辑巡课数据";
    case "view":
      return "查看巡课数据";
    default:
      return "巡课数据";
  }
});

const form = reactive<OdsXksjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  pkh: "",
  zc: "",
  xqj: "",
  skjc: "",
  ydxsrs: undefined,
  sdxsrs: undefined,
  jsdkqkm: "",
  kthdqkm: "",
  xkr: "",
  jxtjm: "",
  ycsm: "",
  xksj: "",
  sjcjsj: "",
  enableStatus: "1",
});

const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 字典选项
const teacherAttendanceOptions = ref<DictOption[]>([]);
const classInteractionOptions = ref<DictOption[]>([]);
const teachingConditionOptions = ref<DictOption[]>([]);

// 排课数据选项
const pksjOptions = ref<OdsPksjInfo[]>([]);
const pksjLoading = ref(false);
const currentPksj = ref<OdsPksjInfo | null>(null);

// 格式化排课数据标签
const formatPksjLabel = (item: OdsPksjInfo) => {
  return `${item.pkh} - ${item.kcmc} - ${item.jsxm}(${item.jgh})`;
};

// 搜索排课数据
const handlePksjSearch = async (query: string) => {
  if (!query) return;

  pksjLoading.value = true;
  try {
    const response = await getOdsPksjList({ pkh: query });
    if (response.data.code === 200) {
      pksjOptions.value = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取排课数据失败");
    }
  } catch (error) {
    console.error("获取排课数据失败:", error);
    ElMessage.error("获取排课数据失败");
  } finally {
    pksjLoading.value = false;
  }
};

// 选择排课数据
const handlePksjChange = (pkh: string) => {
  if (!pkh) {
    currentPksj.value = null;
    form.zc = "";
    form.xqj = "";
    form.skjc = "";
    return;
  }

  const selected = pksjOptions.value.find((item) => item.pkh === pkh);
  if (selected) {
    currentPksj.value = selected;
    form.zc = selected.zc;
    form.xqj = selected.xqj;
    form.skjc = selected.skjc;
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    const [attendance, interaction, condition] = await Promise.all([
      getTeacherAttendanceOptions(),
      getClassInteractionOptions(),
      getTeachingConditionOptions(),
    ]);

    teacherAttendanceOptions.value = attendance.data.data || [];
    classInteractionOptions.value = interaction.data.data || [];
    teachingConditionOptions.value = condition.data.data || [];
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 获取字典文本
const getJsdkqkmText = (code: string) => {
  const option = teacherAttendanceOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code;
};

const getKthdqkmText = (code: string) => {
  const option = classInteractionOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code;
};

const getJxtjmText = (code: string) => {
  const option = teachingConditionOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code;
};

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]+$/,
      message: "主键数据唯一性标识只能包含大写字母和数字",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
  ],
  pkh: [
    { required: true, message: "请选择排课号", trigger: "change" },
    { max: 80, message: "排课号长度不能超过80个字符", trigger: "blur" },
  ],
  zc: [
    { required: true, message: "请输入周次", trigger: "blur" },
    { max: 4, message: "周次长度不能超过4个字符", trigger: "blur" },
  ],
  xqj: [
    { required: true, message: "请输入星期几", trigger: "blur" },
    { max: 3, message: "星期几长度不能超过3个字符", trigger: "blur" },
  ],
  skjc: [
    { required: true, message: "请输入上课节次", trigger: "blur" },
    { max: 5, message: "上课节次长度不能超过5个字符", trigger: "blur" },
  ],
  ydxsrs: [
    { required: true, message: "请输入应到学生人数", trigger: "blur" },
    { type: "number", message: "应到学生人数必须为数字", trigger: "blur" },
    { max: 99999, message: "应到学生人数不能超过5位数", trigger: "blur" },
  ],
  sdxsrs: [
    { required: true, message: "请输入实到学生人数", trigger: "blur" },
    { type: "number", message: "实到学生人数必须为数字", trigger: "blur" },
    { max: 99999, message: "实到学生人数不能超过5位数", trigger: "blur" },
  ],
  jsdkqkm: [
    { required: true, message: "请选择教师到课情况", trigger: "change" },
    { max: 1, message: "教师到课情况码不能超过1个字符", trigger: "blur" },
  ],
  kthdqkm: [
    { required: true, message: "请选择课堂互动情况", trigger: "change" },
    { max: 2, message: "课堂互动情况码不能超过2个字符", trigger: "blur" },
  ],
  xkr: [
    { required: true, message: "请输入巡课人", trigger: "blur" },
    { max: 36, message: "巡课人长度不能超过36个字符", trigger: "blur" },
  ],
  jxtjm: [
    { required: true, message: "请选择教学条件", trigger: "change" },
    { max: 1, message: "教学条件码不能超过1个字符", trigger: "blur" },
  ],
  ycsm: [{ max: 2000, message: "异常说明不能超过2000个字符", trigger: "blur" }],
  xksj: [{ max: 6, message: "巡课时间不能超过6个字符", trigger: "blur" }],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" },
  ],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsXksjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询巡课数据失败:", error);
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
    xxdm: "",
    pkh: "",
    zc: "",
    xqj: "",
    skjc: "",
    jsdkqkm: "",
    kthdqkm: "",
    xkr: "",
    jxtjm: "",
    xksj: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    pkh: "",
    zc: "",
    xqj: "",
    skjc: "",
    ydxsrs: undefined,
    sdxsrs: undefined,
    jsdkqkm: "",
    kthdqkm: "",
    xkr: "",
    jxtjm: "",
    ycsm: "",
    xksj: "",
    sjcjsj: "",
  });
  formRef.value?.resetFields();
};

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    if (response.data.code === 200 && response.data.data) {
      form.xxdm = response.data.data;
    } else {
      ElMessage.warning("获取学校代码失败，请手动输入");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取学校代码失败，请手动输入");
  }
};

// 新增
const handleAdd = async () => {
  dialogMode.value = "add";
  dialogVisible.value = true;
  resetForm();
  await getSchoolCode(); // 自动获取学校代码
};

// 编辑
const handleUpdate = async (row: OdsXksjInfo) => {
  try {
    const response = await getOdsXksjById(row.id);
    if (response.data.code === 200) {
      dialogMode.value = "edit";
      dialogVisible.value = true;
      Object.assign(form, response.data.data);
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取巡课数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看
const handleView = async (row: OdsXksjInfo) => {
  try {
    const response = await getOdsXksjById(row.id);
    if (response.data.code === 200) {
      dialogMode.value = "view";
      dialogVisible.value = true;
      Object.assign(form, response.data.data);
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取巡课数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXksjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条巡课数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsXksj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除巡课数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 时间格式化
const formatDisplayTime = (time: string) => {
  if (!time) return "";
  if (time.length === 6) {
    return `${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}`;
  }
  if (time.length === 14) {
    return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12, 14)}`;
  }
  if (time.length === 15) {
    return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13, 15)}`;
  }
  return time;
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条巡课数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsXksj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除巡课数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXksj(queryParams);

    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `巡课数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出巡课数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表格选择
const handleSelectionChange = (selection: OdsXksjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    const apiCall = dialogMode.value === "add" ? addOdsXksj : updateOdsXksj;
    const response = await apiCall(form);

    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 分页相关
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 行点击
const handleRowClick = (row: OdsXksjInfo) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsXksjInfo) => {
  handleView(row);
};

// 页面加载
onMounted(() => {
  loadDictOptions();
  getList();
});
</script>

<style scoped>
/* 主容器样式 */
.patrol-class-management {
  display: flex;
  flex-direction: column;
  gap: 16px;

  /* 输入框和提示样式 */
  .input-with-tip {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;

    .el-input,
    .el-select {
      flex: 1;
    }

    .data-source-tip {
      position: absolute;
      right: -20px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      text-align: center;
      background-color: #e6a23c;
      color: #fff;
      border-radius: 50%;
      font-size: 12px;
      cursor: help;
    }
  }
}

/* 搜索卡片样式 */
.search-card {
  height: 60px;
  flex-shrink: 0;
}

.search-bar {
  margin-top: -5px;
}

/* 表格卡片样式 */
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
.patrol-dialog {
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
.patrol-detail {
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
