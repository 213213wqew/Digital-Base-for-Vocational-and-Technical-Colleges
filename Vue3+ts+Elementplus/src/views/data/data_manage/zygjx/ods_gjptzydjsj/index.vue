<template>
  <div class="national-platform-resource-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="资源编号" prop="zybh">
            <el-input v-model="queryParams.zybh" placeholder="请输入资源编号" clearable @keyup.enter="handleQuery"
              style="width: 140px" />
          </el-form-item>
          <el-form-item label="资源名称" prop="zymc">
            <el-input v-model="queryParams.zymc" placeholder="请输入资源名称" clearable @keyup.enter="handleQuery"
              style="width: 140px" />
          </el-form-item>
          <el-form-item label="资源级别" prop="zyjbm">
            <el-select v-model="queryParams.zyjbm" placeholder="请选择资源级别" clearable style="width: 140px">
              <el-option v-for="item in resourceLevelOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="资源类型" prop="gjzhjxptzylxm">
            <el-select v-model="queryParams.gjzhjxptzylxm" placeholder="请选择资源类型" clearable style="width: 140px">
              <el-option v-for="item in resourceTypeOptions" :key="item.value" :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="采集时间范围" prop="sjcjsjRange">
            <el-date-picker
              v-model="sjcjsjRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="YYYYMMDD HHmmss"
              format="YYYY-MM-DD HH:mm:ss"
              style="width: 320px"
              @change="handleSjcjsjRangeChange"
            />
          </el-form-item>
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select v-model="queryParams.reportStatus" placeholder="请选择上报状态" clearable style="width: 140px">
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleQuery">
              <el-icon>
                <Search />
              </el-icon>搜索
            </el-button>
            <el-button @click="resetQuery">
              <el-icon>
                <Refresh />
              </el-icon>重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 表格区域 -->
    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <div class="left-buttons">
          <el-button type="primary" @click="handleAdd">
            新增
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            导出Excel
          </el-button>
        </div>
        <div class="center-title">
          <span>国家平台资源对接数据清洗</span>
        </div>
        <div class="right-buttons">
          <!-- <el-button @click="handleImport">
            导入
          </el-button> -->
          <el-tooltip content="刷新" placement="top">
            <el-button circle @click="getList">
              <el-icon>
                <Refresh />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </div>

      <div class="table-body">
        <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange"
          @sort-change="handleSortChange" border style="width: 100%" highlight-current-row @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick" :height="'calc(75vh - 150px)'" stripe size="default"
          :row-style="{ height: '42px' }" :cell-style="{ padding: '2px' }">
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="zjsjwyxbs" label="唯一性标识" min-width="160" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="xxdm" label="学校代码" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zybh" label="资源编号" min-width="150" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zymc" label="资源名称" min-width="200" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="zyjbmText" label="资源级别" min-width="120" show-overflow-tooltip sortable="custom" />
          <el-table-column prop="gjzhjxptzylxmText" label="资源类型" min-width="150" show-overflow-tooltip
            sortable="custom" />

          <el-table-column prop="zyfwlj" label="资源访问链接" min-width="200" show-overflow-tooltip>
            <template #default="scope">
              <el-link v-if="scope.row.zyfwlj" :href="scope.row.zyfwlj" target="_blank" type="primary">
                {{ scope.row.zyfwlj }}
              </el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="djrqDisplay" label="对接日期" min-width="120" align="center" sortable="custom" />
          <el-table-column prop="sjcjsjDisplay" label="采集时间" min-width="160" align="center" sortable="custom" />
          <el-table-column prop="updateTime" label="更新时间" min-width="160" align="center" sortable="custom">
            <template #default="{ row }">
              {{ formatDateTime(row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getReportStatusTagType(row.reportStatus)" size="small">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="row.enableStatus === '1' ? 'success' : 'danger'" size="small">
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-button link type="primary" size="small" @click="handleView(row)">
                  <el-icon>
                    <View />
                  </el-icon>查看
                </el-button>
                <el-button link type="primary" size="small" @click="handleEdit(row)">
                  <el-icon>
                    <Edit />
                  </el-icon>编辑
                </el-button>
                <el-button link type="danger" size="small" @click="handleDelete(row)">
                  <el-icon>
                    <Delete />
                  </el-icon>删除
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
          <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
            :page-sizes="[100, 200, 500, 1000]" layout="sizes, prev, pager, next, jumper" :total="total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
        </div>
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add'
      ? '新增国家平台资源对接数据'
      : '编辑国家平台资源对接数据'
      " width="800px" :close-on-click-modal="false" append-to-body style="height: 630px" class="resource-dialog"
      destroy-on-close>
      <div class="resource-form">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px"
          class="form-container dialog-form" inline-message>
          <!-- 基本信息 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <!-- <el-col :span="12"> -->
              <!-- <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="formData.zjsjwyxbs"
                    placeholder="可选填写，不填由系统自动生成"
                    maxlength="32"
                    show-word-limit
                    style="text-transform: uppercase"
                  />
                </el-form-item>
              </el-col> -->
              <el-col :span="24">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input v-model="formData.xxdm" placeholder="系统自动获取学校代码" maxlength="10" readonly disabled />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="资源编号" prop="zybh">
                  <div class="input-with-icon">
                    <el-select v-model="formData.zybh" placeholder="请选择或搜索资源编号" filterable remote clearable
                      :remote-method="handleResourceNumberSearch" :loading="resourceSearchLoading" style="width: 100%"
                      @change="handleResourceNumberChange" @focus="handleResourceNumberFocus">
                      <el-option v-for="item in resourceOptions" :key="item.ZYBH" :label="item.ZYBH+'-'+item.ZYMC"  
                        :value="item.ZYBH" />
                    </el-select>
                    <el-tooltip content="数据来源：数字资源基本数据子类表" placement="top" effect="dark">
                      <el-icon class="info-icon-after">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="资源名称" prop="zymc">
                  <div class="input-with-icon">
                    <el-select v-model="formData.zymc" placeholder="请选择或搜索资源名称" filterable remote clearable
                      :remote-method="handleResourceNameSearch" :loading="resourceSearchLoading" style="width: 100%"
                      @change="handleResourceNameChange" @focus="handleResourceNameFocus">
                      <el-option v-for="item in resourceOptions" :key="item.ZYMC" :label="item.ZYMC"
                        :value="item.ZYMC" />
                    </el-select>
                    <el-tooltip content="数据来源：数字资源基本数据子类表" placement="top" effect="dark">
                      <el-icon class="info-icon-after">
                        <InfoFilled />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="资源级别" prop="zyjbm">
                  <el-select v-model="formData.zyjbm" placeholder="请选择资源级别" filterable clearable style="width: 100%">
                    <el-option v-for="item in resourceLevelOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="资源类型" prop="gjzhjxptzylxm">
                  <el-select v-model="formData.gjzhjxptzylxm" placeholder="请选择资源类型" filterable clearable
                    style="width: 100%">
                    <el-option v-for="item in resourceTypeOptions" :key="item.value" :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 详细信息 -->
          <div class="form-section">
            <div class="section-title">详细信息</div>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="资源访问链接" prop="zyfwlj">
                  <el-input v-model="formData.zyfwlj" type="textarea" :rows="3" placeholder="请输入资源访问链接" maxlength="300"
                    show-word-limit />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="对接日期" prop="djrq">
                  <el-date-picker v-model="formData.djrq" type="date" placeholder="请选择对接日期" value-format="YYYYMMDD"
                    format="YYYY-MM-DD" style="width: 100%" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker v-model="formData.sjcjsj" type="datetime" placeholder="请选择数据采集时间"
                    value-format="YYYYMMDD HHmmss" format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select v-model="formData.reportStatus" placeholder="请选择上报状态" style="width: 100%" clearable>
                    <el-option label="未上报" value="0" />
                    <el-option label="已上报" value="1" />
                    <el-option label="上报失败" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="启用状态" prop="enableStatus">
                  <el-select v-model="formData.enableStatus" placeholder="请选择启用状态" style="width: 100%" clearable>
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
          <el-button @click="handleFormClose">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleFormSubmit">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="国家平台资源对接数据详情" width="900px" :close-on-click-modal="false"
      append-to-body class="detail-dialog" destroy-on-close>
      <div v-if="currentRecord" class="resource-detail">
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="主键数据唯一性标识">
            <span class="detail-value">{{
              currentRecord.zjsjwyxbs || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ currentRecord.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源编号">
            <span class="detail-value">{{ currentRecord.zybh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源名称">
            <span class="detail-value">{{ currentRecord.zymc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源级别">
            <span class="detail-value">{{
              currentRecord.zyjbmText || currentRecord.zyjbm || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源类型">
            <span class="detail-value">{{
              currentRecord.gjzhjxptzylxmText ||
              currentRecord.gjzhjxptzylxm ||
              "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="资源访问链接" :span="2">
            <el-link v-if="currentRecord.zyfwlj" :href="currentRecord.zyfwlj" target="_blank" type="primary"
              class="detail-link">
              {{ currentRecord.zyfwlj }}
            </el-link>
            <span v-else class="detail-value">-</span>
          </el-descriptions-item>
          <el-descriptions-item label="对接日期">
            <span class="detail-value">{{
              currentRecord.djrqDisplay || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <span class="detail-value">{{
              currentRecord.sjcjsjDisplay || "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag :type="getReportStatusTagType(currentRecord.reportStatus)" size="small">
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'" size="small">
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <span class="detail-value">{{
              formatDateTime(currentRecord.createTime)
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <span class="detail-value">{{
              formatDateTime(currentRecord.updateTime)
            }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog title="导入国家平台资源对接数据" v-model="importDialogVisible" width="400px" :close-on-click-modal="false">
      <div class="import-template">
        <el-button type="primary" link @click="handleDownloadTemplate">
          <el-icon>
            <Download />
          </el-icon>下载导入模板
        </el-button>
      </div>
      <el-upload ref="uploadRef" :http-request="customHttpRequest" :before-upload="beforeUpload" :limit="1"
        :auto-upload="true" drag accept=".xls,.xlsx">
        <el-icon class="el-icon--upload">
          <UploadFilled />
        </el-icon>
        <div class="el-upload__text">
          将Excel文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            请上传.xls或.xlsx格式的文件，文件大小不能超过10MB
            <el-tooltip effect="dark" placement="top" :content="importTipContent">
              <el-icon class="import-tip-icon">
                <Warning />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
      </el-upload>
    </el-dialog>

    <!-- 字段映射对话框 -->
    <el-dialog title="Excel字段映射配置" v-model="fieldMappingDialogVisible" width="1200px" :close-on-click-modal="false"
      append-to-body>
      <div class="field-mapping-container">
        <!-- 文件信息 -->
        <div class="file-info-section">
          <el-alert :title="`文件名: ${currentExcelFile?.name || ''}`" type="info" :closable="false" show-icon>
            <template #default>
              <div class="file-stats">
                <span>表头数量:<span style="color: #5b85f8;"> {{ excelParseResult?.headers?.length || 0 }}</span></span>
                <span style="margin-left: 20px;">数据行数:<span style="color: #5b85f8;"> {{ excelParseResult?.totalRows || 0
                    }}</span></span>
              </div>
            </template>
          </el-alert>
        </div>

        <!-- 主要内容区域 - 使用左右布局 -->
        <el-row :gutter="20" class="main-content">
          <!-- 左侧说明区域 -->
          <el-col :span="8" class="left-panel">
            <!-- 导入模式选择 -->
            <div class="import-mode-section">
              <h4 style="color: #f56c6c;">导入模式选择:</h4>
              <el-radio-group v-model="importMode" class="import-mode-group">
                <el-radio value="insert" label="insert" size="large">
                  <span class="radio-label">仅新增</span>
                  <div class="radio-desc">如果资源编号已存在，则跳过该条数据</div>
                </el-radio>
                <el-radio value="upsert" label="upsert" size="large">
                  <span class="radio-label">更新或新增</span>
                  <div class="radio-desc">如果资源编号已存在，则更新数据；否则新增</div>
                </el-radio>
              </el-radio-group>
            </div>

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
                <el-table :data="getRequiredFields()" border style="width: 100%;" size="small" max-height="280"
                  :show-header="true">
                  <el-table-column label="序号" width="55" type="index" align="center" />
                  <el-table-column prop="label" label="字段名称" min-width="120" show-overflow-tooltip />
                  <el-table-column label="状态" align="center" width="65">
                    <template #default="{ row }">
                      <el-tag :type="getFieldMappingStatus(row.field).isSet ? 'success' : 'danger'" size="small">
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
              <el-table :data="excelParseResult?.headers || []" border style="width: 100%" max-height="500px">
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
                      <div v-for="(preview, index) in getColumnPreview(row.columnIndex)" :key="index"
                        class="preview-item">
                        {{ preview || '-' }}
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="映射到系统字段" min-width="280">
                  <template #default="{ row }">
                    <el-select v-model="fieldMapping[row.columnIndex]" placeholder="请选择系统字段" clearable
                      style="width: 100%" @change="onFieldMappingChange">
                      <el-option v-for="field in systemFields" :key="field.field"
                        :label="`${field.label} ${field.required ? '*' : ''}`" :value="field.field"
                        :disabled="isFieldAlreadyMapped(field.field, row.columnIndex)">
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
                <el-form-item v-for="field in getUnmappedFields()" :key="field.field"
                  :label="field.label + (field.required ? ' *' : '')" :prop="field.field"
                  :rules="field.required ? [{ required: true, message: '请输入默认值', trigger: 'blur' }] : []">
                  <!-- 根据字段类型显示不同的输入控件 -->
                  <template v-if="field.type === 'select'">
                    <el-select v-model="unmappedFieldsForm[field.field]" :placeholder="'请选择' + field.label"
                      style="width: 100%">
                      <el-option v-for="option in getFieldOptions(field.field)" :key="option.value"
                        :label="option.label" :value="option.value" />
                    </el-select>
                  </template>
                  <template v-else-if="field.type === 'number'">
                    <el-input-number v-model="unmappedFieldsForm[field.field]" :placeholder="'请输入' + field.label"
                      :min="0" style="width: 100%" />
                  </template>
                  <template v-else>
                    <el-input v-model="unmappedFieldsForm[field.field]" :placeholder="'请输入' + field.label" />
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
          <el-button type="primary" :loading="importProcessing" :disabled="getUnsetRequiredFieldsCount() > 0"
            @click="executeImportWithMapping">
            {{ importProcessing ? '导入中...' : '确认导入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入进度弹窗 -->
    <ProgressDialog v-model="importProgressVisible" :title="importProgressTitle" :percentage="importProgress"
      :status="importStatus" :status-text="importStatusText" :detail-info="importDetailInfo"
      @close="handleProgressClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
  InfoFilled,
  Upload,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";
import ProgressDialog from "@/components/ProgressDialog/index.vue";
import {
  getOdsGjptzydjsjPage,
  getOdsGjptzydjsjById,
  addOdsGjptzydjsj,
  updateOdsGjptzydjsj,
  deleteOdsGjptzydjsj,
  batchDeleteOdsGjptzydjsj,
  exportOdsGjptzydjsj,
  importOdsGjptzydjsj,
  getResourceLevelOptions,
  getResourceTypeOptions,
  getSystemSchoolCode,
  getResourceOptions,
  parseExcelHeaders,
  importOdsGjptzydjsjWithMapping,
  getSystemFields,
  downloadTemplate,
  type OdsGjptzydjsjQuery,
  type OdsGjptzydjsjForm,
  type OdsGjptzydjsjInfo,
  type DictOption,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
} from "@/api-data/data/data_base/zygjx/ods_gjptzydjsj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsGjptzydjsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const uploadRef = ref();
const formRef = ref<FormInstance>();
const queryForm = ref<FormInstance>();
const submitLoading = ref(false);
const dialogType = ref<"add" | "edit">("add");
const viewDialogVisible = ref(false);

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 导入相关状态
const fieldMappingDialogVisible = ref(false);
const currentExcelFile = ref<File | null>(null);
const excelParseResult = ref<ExcelParseResult | null>(null);
const fieldMapping = ref<FieldMapping>({});
const systemFields = ref<SystemField[]>([]);
const importProcessing = ref(false);
const importMode = ref<"insert" | "upsert">("upsert"); // 默认为更新或新增模式

// 进度条相关状态
const importProgressVisible = ref(false);
const importProgressTitle = ref('数据导入');
const importProgress = ref(0);
const importStatus = ref<'loading' | 'success' | 'error'>('loading');
const importStatusText = ref('准备导入...');
const importDetailInfo = ref('');

// 未映射字段的默认值表单
const unmappedFieldsForm = ref<Record<string, any>>({});

// 查询参数
const queryParams = reactive<OdsGjptzydjsjQuery>({
  pageNum: 1,
  pageSize: 10,
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  zyjbm: "",
  gjzhjxptzylxm: "",
  djrqStart: "",
  djrqEnd: "",
  sjcjsjStart: "",
  sjcjsjEnd: "",
  reportStatus: "",
  enableStatus: "",
  sortField: "",
  sortOrder: "",
});

// 表单数据
const formData = reactive<OdsGjptzydjsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  zybh: "",
  zymc: "",
  zyjbm: "",
  gjzhjxptzylxm: "",
  zyfwlj: "",
  djrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 当前查看记录
const currentRecord = ref<OdsGjptzydjsjInfo | null>(null);

// 字典选项
const resourceLevelOptions = ref<Array<{ label: string; value: string }>>([]);
const resourceTypeOptions = ref<Array<{ label: string; value: string }>>([]);

// 资源选项（从数字资源基本数据表获取）

const resourceOptions = ref<
  Array<{ value: string; label: string; ZYBH: string; ZYMC: string }>
>([]);

// 资源搜索加载状态
const resourceSearchLoading = ref(false);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]{32}$/,
      message: "如果填写，请输入32位大写字母+数字组合",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { len: 10, message: "学校代码必须是10位数字码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码只能是数字", trigger: "blur" },
  ],
  zybh: [
    { required: true, message: "请输入资源编号", trigger: "blur" },
    { max: 50, message: "长度不能超过50个字符", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "请输入资源名称", trigger: "blur" },
    { max: 100, message: "长度不能超过100个字符", trigger: "blur" },
  ],
  zyjbm: [
    { required: true, message: "请输入资源级别码", trigger: "blur" },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
  ],
  gjzhjxptzylxm: [
    {
      required: true,
      message: "请输入国家智慧教学平台资源类型码",
      trigger: "blur",
    },
    { max: 20, message: "长度不能超过20个字符", trigger: "blur" },
  ],
  zyfwlj: [
    { required: true, message: "请输入资源服务链接", trigger: "blur" },
    { max: 200, message: "长度不能超过200个字符", trigger: "blur" },
  ],
  djrq: [{ required: true, message: "请选择对接日期", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 获取下拉选项数据
const loadOptions = async () => {
  try {
    const [levelRes, typeRes, schoolRes] = await Promise.all([
      getResourceLevelOptions() as any,
      getResourceTypeOptions() as any,
      getSystemSchoolCode() as any,
    ]);
    resourceLevelOptions.value = levelRes.data.data;
    resourceTypeOptions.value = typeRes.data.data;
    systemSchoolCode.value = schoolRes.data.data;
  } catch (error: any) {
    ElMessage.error(error.message || "获取选项数据失败");
  }
};

// 获取资源选项
const loadResourceOptions = async (query = "") => {
  try {
    const res = await getResourceOptions(query) as any;
    resourceOptions.value = res.data.data;
    console.log("22222222222222222");
    
    console.log(resourceOptions.value);
    
  } catch (error: any) {
    ElMessage.error(error.message || "获取资源选项失败");
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsGjptzydjsjPage(queryParams);
    // 正确处理API响应格式
    const responseData = (response as any)?.data?.data || {};
    dataList.value = responseData.records || [];
    total.value = responseData.total || 0;
  } catch (error) {
    ElMessage.error("获取数据失败");
  } finally {
    loading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(formData, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
    zybh: "",
    zymc: "",
    zyjbm: "",
    gjzhjxptzylxm: "",
    zyfwlj: "",
    djrq: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.resetFields();
};

// 搜索
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 采集时间范围变化处理
const handleSjcjsjRangeChange = (value: [string, string] | undefined) => {
  if (value && value.length === 2) {
    queryParams.sjcjsjStart = value[0];
    queryParams.sjcjsjEnd = value[1];
  } else {
    queryParams.sjcjsjStart = "";
    queryParams.sjcjsjEnd = "";
  }
  queryParams.pageNum = 1; // 重置到第一页
  getList();
};

// 重置搜索
const resetQuery = () => {
  queryForm.value?.resetFields();
  sjcjsjRange.value = undefined;
  queryParams.pageNum = 1;
  getList();
};

// 新增
const handleAdd = () => {
  dialogType.value = "add";
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    formData.xxdm = systemSchoolCode.value;
  }
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsGjptzydjsjInfo) => {
  dialogType.value = "edit";
  resetForm();
  try {
    const response = await getOdsGjptzydjsjById(row.id);
    // 正确处理API响应格式
    const data = (response as any)?.data?.data || {};
    Object.assign(formData, data);
    // 加载相关的资源选项以确保下拉框能正确显示当前选中的值
    if (data.zybh || data.zymc) {
      await loadResourceOptions(data.zybh || data.zymc);
    }
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsGjptzydjsjInfo) => {
  try {
    const response = await getOdsGjptzydjsjById(row.id);
    // 正确处理API响应格式
    const data = (response as any)?.data?.data || {};
    currentRecord.value = data;
    viewDialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsGjptzydjsjInfo) => {
  try {
    await ElMessageBox.confirm("确认删除该数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    // 调用删除接口
    await deleteOdsGjptzydjsj(row.id);
    ElMessage.success("删除成功");
    await getList();
  } catch (error) {
    if (error !== "cancel") {
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确认删除选中的 ${selectedIds.value.length} 条数据吗？`,
    "提示",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      await batchDeleteOdsGjptzydjsj(selectedIds.value);
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } catch (error) {
      ElMessage.error("批量删除失败");
    }
  });
};

// 导出
const handleExport = () => {
  ElMessageBox.confirm("确认导出国家平台资源对接数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(async () => {
    try {
      const response = await exportOdsGjptzydjsj(queryParams);
      // 处理Blob响应
      let blob: Blob;
      if (response instanceof Blob) {
        blob = response;
      } else if (response.data instanceof Blob) {
        blob = response.data;
      } else {
        blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      }

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `国家平台资源对接数据_${new Date().getTime()}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(link.href);
      ElMessage.success("导出成功");
    } catch (error) {
      ElMessage.error("导出失败");
    }
  });
};

// 导入
const handleImport = () => {
  importDialogVisible.value = true;
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

// 表单提交
const handleFormSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        // 准备提交数据，确保日期格式正确
        const submitData = { ...formData };

        // 确保对接日期格式：YYYYMMDD
        if (submitData.djrq && submitData.djrq.length !== 8) {
          // 如果不是8位格式，可能需要转换
          const date = new Date(submitData.djrq);
          if (!isNaN(date.getTime())) {
            submitData.djrq =
              date.getFullYear() +
              String(date.getMonth() + 1).padStart(2, "0") +
              String(date.getDate()).padStart(2, "0");
          }
        }

        // 确保数据采集时间格式：YYYYMMDD hhmmss （15位）
        if (submitData.sjcjsj && submitData.sjcjsj.length !== 15) {
          // 如果不是15位格式，可能需要转换
          const datetime = new Date(submitData.sjcjsj);
          if (!isNaN(datetime.getTime())) {
            submitData.sjcjsj =
              datetime.getFullYear() +
              String(datetime.getMonth() + 1).padStart(2, "0") +
              String(datetime.getDate()).padStart(2, "0") +
              " " +
              String(datetime.getHours()).padStart(2, "0") +
              String(datetime.getMinutes()).padStart(2, "0") +
              String(datetime.getSeconds()).padStart(2, "0");
          }
        }

        if (dialogType.value === "add") {
          await addOdsGjptzydjsj(submitData);
          ElMessage.success("新增成功");
        } else {
          await updateOdsGjptzydjsj(submitData);
          ElMessage.success("修改成功");
        }
        dialogVisible.value = false;
        getList();
      } catch (error) {
        ElMessage.error(dialogType.value === "add" ? "新增失败" : "修改失败");
      } finally {
        submitLoading.value = false;
      }
    }
  });
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

// 选择改变
const handleSelectionChange = (selection: OdsGjptzydjsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
};

// 排序变化处理
const handleSortChange = ({ column, prop, order }: any) => {
  console.log("排序变化:", { column, prop, order });
  if (order === null) {
    // 取消排序
    queryParams.sortField = "";
    queryParams.sortOrder = "";
  } else {
    // 设置排序
    queryParams.sortField = prop;
    queryParams.sortOrder = order === "ascending" ? "asc" : "desc";
  }
  // 重置到第一页并重新查询
  queryParams.pageNum = 1;
  getList();
};

// 行点击
const handleRowClick = () => {
  // 可以在这里添加行点击逻辑
};

// 行双击
const handleRowDblClick = (row: OdsGjptzydjsjInfo) => {
  handleView(row);
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

// 上报状态标签类型
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

// 上报状态文本
const getReportStatusText = (status: string) => {
  switch (status) {
    case "0":
      return "未上报";
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未知状态";
  }
};

// 格式化日期时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString();
};

// 资源编号搜索方法
const handleResourceNumberSearch = async (query: string) => {
  resourceSearchLoading.value = true;
  await loadResourceOptions(query); // 支持空查询，显示全部
  resourceSearchLoading.value = false;
};

// 资源名称搜索方法
const handleResourceNameSearch = async (query: string) => {
  resourceSearchLoading.value = true;
  await loadResourceOptions(query); // 支持空查询，显示全部
  resourceSearchLoading.value = false;
};

// 资源编号选择改变事件
const handleResourceNumberChange = (value: string) => {
  const selectedOption = resourceOptions.value.find(
    (item) => item.ZYBH === value,
  );
  if (selectedOption) {
    formData.zymc = selectedOption.ZYMC;
  }
};

// 资源名称选择改变事件
const handleResourceNameChange = (value: string) => {
  const selectedOption = resourceOptions.value.find(
    (item) => item.ZYBH === value,
  );
  if (selectedOption) {
    formData.zybh = selectedOption.ZYBH;
  }
};

// 资源编号获得焦点时加载全部选项
const handleResourceNumberFocus = () => {
  if (resourceOptions.value.length === 0) {
    handleResourceNumberSearch("");
  }
};

// 资源名称获得焦点时加载全部选项
const handleResourceNameFocus = () => {
  if (resourceOptions.value.length === 0) {
    handleResourceNameSearch("");
  }
};

// 导入提示内容
const importTipContent = `导入说明：
1. 请先下载导入模板，按模板格式填写数据
2. 模板第一行为字段中文名称，请勿修改
3. 从第二行开始录入数据
4. 必填字段不能为空
5. 支持.xls和.xlsx格式文件
6. 支持根据资源编号更新已有数据`;

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplate({
      excludeFields: [
        'zjsjwyxbs',  // 唯一编码
        'xxdm',       // 学校ID
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
    link.download = `国家平台资源对接数据模板_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    ElMessage.error("模板下载失败");
  }
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

  // 自动设置默认值
  if (systemSchoolCode.value) {
    unmappedFieldsForm.value = {
      ...unmappedFieldsForm.value,
      xxdm: systemSchoolCode.value
    };
  }
};

// 查找匹配的系统字段（智能匹配）
const findMatchingSystemField = (columnName: string): string | null => {
  const normalizedColumnName = columnName.replace(/[\s\-_]/g, '').toLowerCase();

  // 定义匹配规则
  const matchRules: { [key: string]: string[] } = {
    'zybh': ['资源编号', 'zybh', 'resourcenumber', '编号'],
    'zymc': ['资源名称', 'zymc', 'resourcename', '名称'],
    'zyjbm': ['资源级别', 'zyjbm', 'resourcelevel', '级别'],
    'gjzhjxptzylxm': ['资源类型', 'gjzhjxptzylxm', 'resourcetype', '类型'],
    'zyfwlj': ['资源访问链接', 'zyfwlj', 'resourcelink', '链接', '访问链接'],
    'djrq': ['对接日期', 'djrq', 'dockingdate', '日期'],
    'sjcjsj': ['数据采集时间', 'sjcjsj', '采集时间', '时间']
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
  importDetailInfo.value = `文件: ${currentExcelFile.value.name} | 模式: ${importMode.value === 'upsert' ? '更新或新增' : '仅新增'}`;

  try {
    importProcessing.value = true;

    // 确保所有必填字段都有值（通过映射或默认值）
    const requiredFieldsDefaults = ensureRequiredFieldsValues();

    const config: ImportConfig = {
      fieldMapping: fieldMapping.value,
      unmappedFieldsDefaults: {
        ...unmappedFieldsForm.value,
        ...requiredFieldsDefaults,
        xxdm: systemSchoolCode.value // 确保学校代码被包含在默认值中
      },
      startRow: 2,
      autoGenerateId: true,
      updateByResourceNumber: importMode.value === 'upsert' // 根据导入模式决定是否更新
    };

    console.log("开始导入数据，配置:", config);
    console.log("字段映射:", fieldMapping.value);
    console.log("未映射字段默认值:", config.unmappedFieldsDefaults);

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
      response = (await importOdsGjptzydjsjWithMapping(currentExcelFile.value, config)) as any;
      clearInterval(progressTimer);
      console.log('API响应:', response);
    } catch (requestError) {
      clearInterval(progressTimer);
      console.log('API请求错误:', requestError);
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

      console.log('导入失败，错误信息:', errorMsg);
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

  // 定义所有必填字段及其默认值
  const requiredFieldsWithDefaults = [
    { field: 'zyjbm', defaultValue: '1' },
    { field: 'gjzhjxptzylxm', defaultValue: '1' },
  ];

  // 为未映射的必填字段设置默认值
  requiredFieldsWithDefaults.forEach(({ field, defaultValue }) => {
    if (!mappedFields.includes(field) && !unmappedFieldsForm.value[field]) {
      defaults[field] = defaultValue;
      console.log(`为未映射的必填字段 ${field} 设置默认值: ${defaultValue}`);
    }
  });

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

// 获取未设置的必填字段数量
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

// 获取字段映射状态
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
  // 定义不需要在未映射字段中显示的字段
  const excludeFields = [
    'sjcjsj',       // 数据采集时间 - 系统自动生成
    'reportStatus', // 上报状态 - 系统管理字段
    'enableStatus', // 启用状态 - 系统管理字段
  ];

  return systemFields.value.filter(field => {
    // 排除不需要显示的系统字段
    if (excludeFields.includes(field.field)) {
      return false;
    }
    return !mappedFields.includes(field.field);
  });
};

// 获取字段对应的选项
const getFieldOptions = (fieldName: string) => {
  switch (fieldName) {
    case 'zyjbm':
      return resourceLevelOptions.value;
    case 'gjzhjxptzylxm':
      return resourceTypeOptions.value;
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

// 获取字段示例
const getFieldExample = (fieldName: string) => {
  // 定义字段示例数据
  const fieldExamples: Record<string, string> = {
    'zybh': 'ZY20240001',
    'zymc': '高等数学课程资源',
    'zyjbm': '国家级',
    'gjzhjxptzylxm': '课程资源',
    'zyfwlj': 'https://www.example.com/resource',
    'djrq': '20240305',
    'sjcjsj': '20240305 101010',
    'reportStatus': '0',
    'enableStatus': '1'
  };

  const example = fieldExamples[fieldName];
  if (!example) {
    return '';
  }

  // 如果是选择类型的字段，显示对应的标签值
  const field = systemFields.value.find(f => f.field === fieldName);
  if (field && field.type === 'select' && field.options) {
    const option = field.options.find(opt => opt.label === example);
    return option ? option.label : example;
  }

  return example;
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

// 加载系统字段定义
const loadSystemFields = () => {
  const baseFields = getSystemFields();

  // 为选择类型的字段设置实际的选项数据
  systemFields.value = baseFields.map(field => {
    const updatedField = { ...field };

    switch (field.field) {
      case 'zyjbm':
        updatedField.options = resourceLevelOptions.value;
        break;
      case 'gjzhjxptzylxm':
        updatedField.options = resourceTypeOptions.value;
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

// 组件挂载
onMounted(async () => {
  await loadOptions(); // 先加载字典数据
  loadSystemFields(); // 然后加载系统字段
  getList();
});
</script>

<style scoped lang="scss">
.national-platform-resource-management {
  .search-card {
    margin-bottom: 12px;

    :deep(.el-card__body) {
      padding: 15px;
    }
  }

  .search-bar {
    :deep(.el-form) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      row-gap: 6px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }

    :deep(.el-form-item__label) {
      width: 90px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      line-height: 32px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
      height: 32px;
    }

    // 采集时间范围特殊样式
    :deep(.el-form-item[prop="sjcjsjRange"]) {
      .el-form-item__content {
        .el-date-editor {
          width: 280px !important;
          height: 32px;
        }
      }
    }

    :deep(.el-button) {
      font-size: 14px;
      margin-left: 4px;
    }

    // 搜索按钮特殊样式
    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
      
      .el-form-item__content {
        display: flex;
        gap: 4px;
      }
      
      .el-button {
        margin-left: 0;
        padding: 6px 12px;
        font-size: 14px;
        border-radius: 4px;
      }
    }
  }

  .table-card {
    margin-top: 0;

    :deep(.el-card__body) {
      padding: 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      background-color: #f5f7fa;
      padding: 12px 16px;
      border-radius: 0;
    }
  }

  .table-body {
    margin-bottom: 0;

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

  .left-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      font-size: 14px;
      height: 32px;
      padding: 0 15px;
      border-radius: 4px;
    }
  }

  .center-title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .right-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      font-size: 14px;
      height: 32px;
      padding: 0 15px;
      border-radius: 4px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    margin-top: 0;

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

  .resource-dialog {
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

  .detail-dialog {
    :deep(.el-dialog__body) {
      padding: 20px;
      max-height: 70vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
  }
}

/* 弹窗表单错误提示样式 */
:deep(.dialog-form) {
  .el-form-item {
    position: relative;
    margin-bottom: 12px;

    .el-form-item__error {
      position: static;
      transform: none;
      width: auto;
      white-space: normal;
      overflow: visible;
      text-overflow: initial;
      padding: 4px 0 0 0;
      margin: 0;
      line-height: 1.4;
      font-size: 12px;
      color: #f56c6c;
      z-index: 1000;

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
        margin-right: 5px;
        font-weight: bold;
        vertical-align: top;
      }
    }
  }

  .el-col:not(:last-child) {
    padding-right: 20px;
  }
}

/* 表单样式 */
.resource-form {
  .form-container {
    max-height: 480px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    padding-bottom: 5px;
  }

  .form-section {
    margin-bottom: 25px;

    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 15px;

      border-bottom: 1px solid #dcdfe6;
      position: relative;
    }
  }

  :deep(.el-row) {
    margin-bottom: 5px;
  }

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
    color: #606266;
    font-weight: 500;
    line-height: 26px;
  }

  :deep(.el-input__wrapper) {
    font-size: 13px;
    height: 32px;
    border-radius: 3px;
  }

  :deep(.el-select) {
    font-size: 13px;

    .el-input__wrapper {
      height: 32px;
      border-radius: 3px;
    }
  }

  :deep(.el-date-editor) {
    width: 100%;

    .el-input__wrapper {
      height: 32px;
    }
  }

  :deep(.el-textarea__inner) {
    font-size: 13px;
    padding: 5px 11px;
  }
}

/* 详情样式 */
.resource-detail {
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

  .detail-link {
    font-size: 14px;
    word-break: break-all;
  }
}

/* 输入框与图标组合样式 */
.input-with-icon {
  display: flex;
  align-items: center;
  gap: 8px;

  .el-select {
    flex: 1;
  }
}

/* 信息图标样式 */
.info-icon-after {
  color: #409eff;
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: #66b1ff;
  }
}

.import-tip-icon {
  margin-left: 5px;
  font-size: 16px;
  color: #909399;
  cursor: pointer;
}

/* 字段映射对话框样式 */
.field-mapping-container {
  .file-info-section {
    margin-bottom: 20px;

    .file-stats {
      margin-top: 8px;
      font-size: 14px;
      color: #606266;
    }
  }

  .main-content {
    .left-panel {
      .import-mode-section {
        margin-bottom: 20px;
        padding: 16px;
        background-color: #f8f9fa;
        border-radius: 6px;

        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }

        .import-mode-group {
          display: flex;
          flex-direction: column;
          gap: 15px;

          :deep(.el-radio) {
            margin-right: 0;
            margin-bottom: 0;

            .el-radio__label {
              display: flex;
              flex-direction: column;
              align-items: flex-start;

              .radio-label {
                font-weight: 600;
                color: #303133;
                margin-bottom: 4px;
              }

              .radio-desc {
                font-size: 12px;
                color: #909399;
                font-weight: normal;
                line-height: 1.4;
              }
            }
          }
        }
      }

      .mapping-description {
        margin-bottom: 20px;
        padding: 16px;
        background-color: #f8f9fa;
        border-radius: 6px;

        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }

        p {
          margin: 8px 0;
          color: #606266;
          line-height: 1.5;
          font-size: 14px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      .required-fields-status {
        margin-bottom: 20px;

        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }

        .required-fields-table-container {
          margin-bottom: 15px;
          border-radius: 6px;
          overflow: hidden;

          :deep(.el-table) {
            border-radius: 6px;

            .el-table__header-wrapper .el-table__header th {
              background-color: #f5f7fa;
              color: #606266;
              font-weight: 600;
              font-size: 12px;
              padding: 8px 4px;
            }

            .el-table__body-wrapper .el-table__body tr {
              &:hover {
                background-color: #f5f7fa;
              }

              td {
                padding: 6px 4px;
                font-size: 12px;
              }
            }
          }
        }

        .source-mapped {
          color: #67c23a;
          font-size: 11px;
          font-weight: 600;
        }

        .source-default {
          color: #e6a23c;
          font-size: 11px;
          font-weight: 600;
        }
      }

      .mapping-status {
        padding: 12px;
        background-color: #fafbfc;
        border-radius: 6px;
        border: 1px solid #e4e7ed;

        :deep(.el-statistic) {
          text-align: center;

          .el-statistic__head {
            font-size: 11px;
            color: #606266;
            margin-bottom: 4px;
          }

          .el-statistic__content {
            .el-statistic__number {
              font-size: 16px;
              font-weight: 600;
              color: #303133;
            }
          }
        }

        .statistic-item {
          text-align: center;

          &.statistic-success {
            :deep(.el-statistic) {
              .el-statistic__head {
                color: #67c23a;
              }

              .el-statistic__content .el-statistic__number {
                color: #67c23a;
              }
            }
          }

          &.statistic-info {
            :deep(.el-statistic) {
              .el-statistic__head {
                color: #409eff;
              }

              .el-statistic__content .el-statistic__number {
                color: #409eff;
              }
            }
          }

          &.statistic-danger {
            :deep(.el-statistic) {
              .el-statistic__head {
                color: #f56c6c;
              }

              .el-statistic__content .el-statistic__number {
                color: #f56c6c;
              }
            }
          }
        }
      }
    }

    .right-panel {
      .mapping-table-section {
        margin-bottom: 20px;

        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }

        .column-info {
          .column-index {
            font-size: 12px;
            color: #909399;
            margin-top: 4px;
          }
        }

        .data-preview {
          .preview-item {
            padding: 2px 0;
            font-size: 12px;
            color: #666;
            border-bottom: 1px solid #f0f0f0;

            &:last-child {
              border-bottom: none;
            }
          }
        }

        .field-option {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .field-label {
            flex: 1;
          }

          .required-mark {
            color: #f56c6c;
            font-weight: bold;
            margin: 0 8px;
          }

          .field-type {
            color: #909399;
            font-size: 12px;
          }
        }

        .field-example {
          margin-top: 10px;
          padding: 10px;
          background-color: #f8f9fa;
          border-radius: 6px;

          .example-label {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
            margin-bottom: 5px;
          }

          .example-content {
            font-size: 12px;
            color: #606266;
          }
        }
      }

      .unmapped-fields-section {
        margin-top: 20px;
        padding: 16px;
        background-color: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e4e7ed;

        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }

        .section-description {
          margin-bottom: 16px;
          color: #606266;
          font-size: 14px;
        }

        .unmapped-fields-form {
          :deep(.el-form-item) {
            margin-bottom: 15px !important;
          }
        }
      }
    }
  }
}

.warning-text {
  color: #f56c6c;
  font-size: 13px;
}

.import-template {
  margin-bottom: 16px;
  text-align: right;
}
</style>
