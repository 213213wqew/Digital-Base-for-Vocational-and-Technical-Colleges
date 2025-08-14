<template>
  <div class="course-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            <el-input v-model="queryParams.kcmc" placeholder="请输入课程名称" clearable />
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            <el-input v-model="queryParams.kch" placeholder="请输入课程号" clearable />
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
        <div class="operation-buttons">
          <el-button type="primary" @click="handleAdd">
            <el-icon>
              <Plus />
            </el-icon>新增
          </el-button>
          <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            <el-icon>
              <Delete />
            </el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon>
              <Download />
            </el-icon>导出Excel
          </el-button>

          <el-divider direction="vertical" />
        </div>
        <div class="header-title">课程基本数据数据清洗</div>
        <div class="right-buttons">
          <!-- 导入按钮 -->
          <el-tooltip content="导入Excel数据" placement="top">
            <!-- <el-button class="import-button" @click="handleImport">
              <el-icon>
                <Upload />
              </el-icon>导入
            </el-button> -->
          </el-tooltip>
          <!-- 刷新按钮 -->
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
          @sort-change="handleSortChange" border style="width: 100%" highlight-current-row
          :height="'calc(75vh - 140px)'" stripe size="default" :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }">
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column prop="xxdm" show-overflow-tooltip label="学校代码" min-width="120" sortable="custom" />
          <el-table-column prop="kch" show-overflow-tooltip label="课程号" min-width="150" sortable="custom" />
          <el-table-column prop="kcmc" show-overflow-tooltip label="课程名称" min-width="180" sortable="custom" />
          <el-table-column prop="kclxmText" show-overflow-tooltip label="课程类型" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ getZdzyjbmText(row.kclxm) }}
            </template>
          </el-table-column>
          <el-table-column prop="kcsxmText" show-overflow-tooltip label="课程属性" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ getkcsxmText(row.kcsxm) }}
            </template>
          </el-table-column>
          <el-table-column prop="jxjhgdkss" show-overflow-tooltip label="规定课时数" min-width="120" sortable="custom" />
          <el-table-column prop="sjjxkss" show-overflow-tooltip label="实践课时数" min-width="120" sortable="custom" />
          <el-table-column prop="kcxzm" show-overflow-tooltip label="课程性质" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ getKcxzmText(row.kcxzm) }}
            </template>
          </el-table-column>
          <el-table-column prop="ggklbm" show-overflow-tooltip label="公共课类别" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ getGgklbmText(row.ggklbm) }}
            </template>
          </el-table-column>
          <el-table-column prop="jpkcjbm" show-overflow-tooltip label="精品课程级别" min-width="120" sortable="custom">
            <template #default="{ row }">
              {{ getJpkcjbmText(row.jpkcjbm) }}
            </template>
          </el-table-column>
          <el-table-column prop="xnfzsxkss" show-overflow-tooltip label="虚拟仿真实训课时数" min-width="150" sortable="custom" />
          <el-table-column prop="sfkzrtkc" show-overflow-tooltip label="是否课证融通课程" min-width="150" sortable="custom">
            <template #default="{ row }">
              {{ getYesNoText(row.sfkzrtkc) }}
            </template>
          </el-table-column>
          <el-table-column prop="xgjsmc" show-overflow-tooltip label="相关竞赛名称" min-width="150" sortable="custom" />
          <el-table-column prop="sfxqhzkfkc" show-overflow-tooltip label="是否校企合作开发课程" min-width="180" sortable="custom">
            <template #default="{ row }">
              {{ getYesNoText(row.sfxqhzkfkc) }}
            </template>
          </el-table-column>
          <el-table-column prop="sfyxskc" show-overflow-tooltip label="是否有线上课程" min-width="150" sortable="custom">
            <template #default="{ row }">
              {{ getYesNoText(row.sfyxskc) }}
            </template>
          </el-table-column>
          <el-table-column prop="xskcwz" show-overflow-tooltip label="线上课程网址" min-width="150" sortable="custom" />
          <el-table-column prop="sfkcszsfkc" show-overflow-tooltip label="是否课程思政示范课程" min-width="180" sortable="custom">
            <template #default="{ row }">
              {{ getYesNoText(row.sfkcszsfkc) }}
            </template>
          </el-table-column>
          <el-table-column prop="ktjxsjzyxykczym" show-overflow-tooltip label="课堂教学设计主要选用课程资源码" min-width="250"
            sortable="custom">
            <template #default="{ row }">
              {{ getCourseResourceText(row.ktjxsjzyxykczym) }}
            </template>
          </el-table-column>
          <el-table-column prop="reportStatus" label="上报状态" width="100" align="center" sortable="custom">
            <template #default="{ row }">
              <el-tag :type="getReportStatusType(row.reportStatus)" size="small">
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enableStatus" label="启用状态" width="100" align="center" sortable="custom">
            <template #default="{ row }">
              <el-tag :type="getEnableStatusType(row.enableStatus)" size="small">
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="数据采集时间" min-width="160" sortable="custom">
            <template #default="{ row }">
              {{ formatDisplayTime(row.sjcjsj) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" show-overflow-tooltip label="创建时间" min-width="160" sortable="custom">
            <template #default="{ row }">
              {{ formatDisplayTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" show-overflow-tooltip label="更新时间" min-width="160" sortable="custom">
            <template #default="{ row }">
              {{ formatDisplayTime(row.updateTime) }}
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

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <span class="total-info">共 {{ total }} 条</span>
          <div class="pagination-controls">
            <el-pagination v-model:current-page="queryParams.pageNum" v-model:page-size="queryParams.pageSize"
              :page-sizes="[100, 200, 500, 1000]" layout="sizes, prev, pager, next, jumper" :total="total"
              @size-change="handleSizeChange" @current-change="handleCurrentChange" small />
          </div>
        </div>
      </div>
    </el-card>

    <!-- 表单对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add'
        ? '新增课程基本数据'
        : dialogType === 'edit'
          ? '编辑课程基本数据'
          : '查看课程基本数据'
      " width="800px" :close-on-click-modal="false" append-to-body>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="170px" :disabled="dialogType === 'view'">
        <el-row :gutter="20">

          <el-col :span="24">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="系统自动获取学校代码" maxlength="10" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="kcmc">
              <el-input v-model="form.kcmc" placeholder="请输入课程名称" maxlength="60" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <el-input v-model="form.kch" placeholder="请输入课程号" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程类型" prop="kclxm">
              <el-select v-model="form.kclxm" placeholder="请选择课程类型" style="width: 100%">
                <el-option v-for="item in courseTypeOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程属性" prop="kcsxm">
              <el-select v-model="form.kcsxm" placeholder="请选择课程属性" style="width: 100%">
                <el-option v-for="item in coursePropertyOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程性质" prop="kcxzm">
              <el-select v-model="form.kcxzm" placeholder="请选择课程性质" style="width: 100%">
                <el-option v-for="item in courseNatureOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规定课时数" prop="jxjhgdkss">
              <el-input-number v-model="form.jxjhgdkss" placeholder="请输入教学计划规定课时数" :min="0" :max="99999"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实践课时数" prop="sjjxkss">
              <el-input-number v-model="form.sjjxkss" placeholder="请输入实践教学课时数" :min="0" :max="99999"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公共课类别" prop="ggklbm">
              <el-select v-model="form.ggklbm" placeholder="请选择公共课类别" style="width: 100%">
                <el-option v-for="item in publicCourseCategoryOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="精品课程级别" prop="jpkcjbm">
              <el-select v-model="form.jpkcjbm" placeholder="请选择精品课程级别" style="width: 100%">
                <el-option v-for="item in qualityCourseLevelOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="虚拟仿真实训课时数" prop="xnfzsxkss">
              <el-input-number v-model="form.xnfzsxkss" placeholder="请输入虚拟仿真实训课时数" :min="0" :max="99999"
                style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否课证融通课程" prop="sfkzrtkc">
              <el-select v-model="form.sfkzrtkc" placeholder="请选择是否课证融通课程" style="width: 100%">
                <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="相关竞赛名称" prop="xgjsmc">
              <el-input v-model="form.xgjsmc" placeholder="请输入相关竞赛名称（多个用逗号隔开）" maxlength="128" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否校企合作开发课程" prop="sfxqhzkfkc">
              <el-select v-model="form.sfxqhzkfkc" placeholder="请选择是否校企合作开发课程" style="width: 100%">
                <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否有线上课程" prop="sfyxskc">
              <el-select v-model="form.sfyxskc" placeholder="请选择是否有线上课程" style="width: 100%">
                <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="线上课程网址" prop="xskcwz">
              <el-input v-model="form.xskcwz" placeholder="请输入线上课程网址" maxlength="500" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否课程思政示范课程" prop="sfkcszsfkc">
              <el-select v-model="form.sfkcszsfkc" placeholder="请选择是否课程思政示范课程" style="width: 100%">
                <el-option v-for="item in yesNoOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label-width="250px" label="课堂教学设计主要选用课程资源码" prop="ktjxsjzyxykczym">
              <el-select v-model="form.ktjxsjzyxykczym" placeholder="请选择课堂教学设计主要选用课程资源码" style="width: 100%">
                <el-option v-for="item in courseResourceOptions" :key="item.value" :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select v-model="form.reportStatus" placeholder="请选择上报状态" style="width: 100%">
                <el-option label="未上报" value="0" />
                <el-option label="已上报" value="1" />
                <el-option label="上报失败" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select v-model="form.enableStatus" placeholder="请选择启用状态" style="width: 100%">
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker v-model="form.sjcjsj" type="datetime" placeholder="请选择数据采集时间"
                value-format="YYYYMMDD HHmmss" format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </el-form-item>
          </el-col>
          <!-- 查看模式下显示创建时间和更新时间 -->
          <el-col v-if="dialogType === 'view'" :span="12">
            <el-form-item label="创建时间">
              <el-input :value="formatDateTime(currentRecord?.createTime)" readonly disabled
                style="background-color: #f5f7fa" />
            </el-form-item>
          </el-col>
          <el-col v-if="dialogType === 'view'" :span="12">
            <el-form-item label="更新时间">
              <el-input :value="formatDateTime(currentRecord?.updateTime)" readonly disabled
                style="background-color: #f5f7fa" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button v-if="dialogType !== 'view'" type="primary" :loading="submitLoading"
            @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog title="导入课程基本数据" v-model="importDialogVisible" width="400px" :close-on-click-modal="false">
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
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Upload,
  UploadFilled,
  Warning,
  View,
  Edit,
} from "@element-plus/icons-vue";
import {
  getCourseDataPage,
  getCourseDataById,
  addCourseData,
  updateCourseData,
  deleteCourseData,
  batchDeleteCourseData,
  exportCourseData,

  parseExcelHeaders,
  importCourseDataWithMapping,
  getSystemFields,
  getCourseTypeOptions,
  getCoursePropertyOptions,
  getCourseNatureOptions,
  getPublicCourseCategoryOptions,
  getQualityCourseLevelOptions,
  getYesNoOptions,
  getCourseResourceOptions,
  type OdsKcjbsInfo,
  type OdsKcjbsQuery,
  type OdsKcjbsForm,
  type DictOption,

  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
  downloadTemplate,
} from "@/api-data/data/data_base/zygjx/ods_kcjbs";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsKcjbsInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const currentRecord = ref<OdsKcjbsInfo | null>(null);

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

// 字典数据
const courseTypeOptions = ref<DictOption[]>([]);
const coursePropertyOptions = ref<DictOption[]>([]);
const courseNatureOptions = ref<DictOption[]>([]);
const publicCourseCategoryOptions = ref<DictOption[]>([]);
const qualityCourseLevelOptions = ref<DictOption[]>([]);
const yesNoOptions = ref<DictOption[]>([]);
const courseResourceOptions = ref<DictOption[]>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 获取今天日期的函数（格式：YYYYMMDD）
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

// 查询参数
const queryParams = reactive<OdsKcjbsQuery>({
  pageNum: 1,
  pageSize: 100,
  sortField: "",
  sortOrder: "",
  sjcjsj: "", // 默认为今天日期
});

// 表单数据
const form = reactive<OdsKcjbsForm>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  sjcjsj: "",
});

// 表单验证规则
const formRules = reactive({

  xxdm: [
    { required: true, message: "学校代码系统自动获取", trigger: "blur" },
    { max: 10, message: "学校代码长度不能超过10个字符", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "请输入课程号", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  kclxm: [{ required: true, message: "请选择课程类型", trigger: "change" }],
  kcsxm: [{ required: true, message: "请选择课程属性", trigger: "change" }],
  kcxzm: [{ required: true, message: "请选择课程性质", trigger: "change" }],
  jxjhgdkss: [
    { required: true, message: "请输入教学计划规定课时数", trigger: "blur" },
  ],
  sjjxkss: [
    { required: true, message: "请输入实践教学课时数", trigger: "blur" },
  ],
  xnfzsxkss: [
    { required: true, message: "请输入虚拟仿真实训课时数", trigger: "blur" },
  ],
  sfkzrtkc: [
    { required: true, message: "请选择是否课证融通课程", trigger: "change" },
  ],
  xgjsmc: [
    { max: 128, message: "相关竞赛名称长度不能超过128个字符", trigger: "blur" },
  ],
  sfxqhzkfkc: [
    {
      required: true,
      message: "请选择是否校企合作开发课程",
      trigger: "change",
    },
  ],
  sfyxskc: [
    { required: true, message: "请选择是否有线上课程", trigger: "change" },
  ],
  xskcwz: [
    { max: 500, message: "线上课程网址长度不能超过500个字符", trigger: "blur" },
  ],
  sfkcszsfkc: [
    {
      required: true,
      message: "请选择是否课程思政示范课程",
      trigger: "change",
    },
  ],
  ktjxsjzyxykczym: [
    {
      max: 10,
      message: "课堂教学设计主要选用课程资源码长度不能超过10个字符",
      trigger: "blur",
    },
  ],
});

// 状态格式化函数
const getReportStatusType = (status: string) => {
  switch (status) {
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

const getReportStatusText = (status: string) => {
  switch (status) {
    case "1":
      return "已上报";
    case "2":
      return "上报失败";
    default:
      return "未上报";
  }
};

const getEnableStatusType = (status: string) => {
  switch (status) {
    case "1":
      return "success";
    case "0":
      return "danger";
    default:
      return "info";
  }
};

const getEnableStatusText = (status: string) => {
  switch (status) {
    case "1":
      return "启用";
    case "0":
      return "禁用";
    default:
      return "未知";
  }
};

const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "-";
  if (timeStr.length === 14) {
    return `${timeStr.slice(0, 4)}-${timeStr.slice(4, 6)}-${timeStr.slice(6, 8)} ${timeStr.slice(8, 10)}:${timeStr.slice(10, 12)}:${timeStr.slice(12, 14)}`;
  }
  return timeStr;
};

// 获取课程性质文本
const getKcxzmText = (value: string | undefined) => {
  const option = courseNatureOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
};

// 获取公共课类别文本
const getGgklbmText = (value: string | undefined) => {
  const option = publicCourseCategoryOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
};

// 获取精品课程级别文本
const getJpkcjbmText = (value: string | undefined) => {
  const option = qualityCourseLevelOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
};

// 获取是/否文本
const getYesNoText = (value: string | undefined) => {
  const option = yesNoOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
};

// 获取课程资源文本
const getCourseResourceText = (value: string | undefined) => {
  const option = courseResourceOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
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
  } catch {
    return "-";
  }
};

// 加载字典数据
const loadDictData = async () => {
  try {
    const [
      courseType,
      courseProperty,
      courseNature,
      publicCourseCategory,
      qualityCourseLevel,
      yesNo,
      courseResource,
    ] = await Promise.all([
      getCourseTypeOptions() as any,
      getCoursePropertyOptions() as any,
      getCourseNatureOptions() as any,
      getPublicCourseCategoryOptions() as any,
      getQualityCourseLevelOptions() as any,
      getYesNoOptions() as any,
      getCourseResourceOptions() as any,
    ]);
    courseTypeOptions.value = courseType.data
      ? courseType.data.data || courseType.data
      : [];
    coursePropertyOptions.value = courseProperty.data
      ? courseProperty.data.data || courseProperty.data
      : [];
    courseNatureOptions.value = courseNature.data
      ? courseNature.data.data || courseNature.data
      : [];
    publicCourseCategoryOptions.value = publicCourseCategory.data
      ? publicCourseCategory.data.data || publicCourseCategory.data
      : [];
    qualityCourseLevelOptions.value = qualityCourseLevel.data
      ? qualityCourseLevel.data.data || qualityCourseLevel.data
      : [];
    yesNoOptions.value = yesNo.data ? yesNo.data.data || yesNo.data : [];
    courseResourceOptions.value = courseResource.data
      ? courseResource.data.data || courseResource.data
      : [];
  } catch (error) {
    ElMessage.error("加载字典数据失败");
  }
};

/** 获取系统学校代码 */
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response.data as any;
    if (result?.code === 200 && result?.data) {
      systemSchoolCode.value = result.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn("获取系统学校代码失败:", result?.message || "未知错误");
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 方法实现
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getCourseDataPage(queryParams)) as any;
    const data = response.data.data || response.data;
    dataList.value = data.records || [];
    total.value = data.total || 0;
  } catch (error) {
    ElMessage.error("查询数据失败");
  } finally {
    loading.value = false;
  }
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

const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

const resetQuery = () => {
  queryFormRef.value?.resetFields();
  Object.assign(queryParams, { 
    pageNum: 1, 
    pageSize: 100,
    sortField: "",
    sortOrder: "",
    sjcjsj: getTodayDate(), // 重置时恢复默认的今天日期
    sjcjsjStart: "", // 重置采集时间开始
    sjcjsjEnd: "", // 重置采集时间结束
    reportStatus: "" // 重置上报状态
  });
  sjcjsjRange.value = undefined; // 重置采集时间范围
  getList();
};

const handleSelectionChange = (selection: OdsKcjbsInfo[]) => {
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

const handleAdd = () => {
  dialogType.value = "add";
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogVisible.value = true;
};

const handleEdit = async (row: OdsKcjbsInfo) => {
  dialogType.value = "edit";
  try {
    const response = (await getCourseDataById(row.id)) as any;
    const data = response.data.data || response.data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleView = async (row: OdsKcjbsInfo) => {
  dialogType.value = "view";
  try {
    const response = (await getCourseDataById(row.id)) as any;
    const data = response.data.data || response.data;
    currentRecord.value = data;
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

const handleDelete = async (row: OdsKcjbsInfo) => {
  try {
    await ElMessageBox.confirm(`确定要删除课程"${row.kcmc}"吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    await deleteCourseData(row.id);
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
    await batchDeleteCourseData(selectedIds.value);
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
      await addCourseData(form);
      ElMessage.success("新增成功");
    } else {
      await updateCourseData(form);
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

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导出数据
const handleExport = async () => {
  try {
    const response = await exportCourseData({
      ...queryParams,
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
    link.download = `课程基本数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
  }
};

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
        'xxdm',       // 学校ID
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
    link.download = `课程基本数据_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    ElMessage.error("导出失败");
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
      // 检查是否是数据验证错误，直接显示错误信息
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
      // 检查是否是数据验证错误，直接显示错误信息
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

  // 自动设置学校代码的默认值
  if (systemSchoolCode.value) {
    unmappedFieldsForm.value = {
      ...unmappedFieldsForm.value,
      xxdm: systemSchoolCode.value
    };
  }
};

// 初始化模版映射（百分百映射）
const initializeTemplateMapping = () => {
  if (!excelParseResult.value) return;

  console.log('开始模版映射，Excel表头:', excelParseResult.value.headers);

  const mapping: FieldMapping = {};
  const headers = excelParseResult.value.headers;

  // 定义标准模版表头到系统字段的精确映射
  const templateMapping: { [key: string]: string } = {
    '学校代码': 'xxdm',
    '课程名称': 'kcmc',
    '课程号': 'kch',
    '课程类型码': 'kclxm',
    '课程属性码': 'kcsxm',
    '课程性质码': 'kcxzm',
    '公共课类别码': 'ggklbm',
    '精品课程级别码': 'jpkcjbm',
    '教学计划规定课时数': 'jxjhgdkss',
    '实践教学课时数': 'sjjxkss',
    '虚拟仿真实训课时数': 'xnfzsxkss',
    '是否课证融通课程': 'sfkzrtkc',
    '相关竞赛名称': 'xgjsmc',
    '是否校企合作开发课程': 'sfxqhzkfkc',
    '是否有线上课程': 'sfyxskc',
    '线上课程网址': 'xskcwz',
    '是否课程思政示范课程': 'sfkcszsfkc',
    '课堂教学设计主要选用课程资源码': 'ktjxsjzyxykczym',
    '数据采集时间': 'sjcjsj'
  };

  // 按模版表头进行精确映射
  headers.forEach((header, index) => {
    const columnName = header.columnName.trim();
    const systemField = templateMapping[columnName];
    if (systemField) {
      mapping[index.toString()] = systemField;
      console.log(`映射成功: ${columnName} -> ${systemField}`);
    } else {
      console.log(`未找到映射: ${columnName}`);
    }
  });

  fieldMapping.value = mapping;

  // 自动设置学校代码的默认值
  if (systemSchoolCode.value) {
    unmappedFieldsForm.value = {
      ...unmappedFieldsForm.value,
      xxdm: systemSchoolCode.value
    };
  }

  console.log('完成模版映射:', mapping);
};

// 查找匹配的系统字段（智能匹配）
const findMatchingSystemField = (columnName: string): string | null => {
  const normalizedColumnName = columnName.replace(/[\s\-_]/g, '').toLowerCase();

  // 定义匹配规则 - 使用更精确的匹配
  const matchRules: { [key: string]: string[] } = {
    'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    'kcmc': ['课程名称', 'kcmc', 'coursename', '课程名'],
    'kch': ['课程号', 'kch', 'coursecode', '课程编号'],
    'kclxm': ['课程类型码', 'kclxm', 'coursetype', '类型码'],
    'kcsxm': ['课程属性码', 'kcsxm', 'courseproperty', '属性码'],
    'kcxzm': ['课程性质码', 'kcxzm', 'coursenature', '性质码'],
    'ggklbm': ['公共课类别码', 'ggklbm', '公共课类别'],
    'jpkcjbm': ['精品课程级别码', 'jpkcjbm', '精品课程级别'],
    'jxjhgdkss': ['教学计划规定课时数', 'jxjhgdkss', '规定课时数', '规定课时'],
    'sjjxkss': ['实践教学课时数', 'sjjxkss', '实践课时数', '实践课时'],
    'xnfzsxkss': ['虚拟仿真实训课时数', 'xnfzsxkss', '虚拟仿真实训', '仿真课时'],
    'sfkzrtkc': ['是否课证融通课程', 'sfkzrtkc', '课证融通'],
    'xgjsmc': ['相关竞赛名称', 'xgjsmc', '竞赛名称', '竞赛'],
    'sfxqhzkfkc': ['是否校企合作开发课程', 'sfxqhzkfkc', '校企合作开发', '校企合作'],
    'sfyxskc': ['是否有线上课程', 'sfyxskc', '线上课程'],
    'xskcwz': ['线上课程网址', 'xskcwz', '课程网址', '网址'],
    'sfkcszsfkc': ['是否课程思政示范课程', 'sfkcszsfkc', '课程思政示范', '课程思政'],
    'ktjxsjzyxykczym': ['课堂教学设计主要选用课程资源码', 'ktjxsjzyxykczym', '课程资源码'],
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
        xxdm: systemSchoolCode.value // 确保学校代码被包含在默认值中
      },
      startRow: 2,
      autoGenerateId: true
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
      response = (await importCourseDataWithMapping(currentExcelFile.value, config)) as any;
      clearInterval(progressTimer); // 成功时清除定时器
      console.log('API响应:', response);
    } catch (requestError) {
      clearInterval(progressTimer); // 失败时也要清除定时器
      console.log('API请求错误:', requestError);
      throw requestError; // 重新抛出错误
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

    // 不再调用handleImportError，避免重复的错误提示
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
    { field: 'kclxm', defaultValue: '1' }, // 默认：专业基础课
    { field: 'kcsxm', defaultValue: '1' }, // 默认值需要根据实际字典确定
    { field: 'kcxzm', defaultValue: '1' }, // 默认值需要根据实际字典确定
    { field: 'sfkzrtkc', defaultValue: '0' }, // 默认：否
    { field: 'sfxqhzkfkc', defaultValue: '0' }, // 默认：否
    { field: 'sfyxskc', defaultValue: '0' }, // 默认：否
    { field: 'sfkcszsfkc', defaultValue: '0' }, // 默认：否
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
  unmappedFieldsForm.value = {}; // 清空未映射字段的默认值
};

// 获取重点专业级别文本
const getZdzyjbmText = (value: string | undefined) => {
  const option = courseTypeOptions.value.find((item: any) => item.value === value);
  return option ? option.label : "-";
};

// 获取课程属性文本
const getkcsxmText = (value: string | undefined) => {
  const option = coursePropertyOptions.value.find(
    (item: any) => item.value === value,
  );
  return option ? option.label : "-";
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
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value || "", // 自动设置学校代码
    kcmc: "",
    kch: "",
    kclxm: "",
    kcsxm: "",
    kcxzm: "",
    ggklbm: "",
    jpkcjbm: "",
    jxjhgdkss: undefined,
    sjjxkss: undefined,
    xnfzsxkss: undefined,
    sfkzrtkc: "",
    xgjsmc: "",
    sfxqhzkfkc: "",
    sfyxskc: "",
    xskcwz: "",
    sfkcszsfkc: "",
    ktjxsjzyxykczym: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
  formRef.value?.clearValidate();
};

// 组件挂载
onMounted(async () => {
  await loadDictData(); // 先加载字典数据
  loadSystemSchoolCode();
  loadSystemFields(); // 然后加载系统字段
  getList();
});

// 加载系统字段定义
const loadSystemFields = () => {
  const baseFields = getSystemFields();

  // 为选择类型的字段设置实际的选项数据
  systemFields.value = baseFields.map(field => {
    const updatedField = { ...field };

    switch (field.field) {
      case 'kclxm':
        updatedField.options = courseTypeOptions.value;
        break;
      case 'kcsxm':
        updatedField.options = coursePropertyOptions.value;
        break;
      case 'kcxzm':
        updatedField.options = courseNatureOptions.value;
        break;
      case 'ggklbm':
        updatedField.options = publicCourseCategoryOptions.value;
        break;
      case 'jpkcjbm':
        updatedField.options = qualityCourseLevelOptions.value;
        break;
      case 'ktjxsjzyxykczym':
        updatedField.options = courseResourceOptions.value;
        break;
      case 'sfkzrtkc':
      case 'sfxqhzkfkc':
      case 'sfyxskc':
      case 'sfkcszsfkc':
        updatedField.options = yesNoOptions.value;
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

// 检查字段是否已被映射或是否是学校代码字段
const isFieldAlreadyMapped = (fieldName: string, currentColumnIndex: number) => {
  // 学校代码字段不允许手动映射
  if (fieldName === 'xxdm') {
    return true;
  }
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

const unmappedFieldsForm = ref<Record<string, any>>({});

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
    // 如果是学校代码字段且已有系统值，则不显示在未映射字段中
    if (field.field === 'xxdm' && systemSchoolCode.value) {
      return false;
    }
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
    case 'kclxm':
      return courseTypeOptions.value;
    case 'kcsxm':
      return coursePropertyOptions.value;
    case 'kcxzm':
      return courseNatureOptions.value;
    case 'ggklbm':
      return publicCourseCategoryOptions.value;
    case 'jpkcjbm':
      return qualityCourseLevelOptions.value;
    case 'ktjxsjzyxykczym':
      return courseResourceOptions.value;
    case 'sfkzrtkc':
    case 'sfxqhzkfkc':
    case 'sfyxskc':
    case 'sfkcszsfkc':
      return yesNoOptions.value;
    default:
      return [];
  }
};



// 获取字段示例
const getFieldExample = (fieldName: string) => {
  // 定义字段示例数据
  const fieldExamples: Record<string, string> = {
    'xxdm': '10001',
    'kcmc': '高等数学',
    'kch': 'MATH101',
    'kclxm': '01',
    'kcsxm': '01',
    'kcxzm': '01',
    'ggklbm': '01',
    'jpkcjbm': '01',
    'jxjhgdkss': '48',
    'sjjxkss': '16',
    'xnfzsxkss': '8',
    'sfkzrtkc': '是',
    'xgjsmc': '全国大学生数学竞赛',
    'sfxqhzkfkc': '否',
    'sfyxskc': '是',
    'xskcwz': 'https://www.example.com/course',
    'sfkcszsfkc': '否为0 是为1',
    'ktjxsjzyxykczym': '教材',
    'sjcjsj': '',
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
</script>

<style scoped lang="scss">
.course-management {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

 .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      row-gap: 8px;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 0;
      flex: 0 0 auto;
    }

    :deep(.el-form-item__label) {
      width: 110px;
      text-align: right;
      padding-right: 8px;
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      line-height: 32px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 200px;
      font-size: 14px;
      height: 32px;
    }

    // 采集时间范围特殊样式
    :deep(.el-form-item[prop="sjcjsjRange"]) {
      .el-form-item__content {
        .el-date-editor {
          width: 320px !important;
          height: 32px;
        }
      }
    }

    // 上报状态特殊样式
    :deep(.el-form-item[prop="reportStatus"]) {
      .el-form-item__content {
        .el-select {
          width: 150px !important;
          height: 32px;
        }
      }
    }

    :deep(.el-button) {
      font-size: 14px;
      margin-left: 8px;
    }

    // 搜索按钮特殊样式
    :deep(.el-form-item:last-child) {
      margin-left: 0;
      margin-right: 0;
      
      .el-form-item__content {
        display: flex;
        gap: 8px;
      }
      
      .el-button {
        margin-left: 0;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 4px;
      }
    }

    // 响应式布局
    @media (max-width: 1200px) {
      :deep(.el-form) {
        gap: 6px;
      }
      
      :deep(.el-form-item__label) {
        width: 100px;
        font-size: 13px;
      }
      
      :deep(.el-input__wrapper),
      :deep(.el-select) {
        width: 180px;
        font-size: 13px;
      }
      
      :deep(.el-form-item[prop="sjcjsjRange"]) {
        .el-form-item__content {
          .el-date-editor {
            width: 280px !important;
          }
        }
      }
    }
  }

.search-bar {
  margin-top: -5px;
}

.table-card {
  height: calc(100vh - 620px);
  margin-top: -30px;
  flex: 1;

  flex-direction: column;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 8px;
}

.operation-buttons {
  display: flex;
  align-items: center;
  gap: 3px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  text-align: center;
}

.right-buttons {
  display: flex;
  align-items: center;
  gap: 10px;

  .el-button {
    margin: 0;
  }
}

.table-body {
  flex: 1;
  overflow: hidden;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid #e4e7ed;
  margin-top: 16px;
}

.total-info {
  color: #606266;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  align-items: center;
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

.dialog-footer {
  text-align: right;
}

// 表格样式
:deep(.el-table) {
  flex: 1;
  font-size: 12px;

  .cell {
    padding: 0 8px;
  }

  .el-table__header-wrapper {
    .el-table__header {
      th {
        background-color: #fafafa;
        color: #606266;
        font-weight: 600;
      }
    }
  }
}

// 分页样式
.pagination-wrapper {
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

/* 统一表单项间距 */
:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

:deep(.el-row) {
  margin-bottom: 0 !important;

  .el-form-item {
    margin-bottom: 22px !important;
  }
}

// 按钮间距
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

// 对话框样式
:deep(.el-dialog) {
  .el-dialog__header {
    padding: 24px 24px 16px;
    border-bottom: 1px solid #e4e7ed;
  }

  .el-dialog__body {
    padding: 24px 24px 32px;
    max-height: 65vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .el-dialog__footer {
    padding: 20px 24px 24px;
    border-top: 1px solid #e4e7ed;
  }
}

// 卡片样式
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}

/* 导入按钮白色背景样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;

  &:hover {
    background-color: #f5f7fa !important;
    border-color: #c0c4cc !important;
    color: #409eff !important;
  }

  &:focus {
    background-color: #ffffff !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }

  &:active {
    background-color: #f5f7fa !important;
    border-color: #409eff !important;
    color: #409eff !important;
  }
}

/* 导入提示图标样式 */
:deep(.import-tip-icon) {
  margin-left: 5px;
  color: #e6a23c;
  cursor: pointer;
  font-size: 14px;
  vertical-align: middle;
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

        .source-text {
          color: #606266;
          font-size: 11px;
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

/* 统计数值样式 */
:deep(.el-statistic) {
  text-align: center;

  .el-statistic__head {
    font-size: 14px;
    color: inherit;
  }

  .el-statistic__content {
    .el-statistic__number {
      font-size: 24px;
      font-weight: 600;
      color: inherit;
    }
  }
}

/* 字段映射表格样式 */
:deep(.mapping-table-section .el-table) {
  .el-table__header-wrapper .el-table__header th {
    background-color: #f5f7fa;
    color: #606266;
    font-weight: 600;
  }

  .el-table__body-wrapper .el-table__body tr {
    &:hover {
      background-color: #f5f7fa;
    }
  }

  .cell {
    padding: 8px 12px;
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
</style>
