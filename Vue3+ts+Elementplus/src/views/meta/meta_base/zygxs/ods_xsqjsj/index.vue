<template>
  <div class="student-leave-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
            />
          </el-form-item>
          <el-form-item label="开课学年度" prop="kkxnd">
            <el-select
              v-model="queryParams.kkxnd"
              placeholder="请选择学年度"
              clearable
              style="width: 180px"
            >
              <el-option
                v-for="item in kkxndOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审批人" prop="spr">
            <el-input
              v-model="queryParams.spr"
              placeholder="请输入审批人"
              clearable
            />
          </el-form-item>
          <el-form-item >
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
        <div class="header-title">学生请假数据子类表</div>
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
            prop="kkxnd"
            label="开课学年度"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="开课学期"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{row.kkxqm }}
            </template>
          </el-table-column>
          <el-table-column
            label="请假类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.qjlx }}
            </template>
          </el-table-column>
          <el-table-column
            prop="qjkssj"
            label="请假开始时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="qjjssj"
            label="请假结束时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            label="请假提交类型"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ row.qjtjlx }}
            </template>
          </el-table-column>
          <el-table-column
            prop="qjyy"
            label="请假原因"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="qjts"
            label="请假天数"
            min-width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="spsj"
            label="审批时间"
            min-width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="spr"
            label="审批人"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="sfcx"
            label="是否出校"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag :type="row.sfcx === '1' ? 'success' : 'info'" size="small">
                {{ row.sfcx === "1" ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="sfxj"
            label="是否销假"
            min-width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag :type="row.sfxj === '1' ? 'success' : 'info'" size="small">
                {{ row.sfxj === "1" ? "是" : "否" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="xjsj"
            label="销假时间"
            min-width="160"
            align="center"
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
                :type="row.reportStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.reportStatus === "1" ? "已上报" : "未上报" }}
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
      :title="dialogType === 'add' ? '新增学生请假数据' : '编辑学生请假数据'"
      width="800px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 660px"
      class="student-leave-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogType === 'add' || dialogType === 'edit'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="160px"
      >
        <el-row :gutter="20">
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="32位全局唯一编码字符串（大写字母+数字组合）"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              >
                 
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
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
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="学号" prop="xh">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select v-model="form.xh" 
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
                :value="item.xh"
                />
              </el-select>
              <el-tooltip content="数据来源于ODS_XSHXSJ学生画像数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="开课学年度" prop="kkxnd">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="form.kkxnd"
                placeholder="请选择开课学年度"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in kkxndOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据源不明确 KKXND	开课学年度	C	9	M		格式：YYYY-YYYY，如：2001-2002	ZYGJX050106" placement="top">
                  <el-icon style="color: red"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="开课学期码" prop="kkxqm">
              <div style="display: flex; align-items: center; gap: 8px"> 
              <el-select
                v-model="form.kkxqm"
                placeholder="请选择开课学期码"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in kkxqmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据源不明确 KKM	开课学期码	C	2	M		格式：01-02，如：01	ZYGJX050106" placement="top">
                  <el-icon style="color: red"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="请假类型" prop="qjlx">
              <el-select
                v-model="form.qjlx"
                placeholder="请选择请假类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in qjlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="请假开始时间" prop="qjkssj">
              <el-date-picker
                v-model="form.qjkssj"
                type="date"
                placeholder="请选择请假开始时间"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="请假结束时间" prop="qjjssj">
              <el-date-picker
                v-model="form.qjjssj"
                type="date"
                placeholder="请选择请假结束时间"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="请假提交类型" prop="qjtjlx">
              <el-select
                v-model="form.qjtjlx"
                placeholder="请选择请假提交类型"
                filterable
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="item in qjtjlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="请假天数" prop="qjts">
              <el-input-number
                v-model="form.qjts"
                placeholder="请输入请假天数"
                :min="0"
                :max="999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="审批时间" prop="spsj">
              <el-date-picker
                v-model="form.spsj"
                type="date"
                placeholder="请选择审批时间"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="审批人" prop="spr">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select v-model="form.spr" 
                placeholder="请输入审批人/工号关键字搜索"
                clearable
                filterable
                remote
                :remote-method="getTeacherOptionsData"
                :loading="loading"
                style="width: 100%"
              >
                <el-option v-for="item in teacherOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                />
              </el-select>
              
              <el-tooltip content="数据来源于ODS_JSHXSJ教师画像数据子类表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="是否出校" prop="sfcx">
              <el-select
                v-model="form.sfcx"
                placeholder="请选择是否出校"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfbzOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="是否销假" prop="sfxj">
              <el-select
                v-model="form.sfxj"
                placeholder="请选择是否销假"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfbzOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
            <el-form-item label="销假时间" prop="xjsj">
              <el-date-picker
                v-model="form.xjsj"
                type="date"
                placeholder="请选择销假时间"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12"  style="margin-bottom: 18px;">
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
          <el-col :span="12"  style="margin-bottom: 18px;">
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
          <el-col :span="24"  style="margin-bottom: 18px;">
            <el-form-item label="请假原因" prop="qjyy">
              <el-input
                v-model="form.qjyy"
                type="textarea"
                :rows="3"
                placeholder="请输入请假原因"
                maxlength="150"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="student-leave-detail">
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
          <el-descriptions-item label="开课学年度">
            <div class="detail-value">{{ form.kkxnd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开课学期">
            <div class="detail-value">
              {{ getKkxqmText(form.kkxqm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="请假类型">
            <div class="detail-value">
              {{ getQjlxText(form.qjlx) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="请假开始时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.qjkssj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="请假结束时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.qjjssj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="请假提交类型">
            <div class="detail-value">
              {{ getQjtjlxText(form.qjtjlx) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="请假天数">
            <div class="detail-value">{{ form.qjts || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="审批时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.spsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="审批人">
            <div class="detail-value">{{ form.spr || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="是否出校">
            <el-tag :type="form.sfcx === '1' ? 'success' : 'info'" size="small">
              {{ form.sfcx === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否销假">
            <el-tag :type="form.sfxj === '1' ? 'success' : 'info'" size="small">
              {{ form.sfxj === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="销假时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.xjsj) || "-" }}
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
          <el-descriptions-item label="请假原因" :span="2">
            <div class="detail-value">{{ form.qjyy || "-" }}</div>
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
  getOdsXsqjsjPage,
  getOdsXsqjsjById,
  addOdsXsqjsj,
  updateOdsXsqjsj,
  deleteOdsXsqjsj,
  getStudentOptions,
  getSystemSchoolCode,
  getXqdmOptions,
  getQjlxOptions,
  getTjlxOptions,
  getSfbzOptions,
  batchDeleteOdsXsqjsj,
  getTeacherOptions,
  exportOdsXsqjsj,
  type OdsXsqjsjInfo,
  type StudentOption,
  type DictOption,
  type TeacherOption,
  type OdsXsqjsjQuery,
  type OdsXsqjsjForm,
} from "@/api/meta/meta_base/zygxs/ods_xsqjsj";

// 搜索条件
const queryParams = reactive<OdsXsqjsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  kkxnd: "",
  spr: "",
  pageNum: 1,
  pageSize: 20,
});

// 表格数据
const dataList = ref<OdsXsqjsjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);
const studentOptions = ref<StudentOption[]>([]);
const schoolCode = ref("");
const teacherOptions = ref<TeacherOption[]>([]);
// 表单相关
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const dialogMode = ref<"add" | "edit" | "view">("add");
const form = reactive<OdsXsqjsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  kkxnd: "",
  kkxqm: "",
  qjlx: "",
  qjkssj: "",
  qjjssj: "",
  qjtjlx: "",
  qjyy: "",
  qjts: undefined,
  spsj: "",
  spr: "",
  sfcx: "",
  sfxj: "",
  xjsj: "",
  sjcjsj: "",
  enableStatus: "1",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);
const activeTab = ref("basic");
 

// 字典选项
const kkxqmOptions = ref<DictOption[]>([]);
const qjlxOptions = ref<DictOption[]>([]);
const qjtjlxOptions = ref<DictOption[]>([]);
const sfbzOptions = ref<DictOption[]>([]);
 
// 获取字典数据
const getDictData = async () => {
  try {
    const [xqdmRes, qjlxRes, tjlxRes, sfbzRes] = await Promise.all([
      getXqdmOptions(),
      getQjlxOptions(),
      getTjlxOptions(),
      getSfbzOptions(),
    ]) as any[];

    kkxqmOptions.value = xqdmRes.data.data;
    qjlxOptions.value = qjlxRes.data.data;
    qjtjlxOptions.value = tjlxRes.data.data;
    sfbzOptions.value = sfbzRes.data.data;
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 生成学年度选项
const generateAcademicYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  
  // 生成前一年、当前年、后一年的学年度选项
  for (let i = -1; i <= 1; i++) {
    const startYear = currentYear + i;
    const endYear = startYear + 1;
    const value = `${startYear}-${endYear}`;
    const label = `${startYear}-${endYear}`;
    options.push({ value, label });
  }
  
  return options;
};

const kkxndOptions = ref(generateAcademicYearOptions());

// 获取当前学年度
const getCurrentAcademicYear = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // 月份从0开始
  
  // 如果是9月以后，则是新学年开始
  if (currentMonth >= 9) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
};
// 获取教师下拉选项
// 获取系统学校代码（这里先设置默认值，实际应该从用户信息或系统配置获取）
const getSchoolCode = () => {
  // 这里应该从用户登录信息或系统配置中获取
  // 暂时返回默认值
  return "1234567890"; // 10位学校代码
};
const getTeacherOptionsData = async (keyword?: string) => {
  const res = await getTeacherOptions(keyword || "") as any;
  teacherOptions.value = res.data.data;
};

 // 获取学号学生姓名选项列表
const getStudentOptionsData = async (keyword?: string) => {
  const res = await getStudentOptions(keyword) as any;
  studentOptions.value = res.data.data;
};

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
  { validator: (rule: any, value: string, callback: Function) => {
      if (!value) {
        callback(); // 为空时通过验证
      } else if (!/^[A-Z0-9]{32}$/.test(value)) {
        callback(new Error('必须是32位大写字母和数字组合'));
      } else {
        callback();
      }
    }, trigger: 'blur' }
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { len: 10, message: "学校代码必须是10位数字", trigger: "blur" },
    { 
      pattern: /^\d{10}$/, 
      message: "学校代码必须是10位数字码", 
      trigger: "blur" 
    },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  kkxnd: [
    { required: true, message: "请输入开课学年度", trigger: "blur" },
    { len: 9, message: "开课学年度长度必须是9位", trigger: "blur" },
    { 
      pattern: /^\d{4}-\d{4}$/, 
      message: "开课学年度格式：YYYY-YYYY，如：2023-2024", 
      trigger: "blur" 
    },
  ],
  kkxqm: [
    { required: true, message: "请选择开课学期码", trigger: "change" },
  ],
  qjlx: [
    { required: true, message: "请选择请假类型", trigger: "change" },
  ],
  qjkssj: [
    { required: true, message: "请选择请假开始时间", trigger: "change" },
  ],
  qjjssj: [
    { required: true, message: "请选择请假结束时间", trigger: "change" },
  ],
  qjtjlx: [
    { required: true, message: "请选择请假提交类型", trigger: "change" },
  ],
  qjyy: [
    { required: true, message: "请输入请假原因", trigger: "blur" },
    { max: 150, message: "请假原因长度不能超过150字符", trigger: "blur" },
  ],
  qjts: [
    { required: true, message: "请输入请假天数", trigger: "blur" },
    { type: "number" as const, min: 0, message: "请假天数不能小于0", trigger: "blur" },
  ],
  spsj: [
    { required: true, message: "请选择审批时间", trigger: "change" },
  ],
  spr: [
    { required: true, message: "请输入审批人", trigger: "blur" },
    { max: 20, message: "审批人长度不能超过20字符", trigger: "blur" },
  ],
  sfcx: [
    { required: true, message: "请选择是否出校", trigger: "change" },
  ],
  sfxj: [
    { required: true, message: "请选择是否销假", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 格式化时间显示
const formatDisplayTime = (timeStr: string | undefined) => {
  if (!timeStr) return "";
  
  // 如果是YYYYMMDD HHmmss格式（15位），转换为YYYY-MM-DD HH:mm:ss
  if (timeStr.length === 15 && /^\d{15}$/.test(timeStr)) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(9, 11);
    const minute = timeStr.substring(11, 13);
    const second = timeStr.substring(13, 15);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  
  // 如果是YYYYMMDD格式（8位），转换为YYYY-MM-DD
  if (timeStr.length === 8 && /^\d{8}$/.test(timeStr)) {
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  
  return timeStr;
};

// 获取开课学期文本
const getKkxqmText = (value: string | undefined) => {
  if (!value) return "";
  const option = kkxqmOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取请假类型文本
const getQjlxText = (value: string | undefined) => {
  if (!value) return "";
  const option = qjlxOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 获取请假提交类型文本
const getQjtjlxText = (value: string | undefined) => {
  if (!value) return "";
  const option = qjtjlxOptions.value.find(item => item.value === value);
  return option ? option.label : value;
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsXsqjsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询学生请假数据失败:", error);
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
    xxdm: schoolCode.value,
    xh: "",
    kkxnd: "",
    spr: "",
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
    xxdm: schoolCode.value,
    xh: "",
    kkxnd: "",
    kkxqm: "",
    qjlx: "",
    qjkssj: "",
    qjjssj: "",
    qjtjlx: "",
    qjyy: "",
    qjts: undefined,
    spsj: "",
    spr: "",
    sfcx: "",
    sfxj: "",
    xjsj: "",
    sjcjsj: "",
    enableStatus: "1",
  });
  activeTab.value = "basic";
  formRef.value?.clearValidate();
};

// 新增
const handleAdd = () => {
  resetForm();
  // 设置默认值
 
  form.xxdm = schoolCode.value;
  form.kkxnd = getCurrentAcademicYear();
  form.sjcjsj = new Date().toISOString().replace(/[-T:\.Z]/g, '').substring(0, 15); // 当前时间YYYYMMDD HHmmss格式
  
  dialogType.value = "add";
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsXsqjsjInfo) => {
  try {
    const response: any = await getOdsXsqjsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogType.value = "edit";
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生请假数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsXsqjsjInfo) => {
  try {
    const response: any = await getOdsXsqjsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取学生请假数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsXsqjsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条学生请假数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response: any = await deleteOdsXsqjsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除学生请假数据失败:", error);
      ElMessage.error("删除失败");
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
      `确定要删除选中的 ${selectedIds.value.length} 条学生请假数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response: any = await batchDeleteOdsXsqjsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除学生请假数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsXsqjsj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学生请假数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出学生请假数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    let response: any;
    if (dialogType.value === "add") {
      response = await addOdsXsqjsj(form);
    } else {
      response = await updateOdsXsqjsj(form);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
    }
  } catch (error) {
    console.error("提交学生请假数据失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 表单提交（兼容旧方法名）
const handleFormSubmit = handleSubmit;

// 行双击
const handleRowDblClick = (row: OdsXsqjsjInfo) => {
  handleView(row);
};

// 选择改变
const handleSelectionChange = (selection: OdsXsqjsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
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
// 获取当前系统学校代码
const getSystemSchoolCodeData = async () => {
  const res = await getSystemSchoolCode() as any;
  schoolCode.value = res.data.data;
};
// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getDictData();
  getList();
});
</script>

<style scoped>
.student-leave-management {
  padding: 0;
}

.search-card {
  margin-bottom: 2px;
}

.search-card .el-card__body {
  padding: 5px;
}

.search-bar {
  padding: 5px 0;
}

.search-bar .el-form-item {
  margin-bottom: 8px;
}

.search-bar .el-input,
.search-bar .el-select {
  height: 28px;
  font-size: 12px;
}

.search-bar .el-button {
  height: 28px;
  font-size: 12px;
}

.table-card {
  margin-top: -10px;
  min-height: calc(75vh - 100px);
}

.table-card .el-card__body {
  padding: 5px;
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
  margin-top: 20px;
  padding: 10px 2px;
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

.student-leave-dialog {
  height: 440px;
}

.student-leave-detail {
  padding: 20px;
}

.detail-descriptions {
  width: 100%;
}

.detail-value {
  font-size: 14px;
  color: #606266;
}
</style>
