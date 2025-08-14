<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
    
          <el-form-item label="姓名/学号" prop="xm">
            <el-input
              v-model="queryParams.xm"
              placeholder="请输入姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="就业单位" prop="jydwmc">
            <el-input
              v-model="queryParams.jydwmc"
              placeholder="请输入就业单位名称"
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
        <div class="header-title">毕业去向【就业】数据管理</div>
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
          <el-table-column type="selection" width="55" />
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xh"
            label="学号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xm"
            label="姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zymc"
            label="专业名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jydwmc"
            label="就业单位"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jydwhymText"
            label="单位行业"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column prop="qxx" label="起薪线" width="120" align="right">
            <template #default="{ row }">
              <span v-if="row.qxx">{{ row.qxx.toLocaleString() }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="sfdkText"
            label="是否对口"
            width="100"
            show-overflow-tooltip
          />
          <el-table-column
            prop="jyrq"
            label="就业日期"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                style="cursor: pointer"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-switch
                v-model="row.enableStatus"
                active-value="1"
                inactive-value="0"
                @change="handleStatusChange(row)"
              />
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        label-position="right"
      >
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="formData.zjsjwyxbs"
                placeholder="可不填写，如填写需要符合32位大写字母和数字组合规则"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input disabled v-model="formData.xxdm" placeholder="请输入学校代码" maxlength="10" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="学号" prop="xh">
               <div style="display: flex; align-items: center; gap: 8px">
              <el-select v-model="formData.xh"
              :remote-method="getStudentOptionsData"
              :loading="loading"
              filterable
              clearable
              remote
              @change="handleStudentChange"
              placeholder="请选择学号搜索" style="width: 100%">
                <el-option v-for="item in studentOptions" :key="item.value" :label="item.label" :value="item.value" />
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
                <el-input v-model="formData.xm" placeholder="请输入姓名" maxlength="36" />
                <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="专业号" prop="zyh">
              <div style="display: flex; align-items: center; gap: 8px">
                <el-input v-model="formData.zyh" placeholder="请选择专业号" maxlength="64" />
                <el-tooltip content="数据来源于学生画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业名称" prop="zymc">
              <div style="display: flex; align-items: center; gap: 8px">
             

              <el-input v-model="formData.zymc" placeholder="请输入专业名称" maxlength="60" />
              <el-tooltip content="数据来源于教师画像数据表" placement="top">
                  <el-icon style="color: #e6a23c"><Warning /></el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="就业单位是否校企合作单位" prop="jydwsfxqhzdw">
              <el-select
                v-model="formData.jydwsfxqhzdw"
                placeholder="请选择就业单位是否校企合作单位"
                style="width: 100%"
              >
                <el-option
                  v-for="item in jydwsfxqhzdmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="就业单位名称" prop="jydwmc">
              <el-input
                v-model="formData.jydwmc"
                placeholder="请输入就业单位名称"
                maxlength="200"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="8">
            <el-form-item label="单位行业码" prop="jydwhym">
              <el-select
                v-model="formData.jydwhym"
                placeholder="请选择行业码"
                style="width: 100%"
              >
                <el-option
                  v-for="item in jydwhymOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位性质码" prop="jydwxzm">
              <el-select
                v-model="formData.jydwxzm"
                placeholder="请选择单位性质"
                style="width: 100%"
              >
                <el-option
                  v-for="item in jydwxzmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位规模码" prop="jydwgmm">
              <el-select
                v-model="formData.jydwgmm"
                placeholder="请选择单位规模"
                style="width: 100%"
              >
                <el-option
                  v-for="item in jydwgmmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="8">
            <el-form-item label="起薪线(元)" prop="qxx">
              <el-input-number
                v-model="formData.qxx"
                :min="0"
                placeholder="请输入起薪线"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否对口" prop="sfdk">
              <el-select
                v-model="formData.sfdk"
                placeholder="请选择是否对口"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="就业日期" prop="jyrq">
              <el-date-picker
                v-model="formData.jyrq"
                type="date"
                placeholder="请选择就业日期"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYYMMDD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="省机构编码" prop="jyqysjgbm">
              <el-input v-model="formData.jyqysjgbm" placeholder="请输入就业区域省机构编码" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="省机构名称" prop="jyqysjgmc">
              <el-input v-model="formData.jyqysjgmc" placeholder="请输入就业区域省机构名称" maxlength="60" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="市机构编码" prop="jyqyshjgbm">
              <el-input v-model="formData.jyqyshjgbm" placeholder="请输入就业区域市机构编码" maxlength="6" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="市机构名称" prop="jyqyshjgmc">
              <el-input v-model="formData.jyqyshjgmc" placeholder="请输入就业区域市机构名称" maxlength="60" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="8">
            <el-form-item label="是否自主创业" prop="sfzzcy">
              <el-select
                v-model="formData.sfzzcy"
                placeholder="请选择是否自主创业"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否灵活就业" prop="sflhjy">
              <el-select
                v-model="formData.sflhjy"
                placeholder="请选择是否灵活就业"
                style="width: 100%"
              >
                <el-option
                  v-for="item in sfOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="formData.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="创业项目名称" prop="cyxmmc">
              <el-input v-model="formData.cyxmmc" placeholder="请输入创业项目名称" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工作岗位名称" prop="gzgwmc">
              <el-input v-model="formData.gzgwmc" placeholder="请输入工作岗位名称" maxlength="60" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="24">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="formData.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDDHHmmss"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-bottom: 18px;">
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select v-model="formData.reportStatus" placeholder="请选择上报状态" style="width: 100%">
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="formData.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="handleSubmit"
            :loading="submitLoading"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看详情"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="唯一性标识">{{
          viewData.zjsjwyxbs
        }}</el-descriptions-item>
        <el-descriptions-item label="学校代码">{{
          viewData.xxdm
        }}</el-descriptions-item>
        <el-descriptions-item label="学号">{{
          viewData.xh
        }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{
          viewData.xm
        }}</el-descriptions-item>
        <el-descriptions-item label="专业号">{{
          viewData.zyh
        }}</el-descriptions-item>
        <el-descriptions-item label="专业名称">{{
          viewData.zymc
        }}</el-descriptions-item>
        <el-descriptions-item label="就业单位名称" :span="2">{{
          viewData.jydwmc
        }}</el-descriptions-item>
        <el-descriptions-item label="单位行业">{{
          viewData.jydwhymText
        }}</el-descriptions-item>
        <el-descriptions-item label="起薪线">{{
          viewData.qxx ? viewData.qxx.toLocaleString() : "-"
        }}</el-descriptions-item>
        <el-descriptions-item label="是否对口">{{
          viewData.sfdkText
        }}</el-descriptions-item>
        <el-descriptions-item label="就业日期">{{
          viewData.jyrq
        }}</el-descriptions-item>
        <el-descriptions-item label="上报状态">{{
          getReportStatusText(viewData.reportStatus)
        }}</el-descriptions-item>
        <el-descriptions-item label="启用状态">{{
          viewData.enableStatus === "1" ? "启用" : "禁用"
        }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{
          viewData.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{
          viewData.updateTime
        }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  Download,
  View,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
const systemSchoolCode = ref("");
import {
  getOdsByqxjysjPage,
  getOdsByqxjysjById,
  addOdsByqxjysj,
  updateOdsByqxjysj,
  deleteOdsByqxjysj,
  batchDeleteOdsByqxjysj,
  getSystemSchoolCode,
  getStudentOptions,
  getJydwhymOptions,
  exportOdsByqxjysj,
  updateSingleEnableStatus,
  type OdsByqxjysjInfo,
  type OdsByqxjysjQuery,
  type OdsByqxjysjForm,
  type DictOption,
  getJydwxzmOptions,
  getJydwgmmOptions,
  getSfOptions,
  getJydwsfxqhzdmOptions,
} from "@/api/meta/meta_base/zygxs/ods_byqxjysj";

// 查询参数
const queryParams = reactive<OdsByqxjysjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xm: "",
  zymc: "",
  jydwmc: "",
  pageNum: 1,
  pageSize: 20,
});

// 数据状态
const dataList = ref<OdsByqxjysjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const selectedIds = ref<number[]>([]);

// 对话框状态
const dialogVisible = ref(false);
const dialogTitle = ref("");
const isEdit = ref(false);
const submitLoading = ref(false);
const viewDialogVisible = ref(false);
const studentOptions = ref<any[]>([]);
const jydwhymOptions = ref<DictOption[]>([]);
const jydwxzmOptions = ref<DictOption[]>([]);
const jydwgmmOptions = ref<DictOption[]>([]);
const sfOptions = ref<DictOption[]>([]);
const jydwsfxqhzdmOptions = ref<DictOption[]>([]);
// 表单数据
const formRef = ref<FormInstance>();
const formData = reactive<OdsByqxjysjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xm: "",
  zyh: "",
  zymc: "",
  jydwsfxqhzdw: "",
  jydwmc: "",
  jydwhym: "",
  jydwxzm: "",
  jydwgmm: "",
  qxx: undefined,
  sfdk: "",
  jyqysjgbm: "",
  jyqysjgmc: "",
  jyqyshjgbm: "",
  jyqyshjgmc: "",
  jyrq: "",
  sfzzcy: "",
  cyxmmc: "",
  sflhjy: "",
  gzgwmc: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "0",
});

// 查看详情数据
const viewData = ref<OdsByqxjysjInfo>({} as OdsByqxjysjInfo);

// 表单验证规则
const formRules: FormRules = {
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
  xxdm: [{ required: true, message: "请输入学校代码", trigger: "blur" }],
  xh: [{ required: true, message: "请输入学号", trigger: "blur" }],
  zyh: [{ required: true, message: "请输入专业号", trigger: "blur" }],
  zymc: [{ required: true, message: "请输入专业名称", trigger: "blur" }],
  jydwsfxqhzdw: [{ required: true, message: "请选择就业单位是否校企合作单位", trigger: "change" }],
  jydwhym: [{ required: true, message: "请选择就业单位行业码", trigger: "change" }],
  jydwxzm: [{ required: true, message: "请选择就业单位性质码", trigger: "change" }],
  jydwgmm: [{ required: true, message: "请选择就业单位规模码", trigger: "change" }],
  sfdk: [{ required: true, message: "请选择是否对口", trigger: "change" }],
  jyrq: [{ required: true, message: "请选择就业日期", trigger: "change" }],
  sfzzcy: [{ required: true, message: "请选择是否自主创业", trigger: "change" }],
  sflhjy: [{ required: true, message: "请选择是否灵活就业", trigger: "change" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
};

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsByqxjysjPage(queryParams);
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
    xxdm: "",
    xh: "",
    xm: "",
    zymc: "",
    jydwmc: "",
    pageNum: 1,
    pageSize: 20,
  });
  getList();
};

// 表格选择变化
const handleSelectionChange = (selection: OdsByqxjysjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
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

const getStudentOptionsData = async () => {
  const response: any = await getStudentOptions();
  studentOptions.value = response.data.data;
};
const handleStudentChange = (value: string) => {
  const selectedOption = studentOptions.value.find(option => option.value === value); 
  if (selectedOption) {
    formData.xh = selectedOption.xh;
    formData.xm = selectedOption.xsxm;
    formData.zyh = selectedOption.zyh;
    formData.zymc = selectedOption.zymc;
  }
};
// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xm: "",
    zyh: "",
    zymc: "",
    jydwsfxqhzdw: "",
    jydwmc: "",
    jydwhym: "",
    jydwxzm: "",
    jydwgmm: "",
    qxx: undefined,
    sfdk: "",
    jyqysjgbm: "",
    jyqysjgmc: "",
    jyqyshjgbm: "",
    jyqyshjgmc: "",
    jyrq: "",
    sfzzcy: "",
    cyxmmc: "",
    sflhjy: "",
    gzgwmc: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "0",
  });
  formRef.value?.resetFields();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogTitle.value = "新增毕业去向【就业】数据";
  isEdit.value = false;
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsByqxjysjInfo) => {
  try {
    const response: any = await getOdsByqxjysjById(row.id);
    const data = response.data.data || response.data;
    Object.assign(formData, {
      id: data.id,
      zjsjwyxbs: data.zjsjwyxbs,
      xxdm: data.xxdm,
      xh: data.xh,
      xm: data.xm,
      zyh: data.zyh,
      zymc: data.zymc,
      jydwsfxqhzdw: data.jydwsfxqhzdw,
      jydwmc: data.jydwmc,
      jydwhym: data.jydwhym,
      jydwxzm: data.jydwxzm,
      jydwgmm: data.jydwgmm,
      qxx: data.qxx,
      sfdk: data.sfdk,
      jyqysjgbm: data.jyqysjgbm,
      jyqysjgmc: data.jyqysjgmc,
      jyqyshjgbm: data.jyqyshjgbm,
      jyqyshjgmc: data.jyqyshjgmc,
      jyrq: data.jyrq,
      sfzzcy: data.sfzzcy,
      cyxmmc: data.cyxmmc,
      sflhjy: data.sflhjy,
      gzgwmc: data.gzgwmc,
      sjcjsj: data.sjcjsj,
      reportStatus: data.reportStatus,
      enableStatus: data.enableStatus,
    });
    dialogTitle.value = "编辑毕业去向【就业】数据";
    isEdit.value = true;
    dialogVisible.value = true;
  } catch (error: any) {
    ElMessage.error("获取数据失败");
  }
};

// 查看详情
const handleView = async (row: OdsByqxjysjInfo) => {
  try {
    const response: any = await getOdsByqxjysjById(row.id);
    const data = response.data.data || response.data;
    viewData.value = data;
    viewDialogVisible.value = true;
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
        if (isEdit.value) {
          await updateOdsByqxjysj(formData);
          ElMessage.success("修改成功");
        } else {
          await addOdsByqxjysj(formData);
          ElMessage.success("新增成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error: any) {
        ElMessage.error(isEdit.value ? "修改失败" : "新增失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 删除
const handleDelete = (row: OdsByqxjysjInfo) => {
  ElMessageBox.confirm(`确定要删除学号为"${row.xh}"的数据吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const response: any = await deleteOdsByqxjysj(row.id);
        if (response.data.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(response.data.message || "删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
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
        const response: any = await batchDeleteOdsByqxjysj(selectedIds.value);
        if (response.data.code === 200) {
          ElMessage.success("批量删除成功");
          selectedIds.value = [];
          getList();
        } else {
          ElMessage.error(response.data.message || "批量删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "批量删除失败");
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
    const response = await exportOdsByqxjysj(queryParams);

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `毕业去向就业数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    ElMessage.error(error.message || "导出失败");
  }
};

// 状态切换
const handleStatusChange = async (row: OdsByqxjysjInfo) => {
  try {
    const response: any = await updateSingleEnableStatus(
      row.id,
      row.enableStatus,
    );
    if (response.data.code === 200) {
      ElMessage.success("状态修改成功");
    } else {
      // 恢复原状态
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
      ElMessage.error(response.data.message || "状态修改失败");
    }
  } catch (error: any) {
    // 恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    ElMessage.error(error.message || "状态修改失败");
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
const getSystemSchoolCodeData = async () => {
  const response: any = await getSystemSchoolCode();
  systemSchoolCode.value = response.data.data;
};

const loadDictData = async () => {
  try {
    const [jydwhymRes, jydwxzmRes, jydwgmmRes, sfRes,jydwsfxqhzdmRes] = await Promise.all([
      getJydwhymOptions() as any,
      getJydwxzmOptions() as any,
      getJydwgmmOptions() as any,
      getSfOptions() as any,
      getJydwsfxqhzdmOptions() as any,
    ]);

    jydwhymOptions.value = jydwhymRes.data.data;
    jydwxzmOptions.value = jydwxzmRes.data.data;
    jydwgmmOptions.value = jydwgmmRes.data.data;
    sfOptions.value = sfRes.data.data;
    jydwsfxqhzdmOptions.value = jydwsfxqhzdmRes.data.data;

  } catch (error) {
    console.error("加载字典数据失败:", error);
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
.entity-management {
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

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
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
    margin-bottom: 8px;

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
    padding: 8px 0;
    margin-top: 10px;

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
}
</style>
