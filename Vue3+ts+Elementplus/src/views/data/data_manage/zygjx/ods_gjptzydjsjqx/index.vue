<script
 setup lang="ts">
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  Warning,
  Upload,
  UploadFilled,
  InfoFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getGjptzydjsjqxDataPage,
  getGjptzydjsjqxDataById,
  addGjptzydjsjqxData,
  updateGjptzydjsjqxData,
  deleteGjptzydjsjqxData,
  batchDeleteGjptzydjsjqxData,
  exportGjptzydjsjqxData,
  parseExcelHeaders,
  importGjptzydjsjqxDataWithMapping,
  getSystemFields,
  downloadTemplate,
  getResourceTypeOptions,
  getResourceStatusOptions,
  getSystemSchoolCode,
  type OdsGjptzydjsjqxInfo,
  type OdsGjptzydjsjqxQuery,
  type OdsGjptzydjsjqxForm,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
  type DictOption,
  type ImportResult,
} from "@/api-data/data/data_base/zygjx/ods_gjptzydjsjqx";

// 进度条组件导入
import ProgressDialog from "@/components/ProgressDialog/index.vue";

// ==================== 响应式数据定义 ====================

// 查询参数
const queryParams = reactive<OdsGjptzydjsjqxQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  zyh: "",
  zymc: "",
  zylxm: "",
  zyzt: "",
  pageNum: 1,
  pageSize: 100,
});

// 表格数据
const dataList = ref<OdsGjptzydjsjqxInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const multipleSelection = ref<OdsGjptzydjsjqxInfo[]>([]);

// 查询表单引用
const queryFormRef = ref<FormInstance>();

// 表单数据
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const currentRecord = ref<OdsGjptzydjsjqxInfo | null>(null);

// ==================== 导入功能相关状态 ====================

// 导入相关状态
const importDialogVisible = ref(false);
const importLoading = ref(false);
const importFile = ref<File | null>(null);
const importHeaders = ref<string[]>([]);
const systemFields = ref<SystemField[]>([]);
const fieldMapping = ref<Record<string, string>>({});
const defaultValues = ref<Record<string, string>>({});
const importResult = ref<ImportResult | null>(null);
const updateByResourceNumber = ref(true); // 根据资源号更新数据

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增国家平台资源对接数据",
    edit: "编辑国家平台资源对接数据",
    view: "查看国家平台资源对接数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsGjptzydjsjqxForm>({
  id: undefined,
  zjsjwyxbs: "", // 主键数据唯一性标识
  xxdm: "", // 学校代码
  zyh: "", // 资源号 - 关键字段
  zymc: "", // 资源名称
  zylxm: "", // 资源类型码
  zyms: "", // 资源描述
  zyzt: "", // 资源状态
  cjsj: "", // 创建时间
  gxsj: "", // 更新时间
  sjcjsj: "", // 数据采集时间
  reportStatus: "0", // 上报状态
  enableStatus: "1", // 启用状态
});

// 表单验证规则
const formRules = reactive<FormRules>({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可不填，后端自动生成",
      trigger: "blur",
    },
    { len: 32, message: "主键数据唯一性标识必须为32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "主键数据唯一性标识必须为32位大写字母和数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码为必填项", trigger: "blur" },
    { len: 10, message: "学校代码必须为10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  zyh: [
    { required: true, message: "请输入资源号", trigger: "blur" },
    { max: 50, message: "资源号长度不能超过50个字符", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    { max: 200, message: "资源名称长度不能超过200个字符", trigger: "blur" },
  ],
  zylxm: [
    { required: true, message: "请选择资源类型", trigger: "change" },
  ],
  zyzt: [
    { required: true, message: "请选择资源状态", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 字典数据
const resourceTypeOptions = ref<DictOption[]>([]);
const resourceStatusOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// ==================== 初始化和数据加载 ====================

// 初始化
onMounted(() => {
  getList();
  loadDictData();
  getSchoolCode();
});

// 加载字典数据
const loadDictData = async () => {
  try {
    const [resourceType, resourceStatus] = await Promise.all([
      getResourceTypeOptions(),
      getResourceStatusOptions(),
    ]);
    resourceTypeOptions.value = (resourceType as any)?.data?.data || [];
    resourceStatusOptions.value = (resourceStatus as any)?.data?.data || [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const apiResponse = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (apiResponse?.data?.code === 200 && apiResponse.data.data) {
      systemSchoolCode.value = apiResponse.data.data;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取学校代码失败");
    }
  } catch (error: any) {
    console.error("获取学校代码失败:", error);
    ElMessage.error(error.message || "获取学校代码失败");
  }
};

// ==================== 基础CRUD操作 ====================

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getGjptzydjsjqxDataPage(queryParams);
    // 使用类型断言处理API响应格式
    const responseData = (response as any)?.data?.data || {};
    dataList.value = responseData.records || [];
    total.value = responseData.total || 0;
  } catch (error) {
    ElMessage.error("查询数据失败");
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
  Object.keys(queryParams).forEach((key) => {
    if (key !== "pageNum" && key !== "pageSize") {
      (queryParams as any)[key] = "";
    }
  });
  queryParams.pageNum = 1;
  queryFormRef.value?.resetFields();
  getList();
};

// 表格选择事件
const handleSelectionChange = (selection: OdsGjptzydjsjqxInfo[]) => {
  multipleSelection.value = selection;
};

// 分页大小变更
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

// 分页页码变更
const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 新增
const handleAdd = async () => {
  dialogType.value = "add";
  await resetForm();
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsGjptzydjsjqxInfo) => {
  dialogType.value = "edit";
  resetFormSync();
  try {
    const response = await getGjptzydjsjqxDataById(row.id);
    // 使用类型断言处理API响应格式
    const data = (response as any)?.data?.data || {};
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsGjptzydjsjqxInfo) => {
  dialogType.value = "view";
  resetFormSync();
  try {
    const response = await getGjptzydjsjqxDataById(row.id);
    // 使用类型断言处理API响应格式
    const data = (response as any)?.data?.data || {};
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 删除
const handleDelete = (row: OdsGjptzydjsjqxInfo) => {
  ElMessageBox.confirm(`确认删除资源"${row.zymc}"吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteGjptzydjsjqxData(row.id);
        ElMessage.success("删除成功");
        getList();
      } catch (error) {
        ElMessage.error("删除失败");
      }
    })
    .catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确认批量删除选中的${multipleSelection.value.length}条资源数据吗？`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await batchDeleteGjptzydjsjqxData(
          multipleSelection.value.map((item) => item.id),
        );
        ElMessage.success("批量删除成功");
        getList();
      } catch (error) {
        ElMessage.error("批量删除失败");
      }
    })
    .catch(() => {});
};

// 导出
const handleExport = () => {
  ElMessageBox.confirm("确认导出国家平台资源对接数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      try {
        await exportGjptzydjsjqxData(queryParams);
        ElMessage.success("导出成功");
      } catch (error: any) {
        console.error("导出失败:", error);
        ElMessage.error(error.message || "导出失败");
      }
    })
    .catch(() => {});
};

// ==================== 表单操作 ====================

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitLoading.value = true;
    try {
      if (dialogType.value === "add") {
        await addGjptzydjsjqxData(form);
        ElMessage.success("新增成功");
      } else {
        await updateGjptzydjsjqxData(form);
        ElMessage.success("修改成功");
      }
      dialogVisible.value = false;
      getList();
    } catch (error) {
      ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
    } finally {
      submitLoading.value = false;
    }
  });
};

// 重置表单
const resetForm = async () => {
  Object.keys(form).forEach((key) => {
    (form as any)[key] = undefined;
  });

  // 设置一些必要的默认值
  if (dialogType.value === "add") {
    await getSchoolCode(); // 获取并设置学校代码
    form.xxdm = systemSchoolCode.value;
    form.enableStatus = "1"; // 设置默认启用状态
    form.reportStatus = "0"; // 设置默认上报状态
    // 设置当前时间为默认数据采集时间
    const now = new Date();
    form.sjcjsj = now.toISOString().replace('T', ' ').substring(0, 19);
  }

  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 重置表单（不包含异步操作）
const resetFormSync = () => {
  Object.keys(form).forEach((key) => {
    (form as any)[key] = undefined;
  });

  nextTick(() => {
    formRef.value?.resetFields();
  });
};

// 关闭表单
const handleFormClose = () => {
  dialogVisible.value = false;
  resetFormSync();
};

// ==================== 导入功能实现 ====================

// 导入操作入口
const handleImport = () => {
  importDialogVisible.value = true;
  loadSystemFields();
};

// 导入对话框关闭
const handleImportDialogClose = () => {
  importDialogVisible.value = false;
  importFile.value = null;
  importHeaders.value = [];
  systemFields.value = [];
  fieldMapping.value = {};
  defaultValues.value = {};
  importResult.value = null;
  updateByResourceNumber.value = true;
};

// 文件上传变化
const handleFileChange = (file: any) => {
  importFile.value = file.raw;
  if (importFile.value) {
    parseExcelHeaders(importFile.value).then((response: any) => {
      const headers = response?.data?.data?.headers || [];
      importHeaders.value = headers.map((h: any) => h.columnName);
      // 智能匹配字段
      initializeFieldMapping(headers);
    }).catch(error => {
      ElMessage.error(`文件解析失败: ${error.message}`);
      importFile.value = null;
      importHeaders.value = [];
    });
  }
};

// 智能字段映射初始化
const initializeFieldMapping = (headers: any[]) => {
  const mapping: Record<string, string> = {};
  
  // 定义智能匹配规则
  const matchRules: { [key: string]: string[] } = {
    'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    'zyh': ['资源号', 'zyh', 'resourceno', '资源编号'],
    'zymc': ['资源名称', 'zymc', 'resourcename', '资源名'],
    'zylxm': ['资源类型', 'zylxm', 'resourcetype', '类型'],
    'zyms': ['资源描述', 'zyms', 'description', '描述'],
    'zyzt': ['资源状态', 'zyzt', 'status', '状态'],
    'cjsj': ['创建时间', 'cjsj', 'createtime'],
    'gxsj': ['更新时间', 'gxsj', 'updatetime'],
    'sjcjsj': ['数据采集时间', 'sjcjsj', '采集时间', '时间']
  };

  // 智能匹配
  headers.forEach((header) => {
    const columnName = header.columnName.toLowerCase().trim();
    
    for (const [fieldName, patterns] of Object.entries(matchRules)) {
      for (const pattern of patterns) {
        if (columnName.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(columnName)) {
          mapping[fieldName] = header.columnName;
          break;
        }
      }
    }
  });

  fieldMapping.value = mapping;
  
  // 设置默认值
  if (systemSchoolCode.value) {
    defaultValues.value.xxdm = systemSchoolCode.value;
  }
  defaultValues.value.enableStatus = '1';
  defaultValues.value.reportStatus = '0';
};

// 下载导入模板
const handleDownloadTemplate = () => {
  downloadTemplate().then((response: any) => {
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '国家平台资源对接数据导入模板.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success('模板下载成功');
  }).catch(error => {
    ElMessage.error(`模板下载失败: ${error.message}`);
  });
};

// 重置导入
const resetImport = () => {
  importFile.value = null;
  importHeaders.value = [];
  fieldMapping.value = {};
  defaultValues.value = {};
  importResult.value = null;
};

// 执行导入
const handleExecuteImport = async () => {
  if (!importFile.value) {
    ElMessage.warning('请先选择要导入的Excel文件');
    return;
  }

  if (getUnsetRequiredFieldsCount() > 0) {
    ElMessage.warning('请检查必填字段映射，确保所有必填字段都有Excel列映射或默认值');
    return;
  }

  try {
    importLoading.value = true;
    
    // 构建导入配置
    const config: ImportConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: {
        ...defaultValues.value,
        xxdm: systemSchoolCode.value // 确保学校代码
      },
      startRow: 2,
      autoGenerateId: true
    };

    const result = await importGjptzydjsjqxDataWithMapping(importFile.value, config);
    importResult.value = result as any;
    
    ElMessage.success(
      `导入完成！成功: ${result.successCount}, 新增: ${result.insertCount}, 更新: ${result.updateCount}, 失败: ${result.failCount}`
    );
    getList(); // 刷新列表
  } catch (error: any) {
    ElMessage.error(`导入失败: ${error.message}`);
    importResult.value = null;
  } finally {
    importLoading.value = false;
  }
};

// 加载系统字段
const loadSystemFields = async () => {
  try {
    systemFields.value = getSystemFields();
    fieldMapping.value = {};
    defaultValues.value = {};
    
    // 初始化默认值
    systemFields.value.forEach(field => {
      if (field.required) {
        defaultValues.value[field.field] = '';
      }
    });
    
    // 设置系统默认值
    if (systemSchoolCode.value) {
      defaultValues.value.xxdm = systemSchoolCode.value;
    }
    defaultValues.value.enableStatus = '1';
    defaultValues.value.reportStatus = '0';
  } catch (error) {
    console.error("加载系统字段失败:", error);
    ElMessage.error("加载系统字段失败");
  }
};

// ==================== 导入辅助函数 ====================

// 获取已映射字段数量
const getMappedFieldsCount = () => {
  return Object.values(fieldMapping.value).filter(value => value && value.trim() !== '').length;
};

// 获取必填字段未设置数量
const getUnsetRequiredFieldsCount = () => {
  return systemFields.value.filter(field => {
    if (!field.required) return false;
    const mappedValue = fieldMapping.value[field.field];
    const defaultValue = defaultValues.value[field.field];
    return !mappedValue && !defaultValue;
  }).length;
};

// 获取字段描述
const getFieldDescription = (field: SystemField) => {
  const descriptions: Record<string, string> = {
    'zjsjwyxbs': '主键数据唯一性标识，如不填写将自动生成',
    'xxdm': '学校代码，必填项',
    'zyh': '资源号，必填项，导入时将根据此字段判断是否为更新',
    'zymc': '资源名称，必填项',
    'zylxm': '资源类型码，必填项',
    'zyms': '资源描述',
    'zyzt': '资源状态，必填项',
    'cjsj': '创建时间，格式：YYYY-MM-DD HH:mm:ss',
    'gxsj': '更新时间，格式：YYYY-MM-DD HH:mm:ss',
    'sjcjsj': '数据采集时间，必填项，格式：YYYY-MM-DD HH:mm:ss'
  };
  return descriptions[field.field] || '暂无描述';
};

// 获取字段选项
const getFieldOptions = (fieldName: string) => {
  switch (fieldName) {
    case 'zylxm':
      return resourceTypeOptions.value;
    case 'zyzt':
      return resourceStatusOptions.value;
    case 'reportStatus':
      return [
        { value: '0', label: '未上报' },
        { value: '1', label: '已上报' },
        { value: '2', label: '上报失败' }
      ];
    case 'enableStatus':
      return [
        { value: '0', label: '禁用' },
        { value: '1', label: '启用' }
      ];
    default:
      return [];
  }
};

// ==================== 工具函数 ====================

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status] || status;
};

// 获取上报状态标签类型
const getReportStatusType = (status: string) => {
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

// 获取启用状态文本
const getEnableStatusText = (status: string) => {
  return status === "1" ? "启用" : "禁用";
};

// 获取启用状态类型
const getEnableStatusType = (status: string) => {
  return status === "1" ? "success" : "danger";
};

// 格式化日期时间
const formatDateTime = (dateTime: string | null | undefined) => {
  if (!dateTime) return "-";
  try {
    const date = new Date(dateTime);
    if (isNaN(date.getTime())) return "-";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch {
    return "-";
  }
};

// 获取资源类型文本
const getResourceTypeText = (value: string) => {
  if (!value) return "-";
  const option = resourceTypeOptions.value.find((item) => item.value === value);
  return option ? option.label : value;
};

// 获取资源状态文本
const getResourceStatusText = (value: string) => {
  if (!value) return "-";
  const option = resourceStatusOptions.value.find((item) => item.value === value);
  return option ? option.label : value;
};

// 处理主键数据唯一性标识输入
const handleZjsjwyxbsInput = (value: string) => {
  form.zjsjwyxbs = value.toUpperCase();
};
</script><style
 scoped>
/* ==================== 页面整体布局 ==================== */
.gjptzy-management {
  .search-card {
    height: 60px;
  }

  .search-bar {
    margin-top: -8px;
    :deep(.el-form) {
      margin-bottom: 0;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
    }

    :deep(.el-input) {
      width: 200px;
    }

    :deep(.el-select) {
      width: 200px;
    }
  }

  .table-card {
    margin-top: -12px;
    :deep(.el-card__body) {
      padding: 5px;
    }
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .operation-buttons {
      display: flex;
      align-items: center;

      .el-button {
        margin-right: 10px;
        font-size: 14px;

        &:last-child {
          margin-right: 0;
        }
      }

      .el-divider--vertical {
        margin: 0 15px;
        height: 18px;
      }
    }

    .header-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .placeholder {
      display: flex;
      align-items: center;
    }
  }

  .table-body {
    :deep(.el-table) {
      border-radius: 4px;
      overflow: hidden;

      .el-table__header {
        th {
          background-color: #fafafa;
          color: #606266;
          font-weight: 600;
          font-size: 14px;
          border-bottom: 1px solid #ebeef5;
        }
      }

      .el-table__body {
        tr {
          &:hover {
            background-color: #f5f7fa;
          }
        }

        td {
          font-size: 14px;
          color: #606266;
          border-bottom: 1px solid #ebeef5;
        }
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;

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

  .gjptzy-dialog {
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
}

/* ==================== 详情查看样式 ==================== */
.gjptzy-detail {
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

/* ==================== 弹窗表单样式 ==================== */
:deep(.dialog-form) {
  .el-form-item {
    margin-bottom: 18px;
  }

  .el-form-item__label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
  }

  .el-input__wrapper {
    height: 32px;
    border-radius: 4px;
  }

  .el-select .el-input__wrapper {
    height: 32px;
  }

  .el-input-number {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }

  .el-date-editor {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }
}

/* ==================== 表单样式 ==================== */
.gjptzy-form {
  .form-container {
    max-height: 65vh;
    overflow-y: auto;
    padding: 0 20px;
  }

  .form-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 20px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e4e7ed;
    }

    :deep(.el-form-item) {
      margin-bottom: 18px;

      .el-form-item__content {
        flex: 1;
        width: 0;
      }
    }

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-date-editor),
    :deep(.el-input-number) {
      width: 100%;
    }

    .field-tip {
      margin-top: 5px;
      font-size: 12px;
      color: #909399;
      display: flex;
      align-items: center;

      .el-icon {
        margin-right: 4px;
        color: #409eff;
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  width: 120px !important;
  text-align: right;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  height: 32px;
  border-radius: 4px;
}

/* ==================== 导入按钮样式 ==================== */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

/* ==================== 导入对话框样式 ==================== */
.import-dialog {
  :deep(.el-dialog) {
    border-radius: 12px;
    box-shadow:
      0 12px 32px 4px rgba(0, 0, 0, 0.04),
      0 8px 20px rgba(0, 0, 0, 0.08);
  }

  :deep(.el-dialog__header) {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f0f0f0;

    .el-dialog__title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 24px 24px;
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
  }

  .import-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 20px;

    .import-step {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);

      .step-title {
        font-size: 18px;
        font-weight: 600;
        color: #374151;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid #e5e7eb;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, #3b82f6, #1d4ed8);
          border-radius: 1px;
        }
      }

      .step-content {
        .mapping-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px dashed #e5e7eb;

          .file-info {
            display: flex;
            align-items: center;

            .label {
              font-size: 14px;
              color: #606266;
              margin-right: 10px;
            }

            .value {
              font-size: 14px;
              color: #374151;
              font-weight: 500;
            }
          }

          .import-options {
            .el-checkbox {
              font-size: 14px;
              color: #374151;
            }
          }
        }

        .mapping-table {
          margin-bottom: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;

          :deep(.el-table) {
            font-size: 14px;

            .el-table__header th {
              background-color: #f5f7fa;
              font-weight: 600;
              color: #374151;
            }

            .el-table__row td {
              padding: 8px 0;
            }

            .required-field {
              color: #f56c6c;
              font-weight: 600;
            }

            .required-mark {
              color: #f56c6c;
              margin-left: 4px;
            }

            .example-text {
              font-size: 12px;
              color: #909399;
              font-style: italic;
            }

            .field-description {
              font-size: 12px;
              color: #606266;
              line-height: 1.4;
            }
          }
        }

        .mapping-summary {
          display: flex;
          justify-content: space-between;
          padding-top: 15px;
          border-top: 1px dashed #e5e7eb;

          .summary-item {
            display: flex;
            align-items: center;

            .summary-label {
              font-size: 14px;
              color: #606266;
              margin-right: 10px;
            }

            .summary-value {
              font-size: 14px;
              font-weight: 600;

              &.error {
                color: #f56c6c;
              }
              &.success {
                color: #67c23a;
              }
            }
          }
        }

        .import-result-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f0f9eb;
          border: 1px solid #e1f3d8;
          border-radius: 6px;

          .result-item {
            display: flex;
            align-items: center;

            .result-label {
              font-size: 14px;
              color: #606266;
              margin-right: 5px;
            }

            .result-value {
              font-size: 14px;
              font-weight: 600;
              color: #374151;
            }

            &.success .result-value {
              color: #67c23a;
            }
            &.info .result-value {
              color: #909399;
            }
            &.warning .result-value {
              color: #e6a23c;
            }
            &.error .result-value {
              color: #f56c6c;
            }
          }
        }

        .error-list {
          .error-title {
            font-size: 16px;
            font-weight: 600;
            color: #f56c6c;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #f56c6c;
          }

          .error-content {
            max-height: 200px;
            overflow-y: auto;
            font-size: 13px;
            color: #f56c6c;
            background-color: #fef0f0;
            border: 1px solid #fde2e2;
            border-radius: 4px;
            padding: 8px;
            word-break: break-all;

            .error-item {
              margin-bottom: 4px;
            }
          }
        }

        .template-download {
          margin-top: 20px;
          text-align: center;
          padding-top: 15px;
          border-top: 1px dashed #e5e7eb;
        }
      }
    }
  }

  .import-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .el-button {
      border-radius: 8px;
      padding: 12px 24px;
      font-weight: 500;

      &--primary {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border: none;

        &:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
      }

      &:not(.el-button--primary) {
        border: 1px solid #d1d5db;
        color: #6b7280;

        &:hover {
          border-color: #9ca3af;
          color: #374151;
          background-color: #f9fafb;
        }
      }
    }
  }
}
</style>