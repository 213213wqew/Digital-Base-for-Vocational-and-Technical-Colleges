<template>
  <div class="network-course-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="网络课程编号" prop="wlkcbh">
            <el-input
              v-model="queryParams.wlkcbh"
              placeholder="请输入网络课程编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="网络课程名称" prop="wlkcmc">
            <el-input
              v-model="queryParams.wlkcmc"
              placeholder="请输入网络课程名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="主讲教师姓名" prop="zjjsxm">
            <el-input
              v-model="queryParams.zjjsxm"
              placeholder="请输入主讲教师姓名"
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">网络课程在线学习记录数据编码管理</div>
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
            prop="wlkcbh"
            show-overflow-tooltip
            label="网络课程编号"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="wlkcmc"
            show-overflow-tooltip
            label="网络课程名称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="wlkclym"
            show-overflow-tooltip
            label="课程来源"
            min-width="120"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.wlkclymText || row.wlkclym || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="wlkcssptmc"
            show-overflow-tooltip
            label="所属平台名称"
            min-width="160"
            sortable="custom"
          />
          <el-table-column
            prop="zjjsgh"
            show-overflow-tooltip
            label="主讲教师工号"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="zjjsxm"
            show-overflow-tooltip
            label="主讲教师姓名"
            min-width="120"
            sortable="custom"
          />
          <el-table-column label="学习日期" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ formatDisplayDate(row.xsxxrq) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xsxxsc"
            label="学习时长"
            min-width="100"
            align="right"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.xsxxsc || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xsxxrc"
            label="学习人次"
            min-width="100"
            align="right"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.xsxxrc || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="xstjzys"
            label="学习人次"
            min-width="110"
            align="right"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.xstjzys || 0 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="dytls"
            label="答疑讨论数"
            min-width="110"
            align="right"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.dytls || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
                size="small"
                style="cursor: pointer"
                @click="handleSingleReportStatusChange(row)"
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
                style="cursor: pointer"
                @click="handleSingleEnableStatusChange(row)"
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
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleCancel"
      class="custom-dialog"
    >
      <!-- 编辑模式 -->
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="140px"
      >
        <!-- 基础信息 -->
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
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

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="网络课程编号" prop="wlkcbh">
              <el-autocomplete
                v-model="formData.wlkcbh"
                :fetch-suggestions="querySearchCourse"
                :trigger-on-focus="true"
                clearable
                class="flex-1"
                placeholder="请输入课程编号搜索"
                value-key="kch"
                @select="handleCourseSelect"
              >
                <template #default="{ item }">
                  <div class="suggestion-item">
                    <div class="course-code">{{ item.kch }}</div>
                    <div class="course-name">{{ item.kcmc }}</div>
                  </div>
                </template>
                <template #empty>
                  <div class="empty-suggestion">
                    <el-icon><Search /></el-icon>
                    <span>未找到相关课程，请重新输入</span>
                  </div>
                </template>
                <template #suffix>
                  <el-tooltip
                    content="引用课程基本数据子类网络课程"
                    placement="top"
                    effect="light"
                  >
                    <el-icon class="text-warning input-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="网络课程名称" prop="wlkcmc">
              <el-autocomplete
                v-model="formData.wlkcmc"
                :fetch-suggestions="querySearchCourseName"
                :trigger-on-focus="true"
                clearable
                class="flex-1"
                placeholder="请输入课程名称搜索"
                value-key="kcmc"
                @select="handleCourseNameSelect"
              >
                <template #default="{ item }">
                  <div class="suggestion-item">
                    <div class="course-name">{{ item.kcmc }}</div>
                    <div class="course-code">{{ item.kch }}</div>
                  </div>
                </template>
                <template #empty>
                  <div class="empty-suggestion">
                    <el-icon><Search /></el-icon>
                    <span>未找到相关课程，请重新输入</span>
                  </div>
                </template>
                <template #suffix>
                  <el-tooltip
                    content="引用课程基本数据子类网络课程"
                    placement="top"
                    effect="light"
                  >
                    <el-icon class="text-warning input-icon">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="网络课程来源码" prop="wlkclym">
              <el-select
                v-model="formData.wlkclym"
                placeholder="请选择网络课程来源"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in courseSourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属平台名称" prop="wlkcssptmc">
              <el-input
                v-model="formData.wlkcssptmc"
                placeholder="请输入所属平台名称"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="主讲教师工号" prop="zjjsgh">
              <el-input
                v-model="formData.zjjsgh"
                placeholder="请输入主讲教师工号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主讲教师姓名" prop="zjjsxm">
              <el-input
                v-model="formData.zjjsxm"
                placeholder="请输入主讲教师姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 学习数据 -->

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="学生学习日期" prop="xsxxrq">
              <el-date-picker
                v-model="formData.xsxxrq"
                type="date"
                placeholder="请选择学生学习日期"
                style="width: 100%"
                value-format="YYYYMMDD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生学习时长" prop="xsxxsc">
              <el-input-number
                v-model="formData.xsxxsc"
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入学生学习时长"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="学生学习人次" prop="xsxxrc">
              <el-input-number
                v-model="formData.xsxxrc"
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入学生学习人次"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学生提交作业数" prop="xstjzys">
              <el-input-number
                v-model="formData.xstjzys"
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入学生提交作业数"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="答疑讨论数" prop="dytls">
              <el-input-number
                v-model="formData.dytls"
                :min="0"
                :precision="0"
                style="width: 100%"
                placeholder="请输入答疑讨论数"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="录入日期" prop="lrrq">
              <el-date-picker
                v-model="formData.lrrq"
                type="date"
                placeholder="请选择录入日期"
                style="width: 100%"
                value-format="YYYYMMDD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="formData.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                style="width: 100%"
                value-format="YYYYMMDD HHmmss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
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
        </el-row>

        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
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
      <el-descriptions v-else :column="2" border style="width: 100%">
        <el-descriptions-item
          label="主键数据唯一性标识"
          label-align="right"
          align="center"
          >{{ formData.zjsjwyxbs || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学校代码"
          label-align="right"
          align="center"
          >{{ formData.xxdm || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="网络课程编号"
          label-align="right"
          align="center"
          >{{ formData.wlkcbh || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="网络课程名称"
          label-align="right"
          align="center"
          >{{ formData.wlkcmc || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="网络课程来源"
          label-align="right"
          align="center"
          >{{
            formData.wlkclymText || formData.wlkclym || "-"
          }}</el-descriptions-item
        >
        <el-descriptions-item
          label="所属平台名称"
          label-align="right"
          align="center"
          >{{ formData.wlkcssptmc || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="主讲教师工号"
          label-align="right"
          align="center"
          >{{ formData.zjjsgh || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="主讲教师姓名"
          label-align="right"
          align="center"
          >{{ formData.zjjsxm || "-" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学生学习日期"
          label-align="right"
          align="center"
          >{{ formatDisplayDate(formData.xsxxrq) }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学生学习时长"
          label-align="right"
          align="center"
          >{{ formData.xsxxsc || 0 }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学生学习人次"
          label-align="right"
          align="center"
          >{{ formData.xsxxrc || 0 }}</el-descriptions-item
        >
        <el-descriptions-item
          label="学生提交作业数"
          label-align="right"
          align="center"
          >{{ formData.xstjzys || 0 }}</el-descriptions-item
        >
        <el-descriptions-item
          label="答疑讨论数"
          label-align="right"
          align="center"
          >{{ formData.dytls || 0 }}</el-descriptions-item
        >
        <el-descriptions-item
          label="录入日期"
          label-align="right"
          align="center"
          >{{ formatDisplayDate(formData.lrrq) }}</el-descriptions-item
        >
        <el-descriptions-item
          label="数据采集时间"
          label-align="right"
          align="center"
          >{{ formatDisplayTime(formData.sjcjsj) }}</el-descriptions-item
        >
        <el-descriptions-item
          label="上报状态"
          label-align="right"
          align="center"
        >
          <el-tag
            :type="getReportStatusType(formData.reportStatus)"
            size="small"
          >
            {{ getReportStatusText(formData.reportStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="启用状态"
          label-align="right"
          align="center"
        >
          <el-tag
            :type="getEnableStatusType(formData.enableStatus)"
            size="small"
          >
            {{ getEnableStatusText(formData.enableStatus) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item
          label="更新时间"
          label-align="right"
          align="center"
          >{{ formData.updateTime || "-" }}</el-descriptions-item
        >
      </el-descriptions>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
          >
            {{ dialogMode === "edit" ? "修 改" : "确 定" }}
          </el-button>
        </div>
      </template>
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
  View,
  Edit,
  Warning,
} from "@element-plus/icons-vue";
import type { FormRules, FormInstance } from "element-plus";
import {
  getOdsWlkczxxxjlsjPage,
  getOdsWlkczxxxjlsjById,
  addOdsWlkczxxxjlsj,
  updateOdsWlkczxxxjlsj,
  deleteOdsWlkczxxxjlsj,
  exportOdsWlkczxxxjlsj,
  type OdsWlkczxxxjlsjQuery,
  type OdsWlkczxxxjlsjForm,
  type OdsWlkczxxxjlsjInfo,
} from "@/api-code/code/code_base/zygjx/ods_wlkczxxxjlsj";
import {
  getCourseSourceOptions,
  getSystemSchoolCode,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  type DictOption,
  searchOnlineCourses,
  type CourseBasicInfo,
} from "@/api-code/code/code_base/zygjx/ods_wlkczxxxjlsj";

interface OdsWlkczxxxjlsjFormData extends OdsWlkczxxxjlsjForm {
  updateTime?: string;
  lrrqDisplay?: string;
  sjcjsjDisplay?: string;
  xsxxrqDisplay?: string;
  wlkclymText?: string;
}

// 响应式数据
const loading = ref(false);
const submitLoading = ref(false);
const dataList = ref<OdsWlkczxxxjlsjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<OdsWlkczxxxjlsjInfo[]>([]);

// 查询表单引用
const queryFormRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsWlkczxxxjlsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  wlkcbh: "",
  wlkcmc: "",
  wlkclym: "",
  wlkcssptmc: "",
  zjjsgh: "",
  zjjsxm: "",
  xsxxrqStart: "",
  xsxxrqEnd: "",
  lrrqStart: "",
  lrrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 100,
});

// 对话框相关
const dialogVisible = ref(false);
const dialogTitle = ref("");
const dialogMode = ref<"add" | "edit" | "view">("add");
const formData = ref<OdsWlkczxxxjlsjFormData>({});
const formRef = ref();

// 字典选项
const courseSourceOptions = ref<DictOption[]>([]);

// 课程选项缓存
const onlineCoursesCache = ref<CourseBasicInfo[]>([]);

// 课程搜索加载状态
const courseSearchLoading = ref(false);

// 表单验证规则
const formRules = reactive<FormRules>({
  zjsjwyxbs: [
    {
      validator: (_: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 允许为空
        } else if (value.length !== 32) {
          callback(new Error("唯一编码必须是32位"));
        } else if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("唯一编码必须是32位大写字母和数字的组合"));
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  wlkcbh: [
    { required: true, message: "网络课程编号不能为空", trigger: "blur" },
    { max: 60, message: "网络课程编号长度不能超过60个字符", trigger: "blur" },
  ],
  wlkcmc: [
    { required: true, message: "网络课程名称不能为空", trigger: "blur" },
    { max: 60, message: "网络课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  wlkclym: [
    { required: true, message: "请选择网络课程来源", trigger: "change" },
  ],
  wlkcssptmc: [
    { required: true, message: "所属平台名称不能为空", trigger: "blur" },
    { max: 100, message: "所属平台名称长度不能超过100个字符", trigger: "blur" },
  ],
  zjjsgh: [
    { required: true, message: "主讲教师工号不能为空", trigger: "blur" },
    { max: 20, message: "主讲教师工号长度不能超过20个字符", trigger: "blur" },
  ],
  zjjsxm: [
    { required: true, message: "主讲教师姓名不能为空", trigger: "blur" },
    { max: 36, message: "主讲教师姓名长度不能超过36个字符", trigger: "blur" },
  ],
  xsxxrq: [
    { required: true, message: "学生学习日期不能为空", trigger: "change" },
  ],
  xsxxsc: [
    { required: true, message: "学生学习时长不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "学生学习时长必须大于等于0",
      trigger: "blur",
    },
  ],
  xsxxrc: [
    { required: true, message: "学生学习人次不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "学生学习人次必须大于等于0",
      trigger: "blur",
    },
  ],
  xstjzys: [
    { required: true, message: "学生提交作业数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "学生提交作业数必须大于等于0",
      trigger: "blur",
    },
  ],
  dytls: [
    { required: true, message: "答疑讨论数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "答疑讨论数必须大于等于0",
      trigger: "blur",
    },
  ],
  lrrq: [{ required: true, message: "录入日期不能为空", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
  ],
  reportStatus: [
    { required: true, message: "请选择上报状态", trigger: "change" },
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" },
  ],
});

/** 格式化显示时间 */
const formatDisplayTime = (time?: string): string => {
  if (!time) return "-";
  // 根据不同格式处理
  if (time.includes(":")) return time;
  if (time.length === 4) return `${time.slice(0, 2)}:${time.slice(2)}`;
  if (time.length === 14) {
    return `${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)} ${time.slice(8, 10)}:${time.slice(10, 12)}:${time.slice(12)}`;
  }
  return time;
};

/** 格式化显示日期 */
const formatDisplayDate = (date?: string): string => {
  if (!date) return "-";
  // YYYYMMDD -> YYYY-MM-DD
  if (date.length === 8) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  }
  return date;
};

/** 获取上报状态类型 */
const getReportStatusType = (
  status: string | undefined,
): "success" | "warning" | "info" | "danger" => {
  if (!status) return "info";
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

/** 获取启用状态类型 */
const getEnableStatusType = (
  status: string | undefined,
): "success" | "warning" | "info" | "danger" => {
  if (!status) return "info";
  return status === "1" ? "success" : "danger";
};

/** 获取上报状态文本 */
const getReportStatusText = (status: string | undefined): string => {
  if (!status) return "-";
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "-";
  }
};

/** 获取启用状态文本 */
const getEnableStatusText = (status: string | undefined): string => {
  if (!status) return "-";
  return status === "1" ? "启用" : "禁用";
};

/** 查询列表 */
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsWlkczxxxjlsjPage(queryParams);
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
  queryParams.wlkcbh = "";
  queryParams.wlkcmc = "";
  queryParams.wlkclym = "";
  queryParams.wlkcssptmc = "";
  queryParams.zjjsgh = "";
  queryParams.zjjsxm = "";
  queryParams.xsxxrqStart = "";
  queryParams.xsxxrqEnd = "";
  queryParams.lrrqStart = "";
  queryParams.lrrqEnd = "";
  queryParams.sjcjsjStart = "";
  queryParams.sjcjsjEnd = "";
  queryParams.reportStatus = "";
  queryParams.enableStatus = "";
  queryParams.pageNum = 1;
  getList();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: OdsWlkczxxxjlsjInfo[]) => {
  multipleSelection.value = selection;
};

/** 获取学校代码 */
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      formData.value.xxdm = responseData.data;
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

/** 新增按钮操作 */
const handleAdd = async () => {
  formData.value = {};
  dialogTitle.value = "新增网络课程在线学习记录数据";
  dialogMode.value = "add";
  dialogVisible.value = true;
  // 获取学校代码
  await getSchoolCode();
};

/** 查看操作 */
const handleView = async (row: OdsWlkczxxxjlsjInfo) => {
  try {
    loading.value = true;
    const response = await getOdsWlkczxxxjlsjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      formData.value = responseData.data;
      dialogTitle.value = "查看网络课程在线学习记录数据";
      dialogMode.value = "view";
      dialogVisible.value = true;
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
const handleEdit = async (row: OdsWlkczxxxjlsjInfo) => {
  try {
    loading.value = true;
    const response = await getOdsWlkczxxxjlsjById(row.id);
    const responseData = response.data as any;
    if (responseData && responseData.code === 200 && responseData.data) {
      formData.value = responseData.data;
      dialogTitle.value = "修改网络课程在线学习记录数据";
      dialogMode.value = "edit";
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
const handleDelete = async (row: OdsWlkczxxxjlsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条记录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    await deleteOdsWlkczxxxjlsj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    if (error === "cancel") return;
    console.error("删除失败:", error);
    ElMessage.error("删除失败");
  }
};

/** 导出操作 */
const handleExport = async () => {
  try {
    const response = await exportOdsWlkczxxxjlsj(queryParams);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `网络课程在线学习记录数据_${new Date().getTime()}.xlsx`;
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

/** 单个上报状态修改 */
const handleSingleReportStatusChange = (row: OdsWlkczxxxjlsjInfo) => {
  const currentStatus = row.reportStatus || "0";
  const newStatus = currentStatus === "1" ? "0" : "1";
  const actionName = newStatus === "1" ? "已上报" : "未上报";

  ElMessageBox.confirm(`确定要将此记录设置为${actionName}吗？`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await updateSingleReportStatus(row.id, newStatus);
      const responseData = response.data as any;
      if (responseData && responseData.code === 200) {
        ElMessage.success(`设置为${actionName}成功`);
        getList();
      } else {
        const msg = responseData?.message || "操作失败";
        ElMessage.error(msg);
      }
    } catch (error: any) {
      ElMessage.error(error.message || "操作失败");
    }
  });
};

/** 单个启用状态修改 */
const handleSingleEnableStatusChange = (row: OdsWlkczxxxjlsjInfo) => {
  const currentStatus = row.enableStatus || "1";
  const newStatus = currentStatus === "1" ? "0" : "1";
  const actionName = newStatus === "1" ? "启用" : "禁用";

  ElMessageBox.confirm(`确定要${actionName}此记录吗？`, "确认操作", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = await updateSingleEnableStatus(row.id, newStatus);
      const responseData = response.data as any;
      if (responseData && responseData.code === 200) {
        ElMessage.success(`${actionName}成功`);
        getList();
      } else {
        const msg = responseData?.message || "操作失败";
        ElMessage.error(msg);
      }
    } catch (error: any) {
      ElMessage.error(error.message || "操作失败");
    }
  });
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 如果是新增且唯一编码为空，后端会自动生成
    const submitData: OdsWlkczxxxjlsjForm = {
      ...formData.value,
      zjsjwyxbs: formData.value.zjsjwyxbs || undefined, // 如果为空字符串，转为undefined让后端处理
    };

    if (dialogMode.value === "edit") {
      const { data } = await updateOdsWlkczxxxjlsj(submitData);
      if (data) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error("修改失败");
      }
    } else {
      const { data } = await addOdsWlkczxxxjlsj(submitData);
      if (data) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error("新增失败");
      }
    }
  } catch (error) {
    console.error("提交表单失败:", error);
    ElMessage.error(dialogMode.value === "edit" ? "修改失败" : "新增失败");
  } finally {
    submitLoading.value = false;
  }
};

/** 表单取消 */
const handleCancel = () => {
  dialogVisible.value = false;
};

/** 课程编号自动完成查询 */
const querySearchCourse = (
  queryString: string,
  callback: (suggestions: CourseBasicInfo[]) => void,
) => {
  courseSearchLoading.value = true;
  searchOnlineCourses(queryString || "", 20)
    .then((response: any) => {
      if (response.data.code === 200) {
        onlineCoursesCache.value = response.data.data || [];
        callback(response.data.data || []);
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      console.error("搜索线上课程失败:", error);
      callback([]);
    })
    .finally(() => {
      courseSearchLoading.value = false;
    });
};

/** 课程名称自动完成查询 */
const querySearchCourseName = (
  queryString: string,
  callback: (suggestions: CourseBasicInfo[]) => void,
) => {
  courseSearchLoading.value = true;
  searchOnlineCourses(queryString || "", 20)
    .then((response: any) => {
      if (response.data.code === 200) {
        if (response.data.data.length === 0) {
          onlineCoursesCache.value = [];
          callback([
            {
              kch: "未找到相关课程，请重新输入",
              kcmc: "未找到相关课程，请重新输入",
            },
          ]);
        } else {
          onlineCoursesCache.value = response.data.data || [];
          callback(response.data.data || []);
        }
      }
    })
    .catch((error) => {
      console.error("搜索线上课程失败:", error);
      callback([]);
    })
    .finally(() => {
      courseSearchLoading.value = false;
    });
};

/** 课程编号选择处理 */
const handleCourseSelect = (item: Record<string, any>) => {
  if (item) {
    formData.value.wlkcbh = item.kch;
    formData.value.wlkcmc = item.kcmc;
  }
};

/** 课程名称选择处理 */
const handleCourseNameSelect = (item: Record<string, any>) => {
  if (item) {
    formData.value.wlkcbh = item.kch;
    formData.value.wlkcmc = item.kcmc;
  }
};

/** 加载字典数据 */
const loadDictOptions = async () => {
  try {
    const response = await getCourseSourceOptions();
    const responseData = response.data as any;
    if (responseData && responseData.code === 200) {
      courseSourceOptions.value = responseData.data || [];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 页面加载时初始化
onMounted(() => {
  getList();
  loadDictOptions();
});
</script>

<style lang="scss" scoped>
.network-course-management {
  padding: 0px;

  .search-card {
    margin-bottom: 10px;

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
    margin-top: -10px;
    margin-bottom: 0;

    :deep(.el-card__body) {
      padding: 10px 15px 0;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .operation-buttons {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .header-title {
        text-align: center;
        font-size: 16px;
        font-weight: 500;
        color: #1f2f3d;
      }
    }

    .table-body {
      margin-bottom: 16px;
    }
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
    padding-top: 16px;
    border-top: 1px solid #ebeef5;

    .total-info {
      color: #606266;
      font-size: 13px;
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

  .dialog-footer {
    text-align: right;
    padding: 20px 24px;
    margin-top: 20px;
    border-top: 1px solid #ebeef5;

    .el-button {
      padding: 9px 20px;
      min-width: 88px;
      margin-left: 12px;
      height: 40px;
      line-height: 1;
    }
  }
}
.custom-dialog {
  :deep(.el-form-item) {
    margin-bottom: 22px !important;
  }

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

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
}

.course-code {
  font-weight: bold;
}

.course-name {
  color: #666;
  margin-left: 12px;
}

.empty-suggestion {
  padding: 10px;
  text-align: center;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

:deep(.el-tooltip__trigger) {
  cursor: help;
}

.text-warning {
  color: #e6a23c;
}

.input-icon {
  font-size: 16px;
  margin-right: 8px;
}

:deep(.el-input__suffix) {
  display: flex;
  align-items: center;
}

:deep(.el-input__suffix-inner) {
  display: flex;
  align-items: center;
}

.flex-1 {
  flex: 1;
}
</style>
