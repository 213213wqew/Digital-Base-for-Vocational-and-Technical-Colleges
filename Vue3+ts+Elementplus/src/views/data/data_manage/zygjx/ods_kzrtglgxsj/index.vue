<template>
  <div class="course-certificate-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <!-- <el-form-item label="课程号" prop="kch">
            <el-input
              v-model="queryParams.kch"
              placeholder="请输入课程号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item> -->
          <el-form-item label="证书号" prop="zsh">
            <el-input
              v-model="queryParams.zsh"
              placeholder="请输入证书号"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item label="证书名称" prop="zsmc">
            <el-input
              v-model="queryParams.zsmc"
              placeholder="请输入证书名称"
              clearable
              @keyup.enter="handleQuery"
              style="width: 180px"
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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>

          <el-divider direction="vertical" />
        </div>
        <div class="header-title">课证融通关联关系数据清洗</div>
        <div class="placeholder">
          <!-- <el-button type="warning" @click="handleImport">
            <el-icon><Upload /></el-icon>导入Excel
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
          :height="'calc(80vh - 100px)'"
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
            prop="kcmc"
            label="课程名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            label="课程号"
            width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsh"
            label="证书号"
            width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zsmc"
            label="证书名称"
            min-width="180"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            label="数据采集时间"
            width="160"
            show-overflow-tooltip
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDisplayTime(row.sjcjsj) }}
            </template>
          </el-table-column>
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getEnableStatusTagType(row.enableStatus)"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            show-overflow-tooltip
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
      append-to-body
      class="course-certificate-dialog"
      destroy-on-close
    >
      <!-- 查看模式 - 描述列表 -->
      <div v-if="dialogType === 'view'" class="course-certificate-detail">
        <el-descriptions class="detail-descriptions" :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">
            <span class="detail-value">{{ form.zjsjwyxbs || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ form.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程名称">
            <span class="detail-value">{{ form.kcmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程号">
            <span class="detail-value">{{ form.kch || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="证书号">
            <span class="detail-value">{{ form.zsh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="证书名称">
            <span class="detail-value">{{ form.zsmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">
            <span class="detail-value">{{
              formatDisplayTime(form.sjcjsj || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusTagType(form.enableStatus || '1')"
              size="small"
            >
              {{ getEnableStatusText(form.enableStatus || "1") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || "0") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{ formatDateTime(currentRecord?.createTime) }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{ formatDateTime(currentRecord?.updateTime) }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 新增/编辑模式 - 表单 -->
      <div v-else class="course-certificate-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="140px"
          class="form-container"
        >
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <!-- <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    placeholder="可选填，不填将自动生成32位唯一编码（大写字母和数字组合）"
                    maxlength="32"
                    show-word-limit
                    style="text-transform: uppercase"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
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
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程名称" prop="kcmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kcmc"
                      placeholder="请搜索并选择课程名称"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseNameChange"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kcmc"
                        :value="course.kcmc"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ course.kcmc }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            course.kch
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从课程基本数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="课程号" prop="kch">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kch"
                      placeholder="请搜索并选择课程号"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseCodeChange"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kch"
                        :value="course.kch"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ course.kch }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            course.kcmc
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从课程基本数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 证书信息 -->
          <div class="form-section">
            <div class="section-title">证书信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="证书号" prop="zsh">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.zsh"
                      placeholder="请选择证书号"
                      filterable
                      @change="handleCertificateNumberChange"
                      @focus="loadCertificateOptions"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="certificate in certificateOptions"
                        :key="certificate.id"
                        :label="certificate.zsh"
                        :value="certificate.zsh"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ certificate.zsh }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            certificate.zsmc
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从1+X证书数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="证书名称" prop="zsmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.zsmc"
                      placeholder="请选择证书名称"
                      filterable
                      @change="handleCertificateNameChange"
                      @focus="loadCertificateOptions"
                      style="width: 100%"
                      clearable
                    >
                      <el-option
                        v-for="certificate in certificateOptions"
                        :key="certificate.id"
                        :label="certificate.zsmc"
                        :value="certificate.zsmc"
                        :disabled="false"
                      >
                        <div
                          style="display: flex; justify-content: space-between"
                        >
                          <span>{{ certificate.zsmc }}</span>
                          <span style="color: #8492a6; font-size: 13px">{{
                            certificate.zsh
                          }}</span>
                        </div>
                      </el-option>
                    </el-select>
                    <el-icon
                      class="warning-icon"
                      @mouseenter="
                        showTooltip($event, '从1+X证书数据子类表中获取数据')
                      "
                      @mouseleave="hideTooltip"
                    >
                      <Warning />
                    </el-icon>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <div class="section-title">其他信息</div>
            <el-row :gutter="20">
              <el-col :span="24">
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
            </el-row>
            <el-row :gutter="20">
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
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleSubmit"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入课证融通关联关系数据"
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
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
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
                  <el-input 
                    v-model="unmappedFieldsForm[field.field]"
                    :placeholder="'请输入' + field.label"
                  />
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
import { ref, reactive, onMounted, computed, onUnmounted } from "vue";
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
import {
  getOdsKzrtglgxsjPage,
  getOdsKzrtglgxsjById,
  addOdsKzrtglgxsj,
  updateOdsKzrtglgxsj,
  deleteOdsKzrtglgxsj,
  batchDeleteOdsKzrtglgxsj,
  exportOdsKzrtglgxsj,
  importOdsKzrtglgxsj,
  type OdsKzrtglgxsjVO,
  type OdsKzrtglgxsjQuery,
  type OdsKzrtglgxsjDTO,
  // 高级导入功能相关导入
  parseExcelHeaders,
  importKzrtglgxsjDataWithMapping,
  downloadTemplate,
  getSystemFields,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
  searchCourses,
  type CourseBasicInfo,
  searchCertificates,
  type CertificateBasicInfo,
} from "@/api-data/data/data_base/zygjx/ods_kzrtglgxsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";
import ProgressDialog from "@/components/ProgressDialog/index.vue";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKzrtglgxsjVO[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsKzrtglgxsjVO | null>(null);

// 课程相关数据
const courseOptions = ref<CourseBasicInfo[]>([]);
const courseSearchLoading = ref(false);

// 证书相关数据
const certificateOptions = ref<CertificateBasicInfo[]>([]);
const certificateSearchLoading = ref(false);

// 提示框相关
const tooltipDiv = ref<HTMLDivElement | null>(null);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 导入相关数据
const importDialogVisible = ref(false);
const importLoading = ref(false);
const uploadRef = ref<any>(null);

// 高级导入相关状态
const fieldMappingDialogVisible = ref(false);
const currentExcelFile = ref<File | null>(null);
const excelParseResult = ref<ExcelParseResult | null>(null);
const fieldMapping = ref<FieldMapping>({});
const systemFields = ref<SystemField[]>([]);
const importProcessing = ref(false);
const unmappedFieldsForm = ref<Record<string, any>>({});

// 进度条相关状态
const importProgressVisible = ref(false);
const importProgressTitle = ref('数据导入');
const importProgress = ref(0);
const importStatus = ref<'loading' | 'success' | 'error'>('loading');
const importStatusText = ref('准备导入...');
const importDetailInfo = ref('');

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 查询参数
const queryParams = reactive<OdsKzrtglgxsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  zsh: "",
  zsmc: "",
  reportStatus: "", // 上报状态
  pageNum: 1,
  pageSize: 100,
});

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增课证融通关联关系数据",
    edit: "编辑课证融通关联关系数据",
    view: "查看课证融通关联关系数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsKzrtglgxsjDTO>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  zsh: "",
  zsmc: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const formRules = computed(() => ({
  zjsjwyxbs: [
    {
      required: false,
      message: "主键数据唯一性标识可选填，不填将自动生成",
      trigger: "blur",
    },
    {
      validator: (_rule: any, value: string, callback: Function) => {
        if (!value || value.trim() === "") {
          callback();
          return;
        }
        if (value.length !== 32) {
          callback(new Error("如果填写，必须是32位字符"));
          return;
        }
        if (!/^[A-Z0-9]{32}$/.test(value)) {
          callback(new Error("只能包含大写字母和数字"));
          return;
        }
        callback();
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { len: 10, message: "学校代码必须是10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码只能是数字", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "请输入课程号", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  zsh: [{ max: 50, message: "证书号长度不能超过50个字符", trigger: "blur" }],
  zsmc: [
    { max: 100, message: "证书名称长度不能超过100个字符", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
}));

// 方法实现
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsKzrtglgxsjPage(queryParams);
    const result = response.data as any;
    const data = result.data || result;
    dataList.value = data.records || [];
    total.value = data.total || 0;
  } catch (error) {
    ElMessage.error("查询数据失败");
  } finally {
    loading.value = false;
  }
};

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

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, { 
    zjsjwyxbs: "",
    xxdm: "",
    kcmc: "",
    kch: "",
    zsh: "",
    zsmc: "",
    reportStatus: "", // 重置上报状态
    sjcjsjStart: "", // 重置采集时间开始
    sjcjsjEnd: "", // 重置采集时间结束
    pageNum: 1, 
    pageSize: 100 
  });
  sjcjsjRange.value = undefined; // 重置采集时间范围
  getList();
};

const handleSelectionChange = (selection: OdsKzrtglgxsjVO[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

const handleAdd = async () => {
  dialogType.value = "add";
  resetForm();
  // 获取学校代码
  await getSchoolCode();
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsKzrtglgxsjVO) => {
  await openDialog("edit", row);
};

const handleView = async (row: OdsKzrtglgxsjVO) => {
  await openDialog("view", row);
};

const openDialog = async (type: "edit" | "view", row: OdsKzrtglgxsjVO) => {
  dialogType.value = type;
  try {
    const response = await getOdsKzrtglgxsjById(row.id);
    const data =
      (response as any)?.data?.data || (response as any)?.data || response;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleDelete = async (row: OdsKzrtglgxsjVO) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除课证融通关联关系数据"${row.kcmc}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await deleteOdsKzrtglgxsj(row.id.toString());
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的${selectedIds.value.length}条记录吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await batchDeleteOdsKzrtglgxsj(selectedIds.value);
    ElMessage.success("批量删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("批量删除失败");
    }
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    if (dialogType.value === "add") {
      await addOdsKzrtglgxsj(form);
      ElMessage.success("新增成功");
    } else {
      await updateOdsKzrtglgxsj(form);
      ElMessage.success("修改成功");
    }

    dialogVisible.value = false;
    getList();
  } catch (error) {
    ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
  } finally {
    submitLoading.value = false;
  }
};

const handleExport = async () => {
  try {
    const response = await exportOdsKzrtglgxsj({
      ...queryParams,
      excludeFields: [
        'zjsjwyxbs',  // 唯一编码
        'xxdm',       // 学校代码
        'reportStatus', // 状态
        'enableStatus', // 状态
        'sjcjsj',    // 采集时间
        'createTime', // 创建时间
        'updateTime'  // 修改时间
      ]
    });

    // ArrayBuffer类型的响应数据在response.data中
    const arrayBuffer = (response as any).data || response;

    // 创建下载链接
    const blob = new Blob([arrayBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `课证融通关联关系数据_${new Date().getTime()}.xlsx`;
    link.click();

    // 清理
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请稍后重试");
  }
};

const handleImport = () => {
  importDialogVisible.value = true;
};

// ====== 高级导入功能相关方法 ======

// 导入提示内容
const importTipContent = `导入说明：
1. 请先下载导入模板，按模板格式填写数据
2. 模板第一行为字段中文名称，请勿修改
3. 从第二行开始录入数据
4. 必填字段不能为空
5. 支持.xls和.xlsx格式文件`;

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response: any = await downloadTemplate({
      ...queryParams,
      excludeFields: [
        'zjsjwyxbs',  // 唯一编码
        'xxdm',       // 学校代码
        'reportStatus', // 状态
        'enableStatus', // 状态
        'sjcjsj',    // 采集时间
        'createTime', // 创建时间
        'updateTime'  // 修改时间
      ]
    });
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `课证融通关联关系数据_导入模板_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    ElMessage.error("模板下载失败");
  }
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
      excelParseResult.value = response.data.data;
      
      // 初始化字段映射（智能匹配）
      initializeFieldMapping();
      
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
  if (!excelParseResult.value) return;
  
  const mapping: FieldMapping = {};
  const headers = excelParseResult.value.headers;
  
  // 尝试智能匹配字段名
  headers.forEach((header, index) => {
    const columnName = header.columnName.toLowerCase().trim();
    
    // 根据表头名称智能匹配系统字段
    const matchedField = findMatchingSystemField(columnName);
    if (matchedField) {
      mapping[index.toString()] = matchedField;
    }
  });
  
  fieldMapping.value = mapping;
  
  // 注意：学校代码由后端自动生成，不需要在未映射字段中设置默认值
  console.log('字段映射初始化完成，学校代码将由后端自动设置:', systemSchoolCode.value);
};

// 查找匹配的系统字段（智能匹配）
const findMatchingSystemField = (columnName: string): string | null => {
  const normalizedColumnName = columnName.replace(/[\s\-_]/g, '').toLowerCase();
  
  // 定义匹配规则 - 只包含需要在Excel中导入的字段
  const matchRules: { [key: string]: string[] } = {
    'kcmc': ['课程名称', 'kcmc', 'coursename', '课程名'],
    'kch': ['课程号', 'kch', 'coursecode', '课程编号'],
    'zsh': ['证书号', 'zsh', 'certificateno', '证书编号'],
    'zsmc': ['证书名称', 'zsmc', 'certificatename', '证书名'],
    // 注意：以下字段由后端自动生成，不需要智能匹配
    // 'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    // 'sjcjsj': ['数据采集时间', 'sjcjsj', '采集时间', '时间']
  };
  
  // 先进行精确匹配
  for (const [fieldName, patterns] of Object.entries(matchRules)) {
    for (const pattern of patterns) {
      if (columnName === pattern) {
        return fieldName;
      }
    }
  }
  
  // 再进行模糊匹配
  for (const [fieldName, patterns] of Object.entries(matchRules)) {
    for (const pattern of patterns) {
      const normalizedPattern = pattern.replace(/[\s\-_]/g, '').toLowerCase();
      if (normalizedColumnName.includes(normalizedPattern) || normalizedPattern.includes(normalizedColumnName)) {
        return fieldName;
      }
    }
  }
  
  return null;
};

// 执行字段映射导入
const executeImportWithMapping = async () => {
  if (!currentExcelFile.value || !excelParseResult.value) {
    ElMessage.error("请先选择文件");
    return;
  }
  
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
  importDetailInfo.value = `文件: ${currentExcelFile.value.name}`;
  
  try {
    importProcessing.value = true;
    
    // 确保所有必填字段都有值（通过映射或默认值）
    const requiredFieldsDefaults = ensureRequiredFieldsValues();
    
    const config: ImportConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: {
        ...unmappedFieldsForm.value,
        ...requiredFieldsDefaults,
        // 注意：学校代码、唯一标识、采集时间等由后端自动生成，不需要设置默认值
      },
      startRow: 2,
      autoGenerateId: true
    };
    
    console.log("开始导入数据，配置:", config);
    
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
      response = (await importKzrtglgxsjDataWithMapping(currentExcelFile.value, config)) as any;
      clearInterval(progressTimer);
      console.log('API响应:', response);
    } catch (requestError) {
      clearInterval(progressTimer);
      throw requestError;
    }
    
    if (response && response.data && response.data.code === 200) {
      // 导入成功
      importProgress.value = 100;
      importStatus.value = 'success';
      importStatusText.value = '数据导入成功！';
      importDetailInfo.value = `成功导入 ${excelParseResult.value?.totalRows || 0} 条数据`;
      
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

// 确保所有必填字段都有值
const ensureRequiredFieldsValues = () => {
  const mappedFields = Object.values(fieldMapping.value);
  const defaults: Record<string, string> = {};
  
  // 注意：后端自动生成的字段不需要设置默认值
  // 这些字段包括：zjsjwyxbs(唯一标识)、xxdm(学校代码)、sjcjsj(采集时间)、reportStatus、enableStatus
  // 当前课证融通关联关系数据的必填字段都来自Excel导入，不需要额外的默认值
  
  console.log('当前映射字段:', mappedFields);
  console.log('无需设置默认值，所有必填字段都应该通过Excel映射');
  
  return defaults;
};

// 取消字段映射
const cancelFieldMapping = () => {
  fieldMappingDialogVisible.value = false;
  currentExcelFile.value = null;
  excelParseResult.value = null;
  fieldMapping.value = {};
  unmappedFieldsForm.value = {};
};

// 获取列数据预览
const getColumnPreview = (columnIndex: number) => {
  if (!excelParseResult.value?.dataPreview) return [];
  return excelParseResult.value.dataPreview.map(row => row[columnIndex]).slice(0, 3);
};

// 字段映射变更事件
const onFieldMappingChange = () => {
  // 触发响应式更新
  fieldMapping.value = { ...fieldMapping.value };
};

// 检查字段是否已被映射
const isFieldAlreadyMapped = (fieldName: string, currentColumnIndex: number) => {
  const mappedEntries = Object.entries(fieldMapping.value);
  return mappedEntries.some(([columnIndex, mappedField]) => 
    mappedField === fieldName && parseInt(columnIndex) !== currentColumnIndex
  );
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

// 获取已映射字段数量
const getMappedFieldsCount = () => {
  return Object.values(fieldMapping.value).filter(field => field).length;
};

// 获取必填字段数量
const getRequiredFieldsCount = () => {
  return systemFields.value.filter(field => field.required).length;
};

// 获取未映射的必填字段数量
const getUnsetRequiredFieldsCount = () => {
  const mappedFields = Object.values(fieldMapping.value);
  return systemFields.value.filter(field => 
    field.required && 
    !mappedFields.includes(field.field) && 
    !unmappedFieldsForm.value[field.field]
  ).length;
};

// 获取必填字段列表
const getRequiredFields = () => {
  return systemFields.value.filter(field => field.required);
};

// 添加获取字段映射状态的方法
const getFieldMappingStatus = (fieldName: string) => {
  const mappedFields = Object.values(fieldMapping.value);
  const hasMapping = mappedFields.includes(fieldName);
  const hasDefaultValue = unmappedFieldsForm.value[fieldName] !== undefined;
  return {
    isMapped: hasMapping,
    hasDefault: hasDefaultValue,
    isSet: hasMapping || hasDefaultValue
  };
};

// 获取未映射的字段
const getUnmappedFields = () => {
  const mappedFields = Object.values(fieldMapping.value);
  
  // 注意：由于系统字段列表中已经移除了后端自动生成的字段，
  // 这里只需要过滤出未映射的字段即可
  return systemFields.value.filter(field => {
    return !mappedFields.includes(field.field);
  });
};

// 获取字段对应的选项
const getFieldOptions = (fieldName: string) => {
  // 注意：由于系统字段列表中已经移除了后端自动生成的字段，
  // 这里不再需要为reportStatus和enableStatus提供选项
  return [];
};

// 获取字段示例
const getFieldExample = (fieldName: string) => {
  // 定义字段示例数据 - 只包含当前系统字段中的字段
  const fieldExamples: Record<string, string> = {
    'kcmc': '高等数学',
    'kch': 'MATH101',
    'zsh': 'CERT001',
    'zsmc': '数字技能认证证书',
  };
  
  return fieldExamples[fieldName] || '';
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

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (page: number) => {
  queryParams.pageNum = page;
  getList();
};

const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "", // 新增时为空，由后端自动生成
    xxdm: "",
    kcmc: "",
    kch: "",
    zsh: "",
    zsmc: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  // 清空课程选项
  courseOptions.value = [];
  // 清空证书选项
  certificateOptions.value = [];
  formRef.value?.clearValidate();
};

// 时间格式化方法 - 修改为原样输出，不进行格式化
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "-";
  // 直接返回原始时间字符串，不进行任何格式化
  return timeStr;
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

// 获取系统学校代码
const getSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response.data as any;
    if (result?.code === 200 && result?.data) {
      systemSchoolCode.value = result.data;
      form.xxdm = result.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn("获取系统学校代码失败:", result?.message || "未知错误");
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error: any) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 搜索课程信息
const searchCoursesMethod = async (keyword: string) => {
  if (!keyword || keyword.trim() === "") {
    courseOptions.value = [];
    return;
  }

  courseSearchLoading.value = true;
  try {
    const response = await searchCourses(keyword.trim(), 20);
    courseOptions.value = (response as any)?.data?.data || [];
  } catch (error) {
    console.error("搜索课程信息失败:", error);
    ElMessage.error("搜索课程信息失败");
    courseOptions.value = [];
  } finally {
    courseSearchLoading.value = false;
  }
};

// 处理课程名称选择
const handleCourseNameChange = (kcmc: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kcmc === kcmc,
  );
  if (selectedCourse) {
    form.kch = selectedCourse.kch;
    form.kcmc = selectedCourse.kcmc;
  }
};

// 处理课程号选择
const handleCourseCodeChange = (kch: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kch === kch,
  );
  if (selectedCourse) {
    form.kch = selectedCourse.kch;
    form.kcmc = selectedCourse.kcmc;
  }
};

// 加载证书选项数据
const loadCertificateOptions = async () => {
  // 如果已经加载过数据，则不重复加载
  if (certificateOptions.value.length > 0) {
    return;
  }

  certificateSearchLoading.value = true;
  try {
    // 加载所有证书数据（不传关键词，使用后端默认的200条限制）
    const response = await searchCertificates();
    certificateOptions.value = (response as any)?.data?.data || [];
  } catch (error) {
    console.error("加载证书信息失败:", error);
    ElMessage.error("加载证书信息失败");
    certificateOptions.value = [];
  } finally {
    certificateSearchLoading.value = false;
  }
};

// 处理证书名称选择
const handleCertificateNameChange = (zsmc: string) => {
  const selectedCertificate = certificateOptions.value.find(
    (certificate) => certificate.zsmc === zsmc,
  );
  if (selectedCertificate) {
    form.zsh = selectedCertificate.zsh;
    form.zsmc = selectedCertificate.zsmc;
  }
};

// 处理证书号选择
const handleCertificateNumberChange = (zsh: string) => {
  const selectedCertificate = certificateOptions.value.find(
    (certificate) => certificate.zsh === zsh,
  );
  if (selectedCertificate) {
    form.zsh = selectedCertificate.zsh;
    form.zsmc = selectedCertificate.zsmc;
  }
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

const getReportStatusTagType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  const typeMap: Record<string, "success" | "info" | "warning" | "danger"> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

const getEnableStatusText = (status: string) => {
  return status === "1" ? "启用" : "禁用";
};

const getEnableStatusTagType = (status: string): "success" | "danger" => {
  return status === "1" ? "success" : "danger";
};

// 显示提示框
const showTooltip = (event: MouseEvent, content: string) => {
  if (!tooltipDiv.value) {
    tooltipDiv.value = document.createElement("div");
    tooltipDiv.value.style.position = "fixed";
    tooltipDiv.value.style.padding = "8px 12px";
    tooltipDiv.value.style.backgroundColor = "#fff";
    tooltipDiv.value.style.border = "1px solid #e4e7ed";
    tooltipDiv.value.style.borderRadius = "4px";
    tooltipDiv.value.style.fontSize = "12px";
    tooltipDiv.value.style.color = "#606266";
    tooltipDiv.value.style.zIndex = "9999";
    tooltipDiv.value.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,.1)";
    document.body.appendChild(tooltipDiv.value);
  }

  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  if (tooltipDiv.value) {
    tooltipDiv.value.textContent = content;
    tooltipDiv.value.style.left = rect.left + "px";
    tooltipDiv.value.style.top = rect.top - 30 + "px";
    tooltipDiv.value.style.display = "block";
  }
};

// 隐藏提示框
const hideTooltip = () => {
  if (tooltipDiv.value) {
    tooltipDiv.value.style.display = "none";
  }
};

// 加载系统字段定义
const loadSystemFields = () => {
  systemFields.value = getSystemFields();
};

// 组件挂载
onMounted(() => {
  loadSystemFields(); // 加载系统字段
  getList();
  getSchoolCode();
});

// 组件卸载时清理
onUnmounted(() => {
  if (tooltipDiv.value && document.body.contains(tooltipDiv.value)) {
    document.body.removeChild(tooltipDiv.value);
  }
});
</script>

<style scoped lang="scss">
.course-certificate-management {
  padding: 0px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .search-card {
    margin-bottom: 10px;
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

  .course-certificate-dialog {
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
.course-certificate-form {
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
.course-certificate-detail {
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
  .course-certificate-management {
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
  .course-certificate-management {
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
  .course-certificate-management {
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

