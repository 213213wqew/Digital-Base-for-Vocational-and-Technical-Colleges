<template>
  <div class="system-building-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
           
          <el-form-item label="学号" prop="xh">
            <el-input
              v-model="queryParams.xh"
              placeholder="请输入学号"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学生姓名" prop="xsxm">
            <el-input
              v-model="queryParams.xsxm"
              placeholder="请输入学生姓名"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="采集时间范围" prop="sjcjsjRange">
            <el-date-picker
              v-model="sjcjsjRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYYMMDD HHmmss"
              @change="handleSjcjsjRangeChange"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="search-buttons">
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
            :disabled="!multipleSelection.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">
          <h3>实习保险购买情况表数据清洗</h3>
        </div>
        <div class="right-buttons">
          <el-tooltip content="刷新数据" placement="top">
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
          @sort-change="handleSortChange"
          border
          style="width: 100%"
          highlight-current-row
          stripe
          size="default"
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '12px 6px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xh"
            label="学号"
            width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="bxxzmc"
            label="保险险种名称"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bdh"
            label="保单号"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxfczfmc"
            label="出资方名称"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bxgmrqDisplay"
            label="购买日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="bxgmfmText"
            label="购买方"
            width="120"
            align="center"
          />
          <el-table-column
            prop="gmbxzlmText"
            label="保险种类"
            width="120"
            align="center"
          />
          <el-table-column
            prop="sjcjsjDisplay"
            label="采集时间"
            width="160"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="enableStatus"
            label="启用状态"
            width="100"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag
                :type="getEnableStatusType(row.enableStatus)"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.updateTime) }}
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

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="
        dialogType === 'add'
          ? '新增实习保险购买情况数据'
          : dialogType === 'edit'
            ? '编辑实习保险购买情况数据'
            : '查看实习保险购买情况数据'
      "
      width="900px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleFormClose"
      class="system-building-dialog"
    >
      <div class="form-container">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="120px"
          :disabled="dialogType === 'view'"
          class="system-building-form"
        >
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="24">
              <el-col :span="8">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input
                    v-model="form.xxdm"
                    disabled
                    placeholder="请输入学校代码"
                    maxlength="10"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学号" prop="xh">
                  <el-input
                    v-model="form.xh"
                    placeholder="请输入学号"
                    maxlength="20"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="学生姓名" prop="xsxm">
                  <el-input
                    v-model="form.xsxm"
                    placeholder="请输入学生姓名"
                    maxlength="36"
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 保险信息区域 -->
          <div class="form-section">
            <div class="section-title">保险信息</div>
            <el-row :gutter="24">
              <el-col :span="12">
                <el-form-item label="保险险种名称" prop="bxxzmc">
                  <el-input
                    v-model="form.bxxzmc"
                    placeholder="请输入保险险种名称"
                    maxlength="120"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保单号" prop="bdh">
                  <el-input
                    v-model="form.bdh"
                    placeholder="请输入保单号"
                    maxlength="64"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险费出资方名称" prop="bxfczfmc">
                  <el-input
                    v-model="form.bxfczfmc"
                    placeholder="请输入保险费出资方名称"
                    maxlength="200"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险购买日期" prop="bxgmrq">
                  <el-date-picker
                    v-model="form.bxgmrq"
                    type="date"
                    placeholder="请选择保险购买日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="保险购买方" prop="bxgmfm">
                  <el-select
                    v-model="form.bxgmfm"
                    placeholder="请选择保险购买方"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in bxgmfmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买保险种类" prop="gmbxzlm">
                  <el-select
                    v-model="form.gmbxzlm"
                    placeholder="请选择购买保险种类"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in gmbxzlmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 系统信息区域 -->
          <div class="form-section">
            <div class="section-title">系统信息</div>
            <el-row :gutter="24">
              <el-col :span="12">
                 
              </el-col>
              <el-col :span="24">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker
                    v-model="form.sjcjsj"
                    type="datetime"
                    placeholder="请选择数据采集时间"
                    value-format="YYYYMMDDHHmmss"
                    format="YYYY-MM-DD HH:mm:ss"
                    style="width: 100%"
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select
                    v-model="form.reportStatus"
                    placeholder="请选择上报状态"
                    style="width: 100%"
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
                    style="width: 100%"
                  >
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- 查看模式下显示创建时间和更新时间 -->
              <template v-if="dialogType === 'view'">
                <el-col :span="12">
                  <el-form-item label="创建时间">
                    <el-input
                      :value="formatDateTime(currentRecord?.createTime)"
                      readonly
                      disabled
                      style="background-color: #f5f7fa"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="更新时间">
                    <el-input
                      :value="formatDateTime(currentRecord?.updateTime)"
                      readonly
                      disabled
                      style="background-color: #f5f7fa"
                    />
                  </el-form-item>
                </el-col>
              </template>
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose" size="large">
            {{ dialogType === "view" ? "关闭" : "取消" }}
          </el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
            size="large"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入实习保险购买情况数据"
      v-model="importDialogVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="import-template">
        <el-button type="primary" link @click="handleDownloadTemplate">
          <el-icon><Download /></el-icon>下载导入模板
        </el-button>
      </div>
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
      >
        <el-icon class="el-icon--upload"><Upload /></el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip
              effect="dark"
              placement="top"
              :content="importTipContent"
            >
              <el-icon class="import-tip-icon">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 字段映射对话框 -->
    <el-dialog
      title="Excel字段映射配置"
      v-model="fieldMappingDialogVisible"
      width="1200px"
      :close-on-click-modal="false"
      append-to-body
    >
      <div class="field-mapping-container">
        <!-- 文件信息 -->
        <div class="file-info-section">
          <el-alert
            :title="`文件名: ${currentExcelFile?.name || ''}`"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div class="file-stats">
                <span>表头数量:<span style="color: #5b85f8;"> {{ excelParseResult?.headers?.length || 0 }}</span></span>
                <span style="margin-left: 20px;">数据行数:<span style="color: #5b85f8;"> {{ excelParseResult?.totalRows || 0 }}</span></span>
              </div>
            </template>
          </el-alert>
        </div>

        <!-- 主要内容区域 - 使用左右布局 -->
        <el-row :gutter="20" class="main-content">
          <!-- 左侧说明区域 -->
          <el-col :span="8" class="left-panel">
            <!-- 映射配置说明 -->
            <div class="mapping-description">
              <h4 style="color: #f56c6c;">字段映射说明:</h4>
              <p style="color: #f56c6c;">请为每个Excel列选择对应的系统字段。系统已根据列名进行智能匹配，请检查并调整映射关系。</p>
              <p style="color: #f56c6c;"><span style="color: #f56c6c;">*</span> 标记的字段为必填字段，必须设置映射或默认值。</p>
            </div>

            <!-- 必填字段映射状态 -->
            <div class="required-fields-status">
              <h4>必填字段映射状态：</h4>
              <div class="required-fields-table-container">
                <el-table 
                  :data="getRequiredFields()" 
                  border 
                  style="width: 100%;" 
                  size="small"
                  max-height="280"
                  :show-header="true"
                >
                  <el-table-column prop="label" label="字段名称" min-width="120" show-overflow-tooltip />
                  <el-table-column label="状态" align="center" width="65">
                    <template #default="{ row }">
                      <el-tag 
                        :type="getFieldMappingStatus(row.field).isSet ? 'success' : 'danger'"
                        size="small"
                      >
                        {{ getFieldMappingStatus(row.field).isSet ? '✓' : '✗' }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="来源" width="60" align="center">
                    <template #default="{ row }">
                      <span v-if="getFieldMappingStatus(row.field).isMapped" class="source-mapped">映射</span>
                      <span v-else-if="getFieldMappingStatus(row.field).hasDefault" class="source-default">默认</span>
                      <span v-else class="warning-text">-</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <!-- 映射状态统计 -->
            <div class="mapping-status">
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="statistic-item statistic-success">
                    <el-statistic title="已映射" :value="getMappedFieldsCount()" />
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="statistic-item statistic-info">
                    <el-statistic title="必填字段" :value="getRequiredFieldsCount()" />
                  </div>
                </el-col>
                <el-col :span="24" style="margin-top: 15px;">
                  <div class="statistic-item statistic-danger">
                    <el-statistic title="未设置必填字段" :value="getUnsetRequiredFieldsCount()" />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>

          <!-- 右侧主要配置区域 -->
          <el-col :span="16" class="right-panel">
            <!-- 字段映射表格 -->
            <div class="mapping-table-section">
              <h4>Excel列映射：</h4>
              <el-table 
                :data="excelParseResult?.headers || []" 
                border 
                style="width: 100%"
                max-height="500px"
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="columnName" label="Excel列名" width="180">
                  <template #default="{ row }">
                    <div class="column-info">
                      <strong>{{ row.columnName }}</strong>
                      <div class="column-index">列 {{ String.fromCharCode(65 + row.columnIndex) }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="数据预览" width="150">
                  <template #default="{ row }">
                    <div class="data-preview">
                      <div
                        v-for="(preview, index) in getColumnPreview(row.columnIndex)"
                        :key="index"
                        class="preview-item"
                      >
                        {{ preview || '-' }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="映射到系统字段" min-width="280">
                  <template #default="{ row }">
                    <el-select
                      v-model="fieldMapping[row.columnIndex]"
                      placeholder="请选择系统字段"
                      clearable
                      style="width: 100%"
                      @change="onFieldMappingChange"
                    >
                      <el-option
                        v-for="field in systemFields"
                        :key="field.field"
                        :label="`${field.label} ${field.required ? '*' : ''}`"
                        :value="field.field"
                        :disabled="isFieldAlreadyMapped(field.field, row.columnIndex)"
                      >
                        <div class="field-option">
                          <span class="field-label">{{ field.label }}</span>
                          <span v-if="field.required" class="required-mark">*</span>
                          <span class="field-type">({{ getFieldTypeText(field.type) }})</span>
                        </div>
                      </el-option>
                    </el-select>
                    <!-- 字段示例显示 -->
                    <div v-if="fieldMapping[row.columnIndex]" class="field-example">
                      <div class="example-label">💡 示例:</div>
                      <div class="example-content">{{ getFieldExample(fieldMapping[row.columnIndex]) }}</div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 未映射字段默认值设置 -->
            <div class="unmapped-fields-section" v-if="getUnmappedFields().length > 0">
              <h4>未映射字段默认值设置：</h4>
              <p class="section-description">以下字段在Excel中未找到映射，将为每条导入数据统一设置以下值：</p>
              <el-form :model="unmappedFieldsForm" label-width="200px" class="unmapped-fields-form">
                <el-form-item 
                  v-for="field in getUnmappedFields()"
                  :key="field.field"
                  :label="field.label + (field.required ? ' *' : '')"
                  :prop="field.field"
                  :rules="field.required ? [{ required: true, message: '请输入默认值', trigger: 'blur' }] : []"
                >
                  <!-- 根据字段类型显示不同的输入控件 -->
                  <template v-if="field.type === 'select'">
                    <el-select 
                      v-model="unmappedFieldsForm[field.field]" 
                      :placeholder="'请选择' + field.label"
                      style="width: 100%"
                    >
                      <el-option
                        v-for="option in getFieldOptions(field.field)"
                        :key="option.value"
                        :label="option.label"
                        :value="option.value"
                      />
                    </el-select>
                  </template>
                  <template v-else-if="field.type === 'number'">
                    <el-input-number
                      v-model="unmappedFieldsForm[field.field]"
                      :placeholder="'请输入' + field.label"
                      :min="0"
                      style="width: 100%"
                    />
                  </template>
                  <template v-else-if="field.type === 'date'">
                    <el-date-picker
                      v-model="unmappedFieldsForm[field.field]"
                      type="datetime"
                      :placeholder="'请选择' + field.label"
                      value-format="YYYYMMDDHHmmss"
                      format="YYYY-MM-DD HH:mm:ss"
                      style="width: 100%"
                    />
                  </template>
                  <template v-else>
                    <el-input 
                      v-model="unmappedFieldsForm[field.field]"
                      :placeholder="'请输入' + field.label"
                    />
                  </template>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancelFieldMapping">取消</el-button>
          <el-button
            type="primary"
            :loading="importProcessing"
            :disabled="getUnsetRequiredFieldsCount() > 0"
            @click="executeImportWithMapping"
          >
            {{ importProcessing ? '导入中...' : '确认导入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入进度弹窗 -->
    <ProgressDialog
      v-model="importProgressVisible"
      :title="importProgressTitle"
      :percentage="importProgress"
      :status="importStatus"
      :status-text="importStatusText"
      :detail-info="importDetailInfo"
      @close="handleProgressClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  Upload,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";
import ProgressDialog from "@/components/ProgressDialog/index.vue";
import {
  getOdsSxbxgmqksjPage,
  getOdsSxbxgmqksjById,
  addOdsSxbxgmqksj,
  updateOdsSxbxgmqksj,
  deleteOdsSxbxgmqksj,
  batchDeleteOdsSxbxgmqksj,
  exportOdsSxbxgmqksj,
  updateSingleReportStatus,
  updateSingleEnableStatus,
  parseExcelHeaders,
  importOdsSxbxgmqksjWithMapping,
  downloadTemplate,
  getSystemSchoolCode,
  getSystemFields,
  type OdsSxbxgmqksjInfo,
  type OdsSxbxgmqksjQuery,
  type OdsSxbxgmqksjForm,
  type DictOption,
  type SystemField,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type ImportResult,
} from "@/api-data/data/data_base/zygjx/ods_sxbxgmqksj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsSxbxgmqksjInfo[]>([]);
const total = ref(0);
const multipleSelection = ref<OdsSxbxgmqksjInfo[]>([]);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsSxbxgmqksjInfo | null>(null);
const systemSchoolCode = ref<string>("");
// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);
// 导入相关状态
const uploadRef = ref();
const fieldMappingDialogVisible = ref(false);
const currentExcelFile = ref<File | null>(null);
const excelParseResult = ref<ExcelParseResult | null>(null);
const fieldMapping = ref<FieldMapping>({});
const systemFields = ref<SystemField[]>([]);
const importProcessing = ref(false);

// 进度条相关状态
const importProgressVisible = ref(false);
const importProgressTitle = ref('数据导入');
const importProgress = ref(0);
const importStatus = ref<'loading' | 'success' | 'error'>('loading');
const importStatusText = ref('准备导入...');
const importDetailInfo = ref('');

// 导入相关变量
const unmappedFieldsForm = ref<Record<string, any>>({});
const defaultValues = ref<Record<string, any>>({});
const importFile = ref<File | null>(null);
const importResult = ref<any>(null);
const importLoading = ref(false);
const updateByStudentNumber = ref(true);
const autoGenerateId = ref(true);

// 字典数据
const bxgmfmOptions = ref<DictOption[]>([
  { value: "01", label: "学校统一购买" },
  { value: "02", label: "学生自行购买" },
  { value: "03", label: "实习单位购买" },
]);
const gmbxzlmOptions = ref<DictOption[]>([
  { value: "01", label: "意外伤害保险" },
  { value: "02", label: "责任保险" },
  { value: "03", label: "其他保险" },
]);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsSxbxgmqksjQuery>({
  pageNum: 1,
  pageSize: 20,
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  orderByColumn: "",
  isAsc: "asc",
});

// 表单数据
const form = reactive<OdsSxbxgmqksjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sjcjsj: "",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10位", trigger: "blur" },
  ],
  xh: [
    { required: true, message: "请输入学号", trigger: "blur" },
    { max: 20, message: "学号长度不能超过20位", trigger: "blur" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsSxbxgmqksjPage(queryParams);
    // 实际API返回结构: response.data.data.records (使用类型断言避免TS错误)
    if (response.data && (response.data as any).data) {
      dataList.value = (response.data as any).data.records || [];
      total.value = (response.data as any).data.total || 0;
    } else {
      console.error("数据格式异常:", response);
      dataList.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error("查询失败:", error);
    ElMessage.error("查询失败");
    dataList.value = [];
    total.value = 0;
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
  sjcjsjRange.value = undefined;
  queryParams.pageNum = 1;
  getList();
};

// 采集时间范围改变
const handleSjcjsjRangeChange = (value: [string, string] | undefined) => {
  if (value && value.length === 2) {
    queryParams.sjcjsjStart = value[0];
    queryParams.sjcjsjEnd = value[1];
  } else {
    queryParams.sjcjsjStart = "";
    queryParams.sjcjsjEnd = "";
  }
};

// 排序改变
const handleSortChange = ({ column, prop, order }: any) => {
  if (prop && order) {
    queryParams.orderByColumn = prop;
    queryParams.isAsc = order === 'ascending' ? 'asc' : 'desc';
  } else {
    queryParams.orderByColumn = '';
    queryParams.isAsc = 'asc';
  }
  getList();
};

// 分页改变
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

// 选择改变
const handleSelectionChange = (selection: OdsSxbxgmqksjInfo[]) => {
  multipleSelection.value = selection;
};

// 行点击
const handleRowClick = (_row: any) => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: any) => {
  handleView(row);
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: any) => {
  try {
    const response = await getOdsSxbxgmqksjById(row.id);
    Object.assign(form, response.data);
    dialogType.value = "edit";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 查看
const handleView = async (row: any) => {
  try {
    const response = await getOdsSxbxgmqksjById(row.id);
    const data = (response as any)?.data?.data || (response as any)?.data || response.data;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogType.value = "view";
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 删除
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除学生"${row.xsxm}"的保险购买记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await deleteOdsSxbxgmqksj(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
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

  const ids = multipleSelection.value.map((item) => item.id).filter((id): id is number => id !== undefined);

  try {
    await ElMessageBox.confirm(
      `确定要批量删除选中的 ${multipleSelection.value.length} 条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    await batchDeleteOdsSxbxgmqksj(ids);
    ElMessage.success("批量删除成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response :any = await exportOdsSxbxgmqksj(queryParams);
    // 处理导出的二进制数据
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实习保险购买情况数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

// 导入
const handleImport = () => {
  importDialogVisible.value = true;
  loadSystemFields();
};

// 导入对话框关闭
const handleImportDialogClose = () => {
  importDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
  fieldMappingDialogVisible.value = false;
};

// 智能字段映射初始化
const initializeFieldMapping = async () => {
  if (!excelParseResult.value || !systemFields.value.length) return;
  
  // 确保学校代码已经获取
  if (!systemSchoolCode.value) {
    console.log("学校代码未获取，先获取学校代码...");
    await getSystemSchoolCodeData();
  }
  
  const mapping: Record<number, string> = {};
  const headers = excelParseResult.value.headers;
  
  // 智能匹配规则
  const matchRules: Record<string, string[]> = {
    'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    'xh': ['学号', 'xh', 'studentno', '学生学号'],
    'xsxm': ['学生姓名', 'xsxm', 'studentname', '姓名'],
    'bxxzmc': ['保险险种名称', 'bxxzmc', 'insurancename'],
    'bdh': ['保单号', 'bdh', 'policyno'],
    'bxfczfmc': ['保险费出资方名称', 'bxfczfmc', 'payer'],
    'bxgmrq': ['保险购买日期', 'bxgmrq', 'buydate'],
    'bxgmfm': ['保险购买方码', 'bxgmfm', 'buyercode'],
    'gmbxzlm': ['购买保险种类码', 'gmbxzlm', 'typecode']
  };
  
  headers.forEach((header: any, index: number) => {
    const columnName = header.columnName.toLowerCase().trim();
    
    // 查找匹配的系统字段
    for (const [fieldName, patterns] of Object.entries(matchRules)) {
      for (const pattern of patterns) {
        if (columnName.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(columnName)) {
          mapping[index] = fieldName;
          break;
        }
      }
      if (mapping[index]) break;
    }
  });
  
  fieldMapping.value = mapping;
  
  // 为必填字段设置默认值
  systemFields.value.forEach(field => {
    if (field.required && !Object.values(mapping).includes(field.field)) {
      switch (field.field) {
        case 'xxdm':
          defaultValues.value[field.field] = systemSchoolCode.value || ''; // 使用系统学校代码
          break;
        case 'sjcjsj':
          defaultValues.value[field.field] = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14);
          break;
        default:
          defaultValues.value[field.field] = '';
      }
    }
  });
  
  // 为系统自动处理的字段设置默认值（无论是否映射都要设置）
  if (!Object.values(mapping).includes('xxdm')) {
    defaultValues.value['xxdm'] = systemSchoolCode.value || ''; // 学校代码
  }
  if (!Object.values(mapping).includes('reportStatus')) {
    defaultValues.value['reportStatus'] = '0'; // 上报状态默认为0（未上报）
  }
  if (!Object.values(mapping).includes('enableStatus')) {
    defaultValues.value['enableStatus'] = '1'; // 启用状态默认为1（启用）
  }
  if (!Object.values(mapping).includes('sjcjsj')) {
    defaultValues.value['sjcjsj'] = new Date().toISOString().replace(/[-T:]/g, '').slice(0, 14); // 数据采集时间
  }
  // zjsjwyxbs 不设置默认值，完全由后端生成
  
  console.log("字段映射初始化完成:");
  console.log("- 学校代码 systemSchoolCode.value:", systemSchoolCode.value);
  console.log("- 默认值 defaultValues.value:", defaultValues.value);
  console.log("- 学校代码在默认值中:", defaultValues.value.xxdm);
};

// 文件上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件!");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB!");
    return false;
  }
  return true;
};

// 下载导入模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplate() as any;
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `课程建设数据_导入模板_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    ElMessage.error("模板下载失败");
  }
};
// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  const response = await getSystemSchoolCode() as any;
  systemSchoolCode.value = response.data.data;
};

// 重置导入
const resetImport = () => {
  importFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  defaultValues.value = {};
  importResult.value = null;
};

// 执行导入
const handleExecuteImport = async () => {
  if (!currentExcelFile.value) {
    ElMessage.warning('请先选择要导入的Excel文件');
    return;
  }

  if (getUnsetRequiredFieldsCount() > 0) {
    ElMessage.warning('请检查必填字段映射，确保所有必填字段都有Excel列映射或默认值');
    return;
  }

  try {
    importLoading.value = true;
    
    const config: ImportConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: {
        ...defaultValues.value,  // 包含学校代码等系统字段的默认值
        ...unmappedFieldsForm.value,  // 用户设置的未映射字段默认值
      },
      startRow: 2,
      autoGenerateId: true
    };
    
    const response = await importOdsSxbxgmqksjWithMapping(currentExcelFile.value, config);
    const result = response.data as any;
    
    if (result.code === 200) {
      importResult.value = result.data;
      ElMessage.success(`导入成功！成功: ${result.data.successCount || 0}, 新增: ${result.data.insertCount || 0}, 更新: ${result.data.updateCount || 0}, 失败: ${result.data.failureCount || 0}`);
      getList(); // 刷新列表
    } else {
      throw new Error(result.message || '导入失败');
    }
  } catch (error: any) {
    ElMessage.error(`导入失败: ${error.message}`);
    importResult.value = null;
  } finally {
    importLoading.value = false;
  }
};

// 导入完成
const handleImportComplete = () => {
  importDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
  importResult.value = null;
};

// 获取已映射字段数量
const getMappedFieldsCount = () => {
  return Object.values(fieldMapping.value).filter(value => value && value.trim() !== '').length;
};

// 获取必填字段数量
const getRequiredFieldsCount = () => {
  return systemFields.value.filter(field => field.required).length;
};

// 获取必填字段列表
const getRequiredFields = () => {
  return systemFields.value.filter(field => field.required);
};

// 获取未设置必填字段数量
const getUnsetRequiredFieldsCount = () => {
  return systemFields.value.filter(field => {
    if (!field.required) return false;
    const mappedValue = Object.values(fieldMapping.value).includes(field.field);
    const defaultValue = defaultValues.value[field.field];
    return !mappedValue && (!defaultValue || defaultValue === '');
  }).length;
};

// 获取字段示例
const getFieldExample = (field: string) => {
  const examples: Record<string, string> = {
    'zjsjwyxbs': '自动生成32位唯一编码',
    'xxdm': '10001',
    'xh': '2023010101',
    'xsxm': '张三',
    'bxxzmc': '意外伤害保险',
    'bdh': '12345678901234567890',
    'bxfczfmc': '某某保险公司',
    'bxgmrq': '20230101',
    'bxgmfm': '01（学校统一购买）',
    'gmbxzlm': '01（意外伤害保险）',
    'sjcjsj': '20230101120000'
  };
  return examples[field] || '请根据实际情况填写';
};

// 获取字段选项（用于默认值选择）
const getFieldOptions = (field: string) => {
  const options: Record<string, DictOption[]> = {
    'bxgmfm': [
      { value: "01", label: "学校统一购买" },
      { value: "02", label: "学生自行购买" },
      { value: "03", label: "实习单位购买" },
    ],
    'gmbxzlm': [
      { value: "01", label: "意外伤害保险" },
      { value: "02", label: "责任保险" },
      { value: "03", label: "其他保险" },
    ],
  };
  return options[field] || [];
};

// 获取Excel列预览数据
const getColumnPreview = (columnIndex: number) => {
  if (!excelParseResult.value || !excelParseResult.value.dataPreview || excelParseResult.value.dataPreview.length === 0) {
    return [];
  }
  const data = excelParseResult.value.dataPreview;
  const previewData: string[] = [];
  for (let i = 0; i < Math.min(3, data.length); i++) { // 预览前3行
    if (data[i] && data[i][columnIndex] !== undefined && data[i][columnIndex] !== null) {
      previewData.push(String(data[i][columnIndex]));
    } else {
      previewData.push('');
    }
  }
  return previewData;
};

// 获取字段映射状态
const getFieldMappingStatus = (field: string) => {
  const mappedFields = Object.values(fieldMapping.value);
  const isMapped = mappedFields.includes(field);
  const defaultValue = defaultValues.value[field];
  const hasDefault = defaultValue !== undefined && defaultValue !== null && defaultValue !== '';
  const isSet = isMapped || hasDefault;

  return { isMapped, hasDefault, isSet };
};

// 获取未映射字段
const getUnmappedFields = () => {
  const mappedFields = Object.values(fieldMapping.value);
  // 排除系统自动处理的字段
  const excludeFields = ['zjsjwyxbs', 'xxdm', 'reportStatus', 'enableStatus', 'sjcjsj'];
  return systemFields.value.filter(field => 
    !mappedFields.includes(field.field) && !excludeFields.includes(field.field)
  );
};

// 检查字段是否已被映射
const isFieldAlreadyMapped = (fieldName: string, currentColumnIndex: number) => {
  // 学校代码和唯一性标识字段不允许手动映射，系统自动处理
  if (fieldName === 'xxdm' || fieldName === 'zjsjwyxbs') {
    return true;
  }
  const mappedEntries = Object.entries(fieldMapping.value);
  return mappedEntries.some(([columnIndex, mappedField]) => 
    mappedField === fieldName && parseInt(columnIndex) !== currentColumnIndex
  );
};

// 字段映射变化时触发
const onFieldMappingChange = () => {
  // 当字段映射改变时，如果映射到一个必填字段，则清空其默认值
  const requiredFields = systemFields.value.filter(f => f.required);
  requiredFields.forEach(field => {
    const isMapped = Object.values(fieldMapping.value).includes(field.field);
    if (isMapped && defaultValues.value[field.field]) {
      defaultValues.value[field.field] = '';
    }
  });
};

// 上报状态点击
const handleReportStatusClick = async (row: any) => {
  const nextStatus = row.reportStatus === "0" ? "1" : "0";
  const statusText = nextStatus === "1" ? "已上报" : "未上报";

  try {
    await ElMessageBox.confirm(
      `确定要将上报状态修改为"${statusText}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      },
    );

    await updateSingleReportStatus(row.id, nextStatus);
    ElMessage.success("状态修改成功");
    getList();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error("状态修改失败");
    }
  }
};

// 启用状态改变
const handleEnableStatusChange = async (row: any) => {
  const statusText = row.enableStatus === "1" ? "启用" : "禁用";

  try {
    row.statusLoading = true;
    await updateSingleEnableStatus(row.id, row.enableStatus);
    ElMessage.success(`${statusText}成功`);
  } catch (error) {
    // 失败时恢复原状态
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    ElMessage.error(`${statusText}失败`);
  } finally {
    row.statusLoading = false;
  }
};

// 表单提交
const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;

    if (dialogType.value === "add") {
      await addOdsSxbxgmqksj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsSxbxgmqksj(form);
      ElMessage.success("修改成功");
    }

    dialogVisible.value = false;
    getList();
  } catch (error) {
    // 表单验证失败或请求失败
  } finally {
    submitLoading.value = false;
  }
};

// 表单关闭
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xsxm: "",
    bxxzmc: "",
    bdh: "",
    bxfczfmc: "",
    bxgmrq: "",
    bxgmfm: "",
    gmbxzlm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 获取字段描述
const getFieldDescription = (field: SystemField) => {
  const descriptions: Record<string, string> = {
    'zjsjwyxbs': '主键数据唯一性标识，导入时系统自动生成，无需填写',
    'xxdm': '学校代码，必填项',
    'xh': '学生学号，必填项，导入时将根据此字段判断是否为更新',
    'xsxm': '学生姓名，必填项',
    'bxxzmc': '保险险种名称',
    'bdh': '保单号',
    'bxfczfmc': '保险费出资方名称',
    'bxgmrq': '保险购买日期，格式：YYYYMMDD',
    'bxgmfm': '保险购买方码，01-学校统一购买，02-学生自行购买，03-实习单位购买',
    'gmbxzlm': '购买保险种类码，01-意外伤害保险，02-责任保险，03-其他保险',
    'sjcjsj': '数据采集时间，必填项，格式：YYYYMMDDHHmmss'
  };
  return descriptions[field.field] || '暂无描述';
};

// 加载系统字段
const loadSystemFields = () => {
  systemFields.value = getSystemFields();
  
  // 为选择类型的字段设置实际的选项数据
  systemFields.value = systemFields.value.map(field => {
    const updatedField = { ...field };
    
    switch (field.field) {
      case 'bxgmfm':
        updatedField.options = bxgmfmOptions.value;
        break;
      case 'gmbxzlm':
        updatedField.options = gmbxzlmOptions.value;
        break;
      case 'reportStatus':
        updatedField.options = [
          { value: '0', label: '未上报' },
          { value: '1', label: '已上报' },
          { value: '2', label: '上报失败' }
        ];
        break;
      case 'enableStatus':
        updatedField.options = [
          { value: '0', label: '禁用' },
          { value: '1', label: '启用' }
        ];
        break;
    }
    
    return updatedField;
  });
};

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info"; // 未上报
    case "1":
      return "success"; // 已上报
    case "2":
      return "danger"; // 上报失败
    default:
      return "info";
  }
};

// 获取上报状态文本
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

// 获取启用状态标签类型
const getEnableStatusType = (status: string) => {
  switch (status) {
    case "0":
      return "danger"; // 禁用
    case "1":
      return "success"; // 启用
    default:
      return "info";
  }
};

// 获取启用状态文本
const getEnableStatusText = (status: string) => {
  switch (status) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "未知";
  }
};

// 格式化日期时间（用于创建时间和更新时间）
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
  } catch (error) {
    return "-";
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    // 可以从服务器获取字典数据
    // const [buyerRes, typeRes] = await Promise.all([
    //   getInsuranceBuyerOptions(),
    //   getInsuranceTypeOptions()
    // ])
    // bxgmfmOptions.value = buyerRes.data
    // gmbxzlmOptions.value = typeRes.data
  } catch (error) {
    console.warn("加载字典数据失败，使用默认选项");
  }
};

// 初始化
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  loadDictOptions();
});

// 导入提示内容
const importTipContent = `导入说明：
1. 请先下载导入模板，按模板格式填写数据
2. 模板第一行为字段中文名称，请勿修改
3. 从第二行开始录入数据
4. 必填字段不能为空
5. 支持.xls和.xlsx格式文件`;

// 自定义文件上传处理 - 解析Excel表头
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    console.log("开始解析Excel文件:", file.name);
    
    // 保存当前文件
    currentExcelFile.value = file;
    
    // 调用后端API解析Excel表头
    const response = (await parseExcelHeaders(file)) as any;
    console.log("解析响应:", response);

    if (response && response.data && response.data.code === 200) {
      // 后端返回的是完整的ExcelParseResult对象
      const result = response.data.data;
      if (result && result.headers) {
        excelParseResult.value = {
          headers: result.headers.map((header: any) => ({
            columnIndex: header.columnIndex,
            columnName: header.columnName
          })),
          dataPreview: result.dataPreview || [], // 数据预览
          totalRows: result.totalRows || 0 // 总行数信息
        };
      } else {
        excelParseResult.value = {
          headers: [],
          dataPreview: [],
          totalRows: 0
        };
      }
    
      // 初始化字段映射（智能匹配）
      await initializeFieldMapping();
      
      // 显示字段映射对话框
      fieldMappingDialogVisible.value = true;
      importDialogVisible.value = false;
      
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "解析Excel文件失败";
      ElMessage.error(`解析失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("解析失败:", error);
    handleImportError(error, onError);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

// 处理导入错误的通用方法
const handleImportError = (error: any, onError?: Function) => {
  let errorMessage = "操作失败";
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      errorMessage = "登录已过期，请重新登录";
    } else if (status === 403) {
      errorMessage = "没有权限进行此操作";
    } else if (status === 413) {
      errorMessage = "文件太大，请检查文件大小";
    } else if (status === 415) {
      errorMessage = "不支持的文件格式";
    } else if (data && data.message) {
      errorMessage = data.message;
    } else {
      errorMessage = `服务器错误 (${status})`;
    }
  } else if (error?.message) {
    if (error.message.includes("Network Error")) {
      errorMessage = "网络连接失败，请检查网络连接";
    } else if (error.message.includes("timeout")) {
      errorMessage = "请求超时，请重试";
    } else {
      errorMessage = error.message;
    }
  }

      ElMessage.error(errorMessage);
  if (onError) onError(error);
};

// 取消字段映射
const cancelFieldMapping = () => {
  fieldMappingDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
};

// 执行字段映射导入
const executeImportWithMapping = async () => {
  if (!currentExcelFile.value || !excelParseResult.value) {
    ElMessage.error("请先选择文件");
    return;
  }
  
  // 显示进度条弹窗
  importProgressVisible.value = true;
  importProgressTitle.value = 'Excel数据导入';
  importProgress.value = 0;
  importStatus.value = 'loading';
  importStatusText.value = '正在准备导入数据...';
  importDetailInfo.value = `文件: ${currentExcelFile.value.name}`;
  
  try {
    importProcessing.value = true;
    
    const config: ImportConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: {
        ...defaultValues.value,  // 包含学校代码等系统字段的默认值
        ...unmappedFieldsForm.value,  // 用户设置的未映射字段默认值
      },
      startRow: 2,
      autoGenerateId: true
    };
 
    
    // 更新进度条状态
    importProgress.value = 20;
    importStatusText.value = '正在解析Excel文件...';
    
    // 模拟进度更新
    const progressTimer = setInterval(() => {
      if (importProgress.value < 80) {
        importProgress.value += 10;
      }
    }, 200);
    
    let response;
    try {
      response = await importOdsSxbxgmqksjWithMapping(currentExcelFile.value, config);
      clearInterval(progressTimer);
      console.log('API响应:', response);
    } catch (requestError) {
      clearInterval(progressTimer);
      console.log('API请求错误:', requestError);
      throw requestError;
    }
    
    const result = (response as any).data;
    if (result && result.code === 200) {
      // 导入成功
      importProgress.value = 100;
      importStatus.value = 'success';
      importStatusText.value = '数据导入成功！';
      
      const importResult = result.data;
      const successMsg = `成功: ${importResult.successCount || 0}, 新增: ${importResult.insertCount || 0}, 更新: ${importResult.updateCount || 0}, 失败: ${importResult.failureCount || 0}`;
      importDetailInfo.value = successMsg;
      
      // 延迟一下让用户看到成功状态，然后自动关闭
      setTimeout(() => {
        fieldMappingDialogVisible.value = false;
        handleProgressClose();
        ElMessage.success("数据导入成功：" + successMsg);
        getList(); // 刷新列表
      }, 1500);
    } else {
      // 导入失败
      importStatus.value = 'error';
      importProgress.value = 0;
      const errorMsg = result?.message || "导入失败";
      
      if (errorMsg.includes('数据验证失败')) {
        importStatusText.value = '数据验证失败';
        importDetailInfo.value = errorMsg;
      } else {
        importStatusText.value = '导入失败';
        importDetailInfo.value = errorMsg;
      }
      
      console.log('导入失败，错误信息:', errorMsg);
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    importStatus.value = 'error';
    importProgress.value = 0;
    importStatusText.value = '导入过程中发生错误';
    
    let errorDetail = '未知错误';
    if (error?.response?.data?.message) {
      errorDetail = error.response.data.message;
    } else if (error?.message) {
      errorDetail = error.message;
    }
    
    if (errorDetail.includes('数据验证失败')) {
      importStatusText.value = '数据验证失败';
      importDetailInfo.value = '存在数据格式或必填字段问题，请检查Excel文件';
    } else {
      importDetailInfo.value = errorDetail;
    }
  } finally {
    importProcessing.value = false;
  }
};

// 进度条关闭处理
const handleProgressClose = () => {
  importProgressVisible.value = false;
  // 重置进度条状态
  importProgress.value = 0;
  importStatus.value = 'loading';
  importStatusText.value = '准备导入...';
  importDetailInfo.value = '';
};

// 获取字段类型文本
const getFieldTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'string': '文本',
    'number': '数字', 
    'date': '日期',
    'select': '选择'
  };
  return typeMap[type] || type;
};
</script>

 

<style scoped lang="scss">
.system-building-management {
  padding: 0px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .search-card {
    margin-bottom: 12px;
    border-radius: 12px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex-shrink: 0;

    :deep(.el-card__body) {
      padding: 8px 12px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      justify-content: flex-start;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }

    :deep(.el-form-item__label) {
      width: 120px;
      text-align: right;
      padding-right: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #2c3e50;
      white-space: nowrap;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 200px;
      font-size: 14px;
      border-radius: 8px;
      transition: all 0.3s ease;
      
      &:hover {
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
      }
      
      &.is-focus {
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    :deep(.el-date-editor) {
      width: 320px !important;
    }

    :deep(.search-buttons) {
      display: flex;
      gap: 12px;
      margin-left: auto;
      flex-shrink: 0;
    }

    :deep(.el-button) {
      font-size: 14px;
      border-radius: 8px;
      padding: 8px 20px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &:not(.el-button--primary) {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;
        
        &:hover {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
          border-color: #c0c4cc;
          transform: translateY(-1px);
        }
      }
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 0;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 0; // 重要：允许flex子元素收缩

    :deep(.el-card__body) {
      padding: 8px 12px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-height: 0; // 重要：允许flex子元素收缩
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      position: relative;
      padding: 6px 0;
      border-bottom: 2px solid #f0f2f5;
      flex-shrink: 0;

      .header-title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        
        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #2c3e50;
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }
  }

  .table-body {
    margin-bottom: 0;
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 0; // 重要：允许flex子元素收缩
    height: calc(100% - 50px); // 为分页组件预留空间

    :deep(.el-table) {
      font-size: 14px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      flex: 1;
      height: calc(100% - 60px) !important; // 为分页组件预留空间
    }

    :deep(.el-table__header th) {
      padding: 4px 4px;
      height: 32px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-size: 12px;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e4e7ed;
    }

    :deep(.el-table__row td) {
      padding: 2px 4px;
      font-size: 12px;
      border-bottom: 1px solid #f0f2f5;
      transition: background-color 0.2s ease;
    }

    :deep(.el-table__row:hover td) {
      background-color: #f8f9fa;
    }

    :deep(.el-table__row:nth-child(even)) {
      background-color: #fafbfc;
    }

    :deep(.el-table__fixed),
    :deep(.el-table__fixed-right) {
      box-shadow: none;
      z-index: 10;
      background: #fff;
    }

    :deep(.el-table__fixed-right::before),
    :deep(.el-table__fixed::before) {
      display: none;
    }

    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      overflow: hidden;
    }

    :deep(.el-table__body-wrapper) {
      overflow-x: auto;
      overflow-y: auto;
      flex: 1;
    }

    :deep(.el-table__fixed-header-wrapper),
    :deep(.el-table__fixed-body-wrapper),
    :deep(.el-table__fixed-right-header-wrapper),
    :deep(.el-table__fixed-right-body-wrapper) {
      background: #fff;
      z-index: 10;
    }

    :deep(.el-table__fixed-header-wrapper .el-table__header),
    :deep(.el-table__fixed-body-wrapper .el-table__body),
    :deep(.el-table__fixed-right-header-wrapper .el-table__header),
    :deep(.el-table__fixed-right-body-wrapper .el-table__body) {
      width: 100% !important;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    margin-top: 0;
    flex-shrink: 0;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    border-top: 1px solid #e4e7ed;
    border-radius: 0 0 12px 12px;

    .total-info {
      color: #606266;
      font-weight: 500;
      padding: 8px 12px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;

      backdrop-filter: blur(10px);
    }

    :deep(.el-pagination) {
      font-size: 12px;
      background: rgba(255, 255, 255, 0.8);
      padding: 4px 8px;
      border-radius: 20px;
      border: 1px solid #e4e7ed;
      backdrop-filter: blur(10px);

      .btn-prev,
      .btn-next,
      .el-pager li {
        min-width: 24px;
        height: 24px;
        line-height: 24px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.3s ease;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e4e7ed;

        &:hover {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }

        &.active {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          color: white;
          border-color: #409eff;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }
      }

      .el-pagination__total {
        color: #606266;
        font-weight: 500;
      }

      .el-pagination__jump {
        color: #606266;
        font-weight: 500;
      }
    }
  }

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin-right: 0;
      border-radius: 8px;
      padding: 8px 16px;
      font-weight: 500;
      transition: all 0.3s ease;
      white-space: nowrap;
      
      &.el-button--primary {
        background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
        }
      }
      
      &.el-button--danger {
        background: linear-gradient(135deg, #f56c6c 0%, #e74c3c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(245, 108, 108, 0.4);
        }
      }
      
      &.el-button--success {
        background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
        border: none;
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.3);
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
        }
      }
    }
  }

  .header-title {
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 2px 4px rgba(64, 158, 255, 0.1);
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 12px;

    .el-button {
      margin: 0;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 0;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px) rotate(180deg);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;

    .el-button {
      margin: 0;
      padding: 4px 8px;
      font-size: 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
    }
  }

  .system-building-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 65vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }

    :deep(.el-dialog__footer) {
      padding: 20px 24px;
      border-top: 1px solid #e4e7ed;
      background: white;
      
      .el-button {
        border-radius: 8px;
        padding: 8px 20px;
        font-weight: 500;
        transition: all 0.3s ease;
        
        &.el-button--primary {
          background: linear-gradient(135deg, #409eff 0%, #36a3f7 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
          
          &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
          }
        }
      }
    }
  }

  .detail-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      overflow: hidden;
    }

    :deep(.el-dialog__header) {
      background: linear-gradient(135deg, #67c23a 0%, #5cb85c 100%);
      color: white;
      padding: 20px 24px;
      
      .el-dialog__title {
        color: white;
        font-weight: 600;
      }
      
      .el-dialog__headerbtn .el-dialog__close {
        color: white;
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    :deep(.el-dialog__body) {
      padding: 24px;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: #fafbfc;
    }
  }
}

/* 弹窗表单错误提示样式 */
:deep(.dialog-form) {
  .el-form-item {
    position: relative;
    margin-bottom: 16px;

    .el-form-item__error {
      position: absolute;
      top: 50%;
      left: calc(100% + 8px);
      transform: translateY(-50%);
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      padding: 4px 8px;
      margin: 0;
      line-height: 1.2;
      font-size: 11px;
      z-index: 1000;
      background: #fef0f0;
      border: 1px solid #fbc4c4;
      border-radius: 4px;
      color: #f56c6c;

      &:before {
        content: "!";
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        border-radius: 50%;
        background-color: #f56c6c;
        color: white;
        font-size: 10px;
        margin-right: 4px;
        font-weight: bold;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.system-building-form {
  .form-container {
    max-height: 460px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    font-size: 14px;
    color: #2c3e50;
    font-weight: 600;
    line-height: 32px;
  }

  :deep(.el-input__wrapper) {
    font-size: 14px;
    height: 32px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &.is-focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-select) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 14px;
    border-radius: 6px;
    line-height: 1.4;
    padding: 8px 12px;
    transition: all 0.3s ease;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
    }
  }

  :deep(.el-date-editor) {
    font-size: 14px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 6px;
    }
  }

  :deep(.el-row) {
    margin-bottom: 0;
  }
}

/* 详情样式 */
.system-building-detail {
  .detail-descriptions {
    :deep(.el-descriptions__label) {
      font-weight: 700;
      color: #2c3e50;
      width: 160px;
      font-size: 14px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    }

    :deep(.el-descriptions__content) {
      color: #606266;
      font-size: 14px;
      padding: 12px 16px;
    }
  }

  .detail-value {
    color: #2c3e50;
    font-size: 14px;
    font-weight: 500;
  }

  .detail-link {
    font-size: 14px;
    word-break: break-all;
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      color: #36a3f7;
      text-decoration: underline;
    }
  }

  .detail-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border: 1px solid #e4e7ed;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f39c12;
    transform: scale(1.1);
  }
}

/* 上传成功提示样式 */
:deep(.el-upload__tip) {
  color: #909399;
  font-size: 12px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 导入按钮白色背景样式 */
.import-button {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border: 1px solid #dcdfe6 !important;
  color: #606266 !important;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
  }

  &:active {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%) !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 标签样式美化 */
:deep(.el-tag) {
  border-radius: 6px;
  font-weight: 500;
  padding: 4px 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}

/* 链接样式美化 */
:deep(.el-link) {
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    text-shadow: 0 1px 2px rgba(64, 158, 255, 0.3);
  }
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .system-building-management {
    padding: 12px;
    
    .search-card {
      margin-bottom: 10px;
      
      :deep(.el-form) {
        flex-wrap: wrap;
        gap: 10px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select) {
        width: 180px;
      }
      
      :deep(.el-date-editor) {
        width: 280px !important;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      .table-header {
        margin-bottom: 12px;
        padding: 10px 0;
      }
    }
    
    .pagination-wrapper {
      padding: 12px 16px;
    }
  }
}

@media (max-width: 1200px) {
  .system-building-management {
    padding: 8px;
    
    .search-card {
      margin-bottom: 8px;
      
      :deep(.el-card__body) {
        padding: 12px 16px;
      }
      
      :deep(.el-form) {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select),
      :deep(.el-date-editor) {
        width: 100% !important;
      }
      
      :deep(.el-form-item) {
        margin-bottom: 8px;
      }
      
      :deep(.search-buttons) {
        margin-left: 0;
        justify-content: center;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      .table-header {
        flex-direction: column;
        gap: 12px;
        margin-bottom: 10px;
        padding: 8px 0;
        
        .header-title {
          position: static;
          transform: none;
          text-align: center;
        }
      }
    }
    
    .pagination-wrapper {
      padding: 8px 12px;
      flex-direction: column;
      gap: 8px;
      
      .total-info {
        text-align: center;
      }
    }
  }
}

@media (max-width: 768px) {
  .system-building-management {
    padding: 4px;
    
    .search-card {
      margin-bottom: 6px;
      
      :deep(.el-card__body) {
        padding: 8px 12px;
      }
      
      :deep(.el-form-item__label) {
        width: 100px;
        font-size: 13px;
      }
      
      :deep(.el-button) {
        padding: 6px 16px;
        font-size: 13px;
      }
    }
    
    .table-card {
      :deep(.el-card__body) {
        padding: 6px 8px;
      }
      
      .table-header {
        margin-bottom: 8px;
        padding: 6px 0;
        
        .operation-buttons {
          gap: 8px;
          
          .el-button {
            padding: 6px 12px;
            font-size: 13px;
          }
        }
        
        .header-title {
          font-size: 16px;
        }
      }
    }
    
    .table-body {
      :deep(.el-table__header th) {
        padding: 6px 6px;
        height: 36px;
        font-size: 13px;
      }
      
      :deep(.el-table__row td) {
        padding: 4px 6px;
        font-size: 13px;
      }
    }
    
    .pagination-wrapper {
      padding: 6px 8px;
      
      .total-info {
        font-size: 13px;
        padding: 6px 10px;
      }
      
      :deep(.el-pagination) {
        font-size: 13px;
        padding: 6px 12px;
        
        .btn-prev,
        .btn-next,
        .el-pager li {
          min-width: 28px;
          height: 28px;
          line-height: 28px;
        }
      }
    }
  }
}
</style>