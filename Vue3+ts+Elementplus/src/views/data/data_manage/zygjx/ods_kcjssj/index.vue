<template>
  <div class="course-construction-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="课程名称" prop="kcmc">
            
              <el-input
                v-model="queryParams.kcmc"
                placeholder="请输入课程名称"
                clearable
                style="margin-right: 5px"
              />
          
          </el-form-item>
          <el-form-item label="课程号" prop="kch">
            
              <el-input
                v-model="queryParams.kch"
                placeholder="请输入课程号"
                clearable
                style="margin-right: 5px"
              />
          
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
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">课程建设数据数据清洗</div>
        <div class="placeholder">
          <el-tooltip content="导入Excel数据" placement="top">
            <!-- <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button> -->
          </el-tooltip>
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
          @sort-change="handleSortChange"
          border
          style="width: 100%"
          highlight-current-row
          :height="'calc(75vh - 130px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            show-overflow-tooltip
            label="主键数据唯一性标识"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            show-overflow-tooltip
            label="学校代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            show-overflow-tooltip
            label="课程号"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            show-overflow-tooltip
            label="课程名称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="fzrh"
            show-overflow-tooltip
            label="负责人号"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="lxnd"
            show-overflow-tooltip
            label="立项年度"
            min-width="100"
            sortable="custom"
            align="center"
          />
          <el-table-column
            prop="kcjslbmText"
            show-overflow-tooltip
            label="建设类别"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="lxjf"
            show-overflow-tooltip
            label="立项经费"
            min-width="120"
            sortable="custom"
            align="right"
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getEnableStatusType(row.enableStatus)"
                size="small"
              >
                {{ getEnableStatusText(row.enableStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="数据采集时间"
            min-width="160"
            sortable="custom"
          >
            <template #default="{ row }">
              {{  row.sjcjsj }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            show-overflow-tooltip
            label="创建时间"
            min-width="160"
            sortable="custom"
          >
          <template #default="{ row }">
            {{ formatDisplay(row.createTime) }}
          </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            show-overflow-tooltip
            label="更新时间"
            min-width="160"
            sortable="custom"
          >
          <template #default="{ row }">
            {{ formatDisplay(row.updateTime) }}
          </template>
          </el-table-column>
          <el-table-column
            prop="sqrq"
            show-overflow-tooltip
            label="申请日期"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="ysrq"
            show-overflow-tooltip
            label="验收日期"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="jflymText"
            show-overflow-tooltip
            label="经费来源"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="ssdwmc"
            show-overflow-tooltip
            label="所属单位名称"
            min-width="150"
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
      class="course-construction-dialog"
      destroy-on-close
    >
      <!-- 查看模式 - 描述列表 -->
      <div v-if="dialogType === 'view'" class="course-construction-detail">
        <el-descriptions class="detail-descriptions" :column="2" border>
          <el-descriptions-item
            label="主键数据唯一性标识"
            label-class-name="label-title"
          >
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
          <el-descriptions-item label="负责人号">
            <span class="detail-value">{{ form.fzrh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="立项年度">
            <span class="detail-value">{{ form.lxnd || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="申请日期">
            <span class="detail-value">{{ formatDate(form.sqrq || "") }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="验收日期">
            <span class="detail-value">{{ formatDate(form.ysrq || "") }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="经费来源">
            <span class="detail-value">{{
              getFundSourceText(form.jflym || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="立项经费">
            <span class="detail-value">{{
              form.lxjf ? `${form.lxjf}元` : "-"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="课程建设类别">
            <span class="detail-value">{{
              getCourseConstructionTypeText(form.kcjslbm || "")
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="所属单位名称">
            <span class="detail-value">{{ form.ssdwmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">
            <span class="detail-value">{{
              form.sjcjsj || ""
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="getEnableStatusType(form.enableStatus || '1')"
              size="small"
            >
              {{ getEnableStatusText(form.enableStatus || "1") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(form.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus || "0") }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 编辑/新增模式 - 表单 -->
      <div v-else class="course-construction-form">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="120px"
          class="form-container dialog-form"
        >
          <!-- 基本信息区域 -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <div class="input-with-icon">
                    <el-input
                      v-model="form.zjsjwyxbs"
                      placeholder="可不填，后端自动生成32位唯一标识"
                      maxlength="32"
                      show-word-limit
                      style="text-transform: uppercase"
                      @input="handleZjsjwyxbsInput"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="xxdm">
                  <div class="input-with-icon">
                    <el-input
                      v-model="form.xxdm"
                      placeholder="系统自动获取（10位数字码）"
                      maxlength="10"
                      readonly
                      disabled
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程名称" prop="kcmc">
                  <div class="input-with-warning">
                    <el-select
                      v-model="form.kcmc"
                      placeholder="请输入课程名称进行搜索"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseNameChange"
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kcmc"
                        :value="course.kcmc"
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
                      placeholder="请输入课程号进行搜索"
                      filterable
                      remote
                      reserve-keyword
                      :remote-method="searchCoursesMethod"
                      :loading="courseSearchLoading"
                      @change="handleCourseCodeChange"
                    >
                      <el-option
                        v-for="course in courseOptions"
                        :key="course.id"
                        :label="course.kch"
                        :value="course.kch"
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
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="负责人号" prop="fzrh">
                  <el-input
                    v-model="form.fzrh"
                    placeholder="请输入负责人号"
                    maxlength="20"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项年度" prop="lxnd">
                  <el-input
                    v-model="form.lxnd"
                    placeholder="请输入4位年份，如: 2025"
                    maxlength="4"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 详细信息区域 -->
          <div class="form-section">
            <div class="section-title">详细信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="申请日期" prop="sqrq">
                  <el-date-picker
                    v-model="form.sqrq"
                    type="date"
                    placeholder="请选择申请日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="验收日期" prop="ysrq">
                  <el-date-picker
                    v-model="form.ysrq"
                    type="date"
                    placeholder="请选择验收日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="经费来源" prop="jflym">
                  <el-select
                    v-model="form.jflym"
                    placeholder="请选择经费来源"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in fundSourceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="立项经费" prop="lxjf">
                  <el-input-number
                    v-model="form.lxjf"
                    :min="0"
                    :precision="2"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="课程建设类别" prop="kcjslbm">
                  <el-select
                    v-model="form.kcjslbm"
                    placeholder="请选择课程建设类别"
                    filterable
                    clearable
                    style="width: 100%"
                  >
                    <el-option
                      v-for="item in courseConstructionTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属单位名称" prop="ssdwmc">
                  <el-input
                    v-model="form.ssdwmc"
                    placeholder="请输入所属单位名称"
                    maxlength="200"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
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
            </el-row>
            <el-row :gutter="20">
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
              <el-col :span="12">
                <!-- 预留空位 -->
              </el-col>
            </el-row>
            <!-- 查看模式下显示创建时间和更新时间 -->
            <el-row v-if="dialogType === 'view'" :gutter="20">
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
            </el-row>
          </div>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleFormClose">{{
            dialogType === "view" ? "关闭" : "取消"
          }}</el-button>
          <el-button
            v-if="dialogType !== 'view'"
            type="primary"
            :loading="submitLoading"
            @click="handleFormSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入课程建设数据"
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
              <p style="color: #5b85f8;"><span style="color: #5b85f8;">*</span> 课程号存在会更新该条数据，不存在则新增。</p>
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
import { ref, reactive, onMounted, nextTick, computed, onUnmounted } from "vue";
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
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getCourseConstructionDataPage,
  getCourseConstructionDataById,
  addCourseConstructionData,
  updateCourseConstructionData,
  deleteCourseConstructionData,
  batchDeleteCourseConstructionData,
  exportCourseConstructionData,
  importCourseConstructionData,
  parseExcelHeaders,
  importCourseConstructionDataWithMapping,
  getSystemFields,
  downloadTemplate,
  getFundSourceOptions,
  getCourseConstructionTypeOptions,
  searchCourses,
  getSystemSchoolCode,
  type OdsKcjssjInfo,
  type OdsKcjssjQuery,
  type OdsKcjssjForm,
  type CourseBasicInfo,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
  type DictOption,
} from "@/api-data/data/data_base/zygjx/ods_kcjssj";

// 进度条组件导入
import ProgressDialog from "@/components/ProgressDialog/index.vue";

// 查询参数
const queryParams = reactive<OdsKcjssjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  kch: "",
  pageNum: 1,
  pageSize: 100,
  sortField: '', // 新增排序字段
  sortOrder: '', // 新增排序顺序
});

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 表格数据
const dataList = ref<OdsKcjssjInfo[]>([]);
const total = ref(0);
const loading = ref(false);
const multipleSelection = ref<OdsKcjssjInfo[]>([]);

// 查询表单引用
const queryFormRef = ref<FormInstance>();

// 表单数据
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);
const formRef = ref<FormInstance>();
const currentRecord = ref<OdsKcjssjInfo | null>(null);

// 导入相关
const importDialogVisible = ref(false);
const uploadRef = ref();

// 字段映射相关
const fieldMappingDialogVisible = ref(false);
const fieldMapping = ref<{ [key: number]: string }>({});
const unmappedFieldsForm = reactive<{ [key: string]: any }>({});
const excelParseResult = ref<ExcelParseResult | null>(null);
const currentExcelFile = ref<File | null>(null);
const importProcessing = ref(false);
const importProgressVisible = ref(false);
const importProgress = ref(0);
const importStatus = ref<"success" | "error" | "warning" | "info">("info");
const importStatusText = ref("");
const importDetailInfo = ref("");
const importProgressTitle = ref("");

// 系统字段列表
const systemFields = ref<SystemField[]>([]);

// 加载系统字段定义
const loadSystemFields = () => {
  systemFields.value = getSystemFields();
};

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增课程建设数据",
    edit: "编辑课程建设数据",
    view: "查看课程建设数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsKcjssjForm>({
  id: undefined,
  zjsjwyxbs: "", // 主键数据唯一性标识 - 32位大写字母+数字组合
  xxdm: "", // 学校代码 - 10位数字码
  kcmc: "", // 课程名称 - 最大60字符
  kch: "", // 课程号 - 最大50字符
  fzrh: "", // 负责人号 - 最大20字符，必填
  sqrq: "", // 申请日期 - 8位YYYYMMDD格式，可选
  lxnd: "", // 立项年度 - 4位YYYY格式，必填
  ysrq: "", // 验收日期 - 8位YYYYMMDD格式，可选
  jflym: "", // 经费来源码 - 2位字符，可选
  lxjf: 0, // 立项经费 - 数值，可选
  ssdwmc: "", // 所属单位名称 - 最大200字符，可选
  kcjslbm: "", // 课程建设类别码 - 2位字符，可选
  sjcjsj: "", // 数据采集时间 - 15位YYYYMMDDhhmmss格式，必填
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
  kcmc: [
    { required: true, message: "请输入课程名称", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60个字符", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "请输入课程号", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50个字符", trigger: "blur" },
  ],
  fzrh: [
    { required: true, message: "请输入负责人号", trigger: "blur" },
    { max: 20, message: "负责人号长度不能超过20个字符", trigger: "blur" },
  ],
  lxnd: [
    { required: true, message: "请输入立项年度", trigger: "blur" },
    { len: 4, message: "立项年度必须为4位数字", trigger: "blur" },
    {
      pattern: /^\d{4}$/,
      message: "立项年度格式错误，应为YYYY格式",
      trigger: "blur",
    },
  ],
  sqrq: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !/^\d{8}$/.test(value)) {
          callback(new Error("申请日期格式错误，应为YYYYMMDD格式"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  ysrq: [
    {
      validator: (_rule: any, value: any, callback: any) => {
        if (value && !/^\d{8}$/.test(value)) {
          callback(new Error("验收日期格式错误，应为YYYYMMDD格式"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  jflym: [
    { max: 2, message: "经费来源码长度不能超过2个字符", trigger: "change" },
  ],
  lxjf: [
    { type: "number", min: 0, message: "立项经费不能为负数", trigger: "blur" },
  ],
  ssdwmc: [
    { max: 200, message: "所属单位名称长度不能超过200个字符", trigger: "blur" },
  ],
  kcjslbm: [
    { max: 2, message: "课程建设类别码长度不能超过2个字符", trigger: "change" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 字典数据
const fundSourceOptions = ref<DictOption[]>([]);
const courseConstructionTypeOptions = ref<DictOption[]>([]);

// 课程搜索相关
const courseOptions = ref<CourseBasicInfo[]>([]);
const courseSearchLoading = ref(false);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 提示框相关
const tooltipDiv = ref<HTMLDivElement | null>(null);

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

// 组件卸载时清理
onUnmounted(() => {
  if (tooltipDiv.value && document.body.contains(tooltipDiv.value)) {
    document.body.removeChild(tooltipDiv.value);
  }
});

// 初始化
onMounted(() => {
  getList();
  loadDictData();
  getSchoolCode();
  loadSystemFields();
});

// 加载字典数据
const loadDictData = async () => {
  try {
    const [fundSource, courseConstructionType] = await Promise.all([
      getFundSourceOptions(),
      getCourseConstructionTypeOptions(),
    ]);
    fundSourceOptions.value = (fundSource as any)?.data?.data || [];
    courseConstructionTypeOptions.value =
      (courseConstructionType as any)?.data?.data || [];
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

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = await getCourseConstructionDataPage(queryParams);
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
  sjcjsjRange.value = undefined; // 重置采集时间范围
  queryFormRef.value?.resetFields();
  getList();
};

// 表格选择事件
const handleSelectionChange = (selection: OdsKcjssjInfo[]) => {
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

// 表格排序变化处理
const handleSortChange = ({ prop, order }: { prop: string; order: string | null }) => {
  console.log("排序变化:", { prop, order });
  
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

// 注意：这里已经定义了handleSortChange方法，不要重复定义

// 新增
const handleAdd = async () => {
  dialogType.value = "add";
  await resetForm();
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsKcjssjInfo) => {
  dialogType.value = "edit";
  resetFormSync();
  try {
    const response = await getCourseConstructionDataById(row.id);
    // 使用类型断言处理API响应格式
    const data = (response as any)?.data?.data || {};
    Object.assign(form, data);
    dialogVisible.value = true;
  } catch (error) {
    ElMessage.error("获取数据详情失败");
  }
};

// 查看
const handleView = async (row: OdsKcjssjInfo) => {
  dialogType.value = "view";
  resetFormSync();
  try {
    const response = await getCourseConstructionDataById(row.id);
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
const handleDelete = (row: OdsKcjssjInfo) => {
  ElMessageBox.confirm(`确认删除课程建设数据"${row.kcmc}"吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await deleteCourseConstructionData(row.id);
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
    `确认批量删除选中的${multipleSelection.value.length}条课程建设数据吗？`,
    "警告",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        await batchDeleteCourseConstructionData(
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
  ElMessageBox.confirm("确认导出课程建设数据吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  })
    .then(async () => {
      try {
        await exportCourseConstructionData(queryParams);
        ElMessage.success("导出成功");
      } catch (error: any) {
        console.error("导出失败:", error);
        ElMessage.error(error.message || "导出失败");
      }
    })
    .catch(() => {});
};

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：\n1. 第一行为字段中文名称，第二行为字段英文名称\n2. 从第三行开始录入数据\n3. 如果唯一标识为空，系统将自动生成\n4. 采集时间将统一设置为当前时间\n5. 支持.xls和.xlsx格式文件，大小不超过10MB`;

// 上传前校验
const beforeUpload = (rawFile: any) => {
  const isExcel =
    rawFile.type === "application/vnd.ms-excel" ||
    rawFile.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  if (!isExcel) {
    ElMessage.error("请上传.xls或.xlsx格式的Excel文件");
    return false;
  }
  const isLt10M = rawFile.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error("文件大小不能超过10MB");
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
  
  // 自动设置学校代码的默认值
  if (systemSchoolCode.value) {
    Object.assign(unmappedFieldsForm, {
      ...unmappedFieldsForm,
      xxdm: systemSchoolCode.value
    });
  }
};

// 查找匹配的系统字段（智能匹配）
const findMatchingSystemField = (columnName: string): string | null => {
  const normalizedColumnName = columnName.replace(/[\s\-_]/g, '').toLowerCase();
  
  // 定义匹配规则 - 使用更精确的匹配
  const matchRules: { [key: string]: string[] } = {
    'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    'kcmc': ['课程名称', 'kcmc', 'coursename', '课程名'],
    'kch': ['课程号', 'kch', 'coursecode', '课程编号'],
    'fzrh': ['负责人号', 'fzrh', '负责人'],
    'sqrq': ['申请日期', 'sqrq', '申请时间'],
    'lxnd': ['立项年度', 'lxnd', '年度'],
    'ysrq': ['验收日期', 'ysrq', '验收时间'],
    'jflym': ['经费来源', 'jflym', '来源'],
    'lxjf': ['立项经费', 'lxjf', '经费'],
    'kcjslbm': ['课程建设类别', 'kcjslbm', '建设类别'],
    'ssdwmc': ['所属单位名称', 'ssdwmc', '单位名称'],
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

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitLoading.value = true;
    try {
      if (dialogType.value === "add") {
        await addCourseConstructionData(form);
        ElMessage.success("新增成功");
      } else {
        await updateCourseConstructionData(form);
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
    form.enableStatus = "1"; // 设置默认启用状态
    form.reportStatus = "0"; // 设置默认上报状态
    // 设置当前时间为默认数据采集时间（15位格式：YYYYMMDDhhmmss）
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const second = now.getSeconds().toString().padStart(2, "0");
    form.sjcjsj = `${year}${month}${day}${hour}${minute}${second}`;
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
 
// 格式化日期（YYYYMMDD -> YYYY-MM-DD）
const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return "-";
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}-${month}-${day}`;
};

// 格式化时间（YYYYMMDDhhmmss -> YYYY-MM-DD HH:MM:SS）
const formatDisplay = (timestamp: string) => {
  return timestamp.replace('T', ' ');
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

// 获取经费来源文本
const getFundSourceText = (value: string) => {
  if (!value) return "-";
  const option = fundSourceOptions.value.find((item) => item.value === value);
  return option ? option.label : value;
};

// 获取课程建设类别文本
const getCourseConstructionTypeText = (value: string) => {
  if (!value) return "-";
  const option = courseConstructionTypeOptions.value.find(
    (item) => item.value === value,
  );
  return option ? option.label : value;
};

// 处理主键数据唯一性标识输入
const handleZjsjwyxbsInput = (value: string) => {
  form.zjsjwyxbs = value.toUpperCase();
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

// 下载导入模板
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplate({
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
    link.download = `课程建设数据_导入模板_${new Date().getTime()}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    ElMessage.success("模板下载成功");
  } catch (error) {
    ElMessage.error("模板下载失败");
  }
};

// 取消字段映射
const cancelFieldMapping = () => {
  fieldMappingDialogVisible.value = false;
  fieldMapping.value = {}; // 清空映射
  Object.keys(unmappedFieldsForm).forEach(key => {
    delete unmappedFieldsForm[key];
  });
  excelParseResult.value = null; // 清空解析结果
  currentExcelFile.value = null; // 清空文件
  importProcessing.value = false; // 停止导入
  importProgressVisible.value = false; // 隐藏进度弹窗
  importStatus.value = "info";
  importStatusText.value = "";
  importDetailInfo.value = "";
  importProgressTitle.value = "";
};

// 获取必填字段列表
const getRequiredFields = () => {
  return systemFields.value.filter(field => field.required);
};

// 获取必填字段数量
const getRequiredFieldsCount = () => {
  return systemFields.value.filter(field => field.required).length;
};

// 获取已映射字段数量
const getMappedFieldsCount = () => {
  return Object.values(fieldMapping.value).filter(Boolean).length;
};

// 获取未设置必填字段数量
const getUnsetRequiredFieldsCount = () => {
  const mappedFields = Object.values(fieldMapping.value);
  return systemFields.value.filter(field => 
    field.required && 
    !mappedFields.includes(field.field) && 
    !unmappedFieldsForm[field.field]
  ).length;
};

// 获取字段映射状态
const getFieldMappingStatus = (fieldName: string) => {
  const mappedFields = Object.values(fieldMapping.value);
  const hasMapping = mappedFields.includes(fieldName);
  const hasDefaultValue = unmappedFieldsForm[fieldName] !== undefined;
  return {
    isMapped: hasMapping,
    hasDefault: hasDefaultValue,
    isSet: hasMapping || hasDefaultValue
  };
};

// 检查字段是否已被映射
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

// 获取字段示例
const getFieldExample = (fieldName: string) => {
  // 定义字段示例数据
  const fieldExamples: Record<string, string> = {
    'xxdm': '10001',
    'kcmc': '高等数学',
    'kch': 'MATH101',
    'fzrh': 'T001',
    'sqrq': '20230505',
    'lxnd': '2023',
    'ysrq': '20231205',
    'jflym': '01',
    'lxjf': '50000',
    'kcjslbm': '01',
    'ssdwmc': '数学系',
    'sjcjsj': '20230505 101010',
    'reportStatus': '0',
    'enableStatus': '1'
  };
  
  return fieldExamples[fieldName] || '';
};

// 获取字段选项
const getFieldOptions = (fieldName: string) => {
  switch (fieldName) {
    case 'jflym':
      return fundSourceOptions.value;
    case 'kcjslbm':
      return courseConstructionTypeOptions.value;
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
        ...unmappedFieldsForm,
        ...requiredFieldsDefaults,
        xxdm: systemSchoolCode.value // 确保学校代码被包含在默认值中
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
      response = (await importCourseConstructionDataWithMapping(currentExcelFile.value, config)) as any;
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
  
  // 定义所有必填字段及其默认值
  const requiredFieldsWithDefaults = [
    { field: 'xxdm', defaultValue: systemSchoolCode.value || '0000000000' },
    { field: 'kcmc', defaultValue: '未知课程' },
    { field: 'kch', defaultValue: 'UNKNOWN' },
    { field: 'fzrh', defaultValue: 'UNKNOWN' },
    { field: 'lxnd', defaultValue: new Date().getFullYear().toString() },
  ];
  
  // 为未映射的必填字段设置默认值
  requiredFieldsWithDefaults.forEach(({ field, defaultValue }) => {
    if (!mappedFields.includes(field) && !unmappedFieldsForm[field]) {
      defaults[field] = defaultValue;
      console.log(`为未映射的必填字段 ${field} 设置默认值: ${defaultValue}`);
    }
  });
  
  return defaults;
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

// 这里已经在前面定义了handleSortChange方法，不需要重复定义
// 保留注释以便后续维护
</script>

<style scoped lang="scss">
/* 页面整体布局 */
.course-construction-management {
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

  .course-construction-dialog {
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

/* 详情查看样式 */
.course-construction-detail {
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

/* 弹窗表单样式 */
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

/* 表单样式 */
.course-construction-form {
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
        width: 0; /* 确保flex布局正常工作 */
      }
    }

    :deep(.el-input),
    :deep(.el-select),
    :deep(.el-date-editor),
    :deep(.el-input-number) {
      width: 100%;
    }

    .input-with-warning {
      display: flex;
      align-items: center;
      width: 100%;

      :deep(.el-select),
      :deep(.el-input),
      :deep(.el-date-editor),
      :deep(.el-input-number) {
        flex: 1;
      }

      .warning-icon {
        color: #e6a23c;
        margin-left: 8px;
        font-size: 16px;
        cursor: pointer;
        flex-shrink: 0;
      }
    }
  }
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
  width: 120px !important; /* 确保所有标签宽度一致 */
  text-align: right;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  height: 32px;
  border-radius: 4px;
}

/* 导入按钮样式 */
.import-button {
  background-color: #ffffff !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

/* 导入提示图标 */
:deep(.import-tip-icon) {
  margin-left: 4px;
  color: #e6a23c;
  cursor: pointer;
}

/* 字段映射对话框样式 */
.field-mapping-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.field-mapping-container .main-content {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
}

.field-mapping-container .left-panel {
  flex: 0 0 300px; /* 左侧面板固定宽度 */
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
}

.field-mapping-container .right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  overflow-y: auto;
}

.field-mapping-container .mapping-description {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 15px;
}

.field-mapping-container .mapping-description h4 {
  margin-top: 0;
  margin-bottom: 5px;
  color: #e6a23c;
}

.field-mapping-container .mapping-description p {
  margin-bottom: 5px;
  color: #f56c6c;
}

.field-mapping-container .required-fields-status h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #f56c6c;
}

.field-mapping-container .required-fields-table-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.field-mapping-container .required-fields-table-container .el-table {
  border-collapse: collapse;
}

.field-mapping-container .required-fields-table-container th,
.field-mapping-container .required-fields-table-container td {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
  color: #606266;
}

.field-mapping-container .required-fields-table-container th {
  background-color: #fafafa;
  font-weight: 600;
  color: #303133;
}

.field-mapping-container .required-fields-table-container .el-tag {
  font-size: 12px;
}

.field-mapping-container .mapping-status {
  background-color: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 4px;
  padding: 10px 15px;
  margin-top: 15px;
}

.field-mapping-container .mapping-status .el-row {
  margin-bottom: 10px;
}

.field-mapping-container .mapping-status .statistic-item {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.field-mapping-container .mapping-status .statistic-success {
  color: #52c41a;
  border-color: #52c41a;
}

.field-mapping-container .mapping-status .statistic-info {
  color: #1890ff;
  border-color: #91d5ff;
}

.field-mapping-container .mapping-status .statistic-danger {
  color: #f5222d;
  border-color: #f5222d;
}

.field-mapping-container .mapping-table-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #303133;
}

.field-mapping-container .mapping-table-section .el-table {
  border-collapse: collapse;
}

.field-mapping-container .mapping-table-section th,
.field-mapping-container .mapping-table-section td {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
  font-size: 13px;
  color: #606266;
}

.field-mapping-container .mapping-table-section th {
  background-color: #fafafa;
  font-weight: 600;
  color: #303133;
}

.field-mapping-container .mapping-table-section .el-select {
  width: 100%;
}

.field-mapping-container .mapping-table-section .field-option {
  display: flex;
  align-items: center;
  gap: 5px;
}

.field-mapping-container .mapping-table-section .field-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.field-mapping-container .mapping-table-section .required-mark {
  color: #f56c6c;
  font-weight: bold;
}

.field-mapping-container .mapping-table-section .field-type {
  font-size: 12px;
  color: #909399;
}

.field-mapping-container .mapping-table-section .field-example {
  margin-top: 5px;
  padding: 5px 10px;
  background-color: #f4f4f4;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
}

.field-mapping-container .mapping-table-section .example-label {
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.field-mapping-container .mapping-table-section .example-content {
  color: #909399;
  font-size: 12px;
}

.field-mapping-container .unmapped-fields-section h4 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #f56c6c;
}

.field-mapping-container .unmapped-fields-section .section-description {
  color: #f56c6c;
  margin-bottom: 10px;
  font-size: 13px;
}

.field-mapping-container .unmapped-fields-section .el-form-item {
  margin-bottom: 15px;
}

.field-mapping-container .unmapped-fields-section .el-form-item__label {
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.field-mapping-container .unmapped-fields-section .el-input,
.field-mapping-container .unmapped-fields-section .el-select,
.field-mapping-container .unmapped-fields-section .el-input-number {
  width: 100%;
}

.field-mapping-container .unmapped-fields-section .el-input__wrapper,
.field-mapping-container .unmapped-fields-section .el-select__wrapper,
.field-mapping-container .unmapped-fields-section .el-input-number__inner {
  height: 32px;
  border-radius: 4px;
}

.field-mapping-container .unmapped-fields-section .el-input-number__inner {
  text-align: left;
}

.field-mapping-container .unmapped-fields-section .warning-text {
  color: #e6a23c;
  font-size: 12px;
}

.field-mapping-container .unmapped-fields-section .source-mapped {
  color: #67c23a;
  font-size: 12px;
}

.field-mapping-container .unmapped-fields-section .source-default {
  color: #909399;
  font-size: 12px;
}
</style>
