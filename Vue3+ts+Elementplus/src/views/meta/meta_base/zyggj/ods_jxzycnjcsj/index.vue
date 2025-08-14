<template>
  <div class="teaching-resource-adoption-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
        <el-form-item label="资源名称" prop="cyjxzymc">
          <el-input v-model="queryParams.cyjxzymc" placeholder="请输入采用教学资源名称" clearable style="width: 240px;" />
        </el-form-item>
        <el-form-item label="国家名称" prop="cygjmc">
          <el-input v-model="queryParams.cygjmc" placeholder="请输入采用国家名称" clearable style="width: 220px;" />
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
          <el-dropdown @command="handleBatchStatusCommand" :disabled="selectedIds.length === 0">
            <el-button type="info">
              批量状态<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="enable">批量启用</el-dropdown-item>
                <el-dropdown-item command="disable">批量禁用</el-dropdown-item>
                <el-dropdown-item divided command="report">批量上报</el-dropdown-item>
                <el-dropdown-item command="unreport">批量取消上报</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-button type="success" @click="handleExport"><el-icon><Download /></el-icon>导出Excel</el-button>
          
        </div>
        <div class="header-title">教学资源采纳基础数据管理</div>
        <div class="placeholder">

          <el-dropdown @command="handleImportCommand" style="margin-left: 8px;">
            <el-button type="warning">
              <el-icon><Upload /></el-icon>导入数据<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="template">下载导入模板</el-dropdown-item>
               <el-dropdown-item command="import">导入Excel数据</el-dropdown-item>
              </el-dropdown-menu> 
            </template>
          </el-dropdown>
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
        <el-table-column prop="cyjxzymc" label="采用教学资源名称" min-width="250" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="cyjxzylxText" label="资源类型" width="120" align="center" />
        <el-table-column prop="cygjmc" label="采用国家" width="150" show-overflow-tooltip sortable="custom" />
        <el-table-column prop="cysj" label="采用时间" width="120" align="center" sortable="custom" />
        <el-table-column prop="cylxText" label="采用类型" width="120" align="center" />
        <el-table-column prop="sjwfxss" label="涉及外方学生数" width="140" align="center" sortable="custom" />
        <el-table-column label="上报状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getReportStatusType(row.reportStatus)" size="small">
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
              @change="handleEnableStatusChange(row)"
              :loading="row.statusLoading"
            />
          </template>
        </el-table-column>
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

    <!-- 导入数据对话框 -->
    <el-dialog v-model="importDialogVisible" title="导入教学资源采纳数据" width="600px" :close-on-click-modal="false" append-to-body>
      <div class="import-dialog-content">
        <el-alert
          title="导入说明"
          type="info"
          :closable="false"
          show-icon
          style="margin-bottom: 20px;"
        >
          <template #default>
            <div>
              <p>1. 请先下载导入模板，按照模板格式填写数据</p>
              <p>2. 支持 .xlsx 和 .xls 格式的Excel文件</p>
              <p>3. 文件大小不能超过 10MB</p>
              <p>4. 主键唯一标识和数据采集时间可为空，系统将自动生成</p>
            </div>
          </template>
        </el-alert>

        <div class="import-actions">
          <el-button type="primary" @click="handleDownloadTemplate" style="margin-bottom: 20px;">
            <el-icon><Download /></el-icon>下载导入模板
          </el-button>
        </div>

        <div class="import-mode-selection" style="margin-bottom: 20px;">
          <el-alert
            title="导入模式选择"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 15px;"
          >
            <template #default>
              <div>
                <p><strong>普通导入</strong>：将新数据追加到现有数据中</p>
                <p><strong>清空已上报数据后导入</strong>：先清空已上报状态的数据，保留未上报和上报失败的数据，然后导入新数据</p>
              </div>
            </template>
          </el-alert>
          
          <el-radio-group v-model="importMode" style="width: 100%;">
            <el-radio value="normal" style="margin-bottom: 10px;">
              <span style="font-weight: 500;">普通导入</span>
              <span style="color: #909399; margin-left: 10px;">（追加模式）</span>
            </el-radio>
            <el-radio value="clear" style="margin-bottom: 10px;">
              <span style="font-weight: 500; color: #E6A23C;">清空已上报数据后导入</span>
              <span style="color: #F56C6C; margin-left: 10px;">（将清空已上报状态的数据）</span>
            </el-radio>
          </el-radio-group>
        </div>

        <el-upload
          ref="uploadRef"
          class="upload-demo"
          drag
          :auto-upload="false"
          :limit="1"
          :accept="'.xlsx,.xls'"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将Excel文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传 .xlsx/.xls 文件，且不超过 10MB
            </div>
          </template>
        </el-upload>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="importDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="importLoading" :disabled="fileList.length === 0" @click="handleConfirmImport">
            确认导入
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="1100px" :close-on-click-modal="false" append-to-body class="resource-adoption-dialog" destroy-on-close>
      <el-form v-if="dialogMode !== 'view'" ref="formRef" :model="form" :rules="formRules" label-width="150px">
        
        <el-divider content-position="left">核心信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="主键唯一标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" :disabled="true" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用教学资源类型" prop="cyjxzylx"><el-select v-model="form.cyjxzylx" placeholder="请选择资源类型" style="width: 100%;"><el-option v-for="item in dictData.CYJXZYLXDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用教学资源编号" prop="cyjxzybh"><el-input v-model="form.cyjxzybh" placeholder="请输入资源编号" maxlength="64" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24"><el-form-item label="采用教学资源名称" prop="cyjxzymc"><el-input v-model="form.cyjxzymc" placeholder="请输入资源名称" maxlength="300" show-word-limit /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">国家信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用国家代码" prop="cygjdm"><el-input v-model="form.cygjdm" placeholder="请输入国家代码" maxlength="6" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用国家名称" prop="cygjmc"><el-input v-model="form.cygjmc" placeholder="请输入国家名称" maxlength="60" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用国家所属大洲" prop="cygjssdz"><el-input v-model="form.cygjssdz" placeholder="请输入所属大洲" maxlength="20" show-word-limit /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="一带一路" prop="sfydyl"><el-select v-model="form.sfydyl" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="中亚五国" prop="sfzywg"><el-select v-model="form.sfzywg" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="东盟十国" prop="sfdmsg"><el-select v-model="form.sfdmsg" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="上合组织" prop="sfshzz"><el-select v-model="form.sfshzz" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="金砖国家" prop="sfjzgj"><el-select v-model="form.sfjzgj" style="width: 100%;"><el-option v-for="item in dictData.SFBZDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
        </el-row>
        
        <el-divider content-position="left">采用信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用时间" prop="cysj"><el-date-picker v-model="form.cysj" type="month" placeholder="请选择采用年月" format="YYYYMM" value-format="YYYYMM" style="width: 100%;" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="采用院校(机构)" prop="cyyxjg"><el-input v-model="form.cyyxjg" placeholder="请输入采用院校或机构" maxlength="160" show-word-limit /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="采用类型" prop="cylx"><el-select v-model="form.cylx" placeholder="请选择采用类型" style="width: 100%;"><el-option v-for="item in dictData.CYLXDM" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="涉及外方学生数" prop="sjwfxss"><el-input-number v-model="form.sjwfxss" :min="0" controls-position="right" style="width: 100%;" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width: 100%;" /></el-form-item></el-col>
        </el-row>

        <el-divider content-position="left">状态信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12"><el-form-item label="上报状态" prop="reportStatus"><el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width: 100%;"><el-option label="未上报" value="0" /><el-option label="已上报" value="1" /><el-option label="上报失败" value="2" /></el-select></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="启用状态" prop="enableStatus"><el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%;"><el-option label="禁用" value="0" /><el-option label="启用" value="1" /></el-select></el-form-item></el-col>
        </el-row>
      </el-form>
      <div v-else class="resource-adoption-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="主键唯一标识">{{ form.zjsjwyxbs }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{ form.xxdm }}</el-descriptions-item>
          <el-descriptions-item label="资源类型">{{ getDictLabel(dictData.CYJXZYLXDM, form.cyjxzylx) }}</el-descriptions-item>
          <el-descriptions-item label="资源编号">{{ form.cyjxzybh }}</el-descriptions-item>
          <el-descriptions-item label="资源名称" :span="2">{{ form.cyjxzymc }}</el-descriptions-item>
          <el-descriptions-item label="国家代码">{{ form.cygjdm }}</el-descriptions-item>
          <el-descriptions-item label="国家名称">{{ form.cygjmc }}</el-descriptions-item>
          <el-descriptions-item label="所属大洲">{{ form.cygjssdz }}</el-descriptions-item>
          <el-descriptions-item label="一带一路">{{ getDictLabel(dictData.SFBZDM, form.sfydyl) }}</el-descriptions-item>
          <el-descriptions-item label="中亚五国">{{ getDictLabel(dictData.SFBZDM, form.sfzywg) }}</el-descriptions-item>
          <el-descriptions-item label="东盟十国">{{ getDictLabel(dictData.SFBZDM, form.sfdmsg) }}</el-descriptions-item>
          <el-descriptions-item label="上合组织">{{ getDictLabel(dictData.SFBZDM, form.sfshzz) }}</el-descriptions-item>
          <el-descriptions-item label="金砖国家">{{ getDictLabel(dictData.SFBZDM, form.sfjzgj) }}</el-descriptions-item>
          <el-descriptions-item label="采用时间">{{ form.cysj }}</el-descriptions-item>
          <el-descriptions-item label="采用院校(机构)">{{ form.cyyxjg }}</el-descriptions-item>
          <el-descriptions-item label="采用类型">{{ getDictLabel(dictData.CYLXDM, form.cylx) }}</el-descriptions-item>
          <el-descriptions-item label="涉及外方学生数">{{ form.sjwfxss }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{ form.sjcjsj }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">{{ getReportStatusText(form.reportStatus) }}</el-descriptions-item>
          <el-descriptions-item label="启用状态">{{ form.enableStatus === '1' ? '启用' : '禁用' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogMode !== 'view'" type="primary" :loading="submitLoading" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download, Upload, ArrowDown, UploadFilled } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getOdsJxzycnjcsjPage,
  getOdsJxzycnjcsjById,
  addOdsJxzycnjcsj,
  updateOdsJxzycnjcsj,
  deleteOdsJxzycnjcsj,
  batchDeleteOdsJxzycnjcsj,
  exportOdsJxzycnjcsj,
  downloadImportTemplate,
  importOdsJxzycnjcsj,
  importOdsJxzycnjcsjWithClear,
  previewImportOdsJxzycnjcsj,
  updateReportStatus,
  updateEnableStatus,
  batchUpdateReportStatus,
  batchUpdateEnableStatus,
  getDictOptions,
  getSystemSchoolCode,
  type OdsJxzycnjcsjInfo,
  type OdsJxzycnjcsjQuery,
  type OdsJxzycnjcsjForm,
} from "@/api/meta/meta_base/zyggj/ods_jxzycnjcsj";

type DictOption = { label: string; value: any;[key: string]: any; };

const loading = ref(false);
const dataList = ref<OdsJxzycnjcsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const systemSchoolCode = ref("");

// 导入相关变量
const importDialogVisible = ref(false);
const importLoading = ref(false);
const fileList = ref<any[]>([]);
const uploadRef = ref();
const importMode = ref('normal'); // 导入模式：normal-普通导入，clear-清空后导入

const queryParams = reactive<OdsJxzycnjcsjQuery>({
  cyjxzymc: "",
  cygjmc: "",
  pageNum: 1,
  pageSize: 20,
});

const initialState: OdsJxzycnjcsjForm = {
    zjsjwyxbs: "", xxdm: "", cyjxzylx: "", cyjxzybh: "", cyjxzymc: "",
    cygjdm: "", cygjmc: "", cygjssdz: "", sfydyl: "", sfzywg: "",
    sfdmsg: "", sfshzz: "", sfjzgj: "", cysj: "", cyyxjg: "",
    cylx: "", sjwfxss: undefined, sjcjsj: "", reportStatus: "0", enableStatus: "1",
};

const form = ref<OdsJxzycnjcsjForm>({ ...initialState });

const formRules = reactive<FormRules>({
  zjsjwyxbs: [{ validator: (rule: any, value: string, cb: Function) => {
    if (value && (!/^[A-Z0-9]+$/.test(value) || value.length !== 32)) {
      cb(new Error('主键唯一标识必须是32位大写字母和数字组合'));
    } else { cb(); }
  }, trigger: 'blur' }],
  xxdm: [{ required: true, message: "学校代码为必填项", trigger: "blur" }],
  cyjxzylx: [{ required: true, message: "请选择采用教学资源类型", trigger: "change" }],
  cyjxzybh: [{ required: true, message: "请输入采用教学资源编号", trigger: "blur" }, {max: 64, message: '长度不能超过64位'}],
  cyjxzymc: [{ required: true, message: "请输入采用教学资源名称", trigger: "blur" }, {max: 300, message: '长度不能超过300位'}],
  cygjdm: [{ required: true, message: "请输入采用国家代码", trigger: "blur" }, {max: 6, message: '长度不能超过6位'}],
  cygjmc: [{ required: true, message: "请输入采用国家名称", trigger: "blur" }, {max: 60, message: '长度不能超过60位'}],
  cygjssdz: [{ required: true, message: "请输入采用国家所属大洲", trigger: "blur" }, {max: 20, message: '长度不能超过20位'}],
  sfydyl: [{ required: true, message: "请选择是否一带一路国家", trigger: "change" }],
  sfzywg: [{ required: true, message: "请选择是否中亚五国国家", trigger: "change" }],
  sfdmsg: [{ required: true, message: "请选择是否东盟十国国家", trigger: "change" }],
  sfshzz: [{ required: true, message: "请选择是否上合组织国家", trigger: "change" }],
  sfjzgj: [{ required: true, message: "请选择是否金砖国家", trigger: "change" }],
  cysj: [{ required: true, message: "请选择采用时间", trigger: "change" }],
  cyyxjg: [{ required: true, message: "请输入采用院校(机构)", trigger: "blur" }, {max: 160, message: '长度不能超过160位'}],
  cylx: [{ required: true, message: "请选择采用类型", trigger: "change" }],
  sjwfxss: [{ required: true, message: "请输入涉及外方学生数", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
});

const dictData = reactive<{
  CYJXZYLXDM: DictOption[],
  SFBZDM: DictOption[],
  CYLXDM: DictOption[],
}>({
  CYJXZYLXDM: [],
  SFBZDM: [],
  CYLXDM: [],
});

const dialogTitle = computed(() => {
  if (dialogMode.value === 'add') return "新增教学资源采纳数据";
  if (dialogMode.value === 'edit') return "编辑教学资源采纳数据";
  return "查看教学资源采纳数据";
});

const getDictLabel = (options: DictOption[], value: any) => {
  const option = options.find(item => item.value == value);
  return option ? option.label : value;
};

const fetchDictData = async () => {
  try {
    const [res1, res2, res3] = await Promise.all([
      getDictOptions("CYJXZYLXDM"),
      getDictOptions("SFBZDM"),
      getDictOptions("CYLXDM"),
    ]);
    if (res1.data.code === 200) dictData.CYJXZYLXDM = res1.data.data;
    if (res2.data.code === 200) dictData.SFBZDM = res2.data.data;
    if (res3.data.code === 200) dictData.CYLXDM = res3.data.data;
  } catch (error) {
    console.error("获取字典数据失败:", error);
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
    const response = await getOdsJxzycnjcsjPage(queryParams);
    if(response.data.code === 200) {
        const transformedData = response.data.data.records.map(item => ({
            ...item,
            cyjxzylxText: getDictLabel(dictData.CYJXZYLXDM, item.cyjxzylx),
            cylxText: getDictLabel(dictData.CYLXDM, item.cylx)
        }));
        dataList.value = transformedData;
        total.value = response.data.data.total;
    }
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
};

const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsJxzycnjcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsJxzycnjcsjById(row.id);
    form.value = response.data.data;
    dialogMode.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsJxzycnjcsjInfo) => {
  resetForm();
  try {
    const response = await getOdsJxzycnjcsjById(row.id);
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
          await addOdsJxzycnjcsj(form.value);
          ElMessage.success("新增成功");
        } else {
          await updateOdsJxzycnjcsj(form.value);
          ElMessage.success("修改成功");
        }
        dialogVisible.value = false;
        getList();
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

const handleDelete = async (row: OdsJxzycnjcsjInfo) => {
  await ElMessageBox.confirm("确定删除吗?", "提示", { type: "warning" });
  await deleteOdsJxzycnjcsj(row.id);
  ElMessage.success("删除成功");
  getList();
};

const handleBatchDelete = async () => {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条数据吗?`, "提示", { type: "warning" });
  await batchDeleteOdsJxzycnjcsj(selectedIds.value);
  ElMessage.success("批量删除成功");
  getList();
};

const handleExport = async () => {
  ElMessage.info("正在导出，请稍候...");
  try {
    const response = await exportOdsJxzycnjcsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教学资源采纳数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (e) {
    ElMessage.error("导出失败");
  }
};

const handleSelectionChange = (selection: OdsJxzycnjcsjInfo[]) => {
  selectedIds.value = selection.map(item => item.id);
};

const handleImportCommand = (command: string) => {
  if (command === 'template') {
    handleDownloadTemplate();
  } else if (command === 'import') {
    handleImportData();
  }
};

const handleDownloadTemplate = async () => {
  ElMessage.info("正在生成导入模板，请稍候...");
  try {
    const response = await downloadImportTemplate({
      cyjxzymc: queryParams.cyjxzymc,
      cygjmc: queryParams.cygjmc
    });
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `教学资源采纳数据导入模板_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (e) {
    ElMessage.error("模板下载失败");
  }
};

const handleImportData = () => {
  // 重置导入状态
  fileList.value = [];
  importLoading.value = false;
  // 打开导入弹窗
  importDialogVisible.value = true;
};

// 文件选择变化处理
const handleFileChange = (file: any) => {
  // 验证文件类型
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    ElMessage.error('请选择Excel文件（.xlsx或.xls格式）');
    uploadRef.value?.clearFiles();
    return false;
  }

  // 验证文件大小（限制为10MB）
  if (file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过10MB');
    uploadRef.value?.clearFiles();
    return false;
  }

  fileList.value = [file];
  return true;
};

// 文件数量超出限制处理
const handleExceed = () => {
  ElMessage.warning('只能选择一个文件进行导入');
};

// 确认导入处理
const handleConfirmImport = async () => {
  if (fileList.value.length === 0) {
    ElMessage.warning('请先选择要导入的Excel文件');
    return;
  }

  const file = fileList.value[0].raw || fileList.value[0];
  
  // 如果是清空已上报数据后导入，需要二次确认
  if (importMode.value === 'clear') {
    try {
      await ElMessageBox.confirm(
        '此操作将删除数据库中所有已上报状态的数据，保留未上报和上报失败的数据，此操作不可恢复！确定要继续吗？',
        '清空已上报数据确认',
        {
          confirmButtonText: '确定清空已上报数据并导入',
          cancelButtonText: '取消',
          type: 'warning',
          confirmButtonClass: 'el-button--warning'
        }
      );
    } catch {
      return; // 用户取消操作
    }
  }
  
  try {
    importLoading.value = true;
    
    let response;
    if (importMode.value === 'clear') {
      ElMessage.info("正在清空数据库并导入新数据，请稍候...");
      response = await importOdsJxzycnjcsjWithClear(file);
    } else {
      ElMessage.info("正在导入数据，请稍候...");
      response = await importOdsJxzycnjcsj(file);
    }
    
    if (response.data.code === 200) {
      const successMessage = importMode.value === 'clear' ? "清空已上报数据后导入成功" : "数据导入成功";
      ElMessage.success(successMessage);
      importDialogVisible.value = false;
      getList(); // 刷新列表
    } else {
      ElMessage.error(response.data.message || "导入失败");
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    const errorMessage = error.response?.data?.message || error.message || "导入失败";
    ElMessage.error(errorMessage);
  } finally {
    importLoading.value = false;
  }
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case '0': return '未上报';
    case '1': return '已上报';
    case '2': return '上报失败';
    default: return '未知';
  }
};

// 获取上报状态标签类型
const getReportStatusType = (status: string) => {
  switch (status) {
    case '0': return 'info';
    case '1': return 'success';
    case '2': return 'danger';
    default: return 'info';
  }
};

// 处理启用状态变更
const handleEnableStatusChange = async (row: OdsJxzycnjcsjInfo) => {
  try {
    // 设置加载状态
    row.statusLoading = true;
    
    const response = await updateEnableStatus(row.id, row.enableStatus);
    if (response.data.code === 200) {
      ElMessage.success(`${row.enableStatus === '1' ? '启用' : '禁用'}成功`);
      getList(); // 刷新列表
    } else {
      // 如果失败，恢复原状态
      row.enableStatus = row.enableStatus === '1' ? '0' : '1';
      ElMessage.error(response.data.message || '状态修改失败');
    }
  } catch (error: any) {
    // 如果失败，恢复原状态
    row.enableStatus = row.enableStatus === '1' ? '0' : '1';
    console.error('修改启用状态失败:', error);
    ElMessage.error('状态修改失败');
  } finally {
    row.statusLoading = false;
  }
};

// 处理批量状态修改命令
const handleBatchStatusCommand = async (command: string) => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning('请先选择要操作的数据');
    return;
  }

  let confirmMessage = '';
  let successMessage = '';
  let apiCall: any = null;

  switch (command) {
    case 'enable':
      confirmMessage = `确定要批量启用选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量启用成功';
      apiCall = () => batchUpdateEnableStatus(selectedIds.value, '1');
      break;
    case 'disable':
      confirmMessage = `确定要批量禁用选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量禁用成功';
      apiCall = () => batchUpdateEnableStatus(selectedIds.value, '0');
      break;
    case 'report':
      confirmMessage = `确定要批量上报选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量上报成功';
      apiCall = () => batchUpdateReportStatus(selectedIds.value, '1');
      break;
    case 'unreport':
      confirmMessage = `确定要批量取消上报选中的 ${selectedIds.value.length} 条数据吗？`;
      successMessage = '批量取消上报成功';
      apiCall = () => batchUpdateReportStatus(selectedIds.value, '0');
      break;
    default:
      return;
  }

  try {
    await ElMessageBox.confirm(confirmMessage, '提示', { type: 'warning' });
    
    const response = await apiCall();
    if (response.data.code === 200) {
      ElMessage.success(successMessage);
      getList(); // 刷新列表
    } else {
      ElMessage.error(response.data.message || '操作失败');
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('批量状态修改失败:', error);
      ElMessage.error('操作失败');
    }
  }
};

const handleRowDblClick = (row: OdsJxzycnjcsjInfo) => handleView(row);
const handleSizeChange = (size: number) => { queryParams.pageSize = size; getList(); };
const handleCurrentChange = (page: number) => { queryParams.pageNum = page; getList(); };

onMounted(async () => {
  await getSystemSchoolCodeData();
  await fetchDictData();
  getList();
});
</script>

<style scoped>
.teaching-resource-adoption-management { padding: 0; }
.search-card { margin-bottom: 8px; }
.search-form { display: flex; flex-wrap: wrap; gap: 8px; }
.table-card { margin-top: -10px; }
.table-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #e4e7ed; background-color: #fafafa; }
.operation-buttons { display: flex; align-items: center; gap: 8px; }
.header-title { font-size: 16px; font-weight: 600; color: #303133; flex: 1; text-align: center; }
.placeholder { width: 100px; display: flex; justify-content: flex-end; }
.pagination-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px; border-top: 1px solid #e4e7ed; background-color: #fafafa; }
.total-info { font-size: 14px; color: #606266; }
:deep(.resource-adoption-dialog .el-dialog__body) { padding: 20px 24px; max-height: 70vh; overflow-y: auto; }
:deep(.resource-adoption-dialog .el-form-item) { margin-bottom: 18px; }
.resource-adoption-detail .el-descriptions { margin-bottom: 16px; }
.dialog-footer { text-align: right; }
:deep(.el-col) { margin-bottom: 18px; }

/* 导入弹窗样式 */
.import-dialog-content {
  padding: 0;
}

.import-actions {
  text-align: center;
}

.upload-demo {
  margin-top: 10px;
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
