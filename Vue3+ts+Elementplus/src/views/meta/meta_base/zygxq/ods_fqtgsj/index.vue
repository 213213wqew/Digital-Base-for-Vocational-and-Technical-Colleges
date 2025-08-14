<template>
  <div class="enterprise-visit-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
        <el-form-item label="走访企业名称" prop="zfqymc">
          <el-input v-model="queryParams.zfqymc" placeholder="请输入企业名称" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item label="需求专业名称" prop="xqzymc">
          <el-input v-model="queryParams.xqzymc" placeholder="请输入专业名称" clearable style="width: 220px;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery"><el-icon><Search /></el-icon>搜索</el-button>
          <el-button @click="resetQuery"><el-icon><Refresh /></el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增</el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete"><el-icon><Delete /></el-icon>批量删除</el-button>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon>导出Excel</el-button>
         
        </div>
        <div class="header-title">访企拓岗数据管理</div>
        <div class="placeholder">
          <el-button type="warning" @click="handleImport"><el-icon><Upload /></el-icon>导入</el-button>
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList"><el-icon><Refresh /></el-icon></el-button>
          </el-tooltip>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="dataList"
        @selection-change="handleSelectionChange"
        border
        style="width: 100%"
        highlight-current-row
        @row-dblclick="handleRowDblClick"
        :height="'calc(75vh - 160px)'"
        stripe
        size="default"
      >
        <el-table-column type="selection" width="45" fixed="left" />
        <el-table-column type="index" label="序号" width="50" fixed="left" />
        <el-table-column prop="zfqymc" label="走访企业名称" min-width="200" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="xqzymc" label="需求专业名称" min-width="180" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="ktggws" label="可提供岗位数" width="130" align="center" sortable="custom" />
        <el-table-column prop="qtbfr" label="牵头拜访人" width="120" align="center" sortable="custom" />
        <el-table-column prop="bfsj" label="拜访时间" width="120" align="center" sortable="custom" />
        <el-table-column prop="qyjdr" label="企业接待人" width="120" align="center" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" width="160" align="center" sortable="custom" />
        <el-table-column label="操作" width="180" fixed="right" align="center">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="handleView(row)"><el-icon><View /></el-icon>查看</el-button>
            <el-button link type="primary" size="small" @click="handleEdit(row)"><el-icon><Edit /></el-icon>编辑</el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)"><el-icon><Delete /></el-icon>删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <span class="total-info">共 {{ total }} 条</span>
        <el-pagination
          v-model:current-page="queryParams.pageNum"
          v-model:page-size="queryParams.pageSize"
          :page-sizes="[20, 50, 100, 200]"
          layout="sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          small
        />
      </div>
    </el-card>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1200px" :close-on-click-modal="false" append-to-body class="enterprise-visit-dialog" destroy-on-close>
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="formRules" label-width="160px">
        
        <el-divider content-position="left">核心信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" :disabled="true" /></el-form-item></el-col>
          <el-col :span="12">
            <el-form-item label="走访企业名称" prop="zfqymc">
              <div style="display: flex; align-items: center; gap: 8px">
              <el-select
                v-model="form.zfqymc"
                filterable
                remote
                reserve-keyword
                placeholder="请输入企业名称关键字"
                :remote-method="remoteMethod"
                :loading="companySearchLoading"
                @change="handleCompanySelect"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item.hzqytyshxydm"
                  :label="item.hzqymc"
                  :value="item"
                />
              </el-select>
              <el-tooltip content="数据来源 产学合作数据子类类表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
              </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="走访企业统一社会信用代码" prop="zfqydm"><el-input v-model="form.zfqydm" placeholder="选择企业自动填充" maxlength="18" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="拜访时间" prop="bfsj"><el-date-picker v-model="form.bfsj" type="date" placeholder="请选择拜访时间" format="YYYYMMDD" value-format="YYYYMMDD" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        
        <el-divider content-position="left">拜访与接待</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="牵头拜访人" prop="qtbfr"><el-input v-model="form.qtbfr" placeholder="请输入牵头拜访人姓名" maxlength="60" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="职务" prop="zw"><el-input v-model="form.zw" placeholder="请输入牵头拜访人职务" maxlength="60" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="企业接待人姓名" prop="qyjdr"><el-input v-model="form.qyjdr" placeholder="请输入企业接待人姓名" maxlength="36" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接待人职务" prop="jdrzw"><el-input v-model="form.jdrzw" placeholder="请输入接待人职务" maxlength="30" show-word-limit /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">需求与合作</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="需求专业代码" prop="xqzydm">
              <div style="display: flex; align-items: center; gap: 8px">
               <el-select
                v-model="form.xqzydm"
                filterable
                remote
                reserve-keyword
                placeholder="请输入专业代码或名称"
                :remote-method="remoteMethodMajor"
                :loading="majorSearchLoading"
                @change="handleMajorSelect"
                style="width: 100%;"
              >
                <el-option
                  v-for="item in majorOptions"
                  :key="item.value"
                  :label="`${item.label}`"
                  :value="item.value"
                />
              </el-select>
              <el-tooltip content="数据来源 专业建设数据子类表" placement="top">
                <el-icon style="color: #e6a23c"><Warning /></el-icon>
              </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12"><el-form-item label="需求专业名称" prop="xqzymc"><el-input v-model="form.xqzymc" placeholder="选择专业代码自动填充" maxlength="60" show-word-limit :disabled="true" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="需求专业层次" prop="xqzycc"><el-select v-model="form.xqzycc" placeholder="请选择专业层次" style="width: 100%;"><el-option v-for="item in selectOptions.ZYCCDM" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="可提供岗位数" prop="ktggws"><el-input-number v-model="form.ktggws" :min="0" controls-position="right" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="平均薪酬（元）" prop="pjxc"><el-input-number v-model="form.pjxc" :min="0" controls-position="right" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="访谈成果主要形式" prop="ftzyxs"><el-select v-model="form.ftzyxs" placeholder="请选择访谈成果形式" style="width: 100%;"><el-option v-for="item in selectOptions.FTCGXSDM" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></el-form-item></el-col>
          <el-col :span="24"><el-form-item label="其他达成意向的合作" prop="qtdcyxhz"><el-input v-model="form.qtdcyxhz" type="textarea" :rows="3" placeholder="请输入其他合作意向" maxlength="200" show-word-limit /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">实习合作</el-divider>
        <el-row :gutter="20">
          <el-col :span="8"><el-form-item label="接受实习生专业代码" prop="jssxszydm"><el-input v-model="form.jssxszydm" placeholder="实习专业代码" maxlength="8" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="接受实习生专业名称" prop="jssxszymc"><el-input v-model="form.jssxszymc" placeholder="实习专业名称" maxlength="60" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="接受实习生专业层次" prop="jssxszycc"><el-select v-model="form.jssxszycc" placeholder="实习专业层次" style="width: 100%;"><el-option v-for="item in selectOptions.ZYCCDM" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接受实习生人数" prop="jssxszyrs"><el-input-number v-model="form.jssxszyrs" :min="0" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接受实习报酬（元）" prop="jssxszybc"><el-input-number v-model="form.jssxszybc" :min="0" style="width: 100%;" /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">就业合作</el-divider>
        <el-row :gutter="20">
          <el-col :span="8"><el-form-item label="接受学生就业专业代码" prop="jsxsjyzydm"><el-input v-model="form.jsxsjyzydm" placeholder="就业专业代码" maxlength="8" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="接受学生就业专业名称" prop="jsxsjyzymc"><el-input v-model="form.jsxsjyzymc" placeholder="就业专业名称" maxlength="60" /></el-form-item></el-col>
          <el-col :span="8"><el-form-item label="接受学生就业专业层次" prop="jsxsjyzycc"><el-select v-model="form.jsxsjyzycc" placeholder="就业专业层次" style="width: 100%;"><el-option v-for="item in selectOptions.ZYCCDM" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接受学生就业人数" prop="jsxsjyrs"><el-input-number v-model="form.jsxsjyrs" :min="0" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="接受学生就业起薪线（元/月）" prop="jsxsjyqxx"><el-input-number v-model="form.jsxsjyqxx" :min="0" style="width: 100%;" /></el-form-item></el-col>
        </el-row>

      </el-form>
      <div v-else class="enterprise-visit-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="走访企业名称">{{ form.zfqymc }}</el-descriptions-item>
          <el-descriptions-item label="走访企业统一社会信用代码">{{ form.zfqydm }}</el-descriptions-item>
          <el-descriptions-item label="需求专业代码">{{ form.xqzydm }}</el-descriptions-item>
          <el-descriptions-item label="需求专业名称">{{ form.xqzymc }}</el-descriptions-item>
          <el-descriptions-item label="需求专业层次">{{ getDictLabel(selectOptions.ZYCCDM, form.xqzycc) }}</el-descriptions-item>
          <el-descriptions-item label="可提供岗位数">{{ form.ktggws }}</el-descriptions-item>
          <el-descriptions-item label="平均薪酬（元）">{{ form.pjxc }}</el-descriptions-item>
          <el-descriptions-item label="牵头拜访人">{{ form.qtbfr }}</el-descriptions-item>
          <el-descriptions-item label="职务">{{ form.zw }}</el-descriptions-item>
          <el-descriptions-item label="拜访时间">{{ form.bfsj }}</el-descriptions-item>
          <el-descriptions-item label="企业接待人姓名">{{ form.qyjdr }}</el-descriptions-item>
          <el-descriptions-item label="接待人职务">{{ form.jdrzw }}</el-descriptions-item>
          <el-descriptions-item label="访谈成果主要形式">{{ getDictLabel(selectOptions.FTCGXSDM, form.ftzyxs) }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
          <el-descriptions-item label="其他达成意向的合作" :span="2">{{ form.qtdcyxhz }}</el-descriptions-item>
          <el-descriptions-item label="接受实习生专业代码">{{ form.jssxszydm }}</el-descriptions-item>
          <el-descriptions-item label="接受实习生专业名称">{{ form.jssxszymc }}</el-descriptions-item>
          <el-descriptions-item label="接受实习生专业层次">{{ getDictLabel(selectOptions.ZYCCDM, form.jssxszycc) }}</el-descriptions-item>
          <el-descriptions-item label="接受实习生人数">{{ form.jssxszyrs }}</el-descriptions-item>
          <el-descriptions-item label="接受实习报酬（元）">{{ form.jssxszybc }}</el-descriptions-item>
          <el-descriptions-item label="接受学生就业专业代码">{{ form.jsxsjyzydm }}</el-descriptions-item>
          <el-descriptions-item label="接受学生就业专业名称">{{ form.jsxsjyzymc }}</el-descriptions-item>
          <el-descriptions-item label="接受学生就业专业层次">{{ getDictLabel(selectOptions.ZYCCDM, form.jsxsjyzycc) }}</el-descriptions-item>
          <el-descriptions-item label="接受学生就业人数">{{ form.jsxsjyrs }}</el-descriptions-item>
          <el-descriptions-item label="接受学生就业起薪线（元/月）">{{ form.jsxsjyqxx }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入访企拓岗数据"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleImportClose"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px"
        >
          <template #default>
            <div>
              <p>1. 请使用标准的Excel模板进行数据导入</p>
              <p>2. 必填字段：走访企业名称、走访企业统一社会信用代码、需求专业代码等</p>
              <p>3. 支持新增和更新数据，系统会根据唯一标识自动判断</p>
              <p>4. 单次最多支持导入1000条数据</p>
            </div>
          </template>
        </el-alert>

        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 xlsx/xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>

        <div v-if="importResult" class="import-result" style="margin-top: 20px">
          <el-alert
            :title="`导入完成：总数 ${importResult.total}，成功 ${importResult.success}，新增 ${importResult.insert}，更新 ${importResult.update}，失败 ${importResult.fail}`"
            :type="importResult.fail > 0 ? 'warning' : 'success'"
            :closable="false"
            show-icon
          >
            <template #default>
              <div v-if="importResult.errors && importResult.errors.length > 0">
                <p style="margin: 10px 0 5px 0; font-weight: bold">错误详情：</p>
                <div style="max-height: 200px; overflow-y: auto">
                  <p v-for="(error, index) in importResult.errors" :key="index" style="margin: 2px 0; color: #f56c6c">
                    {{ error }}
                  </p>
                </div>
              </div>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleImportClose">取消</el-button>
          <el-button
            type="primary"
            :loading="importLoading"
            :disabled="!selectedFile"
            @click="handleImportSubmit"
          >
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download, Upload, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsFqtgsjPage,
  getOdsFqtgsjById,
  addOdsFqtgsj,
  updateOdsFqtgsj,
  deleteOdsFqtgsj,
  batchDeleteOdsFqtgsj,
  exportOdsFqtgsj,
  importOdsFqtgsj,
  getDictOptions,
  searchCxhzCompanies,
  getZyhOptions,
  type OdsFqtgsjInfo,
  type OdsFqtgsjQuery,
  type OdsFqtgsjForm,
  type OdsCxhzCompanyInfo,
} from "@/api/meta/meta_base/zygxq/ods_fqtgsj";
import { getSystemSchoolCode } from "@/api/meta/meta_base/zygxx/ods_xxtsxxhxtyysj";


type DictOption = { label: string; value: any };

const loading = ref(false);
const dataList = ref<OdsFqtgsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

// 导入相关变量
const importDialogVisible = ref(false);
const importLoading = ref(false);
const selectedFile = ref<File | null>(null);
const fileList = ref<any[]>([]);
const importResult = ref<any>(null);
const uploadRef = ref<any>();

// 企业搜索
const companySearchLoading = ref(false);
const companyOptions = ref<OdsCxhzCompanyInfo[]>([]);

// 专业搜索
const majorSearchLoading = ref(false);
const majorOptions = ref<DictOption[]>([]);

const queryParams = reactive<OdsFqtgsjQuery>({
  zfqymc: "",
  xqzymc: "",
  pageNum: 1,
  pageSize: 20,
});

const initialState: OdsFqtgsjForm = {
    zjsjwyxbs: "", xxdm: "", zfqymc: "", zfqydm: "", xqzydm: "",
    xqzymc: "", xqzycc: "", ktggws: "", pjxc: "", qtbfr: "",
    zw: "", bfsj: "", qyjdr: "", jdrzw: "", ftzyxs: "",
    jssxszydm: "", jssxszymc: "", jssxszycc: "", jssxszyrs: "", jssxszybc: undefined,
    jsxsjyzydm: "", jsxsjyzymc: "", jsxsjyzycc: "", jsxsjyrs: "", jsxsjyqxx: undefined,
    qtdcyxhz: "", sjcjsj: "",
};
const form = ref<OdsFqtgsjForm>({ ...initialState });

const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const systemSchoolCode = ref("");

const formRules = reactive<FormRules>({
  zfqymc: [{ required: true, message: "走访企业名称为必填项", trigger: "change" }],
  zfqydm: [{ required: true, message: "走访企业统一社会信用代码为必填项", trigger: "blur" }],
  xqzydm: [{ required: true, message: "需求专业代码为必填项", trigger: "change" }],
   
  xqzycc: [{ required: true, message: "需求专业层次为必填项", trigger: "change" }],
  ktggws: [{ required: true, message: "可提供岗位数为必填项", trigger: "blur" }],
  pjxc: [{ required: true, message: "平均薪酬为必填项", trigger: "blur" }],
  bfsj: [{ required: true, message: "拜访时间为必填项", trigger: "change" }],
  ftzyxs: [{ required: true, message: "访谈成果主要形式为必填项", trigger: "change" }],
  jssxszydm: [{ required: true, message: "接受实习生专业代码为必填项", trigger: "blur" }],
  jssxszymc: [{ required: true, message: "接受实习生专业名称为必填项", trigger: "blur" }],
  jssxszycc: [{ required: true, message: "接受实习生专业层次为必填项", trigger: "change" }],
  jssxszyrs: [{ required: true, message: "接受实习生人数为必填项", trigger: "blur" }],
  jssxszybc: [{ required: true, message: "接受实习报酬为必填项", trigger: "blur" }],
  jsxsjyzydm: [{ required: true, message: "接受学生就业专业代码为必填项", trigger: "blur" }],
  jsxsjyzymc: [{ required: true, message: "接受学生就业专业名称为必填项", trigger: "blur" }],
  jsxsjyzycc: [{ required: true, message: "接受学生就业专业层次为必填项", trigger: "change" }],
  jsxsjyrs: [{ required: true, message: "接受学生就业人数为必填项", trigger: "blur" }],
  jsxsjyqxx: [{ required: true, message: "接受学生就业起薪线为必填项", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间为必填项", trigger: "change" }],
});

const selectOptions = reactive({
  ZYCCDM: [] as DictOption[],
  FTCGXSDM: [] as DictOption[],
});

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return "新增访企拓岗数据";
  if (dialogMode.value === 'edit') return "编辑访企拓岗数据";
  return "查看访企拓岗数据";
});

// 远程搜索企业方法
const remoteMethod = async (query: string) => {
  if (query) {
    companySearchLoading.value = true;
    try {
      const res = await searchCxhzCompanies(query);
      if (res.data.code === 200) {
        companyOptions.value = res.data.data;
      } else {
        companyOptions.value = [];
      }
    } catch (error) {
      companyOptions.value = [];
      console.error("搜索企业失败:", error);
    } finally {
      companySearchLoading.value = false;
    }
  } else {
    companyOptions.value = [];
  }
};

// 选择企业后，自动填充信用代码
const handleCompanySelect = (selectedCompany: OdsCxhzCompanyInfo) => {
  if (selectedCompany) {
    form.value.zfqymc = selectedCompany.hzqymc;
    form.value.zfqydm = selectedCompany.hzqytyshxydm;
  }
};

// 远程搜索专业方法
const remoteMethodMajor = async (query: string) => {
  if (query) {
    majorSearchLoading.value = true;
    try {
      const res = await getZyhOptions(query);
      if (res.data.code === 200) {
        majorOptions.value = res.data.data;
      } else {
        majorOptions.value = [];
      }
    } catch (error) {
      majorOptions.value = [];
      console.error("搜索专业失败:", error);
    } finally {
      majorSearchLoading.value = false;
    }
  } else {
    majorOptions.value = [];
  }
};

// 选择专业后，自动填充专业名称
const handleMajorSelect = (selectedMajorCode: string) => {
  if (selectedMajorCode) {
    const selectedOption = majorOptions.value.find(opt => opt.value === selectedMajorCode);
    if (selectedOption) {
      form.value.xqzymc = selectedOption.zymc;
    }
  }
};


const getDictLabel = (options: DictOption[], value: any) => {
  const option = options.find(item => item.value == value);
  return option ? option.label : value;
};

const fetchSelectOptions = async () => {
  try {
    const resZycc = await getDictOptions("ZYCCDM");
    if (resZycc.data.code === 200) selectOptions.ZYCCDM = resZycc.data.data;
    const resFtcgxs = await getDictOptions("FTCGXSDM");
    if (resFtcgxs.data.code === 200) selectOptions.FTCGXSDM = resFtcgxs.data.data;
  } catch (error) {
    console.error("获取下拉选项失败:", error);
  }
};

const getSystemSchoolCodeData = async () => {
  try {
    const response = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      initialState.xxdm = response.data.data;
    }
  } catch (error) {
    console.error("获取学校代码失败:", error);
  }
};

const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsFqtgsjPage(queryParams);
    dataList.value = response.data.data.records;
    total.value = response.data.data.total;
  } finally {
    loading.value = false;
  }
};

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

const resetForm = () => {
  form.value = { ...initialState, xxdm: systemSchoolCode.value };
  formRef.value?.resetFields();
  companyOptions.value = []; // 重置时清空企业选项
  majorOptions.value = []; // 重置时清空专业选项
};

const handleAdd = async () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsFqtgsjInfo) => {
  resetForm();
  try {
    const response = await getOdsFqtgsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsFqtgsjInfo) => {
  resetForm();
  try {
    const response = await getOdsFqtgsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleFormSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        if (dialogMode.value === "add") {
          await addOdsFqtgsj(form.value);
        } else {
          await updateOdsFqtgsj(form.value);
        }
        ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
        dialogVisible.value = false;
        getList();
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

const handleDelete = async (row: OdsFqtgsjInfo) => {
  await ElMessageBox.confirm("确定删除吗?", "提示", { type: "warning" });
  await deleteOdsFqtgsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条数据吗?`, "提示", { type: "warning" });
  await batchDeleteOdsFqtgsj(selectedIds.value);
  ElMessage.success("批量删除成功");
  getList();
};

const handleExport = async () => {
  ElMessage.info("正在导出，请稍候...");
  const response = await exportOdsFqtgsj(queryParams);
  const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `访企拓岗数据_${new Date().getTime()}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
  ElMessage.success("导出成功");
};

// 导入相关方法
const handleImport = () => {
  importDialogVisible.value = true;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
};

const handleFileChange = (file: any) => {
  selectedFile.value = file.raw;
  fileList.value = [file];
};

const handleExceed = () => {
  ElMessage.warning("只能选择一个文件进行导入");
};

const handleImportSubmit = async () => {
  if (!selectedFile.value) {
    ElMessage.warning("请选择要导入的文件");
    return;
  }

  // 文件大小检查（10MB）
  if (selectedFile.value.size > 10 * 1024 * 1024) {
    ElMessage.error("文件大小不能超过10MB");
    return;
  }

  // 文件类型检查
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel'
  ];
  if (!allowedTypes.includes(selectedFile.value.type)) {
    ElMessage.error("只支持Excel文件格式（.xlsx, .xls）");
    return;
  }

  try {
    importLoading.value = true;
    
    const response = await importOdsFqtgsj(selectedFile.value);
    
    if (response.data.code === 200) {
      importResult.value = response.data.data;
      ElMessage.success("导入完成");
      
      // 导入成功后关闭弹窗并刷新数据
      handleImportClose();
      getList();
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error) {
    console.error("导入失败:", error);
    ElMessage.error("导入失败");
  } finally {
    importLoading.value = false;
  }
};

const handleImportClose = () => {
  importDialogVisible.value = false;
  importResult.value = null;
  selectedFile.value = null;
  fileList.value = [];
  uploadRef.value?.clearFiles();
};

const handleSelectionChange = (selection: OdsFqtgsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleRowDblClick = (row: OdsFqtgsjInfo) => handleView(row);
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  await getSystemSchoolCodeData();
  await fetchSelectOptions();
  getList();
});
</script>

<style scoped>
.enterprise-visit-management { padding: 0; }
.search-card { margin-bottom: 8px; }
.search-form { display: flex; flex-wrap: wrap; gap: 8px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; }
.operation-buttons { display: flex; align-items: center; gap: 8px; }
.header-title { font-size: 16px; font-weight: 600; color: #303133; flex: 1; text-align: center; }
.placeholder { width: 100px; display: flex; justify-content: flex-end; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-top: 1px solid #e4e7ed; background-color: #fafafa; }
.total-info { font-size: 14px; color: #606266; }
:deep(.enterprise-visit-dialog .el-dialog__body) { padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
:deep(.enterprise-visit-dialog .el-form-item) { margin-bottom: 18px; }
.enterprise-visit-detail .el-descriptions { margin-bottom: 16px; }
.dialog-footer { text-align: right; }
:deep(.el-col) {
  margin-bottom: 12px;
}
:deep(.el-divider--horizontal) {
    margin: 20px 0;
}

/* 导入对话框样式 */
.import-content {
  padding: 0;
}

:deep(.upload-demo .el-upload-dragger) {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.upload-demo .el-upload-dragger:hover) {
  border-color: #409eff;
}

:deep(.upload-demo .el-icon--upload) {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

:deep(.upload-demo .el-upload__text) {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

:deep(.upload-demo .el-upload__text em) {
  color: #409eff;
  font-style: normal;
}

:deep(.upload-demo .el-upload__tip) {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
  text-align: center;
}ard { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; }
.operation-buttons { display: flex; align-items: center; gap: 8px; }
.header-title { font-size: 16px; font-weight: 600; color: #303133; flex: 1; text-align: center; }
.placeholder { width: 100px; display: flex; justify-content: flex-end; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-top: 1px solid #e4e7ed; background-color: #fafafa; }
.total-info { font-size: 14px; color: #606266; }
:deep(.enterprise-visit-dialog .el-dialog__body) { padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
:deep(.enterprise-visit-dialog .el-form-item) { margin-bottom: 18px; }
.enterprise-visit-detail .el-descriptions { margin-bottom: 16px; }
.dialog-footer { text-align: right; }
:deep(.el-col) {
  margin-bottom: 12px;
}
:deep(.el-divider--horizontal) {
    margin: 20px 0;
}

/* Import dialog styles */
.import-content {
  padding: 0;
}

:deep(.upload-demo .el-upload-dragger) {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.upload-demo .el-upload-dragger:hover) {
  border-color: #409eff;
}

:deep(.upload-demo .el-icon--upload) {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 50px;
}

:deep(.upload-demo .el-upload__text) {
  color: #606266;
  font-size: 14px;
  text-align: center;
}

:deep(.upload-demo .el-upload__text em) {
  color: #409eff;
  font-style: normal;
}

:deep(.upload-demo .el-upload__tip) {
  font-size: 12px;
  color: #606266;
  margin-top: 7px;
  text-align: center;
}
</style>
