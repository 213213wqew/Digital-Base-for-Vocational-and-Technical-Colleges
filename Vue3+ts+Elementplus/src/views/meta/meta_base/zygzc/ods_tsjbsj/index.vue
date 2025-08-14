<template>
  <div class="book-basic-data-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" class="search-form">
          <el-form-item label="图书编号" prop="tsbh">
            <el-input
              v-model="queryParams.tsbh"
              placeholder="请输入图书编号"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="图书条形码" prop="tstxm">
            <el-input
              v-model="queryParams.tstxm"
              placeholder="请输入图书条形码"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="正标题" prop="zbt">
            <el-input
              v-model="queryParams.zbt"
              placeholder="请输入正标题"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="出版社" prop="cbs">
            <el-input
              v-model="queryParams.cbs"
              placeholder="请输入出版社"
              clearable
              style="width: 220px;"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          
          <el-form-item class="search-buttons">
            <el-button type="primary" @click="handleQuery" style="margin-left: 8px;">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" style="margin-left: 8px;">
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
        </div>
        <div class="header-title">图书基本数据管理</div>
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
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="tsbh" label="图书编号" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="tstxm" label="图书条形码" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zbt" label="正标题" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="dyzz" label="第一作者" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="cbs" label="出版社" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="cbrq" label="出版日期" min-width="120" align="center" sortable="custom" />
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" sortable="custom" />
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon><View /></el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="formDialogVisible"
      :title="formDialogTitle"
      width="1200px"
      :close-on-click-modal="false"
      append-to-body
      style="height: 1120px"
      class="book-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="唯一标识" prop="zjsjwyxbs"><el-input v-model="form.zjsjwyxbs" placeholder="可不填，后端自动生成" maxlength="32" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="学校代码" prop="xxdm"><el-input v-model="form.xxdm" placeholder="系统自动获取" :disabled="true" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="图书编号" prop="tsbh"><el-input v-model="form.tsbh" placeholder="请输入图书编号" maxlength="50" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="图书条形码" prop="tstxm"><el-input v-model="form.tstxm" placeholder="请输入图书条形码" maxlength="50" show-word-limit /></el-form-item></el-col>
          <el-col :span="24" style="margin-bottom: 18px;"><el-form-item label="正标题" prop="zbt"><el-input v-model="form.zbt" placeholder="请输入正标题" maxlength="520" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="并列标题" prop="blbt"><el-input v-model="form.blbt" placeholder="请输入并列标题" maxlength="200" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="副标题" prop="fbt"><el-input v-model="form.fbt" placeholder="请输入副标题" maxlength="180" show-word-limit /></el-form-item></el-col>
          <el-col :span="24" style="margin-bottom: 18px;"><el-form-item label="检索关键字" prop="jsgjz"><el-input v-model="form.jsgjz" placeholder="请输入检索关键字" maxlength="500" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="图书出版号" prop="tscbh"><el-input v-model="form.tscbh" placeholder="请输入图书出版号" maxlength="100" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="第一作者" prop="dyzz"><el-input v-model="form.dyzz" placeholder="请输入第一作者" maxlength="300" show-word-limit /></el-form-item></el-col>
          <el-col :span="24"  style="margin-bottom: 18px;"><el-form-item label="其他作者" prop="qtzz"><el-input v-model="form.qtzz" type="textarea" :rows="2" placeholder="请输入其他作者，多个用逗号隔开" maxlength="2000" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="价格(元)" prop="jg"><el-input-number v-model="form.jg" :precision="2" :step="0.01" :min="0" placeholder="请输入价格" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="文献类型码" prop="wxlxm"><el-select v-model="form.wxlxm" placeholder="请选择文献类型" style="width:100%"><el-option v-for="item in dictData.wxlxmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="装订码" prop="zdm"><el-select v-model="form.zdm" placeholder="请选择装订码" style="width:100%"><el-option v-for="item in dictData.zdmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="分类号" prop="flh"><el-input v-model="form.flh" placeholder="请输入分类号" maxlength="60" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="中国语种码" prop="zgyzm"><el-select v-model="form.zgyzm" placeholder="请选择中国语种" style="width:100%"><el-option v-for="item in dictData.zgyzmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="语种码" prop="yzm"><el-select v-model="form.yzm" placeholder="请选择世界语种" style="width:100%"><el-option v-for="item in dictData.yzmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="开本" prop="kb"><el-input v-model="form.kb" placeholder="请输入开本" maxlength="30" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="页数" prop="ys"><el-input-number v-model="form.ys" :min="0" placeholder="请输入页数" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="版次" prop="bc"><el-input v-model="form.bc" placeholder="请输入版次" maxlength="30" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="图书附件名称" prop="tsfjmc"><el-input v-model="form.tsfjmc" placeholder="请输入图书附件名称" maxlength="180" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="丛书名称" prop="csmc"><el-input v-model="form.csmc" placeholder="请输入丛书名称" maxlength="500" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="丛书编者" prop="csbz"><el-input v-model="form.csbz" placeholder="请输入丛书编者" maxlength="180" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="出版社" prop="cbs"><el-input v-model="form.cbs" placeholder="请输入出版社" maxlength="180" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="出版社级别码" prop="cbsjbm"><el-select v-model="form.cbsjbm" placeholder="请选择出版社级别" style="width:100%"><el-option v-for="item in dictData.cbsjbmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="出版地" prop="cbd"><el-input v-model="form.cbd" placeholder="请输入出版地" maxlength="60" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="出版日期" prop="cbrq"><el-date-picker v-model="form.cbrq" type="date" placeholder="请选择出版日期" format="YYYYMMDD" value-format="YYYYMMDD" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="发行单位" prop="fxdw"><el-input v-model="form.fxdw" placeholder="请输入发行单位" maxlength="100" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="图书状态码" prop="tsztm"><el-select v-model="form.tsztm" placeholder="请选择图书状态" style="width:100%"><el-option v-for="item in dictData.tsztmOptions" :key="item.value" :label="item.label" :value="item.value" /></el-select></el-form-item></el-col>
          <el-col :span="24" style="margin-bottom: 18px;"><el-form-item label="备注" prop="bz"><el-input v-model="form.bz" type="textarea" :rows="2" placeholder="请输入备注" maxlength="2000" show-word-limit /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="数据采集时间" prop="sjcjsj"><el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间" format="YYYYMMDD HHmmss" value-format="YYYYMMDD HHmmss" style="width:100%" /></el-form-item></el-col>
          <el-col :span="12" style="margin-bottom: 18px;"><el-form-item label="启用状态" prop="enableStatus"><el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width:100%"><el-option label="禁用" value="0" /><el-option label="启用" value="1" /></el-select></el-form-item></el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="formDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleFormSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="查看图书基本数据"
      width="1200px"
      append-to-body
      class="book-dialog"
      destroy-on-close
    >
      <div class="book-detail">
        <el-descriptions class="detail-descriptions" :column="2" size="large" border>
          <el-descriptions-item label="唯一标识"><div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="学校代码"><div class="detail-value">{{ form.xxdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="图书编号"><div class="detail-value">{{ form.tsbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="图书条形码"><div class="detail-value">{{ form.tstxm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="正标题" :span="2"><div class="detail-value">{{ form.zbt || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="并列标题"><div class="detail-value">{{ form.blbt || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="副标题"><div class="detail-value">{{ form.fbt || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="检索关键字" :span="2"><div class="detail-value">{{ form.jsgjz || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="图书出版号"><div class="detail-value">{{ form.tscbh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="第一作者"><div class="detail-value">{{ form.dyzz || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="其他作者" :span="2"><div class="detail-value">{{ form.qtzz || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="价格(元)"><div class="detail-value">{{ form.jg || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="文献类型码"><div class="detail-value">{{ form.wxlxm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="装订码"><div class="detail-value">{{ form.zdm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="分类号"><div class="detail-value">{{ form.flh || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="中国语种码"><div class="detail-value">{{ form.zgyzm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="语种码"><div class="detail-value">{{ form.yzm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="开本"><div class="detail-value">{{ form.kb || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="页数"><div class="detail-value">{{ form.ys || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="版次"><div class="detail-value">{{ form.bc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="图书附件名称"><div class="detail-value">{{ form.tsfjmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="丛书名称"><div class="detail-value">{{ form.csmc || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="丛书编者"><div class="detail-value">{{ form.csbz || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="出版社"><div class="detail-value">{{ form.cbs || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="出版社级别码"><div class="detail-value">{{ form.cbsjbm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="出版地"><div class="detail-value">{{ form.cbd || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="出版日期"><div class="detail-value">{{ form.cbrq || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="发行单位"><div class="detail-value">{{ form.fxdw || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="图书状态码"><div class="detail-value">{{ form.tsztm || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="备注" :span="2"><div class="detail-value">{{ form.bz || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="数据采集时间"><div class="detail-value">{{ form.sjcjsj || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="启用状态"><el-tag :type="form.enableStatus === '1' ? 'success' : 'danger'" size="small">{{ form.enableStatus === "1" ? "启用" : "禁用" }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="创建时间"><div class="detail-value">{{ form.createTime || "-" }}</div></el-descriptions-item>
          <el-descriptions-item label="更新时间"><div class="detail-value">{{ form.updateTime || "-" }}</div></el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="viewDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import { Search, Refresh, Plus, Edit, Delete, View, Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsTsjbsjPage,
  getOdsTsjbsjById,
  addOdsTsjbsj,
  updateOdsTsjbsj,
  deleteOdsTsjbsj,
  batchDeleteOdsTsjbsj,
  exportOdsTsjbsj,
  getDictOptions,
  getSystemSchoolCode,
  type OdsTsjbsjInfo,
  type OdsTsjbsjQuery,
  type OdsTsjbsjForm,
} from "@/api/meta/meta_base/zygzc/ods_tsjbsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsTsjbsjInfo[]>([]);
const total = ref(0);
const formDialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogMode = ref<"add" | "edit">("add");
const selectedIds = ref<number[]>([]);

// 计算属性
const formDialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add": return "新增图书基本数据";
    case "edit": return "编辑图书基本数据";
    default: return "图书基本数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsTsjbsjQuery>({
  tsbh: "",
  tstxm: "",
  zbt: "",
  cbs: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单相关
const form = reactive<OdsTsjbsjForm>({
  zjsjwyxbs: "", xxdm: "", tsbh: "", tstxm: "", zbt: "", blbt: "", fbt: "",
  jsgjz: "", tscbh: "", dyzz: "", qtzz: "", jg: undefined, wxlxm: "",
  zdm: "", flh: "", zgyzm: "", yzm: "", kb: "", ys: undefined, bc: "",
  tsfjmc: "", csmc: "", csbz: "", cbs: "", cbsjbm: "", cbd: "",
  cbrq: "", fxdw: "", bz: "", tsztm: "", sjcjsj: "", enableStatus: "1",
});
const formRef = ref<FormInstance>();
const queryFormRef = ref<FormInstance>();
const submitLoading = ref(false);
const systemSchoolCode = ref("");

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [{ validator: (rule: any, value: string, callback: Function) => {
    if (!value) { callback(); }
    else if (value.length !== 32) { callback(new Error('唯一编码必须是32位')); }
    else if (!/^[A-Z0-9]+$/.test(value)) { callback(new Error('只能包含大写字母和数字')); }
    else { callback(); }
  }, trigger: 'blur' }],
  xxdm: [{ required: true, message: "学校代码不能为空", trigger: "blur" }],
  tsbh: [{ required: true, message: "图书编号不能为空", trigger: "blur" }, { max: 50, message: "长度不能超过50", trigger: "blur" }],
  tstxm: [{ required: true, message: "图书条形码不能为空", trigger: "blur" }, { max: 50, message: "长度不能超过50", trigger: "blur" }],
  zbt: [{ required: true, message: "正标题不能为空", trigger: "blur" }, { max: 520, message: "长度不能超过520", trigger: "blur" }],
  tscbh: [{ required: true, message: "图书出版号不能为空", trigger: "blur" }, { max: 100, message: "长度不能超过100", trigger: "blur" }],
  dyzz: [{ required: true, message: "第一作者不能为空", trigger: "blur" }, { max: 300, message: "长度不能超过300", trigger: "blur" }],
  sjcjsj: [{ required: true, message: "数据采集时间不能为空", trigger: "change" }],
});

// 字典数据
const dictData = reactive({
  wxlxmOptions: [], zdmOptions: [], zgyzmOptions: [], yzmOptions: [],
  cbsjbmOptions: [], tsztmOptions: [],
});

// 获取字典数据
const loadDictData = async () => {
  try {
    const [wxlxmRes, zdmRes, zgyzmRes, yzmRes, cbsjbmRes, tsztmRes] = await Promise.all([
      getDictOptions("WXLXDM") as any, getDictOptions("KWZDDM") as any, getDictOptions("ZGYZDM") as any,
      getDictOptions("SJYZDM") as any, getDictOptions("CBSJBDM") as any, getDictOptions("TSQKZTDM") as any,
    ]);
    dictData.wxlxmOptions = wxlxmRes.data.data || [];
    dictData.zdmOptions = zdmRes.data.data || [];
    dictData.zgyzmOptions = zgyzmRes.data.data || [];
    dictData.yzmOptions = yzmRes.data.data || [];
    dictData.cbsjbmOptions = cbsjbmRes.data.data || [];
    dictData.tsztmOptions = tsztmRes.data.data || [];
  } catch (error) {
    console.error("获取字典数据失败:", error);
    ElMessage.error("获取字典数据失败");
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response: any = await getOdsTsjbsjPage(queryParams);
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.msg || "查询失败");
    }
  } catch (error) {
    console.error("查询图书数据失败:", error);
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
  queryFormRef.value?.resetFields();
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  formDialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsTsjbsjInfo) => {
  try {
    const response: any = await getOdsTsjbsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      formDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取图书数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsTsjbsjInfo) => {
  try {
    const response: any = await getOdsTsjbsjById(row.id);
    if (response.data.code === 200) {
      Object.assign(form, response.data.data);
      viewDialogVisible.value = true;
    } else {
      ElMessage.error(response.data.msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取图书数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsTsjbsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条图书数据吗？", "提示", {
      confirmButtonText: "确定", cancelButtonText: "取消", type: "warning",
    });
    const response: any = await deleteOdsTsjbsj(row.id);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除图书数据失败:", error);
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
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`, "提示",
      { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
    );
    const response: any = await batchDeleteOdsTsjbsj(selectedIds.value);
    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error(response.data.msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除图书数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsTsjbsj(queryParams);
    const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `图书基本数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出图书数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
      submitLoading.value = true;
    let response: any;
    if (dialogMode.value === "add") {
      response = await addOdsTsjbsj(form);
    } else {
      response = await updateOdsTsjbsj(form);
    }
    if (response.data.code === 200) {
      ElMessage.success(dialogMode.value === "add" ? "新增成功" : "修改成功");
      formDialogVisible.value = false;
          getList();
    } else {
      ElMessage.error(response.data.msg || "操作失败");
        }
      } catch (error) {
    console.error("提交表单失败:", error);
      } finally {
        submitLoading.value = false;
      }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined, zjsjwyxbs: "", xxdm: systemSchoolCode.value, tsbh: "", tstxm: "", zbt: "", blbt: "", fbt: "",
    jsgjz: "", tscbh: "", dyzz: "", qtzz: "", jg: undefined, wxlxm: "", zdm: "", flh: "", zgyzm: "",
    yzm: "", kb: "", ys: undefined, bc: "", tsfjmc: "", csmc: "", csbz: "", cbs: "", cbsjbm: "",
    cbd: "", cbrq: "", fxdw: "", bz: "", tsztm: "", sjcjsj: "", enableStatus: "1",
  });
  if (formRef.value) {
    formRef.value.clearValidate();
  }
};

// 关闭表单对话框
const handleFormClose = () => {
  formDialogVisible.value = false;
  resetForm();
};

const handleRowClick = () => { /* 行点击逻辑 */ };

const handleSelectionChange = (selection: OdsTsjbsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleRowDblClick = (row: OdsTsjbsjInfo) => {
  handleView(row);
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

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

onMounted(() => {
  getSystemSchoolCodeData();
  loadDictData();
  getList();
});
</script>

<style scoped>
.book-basic-data-management {
  padding: 0px;
}

.search-card {
  margin-bottom: 8px;
}

.search-bar {
  padding: 8px;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.search-buttons {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.search-form .el-form-item) {
  margin-bottom: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 8px;
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-button) {
  height: 32px;
  padding: 8px 15px;
}

.table-card {
  margin-top: -10px;
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
  gap: 2px;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 2px 2px;
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

.book-dialog {
  border-radius: 8px;
}

.book-detail {
  max-height: 60vh;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-descriptions {
  margin-bottom: 20px;
}

.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}

.detail-value:empty::before {
  content: "-";
  color: #909399;
}

:deep(.el-table .el-table__body-wrapper .el-table__row) {
  transition: background-color 0.2s ease;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.book-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.book-dialog .el-dialog__title) {
  color: white;
  font-weight: 600;
}

:deep(.book-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.book-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.book-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 60vh;
  overflow-y: auto;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

:deep(.el-input__wrapper) {
  border-radius: 6px;
}

:deep(.el-select .el-input__wrapper) {
  border-radius: 6px;
}

:deep(.operation-buttons .el-button) {
  border-radius: 6px;
  font-weight: 500;
}

:deep(.action-buttons .el-button) {
  padding: 2px 4px;
  font-size: 12px;
}

:deep(.el-tag) {
  border-radius: 4px;
  font-weight: 500;
}

:deep(.el-input.is-disabled .el-input__wrapper) {
  background-color: #f5f7fa !important;
  box-shadow: 0 0 0 1px #e4e7ed inset !important;
}

:deep(.el-input.is-disabled .el-input__inner) {
  background-color: transparent !important;
  color: #606266 !important;
}
</style>
