<template>
  <div class="system-building-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
           
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
          <el-form-item label="实习企业" prop="sxqymc">
            <el-input
              v-model="queryParams.sxqymc"
              placeholder="请输入实习企业名称"
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
           
          <!-- <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              style="width: 120px"
            >
              <el-option label="禁用" value="0" />
              <el-option label="启用" value="1" />
            </el-select>
          </el-form-item> -->
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
            :disabled="selectedIds.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
        
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">实习报告记录数据表数据清洗</div>
        <div class="placeholder">
          <!-- <el-button type="success" @click="handleImport">
            <el-icon><Upload /></el-icon>导入
          </el-button> -->
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
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxqymc"
            label="实习企业"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxgwmc"
            label="实习岗位"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxzdjs"
            label="指导教师"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxbglbmText"
            label="报告类别"
            width="120"
            align="center"
          />
          <el-table-column
            prop="sxbgtjrqDisplay"
            label="提交日期"
            width="120"
            align="center"
          />
          <el-table-column
            prop="jspyztmText"
            label="批阅状态"
            width="120"
            align="center"
          />
          <el-table-column
            prop="reportStatus"
            label="上报状态"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus as string) as any"
                @click="handleReportStatusClick(row)"
                style="cursor: pointer"
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
          >
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
          <el-table-column
            prop="createTime"
            label="创建时间"
            width="160"
            align="center"
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
      v-model="dialogVisible"
      :title="
        dialogType === 'add' ? '新增实习报告记录数据' : '编辑实习报告记录数据'
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
        <!-- 基本信息区域 -->
        <div class="form-section">
          <div class="section-title">基本信息</div>
          <el-row :gutter="35">
            <el-col :span="12">
              <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                <el-input
                  v-model="form.zjsjwyxbs"
                  placeholder="请输入主键数据唯一性标识"
                  maxlength="32"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学校代码" prop="xxdm">
                <el-input
                  v-model="form.xxdm"
                  placeholder="请输入学校代码"
                  maxlength="10"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学号" prop="xh">
                <el-input
                  v-model="form.xh"
                  placeholder="请输入学号"
                  maxlength="20"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学生姓名" prop="xsxm">
                <el-input
                  v-model="form.xsxm"
                  placeholder="请输入学生姓名"
                  maxlength="36"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="实习企业名称" prop="sxqymc">
                <el-input
                  v-model="form.sxqymc"
                  placeholder="请输入实习企业名称"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实习岗位名称" prop="sxgwmc">
                <el-input
                  v-model="form.sxgwmc"
                  placeholder="请输入实习岗位名称"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实习指导教师" prop="sxzdjs">
                <el-input
                  v-model="form.sxzdjs"
                  placeholder="请输入实习指导教师"
                  maxlength="36"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 报告信息区域 -->
        <div class="form-section">
          <div class="section-title">报告信息</div>
          <el-row :gutter="35">
            <el-col :span="12">
              <el-form-item label="实习报告类别码" prop="sxbglbm">
                <el-select
                  v-model="form.sxbglbm"
                  placeholder="请选择实习报告类别"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in reportTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实习报告提交日期" prop="sxbgtjrq">
                <el-date-picker
                  v-model="form.sxbgtjrq"
                  type="date"
                  placeholder="请选择实习报告提交日期"
                  value-format="YYYYMMDD"
                  format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教师批阅状态码" prop="jspyztm">
                <el-select
                  v-model="form.jspyztm"
                  placeholder="请选择教师批阅状态"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in teacherReviewStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据采集时间" prop="sjcjsj">
                <el-date-picker
                  v-model="form.sjcjsj"
                  type="datetime"
                  placeholder="请选择数据采集时间"
                  value-format="YYYYMMDDHHmmss"
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 100%"
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
            <el-col :span="24">
              <el-form-item label="实习报告内容摘要" prop="sxbgnrzy">
                <el-input
                  v-model="form.sxbgnrzy"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入实习报告内容摘要"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="实习报告内容" prop="sxbgnr">
                <el-input
                  v-model="form.sxbgnr"
                  type="textarea"
                  :rows="6"
                  placeholder="请输入实习报告内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
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
      title="实习报告记录数据详情"
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
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{
            currentRecord.xh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学生姓名">{{
            currentRecord.xsxm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习企业名称" :span="2">{{
            currentRecord.sxqymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习岗位名称">{{
            currentRecord.sxgwmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习指导教师">{{
            currentRecord.sxzdjs || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告类别">{{
            currentRecord.sxbglbmText || currentRecord.sxbglbm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告提交日期">{{
            currentRecord.sxbgtjrqDisplay || currentRecord.sxbgtjrq || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="教师批阅状态">{{
            currentRecord.jspyztmText || currentRecord.jspyztm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            currentRecord.sjcjsjDisplay || currentRecord.sjcjsj || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus as string) as any">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'">
              {{ currentRecord.enableStatus === '1' ? '启用' : '禁用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实习报告内容摘要" :span="2">{{
            currentRecord.sxbgnrzy || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习报告内容" :span="2">
            <div style="max-height: 150px; overflow-y: auto">
              {{ currentRecord.sxbgnr || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            formatDateTime(currentRecord.createTime)
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            formatDateTime(currentRecord.updateTime)
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- ==================== 导入功能相关对话框 ==================== -->

    <!-- 导入对话框（第一步：上传文件） -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入实习报告记录数据"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleImportDialogClose"
    >
      <!-- 模板下载区域 -->
      <div class="import-template">
        <el-alert
          title="导入前请先下载模板"
          type="info"
          :closable="false"
          show-icon
        >
          <p>请使用标准模板格式导入数据，以确保数据的准确性和完整性。</p>
        </el-alert>
        <div style="margin-top: 16px; text-align: center;">
          <el-button type="primary" @click="handleDownloadTemplate">
            <el-icon><Download /></el-icon>下载导入模板
          </el-button>
        </div>
      </div>

      <el-divider />

      <!-- 文件上传区域 -->
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
        class="import-upload"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip effect="dark" placement="top" :content="importTipContent">
              <el-icon class="import-tip-icon"><Warning /></el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleImportDialogClose">取消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 字段映射对话框（第二步：配置字段映射） -->
    <el-dialog
      v-model="fieldMappingDialogVisible"
      title="Excel字段映射配置"
      width="1200px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="cancelFieldMapping"
    >
      <div class="field-mapping-container">
        <!-- 文件信息展示 -->
        <div class="file-info-section">
          <el-alert :title="`文件名: ${currentExcelFile?.name || ''}`" type="info" :closable="false" show-icon>
            <template #default>
              <div class="file-stats">
                <span>表头数量: {{ excelParseResult?.headers?.length || 0 }}</span>
                <span style="margin-left: 20px;">数据行数: {{ excelParseResult?.totalRows || 0 }}</span>
              </div>
            </template>
          </el-alert>
        </div>

        <!-- 左右布局的主要内容 -->
        <el-row :gutter="20" class="main-content">
          <!-- 左侧：映射状态和说明 -->
          <el-col :span="8" class="left-panel">
            <!-- 映射配置说明 -->
            <div class="mapping-description">
              <h4>字段映射说明:</h4>
              <p>请为每个Excel列选择对应的系统字段。系统已根据列名进行智能匹配，请检查并调整映射关系。</p>
              <p>* 标记的字段为必填字段，必须设置映射或默认值。</p>
              <p><strong>系统自动处理的字段：</strong>主键唯一标识、学校代码、数据采集时间、上报状态、启用状态</p>
            </div>

            <!-- 必填字段映射状态表格 -->
            <div class="required-fields-status">
              <h4>必填字段映射状态：</h4>
              <el-table :data="getRequiredFields()" border size="small">
                <el-table-column prop="label" label="字段名称" />
                <el-table-column label="状态" align="center">
                  <template #default="{ row }">
                    <el-tag :type="getFieldMappingStatus(row.field).isSet ? 'success' : 'danger'" size="small">
                      {{ getFieldMappingStatus(row.field).isSet ? '✓' : '✗' }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="来源" align="center">
                  <template #default="{ row }">
                    <span v-if="getFieldMappingStatus(row.field).isMapped">映射</span>
                    <span v-else-if="getFieldMappingStatus(row.field).hasDefault">默认</span>
                    <span v-else>-</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 映射状态统计 -->
            <div class="mapping-status">
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-statistic title="已映射" :value="getMappedFieldsCount()" />
                </el-col>
                <el-col :span="12">
                  <el-statistic title="必填字段" :value="getRequiredFieldsCount()" />
                </el-col>
                <el-col :span="24">
                  <el-statistic title="未设置必填字段" :value="getUnsetRequiredFieldsCount()" />
                </el-col>
              </el-row>
            </div>
            
            <!-- 系统自动处理字段说明 -->
            <div class="auto-fields-info">
              <h4>系统自动处理字段：</h4>
              <el-table :data="systemFields.filter(f => f.isDefault)" border size="small">
                <el-table-column prop="label" label="字段名称" />
                <el-table-column label="处理方式" align="center">
                  <template #default="{ row }">
                    <el-tag size="small" type="success">自动填充</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="description" label="说明" show-overflow-tooltip />
              </el-table>
            </div>
          </el-col>

          <!-- 右侧：字段映射配置 -->
          <el-col :span="16" class="right-panel">
            <!-- Excel列映射表格 -->
            <div class="mapping-table-section">
              <h4>Excel列映射：</h4>
              <el-table 
                :data="excelData.isReady ? excelData.headers : []" 
                :key="excelData.headers.length"
                border
              >
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column label="Excel列名" width="180">
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
                      <div v-for="(preview, index) in getColumnPreview(row.columnIndex)" :key="index">
                        {{ preview || '-' }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="映射到系统字段">
                  <template #default="{ row }">
                    <el-select
                      v-model="fieldMapping[row.columnIndex.toString()]"
                      placeholder="请选择系统字段"
                      clearable
                      style="width: 100%"
                      @change="onFieldMappingChange"
                    >
                      <el-option
                        v-for="field in systemFields.filter(f => !f.isDefault)"
                        :key="field.field"
                        :label="`${field.label} ${field.required ? '*' : ''}`"
                        :value="field.field"
                        :disabled="isFieldAlreadyMapped(field.field, row.columnIndex.toString())"
                      />
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
              <p>以下字段在Excel中未找到映射，将为每条导入数据统一设置以下值：</p>
              <el-form :model="unmappedFieldsForm" label-width="200px">
                <el-form-item
                  v-for="field in getUnmappedFields()"
                  :key="field.field"
                  :label="field.label + (field.required ? ' *' : '')"
                  :rules="field.required ? [{ required: true, message: '请输入默认值' }] : []"
                >
                  <!-- 根据字段类型显示不同的输入控件 -->
                  <el-select v-if="field.type === 'select'" v-model="unmappedFieldsForm[field.field]">
                    <el-option v-for="option in getFieldOptions(field.field)" :key="option.value" :label="option.label" :value="option.value" />
                  </el-select>
                  <el-input-number v-else-if="field.type === 'number'" v-model="unmappedFieldsForm[field.field]" :min="0" />
                  <el-input v-else v-model="unmappedFieldsForm[field.field]" />
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

    <!-- 进度监控对话框（第三步：显示导入进度） -->
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
import { ref, reactive, onMounted, nextTick, triggerRef } from "vue";
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
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  pageOdsSxbgjlsj,
  getOdsSxbgjlsjById,
  addOdsSxbgjlsj,
  updateOdsSxbgjlsj,
  deleteOdsSxbgjlsj,
  batchDeleteOdsSxbgjlsj,
  exportOdsSxbgjlsj,
  updateOdsSxbgjlsjReportStatus,
  updateOdsSxbgjlsjEnableStatus,
  getReportTypeOptions,
  getTeacherReviewStatusOptions,
  // 导入功能相关
  parseExcelHeaders,
  importOdsSxbgjlsjWithMapping,
  downloadTemplate,
  getSystemFields,
  type OdsSxbgjlsjInfo,
  type OdsSxbgjlsjQuery,
  type OdsSxbgjlsjForm,
  type DictOption,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
  type ImportResult,
} from "@/api-data/data/data_base/zygjx/ods_sxbgjlsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsSxbgjlsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const currentRecord = ref<OdsSxbgjlsjInfo | null>(null);
const submitLoading = ref(false);

// 字典选项
const reportTypeOptions = ref<DictOption[]>([]);
const teacherReviewStatusOptions = ref<DictOption[]>([]);

// 表单引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();

// ==================== 导入功能相关数据 ====================
// 导入对话框状态
const importDialogVisible = ref(false);
const fieldMappingDialogVisible = ref(false);
const importProgressVisible = ref(false);

// 导入文件和解析结果
const currentExcelFile = ref<File | null>(null);
const excelParseResult = ref<ExcelParseResult | null>(null);
// 备用的响应式对象，用于解决Vue响应式问题
const excelData = reactive({
  headers: [] as any[],
  dataPreview: [] as string[][],
  totalRows: 0,
  isReady: false
});
const uploadRef = ref();

// 字段映射配置
const fieldMapping = ref<Record<string, string>>({});
const systemFields = ref<SystemField[]>([]);
const unmappedFieldsForm = ref<Record<string, any>>({});

// 导入状态
const importProcessing = ref(false);
const importResult = ref<ImportResult | null>(null);

// 进度相关
const importProgressTitle = ref('Excel数据导入');
const importProgress = ref(0);
const importStatus = ref<'success' | 'exception' | 'warning' | 'error' | 'loading' | '' | undefined>('');
const importStatusText = ref('正在处理...');
const importDetailInfo = ref('');

// 获取学校代码（从系统配置获取）
const systemSchoolCode = ref('4344000123'); // 这里应该从系统配置获取

// 导入提示内容
const importTipContent = `
导入说明：
1. 请先下载导入模板，按模板格式填写数据
2. 支持Excel文件格式(.xls, .xlsx)
3. 文件大小不能超过10MB
4. 必填字段：学号、学生姓名、实习企业名称
5. 系统会自动生成学校代码、唯一标识等字段
6. 支持智能字段映射和手动调整映射关系
`;

// 导入模式选择
const importMode = ref<'insert' | 'upsert'>('upsert');

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 查询参数
const queryParams = reactive<OdsSxbgjlsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sxqymc: "",
  reportStatus: "",
  enableStatus: "",
  pageNum: 1,
  pageSize: 20,
});

// 表单数据
const form = reactive<OdsSxbgjlsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sxqymc: "",
  sxgwmc: "",
  sxzdjs: "",
  sxbglbm: "",
  sxbgnrzy: "",
  sxbgnr: "",
  sxbgtjrq: "",
  jspyztm: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { required: true, message: "请输入主键数据唯一性标识", trigger: "blur" },
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

// 获取字典数据
const loadDictOptions = async () => {
  try {
    const [reportTypeRes, teacherReviewRes] = await Promise.all([
      getReportTypeOptions() as any,
      getTeacherReviewStatusOptions() as any,
    ]);

    if (reportTypeRes.data.code === 200) {
      reportTypeOptions.value = reportTypeRes.data.data || [];
    }

    if (teacherReviewRes.data.code === 200) {
      teacherReviewStatusOptions.value = teacherReviewRes.data.data || [];
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await pageOdsSxbgjlsj(queryParams) as any;
    if (response.data.code === 200) {
      dataList.value = response.data.data.records;
      total.value = response.data.data.total;
    } else {
      ElMessage.error(response.data.message || "查询失败");
    }
  } catch (error) {
    console.error("获取数据失败:", error);
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

/** 处理采集时间范围变化 */
const handleSjcjsjRangeChange = (value: [string, string] | undefined) => {
  if (value && value.length === 2) {
    queryParams.sjcjsjStart = value[0];
    queryParams.sjcjsjEnd = value[1];
  } else {
    queryParams.sjcjsjStart = "";
    queryParams.sjcjsjEnd = "";
  }
};

// 重置搜索
const resetQuery = () => {
  queryForm.value?.resetFields();
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.xh = "";
  queryParams.xsxm = "";
  queryParams.sxqymc = "";
  queryParams.reportStatus = ""; // 重置上报状态
  queryParams.sjcjsjStart = ""; // 重置采集时间开始
  queryParams.sjcjsjEnd = ""; // 重置采集时间结束
  sjcjsjRange.value = undefined; // 重置采集时间范围
  queryParams.pageNum = 1;
  getList();
};

// 分页变化
const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  queryParams.pageNum = 1;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

// 表格选择变化
const handleSelectionChange = (selection: OdsSxbgjlsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 状态相关方法
const getReportStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    "0": "未上报",
    "1": "已上报",
    "2": "上报失败",
  };
  return statusMap[status] || "未知";
};

const getReportStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 日期时间格式化
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("zh-CN");
};

// 操作方法
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsSxbgjlsjInfo) => {
  try {
    const response = await getOdsSxbgjlsjById(row.id) as any;
    if (response.data.code === 200) {
      const data = response.data.data;
      Object.assign(form, data);
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

const handleView = async (row: OdsSxbgjlsjInfo) => {
  try {
    const response = await getOdsSxbgjlsjById(row.id) as any;
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

const handleDelete = async (row: OdsSxbgjlsjInfo) => {
  try {
    await ElMessageBox.confirm(
      "此操作将永久删除该实习报告记录数据，是否继续？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await deleteOdsSxbgjlsj(row.id) as any;
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

const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `此操作将永久删除选中的${selectedIds.value.length}条实习报告记录数据，是否继续？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsSxbgjlsj(selectedIds.value) as any;
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

const handleExport = async () => {
  try {
    const response = await exportOdsSxbgjlsj(queryParams) as any  ;
console.log(response);

    // 创建下载链接
    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实习报告记录数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  }
};

// 状态变更
const handleReportStatusClick = async (row: OdsSxbgjlsjInfo) => {
  const statusOptions = [
    { label: "未上报", value: "0" },
    { label: "已上报", value: "1" },
    { label: "上报失败", value: "2" },
  ];

  try {
    const { value } = await ElMessageBox.confirm(
      "请选择上报状态：0-未上报，1-已上报，2-上报失败",
      "修改上报状态",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await updateOdsSxbgjlsjReportStatus(row.id, "1") as any;
    if (response.data.code === 200) {
      ElMessage.success("修改成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "修改失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("修改上报状态失败:", error);
      ElMessage.error("修改失败");
    }
  }
};

const handleEnableStatusChange = async (row: OdsSxbgjlsjInfo & { statusLoading?: boolean }) => {
  const originalStatus = row.enableStatus;
  row.statusLoading = true;

  try {
    const response = await updateOdsSxbgjlsjEnableStatus(
      row.id,
      row.enableStatus,
    ) as any;
    if (response.data.code === 200) {
      ElMessage.success("修改成功");
    } else {
      row.enableStatus = originalStatus;
      ElMessage.error(response.data.message || "修改失败");
    }
  } catch (error) {
    row.enableStatus = originalStatus;
    console.error("修改启用状态失败:", error);
    ElMessage.error("修改失败");
  } finally {
    row.statusLoading = false;
  }
};

// 表单相关方法
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    xh: "",
    xsxm: "",
    sxqymc: "",
    sxgwmc: "",
    sxzdjs: "",
    sxbglbm: "",
    sxbgnrzy: "",
    sxbgnr: "",
    sxbgtjrq: "",
    jspyztm: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

const handleFormSubmit = async () => {
  try {
    await formRef.value?.validate();

    submitLoading.value = true;
    let response;

    if (dialogType.value === "add") {
        response = await addOdsSxbgjlsj(form) as any;
    } else {
      response = await updateOdsSxbgjlsj(form) as any;
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "修改成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(response.data.message || "操作失败");
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 表格行点击
const handleRowClick = (row: OdsSxbgjlsjInfo) => {
  // 可以添加行点击逻辑
};

const handleRowDblClick = (row: OdsSxbgjlsjInfo) => {
  handleView(row);
};

// ==================== 导入功能相关方法 ====================

// 导入操作入口
const handleImport = () => {
  console.log('点击了导入按钮，准备打开导入对话框');
  importDialogVisible.value = true;
  systemFields.value = getSystemFields();
  console.log('导入对话框状态已设置为:', importDialogVisible.value);
};

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplate({
      excludeFields: [
        'zjsjwyxbs',  // 唯一编码
        'xxdm',       // 学校代码
        'reportStatus', // 状态
        'enableStatus', // 状态
        'sjcjsj',    // 采集时间
        'createTime', // 创建时间
        'updateTime'  // 修改时间
      ]
    }) as any;
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `实习报告记录数据_导入模板_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    console.error("模板下载失败:", error);
    ElMessage.error("模板下载失败");
  }
};

// 文件上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel = rawFile.type === "application/vnd.ms-excel" || 
                  rawFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
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
      console.log("后端返回的result:", result);
      
      if (result && result.headers) {
        // 先设置为null，再设置新值，强制触发响应式更新
        excelParseResult.value = null;
        await nextTick();
        
        const processedData = {
          headers: result.headers.map((header: any) => ({
            columnIndex: header.columnIndex,
            columnName: header.columnName
          })),
          dataPreview: result.dataPreview || [], // 数据预览
          totalRows: result.totalRows || 0 // 总行数信息
        };
        
        excelParseResult.value = processedData;
        
        // 同时更新备用的reactive对象
        excelData.headers = processedData.headers;
        excelData.dataPreview = processedData.dataPreview;
        excelData.totalRows = processedData.totalRows;
        excelData.isReady = true;
        
        // 强制触发响应式更新
        triggerRef(excelParseResult);
        console.log("处理后的excelParseResult.value:", excelParseResult.value);
      } else {
        console.log("result或result.headers为空，设置默认值");
        excelParseResult.value = null;
        await nextTick();
        excelParseResult.value = {
          headers: [],
          dataPreview: [],
          totalRows: 0
        };
        triggerRef(excelParseResult);
      }
      
      // 使用nextTick确保响应式数据更新完成后再进行后续操作
      await nextTick();
      
      // 初始化字段映射（智能匹配）
      initializeFieldMapping();
      
      // 再次使用nextTick确保数据完全更新后显示对话框
      await nextTick();
      
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

// 初始化字段映射（智能匹配）
const initializeFieldMapping = () => {
  if (!excelParseResult.value || !excelData.isReady) {
    console.log('数据未准备好，跳过初始化');
    return;
  }
  
  const mapping: Record<string, string> = {};
  const headers = excelData.headers; // 使用excelData中的数据，与表格一致
  console.log('开始初始化字段映射，表头数量:', headers.length);
  console.log('headers数据:', headers);
  
  // 尝试智能匹配字段名
  headers.forEach((header, index) => {
    const columnName = header.columnName.trim(); // 不要转小写，保持原始格式
    const columnIndex = header.columnIndex; // 使用header中的columnIndex
    console.log(`处理第${index}列: "${columnName}", columnIndex: ${columnIndex}`);
    
    // 根据表头名称智能匹配系统字段
    const matchedField = findMatchingSystemField(columnName);
    if (matchedField) {
      mapping[columnIndex.toString()] = matchedField; // 使用columnIndex而不是index
      console.log(`映射成功: 列${columnIndex} "${columnName}" -> ${matchedField}`);
    }
  });
  
  fieldMapping.value = mapping;
  console.log('字段映射完成:', mapping);
  
  // 强制触发响应式更新
  nextTick(() => {
    console.log('Vue更新后的fieldMapping:', fieldMapping.value);
  });
  
  // 自动设置默认值字段的默认值
  unmappedFieldsForm.value = {
    ...unmappedFieldsForm.value,
    // 系统自动生成/填充的字段
    xxdm: systemSchoolCode.value || '4344000123', // 学校代码
    sjcjsj: new Date().toISOString().replace(/[-:T]/g, '').substring(0, 15), // 数据采集时间：YYYYMMDDHHmmss
    reportStatus: '0', // 默认未上报
    enableStatus: '1', // 默认启用
  };
};

// 查找匹配的系统字段（智能匹配）
const findMatchingSystemField = (columnName: string): string | null => {
  console.log('匹配字段:', columnName);
  
  // 定义匹配规则 - 精确匹配Excel模板表头
  const matchRules: { [key: string]: string[] } = {
    'xh': ['学号'],
    'xsxm': ['学生姓名'],
    'sxqymc': ['实习企业名称'],
    'sxgwmc': ['实习岗位名称'],
    'sxzdjs': ['实习指导教师'],
    'sxbglbm': ['实习报告类别码'],
    'sxbgnrzy': ['实习报告内容摘要'],
    'sxbgnr': ['实习报告内容'],
    'sxbgtjrq': ['实习报告提交日期'],
    'jspyztm': ['教师批阅状态码']
  };
  
  // 精确匹配
  for (const [fieldName, patterns] of Object.entries(matchRules)) {
    for (const pattern of patterns) {
      if (columnName.trim() === pattern) {
        console.log('匹配成功:', columnName, '->', fieldName);
        return fieldName;
      }
    }
  }
  
  console.log('未匹配到字段:', columnName);
  return null;
};
 

// 关闭导入对话框
const handleImportDialogClose = () => {
  importDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
  importResult.value = null;
  uploadRef.value?.clearFiles();
};

// 关闭进度对话框
const handleProgressClose = () => {
  importProgressVisible.value = false;
  importProgress.value = 0;
  importStatus.value = '';
  importStatusText.value = '正在处理...';
  importDetailInfo.value = '';
};

// ==================== 字段映射相关辅助方法 ====================

// 获取已映射字段数量
const getMappedFieldsCount = () => {
  return Object.values(fieldMapping.value).filter(field => field).length;
};

// 获取必填字段数量（排除默认值字段）
const getRequiredFieldsCount = () => {
  return systemFields.value.filter(field => field.required && !field.isDefault).length;
};

// 获取未映射的必填字段数量（排除默认值字段）
const getUnsetRequiredFieldsCount = () => {
  const mappedFields = Object.values(fieldMapping.value);
  return systemFields.value.filter(field => 
    field.required && 
    !field.isDefault && // 排除默认值字段
    !mappedFields.includes(field.field) && 
    !unmappedFieldsForm.value[field.field]
  ).length;
};

// 获取必填字段列表（排除默认值字段）
const getRequiredFields = () => {
  return systemFields.value.filter(field => field.required && !field.isDefault);
};

// 获取字段映射状态
const getFieldMappingStatus = (fieldName: string) => {
  const mappedFields = Object.values(fieldMapping.value);
  const hasMapping = mappedFields.includes(fieldName);
  const hasDefaultValue = unmappedFieldsForm.value[fieldName] !== undefined && unmappedFieldsForm.value[fieldName] !== '';
  return {
    isMapped: hasMapping,
    hasDefault: hasDefaultValue,
    isSet: hasMapping || hasDefaultValue
  };
};

// 获取未映射的字段列表（排除默认值字段）
const getUnmappedFields = () => {
  const mappedFields = Object.values(fieldMapping.value);
  return systemFields.value.filter(field => !mappedFields.includes(field.field) && !field.isDefault);
};

// 获取列数据预览
const getColumnPreview = (columnIndex: number) => {
  if (!excelData.isReady || !excelData.dataPreview.length) return [];
  return excelData.dataPreview.map(row => row[columnIndex]).slice(0, 3);
};

// 检查字段是否已被映射
const isFieldAlreadyMapped = (fieldName: string, currentColumnIndex: string) => {
  // 查找对应的字段定义
  const field = systemFields.value.find(f => f.field === fieldName);
  
  // 默认值字段不允许手动映射
  if (field && field.isDefault) {
    return true;
  }
  
  const mappedEntries = Object.entries(fieldMapping.value);
  return mappedEntries.some(([columnIndex, mappedField]) => 
    mappedField === fieldName && columnIndex !== currentColumnIndex
  );
};

// 获取字段示例
const getFieldExample = (fieldName: string) => {
  const field = systemFields.value.find(f => f.field === fieldName);
  return field?.example || '';
};

// 获取字段选项
const getFieldOptions = (fieldName: string) => {
  const field = systemFields.value.find(f => f.field === fieldName);
  return field?.options || [];
};

// 字段映射变化处理
const onFieldMappingChange = () => {
  // 可以在这里添加映射变化后的处理逻辑
  console.log('字段映射已更新:', fieldMapping.value);
};

// 取消字段映射配置
const cancelFieldMapping = () => {
  fieldMappingDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
};

// 确保所有默认值字段都有值
const ensureDefaultFieldsValues = () => {
  const defaults: Record<string, string> = {};
  
  // 定义所有默认值字段及其默认值
  const defaultFieldsWithValues = [
    { field: 'zjsjwyxbs', defaultValue: '' }, // 主键唯一标识（后端自动生成）
    { field: 'xxdm', defaultValue: systemSchoolCode.value || '4344000123' }, // 学校代码
    { field: 'sjcjsj', defaultValue: new Date().toISOString().replace(/[-:T]/g, '').substring(0, 14) }, // 数据采集时间
    { field: 'reportStatus', defaultValue: '0' }, // 上报状态：未上报
    { field: 'enableStatus', defaultValue: '1' }, // 启用状态：启用
  ];
  
  // 为所有默认值字段设置值
  defaultFieldsWithValues.forEach(({ field, defaultValue }) => {
    if (defaultValue) { // 只有非空默认值才设置
      defaults[field] = defaultValue;
    }
  });
  
  return defaults;
};

// 执行字段映射导入（核心导入方法）
const executeImportWithMapping = async () => {

  // 确保学校代码已设置
  if (!systemSchoolCode.value) {
    ElMessage.error("系统学校代码未配置，请先配置学校信息");
    return;
  }
  
  // 显示进度条弹窗
  importProgressVisible.value = true;
  importProgressTitle.value = 'Excel数据导入';
  importProgress.value = 0;
  importStatus.value = 'loading';
  importStatusText.value = '正在准备导入数据...';
  importDetailInfo.value = `文件: ${currentExcelFile.value?.name || '未知文件'}`;
  
  try {
    importProcessing.value = true;
    
    // 确保所有默认值字段都有值
    const defaultFieldsDefaults = ensureDefaultFieldsValues();
    
          const config: ImportConfig = {
        fieldMapping: fieldMapping.value,
        unmappedFieldsDefaults: {
          ...unmappedFieldsForm.value,
          ...defaultFieldsDefaults,
          xxdm: systemSchoolCode.value // 确保学校代码被包含在默认值中
        },
      startRow: 2,
      autoGenerateId: true,
      updateByStudentNumber: importMode.value === 'upsert' // 根据学号更新数据
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
      if (!currentExcelFile.value) {
        throw new Error('没有选择文件');
      }
      response = (await importOdsSxbgjlsjWithMapping(currentExcelFile.value, config)) as any;
      clearInterval(progressTimer);
    } catch (requestError) {
      clearInterval(progressTimer);
      throw requestError;
    }
    
    if (response && response.data && response.data.code === 200) {
      // 导入成功
      importProgress.value = 100;
      importStatus.value = 'success';
      importStatusText.value = '数据导入成功！';
      
      const result = response.data.data;
      importDetailInfo.value = `成功导入 ${result.successCount || 0} 条数据，新增：${result.insertCount || 0}，更新：${result.updateCount || 0}，失败：${result.failureCount || 0}`;
      
      // 延迟一下让用户看到成功状态，然后自动关闭
      setTimeout(() => {
        fieldMappingDialogVisible.value = false;
        handleProgressClose();
        ElMessage.success("数据导入成功");
        getList(); // 刷新列表
      }, 1500);
    } else {
      // 导入失败
      importStatus.value = 'error';
      importProgress.value = 0;
      const errorMsg = response?.data?.message || "导入失败";
      
      // 针对不同错误类型显示不同的状态文本
      if (errorMsg.includes('数据验证失败')) {
        importStatusText.value = '数据验证失败';
        importDetailInfo.value = errorMsg;
      } else {
        importStatusText.value = '导入失败';
        importDetailInfo.value = errorMsg;
      }
    }
  } catch (error: any) {
    console.error("导入失败:", error);
    importStatus.value = 'error';
    importProgress.value = 0;
    importStatusText.value = '导入过程中发生错误';
    
    // 处理不同类型的错误信息
    let errorDetail = '未知错误';
    if (error?.response?.data?.message) {
      errorDetail = error.response.data.message;
    } else if (error?.message) {
      errorDetail = error.message;
    }
    
    // 对于数据验证错误，显示更友好的提示
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

// 组件挂载
onMounted(() => {
  loadDictOptions();
  getList();
});
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