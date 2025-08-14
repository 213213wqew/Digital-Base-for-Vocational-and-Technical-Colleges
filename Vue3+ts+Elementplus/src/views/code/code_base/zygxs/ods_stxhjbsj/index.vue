<template>
  <div class="club-association-management">
    <!-- 搜索区域 -->
    <el-card class="search-card"  >
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="社团编号" prop="stbh">
            <el-input
              v-model="queryParams.stbh"
              placeholder="请输入社团编号"
              clearable
            />
          </el-form-item>
          <el-form-item label="社团名称" prop="stmc">
            <el-input
              v-model="queryParams.stmc"
              placeholder="请输入社团名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="社团类型码" prop="stlxm">
            <el-input
              v-model="queryParams.stlxm"
              placeholder="请输入社团类型码"
              clearable
            />
          </el-form-item>
          <el-form-item label="挂靠单位名称" prop="gkdwmc">
            <el-input
              v-model="queryParams.gkdwmc"
              placeholder="请输入挂靠单位名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="社团负责人姓名" prop="stfzrxm">
            <el-input
              v-model="queryParams.stfzrxm"
              placeholder="请输入社团负责人姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="指导教师姓名" prop="zdjsxm">
            <select-student-options v-model="queryParams.zdjsxm" ></select-student-options>
            <el-input
              v-model="queryParams.zdjsxm"
              placeholder="请输入指导教师姓名"
              clearable
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              style="width: 100px;"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              style="width: 100px;"
              placeholder="请选择启用状态"
              clearable
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item style="margin-top: -23px;">
            <el-button type="primary"  @click="handleQuery">
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
        <div class="header-title">社团（协会）基本数据编码管理</div>
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
          :height="'calc(75vh - 240px)'"
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
            prop="stbh"
            show-overflow-tooltip
            label="社团编号"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="stmc"
            show-overflow-tooltip
            label="社团名称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="stlxm"
            show-overflow-tooltip
            label="社团类型码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="stlxmText"
            show-overflow-tooltip
            label="社团类型"
            min-width="120"
          />
          <el-table-column
            prop="gkdwmc"
            show-overflow-tooltip
            label="挂靠单位名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="stfzrxm"
            show-overflow-tooltip
            label="社团负责人姓名"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="zdjsxm"
            show-overflow-tooltip
            label="指导教师姓名"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="clrq"
            show-overflow-tooltip
            label="成立日期"
            min-width="120"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayDate(row.clrq) }}
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
            width="200"
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增社团（协会）基本数据'
          : '编辑社团（协会）基本数据'
      "
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="140px"
      >
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
            <el-row :gutter="16" style="margin-bottom: 15px;">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    placeholder="留空可自动生成32位唯一编码"
                    maxlength="32"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input
                    v-model="form.xxdm"
                    readonly
                    disabled
                    placeholder="10位学校（机构）标识码"
                    maxlength="10"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="社团编号" prop="stbh">
                  <el-input
                    v-model="form.stbh"
                    placeholder="请输入社团编号"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社团名称" prop="stmc">
                  <el-input
                    v-model="form.stmc"
                    placeholder="请输入社团名称"
                    maxlength="60"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="社团类型码" prop="stlxm">
                  <el-select v-model="form.stlxm" placeholder="请选择社团类型码">
                    <el-option v-for="item in authenticationModeOptions" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
             
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="挂靠单位名称" prop="gkdwmc">
                  <el-input
                    v-model="form.gkdwmc"
                    placeholder="请输入挂靠单位名称"
                    maxlength="60"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="成立日期" prop="clrq">
                  <el-date-picker
                    v-model="form.clrq"
                    type="date"
                    placeholder="请选择成立日期"
                    value-format="YYYYMMDD"
                  />
                  
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="解散日期" prop="jsrq">
                  <el-date-picker
                    v-model="form.jsrq"
                    type="date"
                    placeholder="请选择解散日期"
                    value-format="YYYYMMDD"
                  />
                  
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="社团负责人号" prop="stfzrh">
                  <el-input
                    v-model="form.stfzrh"
                    placeholder="请输入社团负责人号"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="社团负责人姓名" prop="stfzrxm">
                  <el-input
                    v-model="form.stfzrxm"
                    placeholder="请输入社团负责人姓名"
                    maxlength="36"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="指导教师工号" prop="zdjsh">
                  <div style="display: flex; align-items: center; gap: 8px">
                  <el-select v-model="form.zdjsh"
                  filterable
                  remote
                  placeholder="请输入教工号或教师姓名进行搜索"
                  clearable
                   :remote-method="searchTeacherOptions"  @change="loadTeacherOptions" >
                    <el-option
                    v-for="teacher in teacherOptions"
                    :key="teacher.jgh"
                    :label="`${teacher.jgh} - ${teacher.jsxm}`"
                    :value="teacher.jgh"
                  />
                  </el-select>
                  <el-tooltip content="数据来源于教师画像数据表" placement="top">
                    <el-icon style="color: #e6a23c"><Warning /></el-icon>
                  </el-tooltip>
                  </div>
              
                   
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="指导教师姓名" prop="zdjsxm">
                  <el-input
                    v-model="form.zdjsxm"
                    placeholder="请输入指导教师姓名"
                    maxlength="36"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker
                    v-model="form.sjcjsj"
                    type="datetime"
                    placeholder="请选择数据采集时间"
                    value-format="YYYYMMDD HHmmss"
                  />
                 
                </el-form-item>
              </el-col>
             
            </el-row>
            
            <el-row style="margin-bottom: 15px;" >
              <el-col :span="24">
                <el-form-item label="社团简介" prop="stjj">
                  <el-input
                    v-model="form.stjj"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入社团简介"
                    maxlength="2000"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="16" style="margin-bottom: 15px;" >
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select
                    v-model="form.reportStatus"
                    placeholder="请选择上报状态"
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
                  >
                    <el-option label="禁用" value="0" />
                    <el-option label="启用" value="1" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
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
      title="社团（协会）基本数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{
            currentRecord.zjsjwyxbs
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm
          }}</el-descriptions-item>
          <el-descriptions-item label="社团编号">{{
            currentRecord.stbh
          }}</el-descriptions-item>
          <el-descriptions-item label="社团名称">{{
            currentRecord.stmc
          }}</el-descriptions-item>
          <el-descriptions-item label="社团类型码">{{
            currentRecord.stlxm
          }}</el-descriptions-item>
          <el-descriptions-item label="社团类型">{{
            currentRecord.stlxmText
          }}</el-descriptions-item>
          <el-descriptions-item label="成立日期">{{
            formatDisplayDate(currentRecord.clrq)
          }}</el-descriptions-item>
          <el-descriptions-item label="解散日期">{{
            formatDisplayDate(currentRecord.jsrq)
          }}</el-descriptions-item>
          <el-descriptions-item label="挂靠单位名称">{{
            currentRecord.gkdwmc
          }}</el-descriptions-item>
          <el-descriptions-item label="社团负责人号">{{
            currentRecord.stfzrh
          }}</el-descriptions-item>
          <el-descriptions-item label="社团负责人姓名">{{
            currentRecord.stfzrxm
          }}</el-descriptions-item>
          <el-descriptions-item label="指导教师工号">{{
            currentRecord.zdjsh
          }}</el-descriptions-item>
          <el-descriptions-item label="指导教师姓名">{{
            currentRecord.zdjsxm
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            formatDisplayTime(currentRecord.sjcjsj)
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(currentRecord.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(currentRecord.enableStatus)"
              size="small"
            >
              {{ getEnableStatusText(currentRecord.enableStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            currentRecord.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentRecord.updateTime
          }}</el-descriptions-item>
          <el-descriptions-item label="社团简介" :span="2">{{
            currentRecord.stjj
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
  getOdsStxhjbsjPage,
  getOdsStxhjbsjById,
  addOdsStxhjbsj,
  updateOdsStxhjbsj,
  deleteOdsStxhjbsj,
  batchDeleteOdsStxhjbsj,
  getSystemSchoolCode,
  searchTeachers,
  getAuthenticationModeOptions,
  type TeacherBasicInfo,
  exportOdsStxhjbsj,
  type DictOption,
  type OdsStxhjbsjInfo,
  type OdsStxhjbsjQuery,
  type OdsStxhjbsjForm,
 
} from "@/api-code/code/code_base/zygxs/ods_stxhjbsj";
const systemSchoolCode = ref("");
const authenticationModeOptions = ref<DictOption[]>([]);
// 搜索条件
const queryParams = reactive<OdsStxhjbsjQuery>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  stbh: "",
  stmc: "",
  stlxm: "",
  gkdwmc: "",
  stfzrxm: "",
  zdjsxm: "",
  reportStatus: "",
  enableStatus: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  clrqStart: "",
  clrqEnd: "",
  pageNum: 1,
  pageSize: 20,
});

 
// 表格数据
const dataList = ref<OdsStxhjbsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const multipleSelection = ref<OdsStxhjbsjInfo[]>([]);

// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const form = reactive<OdsStxhjbsjForm>({
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  stbh: "",
  stmc: "",
  stlxm: "",
  stjj: "",
  clrq: "",
  gkdwmc: "",
  stfzrh: "",
  stfzrxm: "",
  zdjsh: "",
  zdjsxm: "",
  jsrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");

// 详情对话框
const viewDialogVisible = ref(false);
const currentRecord = ref<OdsStxhjbsjInfo | null>(null);
const loadTeacherOptions = (value: string) => {
  if (value) {
   
    
    teacherOptions.value = teacherOptions.value.filter(
      (item) => item.value === value,
    );
  
    form.zdjsxm = teacherOptions.value[0].jsxm;
  }
};
const searchTeacherOptions = async (keyword: string) => {
  const response: any = await searchTeachers(keyword);
  teacherOptions.value = response.data.data;
};

const validateZjsjwyxbs = (rule: any, value: string, callback: any) => {
  if (value && !/^[A-Z0-9]{32}$/.test(value)) {
    callback(new Error("唯一编码必须是32位的大写字母和数字组合"));
  } else {
    callback();
  }
};

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { validator: validateZjsjwyxbs, trigger: "blur" }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "长度不能超过10位", trigger: "blur" },
  ],
  stbh: [
    { required: true, message: "请输入社团编号", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" },
  ],
  stmc: [
    { required: true, message: "请输入社团名称", trigger: "blur" },
    { max: 60, message: "长度不能超过60位", trigger: "blur" },
  ],
  stlxm: [{ max: 2, message: "长度不能超过2位", trigger: "blur" }],
  stjj: [{ max: 2000, message: "长度不能超过2000个字符", trigger: "blur" }],
  clrq: [{ max: 8, message: "长度不能超过8位", trigger: "blur" }],
  gkdwmc: [{ max: 60, message: "长度不能超过60位", trigger: "blur" }],
  stfzrh: [
    { required: true, message: "请输入社团负责人号", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" },
  ],
  stfzrxm: [{ max: 36, message: "长度不能超过36位", trigger: "blur" }],
  zdjsh: [
    { required: true, message: "请输入指导教师工号", trigger: "blur" },
    { max: 20, message: "长度不能超过20位", trigger: "blur" },
  ],
  zdjsxm: [{ max: 36, message: "长度不能超过36位", trigger: "blur" }],
  jsrq: [{ max: 8, message: "长度不能超过8位", trigger: "blur" }],
  sjcjsj: [
    { required: true, message: "请输入数据采集时间", trigger: "blur" },
    { max: 15, message: "长度不能超过15位", trigger: "blur" },
  ],
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

  return timeStr;
};

// 日期格式化显示函数
const formatDisplayDate = (dateStr: string): string => {
  if (!dateStr) return "-";

  // 如果是8位格式YYYYMMDD，转换为可读格式
  if (dateStr.length === 8 && /^\d{8}$/.test(dateStr)) {
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }

  return dateStr;
};

const teacherOptions = ref<TeacherBasicInfo[]>([]); // 教师选项
// 上报状态文本映射
const getReportStatusText = (status: string): string => {
  if (!status && status !== "0") {
    return "未上报";
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
    return "info";
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
  if (!status && status !== "0") {
    return "启用";
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
    return "success";
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

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsStxhjbsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("查询社团（协会）基本数据失败:", error);
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
    stbh: "",
    stmc: "",
    stlxm: "",
    gkdwmc: "",
    stfzrxm: "",
    zdjsxm: "",
    reportStatus: "",
    enableStatus: "",
    sjcjsjStart: "",
    sjcjsjEnd: "",
    clrqStart: "",
    clrqEnd: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  form.xxdm = systemSchoolCode.value;
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsStxhjbsjInfo) => {
  try {
    const response: any = await getOdsStxhjbsjById(row.id);
    if (response.data.code === 200) {
      dialogType.value = "edit";
      dialogVisible.value = true;
      Object.assign(form, response.data.data);
    } else {
      ElMessage.error(response.data.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsStxhjbsjInfo) => {
  try {
    const response: any = await getOdsStxhjbsjById(row.id);
    if (response.data.code === 200) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsStxhjbsjInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除社团"${row.stmc}"吗？`, "确认删除", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsStxhjbsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${multipleSelection.value.length} 条记录吗？`,
      "确认批量删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const ids = multipleSelection.value.map((item) => item.id);
    const response: any = await batchDeleteOdsStxhjbsj(ids);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsStxhjbsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "社团（协会）基本数据.xlsx";
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

// 表格选择变化
const handleSelectionChange = (selection: OdsStxhjbsjInfo[]) => {
  multipleSelection.value = selection;
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  getList();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    stbh: "",
    stmc: "",
    stlxm: "",
    stjj: "",
    clrq: "",
    gkdwmc: "",
    stfzrh: "",
    stfzrxm: "",
    zdjsh: "",
    zdjsxm: "",
    jsrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
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

// 提交表单
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsStxhjbsj(form);
    } else {
      response = await updateOdsStxhjbsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      handleFormClose();
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
const loadSystemSchoolCode = async () => {
  try {
    const response = (await getSystemSchoolCode()) as any;
    if (response.data?.code === 200 && response.data?.data) {
      systemSchoolCode.value = response.data.data;
    } else {
      ElMessage.warning("获取系统学校代码失败");
    }
  } catch (error) {
    ElMessage.error("获取系统学校代码异常");
  }
};
const getAuthenticationModeOptionsInfo = async () => {
  try {
    const response = (await getAuthenticationModeOptions()) as any;
    if (response.data?.code === 200 && response.data?.data) {
      authenticationModeOptions.value = response.data.data;
    }
  } catch (error) {
    ElMessage.error("获取认证方式选项异常");
  }
};

// 挂载时获取数据
onMounted(() => {
  getAuthenticationModeOptionsInfo();
  loadSystemSchoolCode();
  getList();
});
</script>

<style scoped>
.club-association-management {
  padding: 0px;
}

.search-card {
  margin-bottom: 0px; 
}

.search-bar {
  height: 100%;
  padding: 0px 0;
}

.table-card {
  min-height: calc(75vh - 100px);
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
  gap: 8px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 0px 2px;
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
</style>
