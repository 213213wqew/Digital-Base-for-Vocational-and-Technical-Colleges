<template>
<div class="system-building-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="学校名称" prop="xxmc">
            <el-input
              v-model="queryParams.xxmc"
              placeholder="请输入学校名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
            />
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
          <el-tooltip v-if="schoolList.length > 0" content="已有数据，不能新增！" placement="top">
            <el-button  type="primary" @click="handleAdd" :disabled="schoolList.length > 0">
              <el-icon><Plus /></el-icon>新增
            </el-button>
          </el-tooltip>
          <el-button v-else type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增
          </el-button>
          <el-button
            type="danger"
            :disabled="!selectedIds.length"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title"><h3>学校基本数据数据清洗</h3></div>
        <div class="placeholder">
          <!-- <el-button @click="handleImport">
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
          :loading="loading"
          :data="schoolList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          highlight-current-row
          :height="'calc(75vh - 110px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="xxmc"
            show-overflow-tooltip
            label="学校名称"
            min-width="200"
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            show-overflow-tooltip
            label="学校代码"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            prop="xxjgdm"
            show-overflow-tooltip
            label="机构代码"
            min-width="140"
            sortable="custom"
          />
          <el-table-column
            label="行政区划"
            min-width="150"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <div>{{ row.sjgmc || "-" }}</div>
              <div v-if="row.shjgmc">{{ row.shjgmc }}</div>
              <div v-if="row.qxjgmc">{{ row.qxjgmc }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="xxjbzmc"
            show-overflow-tooltip
            label="举办者"
            min-width="120"
            sortable="custom"
          />
          <el-table-column label="学校性质" width="100" align="center">
            <template #default="{ row }">
              <el-tag :type="getSchoolTypeTag(row.xxxzm)" size="small">
                {{ getSchoolTypeText(row.xxxzm) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="建校年月"
            prop="jxny"
            width="100"
            align="center"
          >
            <template #default="{ row }">
              {{ formatDate(row.jxny) || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="师生数据" width="150" align="center">
            <template #default="{ row }">
              <div>
                <el-icon><User /></el-icon> 教职工: {{ row.xyjzgzs || 0 }}
              </div>
              <div>
                <el-icon><UserFilled /></el-icon> 学生: {{ row.xyxss || 0 }}
              </div>
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
                :type="row.enableStatus === '1' ? 'success' : 'info'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
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
              {{ row.sjcjsj || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            show-overflow-tooltip
            label="更新时间"
            min-width="160"
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
                  @click="handleUpdate(row)"
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

    <!-- 新增/编辑/查看 对话框 -->
    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="1000px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        :disabled="dialogType === 'view'"
       
        class="dialog-form"
      >
        <!-- 学校基础信息 -->
        <el-divider content-position="left"
          ><span class="divider-title">学校基础信息</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学校名称" prop="xxmc">
              <el-input v-model="form.xxmc" placeholder="请输入学校名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input v-model="form.xxdm" placeholder="请输入学校代码" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="建校年月" prop="jxny">
              <el-input v-model="form.jxny" placeholder="格式：YYYYMM" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学校机构代码" prop="xxjgdm">
              <el-input
                v-model="form.xxjgdm"
                placeholder="请输入学校机构代码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学校性质码" prop="xxxzm">
              <el-select
                v-model="form.xxxzm"
                placeholder="请选择学校性质"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in schoolTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="办学类型码" prop="xxbxlxm">
              <el-select
                v-model="form.xxbxlxm"
                placeholder="请选择办学类型"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in schoolingTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 举办者信息 -->
        <el-divider content-position="left"
          ><span class="divider-title">举办者信息</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="学校举办者" prop="xxjbzmc">
              <el-input
                v-model="form.xxjbzmc"
                placeholder="请输入学校举办者名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="举办者性质码" prop="xxjbzxzm">
              <el-select
                v-model="form.xxjbzxzm"
                placeholder="请选择举办者性质"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in organizeTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="举办者级别码" prop="xxjbzjbm">
              <el-select
                v-model="form.xxjbzjbm"
                placeholder="请选择举办者级别"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in organizeLevelOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 高水平学校信息 -->
        <el-divider content-position="left"
          ><span class="divider-title">高水平学校信息</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="高水平学校性质码" prop="gspxxxzm">
              <el-select
                v-model="form.gspxxxzm"
                placeholder="请选择高水平学校性质"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in highLevelTypeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="高水平学校级别码" prop="gspxxjbm">
              <el-select
                v-model="form.gspxxjbm"
                placeholder="请选择高水平学校级别"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="dict in highLevelGradeOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专业群数量" prop="zyqsl">
              <el-input-number
                v-model="form.zyqsl"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="立项部门名称" prop="gspxxlxbmmc">
              <el-input
                v-model="form.gspxxlxbmmc"
                placeholder="请输入高水平学校立项部门名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="批准年月" prop="gspxxpzny">
              <el-input v-model="form.gspxxpzny" placeholder="格式：YYYYMM" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 空列，保持对齐 -->
          </el-col>
        </el-row>

        <!-- 行政区划 -->
        <el-divider content-position="left"
          ><span class="divider-title">行政区划</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="省机构编码" prop="sjgbm">
              <el-input v-model="form.sjgbm" placeholder="请输入省机构编码" />
            </el-form-item>
            <el-form-item label="省机构名称" prop="sjgmc">
              <el-input v-model="form.sjgmc" placeholder="请输入省机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="市机构编码" prop="shjgbm">
              <el-input v-model="form.shjgbm" placeholder="请输入市机构编码" />
            </el-form-item>
            <el-form-item label="市机构名称" prop="shjgmc">
              <el-input v-model="form.shjgmc" placeholder="请输入市机构名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="区县机构编码" prop="qxjgbm">
              <el-input
                v-model="form.qxjgbm"
                placeholder="请输入区县机构编码"
              />
            </el-form-item>
            <el-form-item label="区县机构名称" prop="qxjgmc">
              <el-input
                v-model="form.qxjgmc"
                placeholder="请输入区县机构名称"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 人员信息 -->
        <el-divider content-position="left"
          ><span class="divider-title">人员信息</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="教职工总数" prop="xyjzgzs">
              <el-input-number
                v-model="form.xyjzgzs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="专技岗人数" prop="zjgrs">
              <el-input-number
                v-model="form.zjgrs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理岗人数" prop="glgrs">
              <el-input-number
                v-model="form.glgrs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="工勤岗人数" prop="gqgrs">
              <el-input-number
                v-model="form.gqgrs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学生数" prop="xyxss">
              <el-input-number
                v-model="form.xyxss"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 空列，保持对齐 -->
          </el-col>
        </el-row>

        <!-- 信息化设施 -->
        <el-divider content-position="left"
          ><span class="divider-title">信息化设施</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="特色信息化系统数" prop="xxtsxxhxts">
              <el-input-number
                v-model="form.xxtsxxhxts"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="校园出口带宽" prop="xyckdk">
              <el-input-number
                v-model="form.xyckdk"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主干网带宽" prop="xyzgwdk">
              <el-input-number
                v-model="form.xyzgwdk"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="多媒体教室数" prop="dmtjss">
              <el-input-number
                v-model="form.dmtjss"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="有线网络接入数" prop="yxwljrs">
              <el-input-number
                v-model="form.yxwljrs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="无线网络接入数" prop="wxwljrs">
              <el-input-number
                v-model="form.wxwljrs"
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 其他信息 -->
        <el-divider content-position="left"
          ><span class="divider-title">其他信息</span></el-divider
        >
        <el-row :gutter="20">
          <el-col :span="8">
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
          <!-- <el-col :span="8">
            <el-form-item label="唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="请输入主键数据唯一性标识"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="8">
            <el-form-item label="上报状态" prop="reportStatus">
              <el-select
                v-model="form.reportStatus"
                placeholder="请选择上报状态"
                clearable
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
          <el-col :span="8">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择启用状态"
                clearable
                style="width: 100%"
              >
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <!-- 空列，保持对齐 -->
          </el-col>
          <el-col :span="8">
            <!-- 空列，保持对齐 -->
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="submitForm"
          v-if="dialogType !== 'view'"
          >确 定</el-button
        >
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="学校基本数据详情"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      draggable
      append-to-body
      @close="handleDetailClose"
    >
      <div v-if="currentRecord">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="学校名称">{{
            currentRecord.xxmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校代码">{{
            currentRecord.xxdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校机构代码">{{
            currentRecord.xxjgdm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="建校年月">{{
            formatDate(currentRecord.jxny) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校举办者">{{
            currentRecord.xxjbzmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="举办者性质">{{
            getOrganizeTypeText(currentRecord.xxjbzxzm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="举办者级别">{{
            getOrganizeLevelText(currentRecord.xxjbzjbm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="学校性质">{{
            getSchoolTypeText(currentRecord.xxxzm) || "-"
          }}</el-descriptions-item>

          <el-descriptions-item label="行政区划" :span="2">
            {{ currentRecord.sjgmc || "-" }}
            {{ currentRecord.shjgmc ? "/ " + currentRecord.shjgmc : "" }}
            {{ currentRecord.qxjgmc ? "/ " + currentRecord.qxjgmc : "" }}
          </el-descriptions-item>

          <el-descriptions-item label="办学类型">{{
            getSchoolingTypeText(currentRecord.xxbxlxm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="唯一性标识">{{
            currentRecord.zjsjwyxbs || "-"
          }}</el-descriptions-item>

          <el-descriptions-item label="高水平学校性质">{{
            getHighLevelTypeText(currentRecord.gspxxxzm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="高水平学校级别">{{
            getHighLevelGradeText(currentRecord.gspxxjbm) || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="立项部门名称">{{
            currentRecord.gspxxlxbmmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="批准年月">{{
            currentRecord.gspxxpzny || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="专业群数量">{{
            currentRecord.zyqsl || "0"
          }}</el-descriptions-item>

          <el-descriptions-item label="教职工总数">{{
            currentRecord.xyjzgzs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="专技岗人数">{{
            currentRecord.zjgrs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="管理岗人数">{{
            currentRecord.glgrs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="工勤岗人数">{{
            currentRecord.gqgrs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="学生数">{{
            currentRecord.xyxss || "0"
          }}</el-descriptions-item>

          <el-descriptions-item label="特色信息化系统数">{{
            currentRecord.xxtsxxhxts || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="校园出口带宽">{{
            currentRecord.xyckdk || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="校园主干网带宽">{{
            currentRecord.xyzgwdk || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="有线网络接入数">{{
            currentRecord.yxwljrs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="无线网络接入数">{{
            currentRecord.wxwljrs || "0"
          }}</el-descriptions-item>
          <el-descriptions-item label="多媒体教室数">{{
            currentRecord.dmtjss || "0"
          }}</el-descriptions-item>

          <el-descriptions-item label="数据采集时间">{{
            currentRecord.sjcjsj || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(currentRecord.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus) }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ currentRecord.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="创建时间">{{
            currentRecord.createTime || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{
            currentRecord.updateTime || "-"
          }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleDetailClose">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog
      title="导入学校数据"
      v-model="importVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="uploadRef"
        :http-request="customHttpRequest"
        :before-upload="beforeUpload"
        :limit="1"
        :auto-upload="true"
        drag
        accept=".xls,.xlsx"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
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

    <!-- 定时同步设置对话框 -->
    <el-dialog
      v-model="showSyncTimeDialog"
      title="定时同步设置"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="syncTimeForm" label-width="120px">
        <el-form-item label="模块名称">
          <el-input
            v-model="syncTimeForm.moduleName"
            disabled
            placeholder="学校基本数据"
          />
        </el-form-item>
        <el-form-item label="同步时间">
          <el-date-picker
            v-model="syncTimeForm.syncTime"
            type="datetime"
            placeholder="选择同步时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch
            v-model="syncTimeForm.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="syncTimeForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showSyncTimeDialog = false">取消</el-button>
        <el-button type="primary" @click="saveSyncTime">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox, FormInstance, FormRules } from "element-plus";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import "@/styles/data-manage.scss"
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Edit,
  View,
  Download,
  Upload,
  User,
  UserFilled,
  UploadFilled,
  Warning,
} from "@element-plus/icons-vue";

import {
  listSchoolBasicData,
  getSchoolBasicData,
  addSchoolBasicData,
  updateSchoolBasicData,
  deleteSchoolBasicData,
  batchDeleteSchoolBasicData,
  exportSchoolBasicData,
  saveSyncSchedule,
  getDictOptions,
  importSchoolBasicData,
  type MetaBaseZygxxOdsXxjbsjQuery,
  type MetaBaseZygxxOdsXxjbsjInfo,
  type MetaBaseZygxxOdsXxjbsjForm,
  type DictOption,
} from "@/api-data/data/data_base/zygxx/ods_xxjbsj";

// 查询参数
const queryParams = reactive<MetaBaseZygxxOdsXxjbsjQuery>({
  pageNum: 1,
  pageSize: 100,
  xxmc: "",
  xxdm: "",
  sjgbm: "",
  xxxzm: "",
});

// 页面状态
const loading = ref(false);

const schoolList = ref<MetaBaseZygxxOdsXxjbsjInfo[]>([]);
const total = ref(0);
const selectedRows = ref<MetaBaseZygxxOdsXxjbsjInfo[]>([]);
const selectedIds = ref<number[]>([]);
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();
const uploadRef = ref<UploadInstance>();

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const importVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const dialogTitle = computed(() => {
  if (dialogType.value === "add") return "新增学校数据";
  if (dialogType.value === "edit") return "编辑学校数据";
  return "查看学校数据";
});
const form = ref<MetaBaseZygxxOdsXxjbsjForm>({});
const currentRecord = ref<MetaBaseZygxxOdsXxjbsjInfo | null>(null);

// 表单校验规则
const rules = reactive<FormRules>({
  // 基础信息必填字段
 
  xxmc: [
    { required: true, message: "学校名称不能为空", trigger: "blur" },
    { max: 60, message: "学校名称不能超过60个字符", trigger: "blur" },
  ],
  xxdm: [
    { required: true, message: "学校代码不能为空", trigger: "blur" },
    { max: 10, message: "学校代码不能超过10个字符", trigger: "blur" },
  ],
  xxjgdm: [
    { required: true, message: "学校机构代码不能为空", trigger: "blur" },
    { max: 18, message: "学校机构代码不能超过18个字符", trigger: "blur" },
  ],
  xxxzm: [{ required: true, message: "学校性质码不能为空", trigger: "change" }],
  xxbxlxm: [
    { required: true, message: "学校办学类型码不能为空", trigger: "change" },
  ],

  // 举办者信息必填字段
  xxjbzmc: [
    { required: true, message: "学校举办者名称不能为空", trigger: "blur" },
    { max: 60, message: "学校举办者名称不能超过60个字符", trigger: "blur" },
  ],
  xxjbzxzm: [
    { required: true, message: "学校举办者性质码不能为空", trigger: "change" },
  ],
  xxjbzjbm: [
    { required: true, message: "学校举办者级别码不能为空", trigger: "change" },
  ],

  // 高水平学校信息必填字段
  gspxxxzm: [
    { required: true, message: "高水平学校性质码不能为空", trigger: "change" },
  ],
  gspxxjbm: [
    { required: true, message: "高水平学校级别码不能为空", trigger: "change" },
  ],
  zyqsl: [
    { required: true, message: "专业群数量不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999,
      message: "专业群数量必须是0-99999之间的数字",
      trigger: "blur",
    },
  ],

  // 行政区划必填字段
  sjgbm: [
    { required: true, message: "省机构编码不能为空", trigger: "blur" },
    { max: 6, message: "省机构编码不能超过6个字符", trigger: "blur" },
  ],
  sjgmc: [
    { required: true, message: "省机构名称不能为空", trigger: "blur" },
    { max: 60, message: "省机构名称不能超过60个字符", trigger: "blur" },
  ],
  shjgbm: [
    { required: true, message: "市机构编码不能为空", trigger: "blur" },
    { max: 6, message: "市机构编码不能超过6个字符", trigger: "blur" },
  ],
  shjgmc: [
    { required: true, message: "市机构名称不能为空", trigger: "blur" },
    { max: 60, message: "市机构名称不能超过60个字符", trigger: "blur" },
  ],
  qxjgbm: [
    { required: true, message: "区县机构编码不能为空", trigger: "blur" },
    { max: 6, message: "区县机构编码不能超过6个字符", trigger: "blur" },
  ],
  qxjgmc: [
    { required: true, message: "区县机构名称不能为空", trigger: "blur" },
    { max: 60, message: "区县机构名称不能超过60个字符", trigger: "blur" },
  ],

  // 人员信息必填字段
  xyjzgzs: [
    { required: true, message: "现有教职工总数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "教职工总数必须是有效数字",
      trigger: "blur",
    },
  ],
  zjgrs: [
    { required: true, message: "专技岗人数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "专技岗人数必须是有效数字",
      trigger: "blur",
    },
  ],
  glgrs: [
    { required: true, message: "管理岗人数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "管理岗人数必须是有效数字",
      trigger: "blur",
    },
  ],
  gqgrs: [
    { required: true, message: "工勤岗人数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "工勤岗人数必须是有效数字",
      trigger: "blur",
    },
  ],
  xyxss: [
    { required: true, message: "现有学生数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "学生数必须是有效数字",
      trigger: "blur",
    },
  ],

  // 信息化设施必填字段
  xxtsxxhxts: [
    {
      required: true,
      message: "学校特色信息化系统数不能为空",
      trigger: "blur",
    },
    {
      type: "number",
      min: 0,
      max: 99999999,
      message: "信息化系统数必须是有效数字",
      trigger: "blur",
    },
  ],
  xyckdk: [
    { required: true, message: "校园出口带宽不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "校园出口带宽必须是有效数字",
      trigger: "blur",
    },
  ],
  xyzgwdk: [
    { required: true, message: "校园主干网带宽不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      message: "校园主干网带宽必须是有效数字",
      trigger: "blur",
    },
  ],
  yxwljrs: [
    { required: true, message: "有线网络接入数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999999999,
      message: "有线网络接入数必须是有效数字",
      trigger: "blur",
    },
  ],
  wxwljrs: [
    { required: true, message: "无线网络接入数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 9999999999,
      message: "无线网络接入数必须是有效数字",
      trigger: "blur",
    },
  ],
  dmtjss: [
    { required: true, message: "多媒体教室数不能为空", trigger: "blur" },
    {
      type: "number",
      min: 0,
      max: 99999,
      message: "多媒体教室数必须是0-99999之间的数字",
      trigger: "blur",
    },
  ],

  // 其他信息必填字段
  sjcjsj: [
    { required: true, message: "数据采集时间不能为空", trigger: "change" },
  ],

  // 可选字段的长度验证
  jxny: [
    { pattern: /^\d{6}$/, message: "建校年月格式应为YYYYMM", trigger: "blur" },
  ],
  gspxxlxbmmc: [
    { max: 60, message: "立项部门名称不能超过60个字符", trigger: "blur" },
  ],
  gspxxpzny: [
    { pattern: /^\d{6}$/, message: "批准年月格式应为YYYYMM", trigger: "blur" },
  ],
});

// 定时同步设置
const showSyncTimeDialog = ref(false);
const syncTimeForm = ref({
  moduleName: "学校基本数据",
  syncTime: "",
  enabled: false,
  remark: "",
});

// 导入提示内容
const importTipContent = `导入说明：
1. 第一行为字段中文名称，第二行为字段英文名称
2. 从第三行开始录入数据
3. 如果唯一标识为空，系统将自动生成
4. 支持.xls和.xlsx格式文件`;

// 字典数据
const schoolTypeOptions = ref<DictOption[]>([]);
const provinceOptions = ref<DictOption[]>([]);
const organizeTypeOptions = ref<DictOption[]>([]);
const organizeLevelOptions = ref<DictOption[]>([]);
const highLevelTypeOptions = ref<DictOption[]>([]);
const highLevelGradeOptions = ref<DictOption[]>([]);
const schoolingTypeOptions = ref<DictOption[]>([]);

// 获取数据列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await listSchoolBasicData(queryParams);
    const result = response.data as any;
    schoolList.value =
      result.data.records.map((item: any) => ({
        ...item,
        statusLoading: false,
        originalEnableStatus: item.enableStatus, // 记录初始状态
      })) || [];
    total.value = result.data.total || 0;
  } catch (error) {
    console.error("获取学校基本数据失败:", error);
    schoolList.value = [];
    total.value = 0;
    ElMessage.error("获取数据失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 查询操作
const handleQuery = () => {
  queryParams.pageNum = 1;
  getList();
};

// 重置查询
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

// 表格选择改变
const handleSelectionChange = (selection: MetaBaseZygxxOdsXxjbsjInfo[]) => {
  selectedRows.value = selection;
  selectedIds.value = selection.map((item) => item.id);
};

// 重置表单
const resetForm = () => {
  form.value = {
    id: undefined,
    zjsjwyxbs: "",
    sjgbm: "",
    sjgmc: "",
    shjgbm: "",
    shjgmc: "",
    qxjgbm: "",
    qxjgmc: "",
    xxjgdm: "",
    xxdm: "",
    xxmc: "",
    jxny: "",
    xxjbzmc: "",
    xxjbzxzm: "",
    xxjbzjbm: "",
    xxxzm: "",
    gspxxxzm: "",
    gspxxjbm: "",
    gspxxlxbmmc: "",
    gspxxpzny: "",
    zyqsl: 0,
    xxbxlxm: "",
    xyjzgzs: 0,
    zjgrs: 0,
    glgrs: 0,
    gqgrs: 0,
    xyxss: 0,
    xxtsxxhxts: 0,
    xyckdk: 0,
    xyzgwdk: 0,
    yxwljrs: 0,
    wxwljrs: 0,
    dmtjss: 0,
    sjcjsj: "",
    reportStatus: "0", // 默认为未上报
    enableStatus: "1", // 默认为启用
  };
  formRef.value?.resetFields();
};

// 新增
const handleAdd = () => {
  // 如果已有数据则提示并不弹窗
  if (schoolList.value.length > 0) {
    ElMessage.warning("已有数据，不能新增！");
    return;
  }
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
};

// 查看
const handleView = async (row: MetaBaseZygxxOdsXxjbsjInfo) => {
  try {
    const response: any = await getSchoolBasicData(row.id);
    if (response && response.data) {
      currentRecord.value = response.data.data;
      viewDialogVisible.value = true;
    } else {
      ElMessage.error("获取详情数据为空");
    }
  } catch (e) {
    console.error("获取详情失败:", e);
    ElMessage.error("获取详情失败");
  }
};

// 修改
const handleUpdate = async (row: MetaBaseZygxxOdsXxjbsjInfo) => {
  resetForm();
  try {
    const response: any = await getSchoolBasicData(row.id);
    if (response && response.data) {
      // 确保数据正确赋值，避免undefined
      const data = response.data.data;
      form.value = {
        id: data.id,
        zjsjwyxbs: data.zjsjwyxbs || "",
        sjgbm: data.sjgbm || "",
        sjgmc: data.sjgmc || "",
        shjgbm: data.shjgbm || "",
        shjgmc: data.shjgmc || "",
        qxjgbm: data.qxjgbm || "",
        qxjgmc: data.qxjgmc || "",
        xxjgdm: data.xxjgdm || "",
        xxdm: data.xxdm || "",
        xxmc: data.xxmc || "",
        jxny: data.jxny || "",
        xxjbzmc: data.xxjbzmc || "",
        xxjbzxzm: data.xxjbzxzm || "",
        xxjbzjbm: data.xxjbzjbm || "",
        xxxzm: data.xxxzm || "",
        gspxxxzm: data.gspxxxzm || "",
        gspxxjbm: data.gspxxjbm || "",
        gspxxlxbmmc: data.gspxxlxbmmc || "",
        gspxxpzny: data.gspxxpzny || "",
        zyqsl: data.zyqsl || 0,
        xxbxlxm: data.xxbxlxm || "",
        xyjzgzs: data.xyjzgzs || 0,
        zjgrs: data.zjgrs || 0,
        glgrs: data.glgrs || 0,
        gqgrs: data.gqgrs || 0,
        xyxss: data.xyxss || 0,
        xxtsxxhxts: data.xxtsxxhxts || 0,
        xyckdk: data.xyckdk || 0,
        xyzgwdk: data.xyzgwdk || 0,
        yxwljrs: data.yxwljrs || 0,
        wxwljrs: data.wxwljrs || 0,
        dmtjss: data.dmtjss || 0,
        sjcjsj: data.sjcjsj || "",
        reportStatus: data.reportStatus || "0",
        enableStatus: data.enableStatus || "1",
      };
      dialogType.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error("获取详情数据为空");
    }
  } catch (e) {
    console.error("获取详情失败:", e);
    ElMessage.error("获取详情失败");
  }
};

// 提交表单
const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      const isEdit = dialogType.value === "edit";
      try {
        // 确保状态字段有有效值
        const submitData = {
          ...form.value,
          reportStatus: form.value.reportStatus || "0",
          enableStatus: form.value.enableStatus || "1",
        };

        if (isEdit) {
          await updateSchoolBasicData(submitData);
        } else {
          await addSchoolBasicData(submitData);
        }
        ElMessage.success(isEdit ? "修改成功" : "新增成功");
        dialogVisible.value = false;
        getList();
      } catch (error) {
        console.error("表单提交失败:", error);
        ElMessage.error((isEdit ? "修改" : "新增") + "失败，请重试");
      }
    }
  });
};

// 删除
const handleDelete = async (row: MetaBaseZygxxOdsXxjbsjInfo) => {
  try {
    await ElMessageBox.confirm(
      `确定删除学校"${row.xxmc}"的数据吗？此操作不可撤销！`,
      "确认删除",
      {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      },
    );
    await deleteSchoolBasicData(row.id);
    ElMessage.success("删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除失败:", error);
    }
  }
};

// 导入
const handleImport = () => {
  importVisible.value = true;
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${selectedIds.value.length} 条记录吗？此操作不可撤销！`,
      "确认删除",
      { type: "warning" },
    );
    await batchDeleteSchoolBasicData(selectedIds.value);
    ElMessage.success("批量删除成功");
    getList();
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除失败:", error);
    }
  }
};

// 文件上传前校验
const beforeUpload: UploadProps["beforeUpload"] = (rawFile: UploadRawFile) => {
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

// 自定义文件上传处理
const customHttpRequest = async (options: any) => {
  const { file, onSuccess, onError } = options;

  try {
    // 创建FormData
    const formData = new FormData();
    formData.append("file", file);

    console.log("开始上传文件:", file.name);

    // 使用API模块中的导入函数
    const response = (await importSchoolBasicData(formData)) as any;

    console.log("导入响应:", response);

    if (response && response.data && response.data.code === 200) {
      ElMessage.success("数据导入成功");
      importVisible.value = false;
      getList(); // 刷新列表
      onSuccess(response.data);
    } else {
      const errorMsg = response?.data?.message || "导入失败，请检查文件格式";
      ElMessage.error(`导入失败: ${errorMsg}`);
      onError(new Error(errorMsg));
    }
  } catch (error: any) {
    console.error("导入失败:", error);

    let errorMessage = "导入失败";
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
    onError(error);
  } finally {
    uploadRef.value?.clearFiles();
  }
};

// 导出
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");
    const response = await exportSchoolBasicData(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `学校基本数据_${new Date().toLocaleDateString().replace(/\//g, "")}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 分页大小改变
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

// 当前页改变
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 工具函数
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  if (dateStr.length === 6) {
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}`;
  }
  return dateStr;
};

// 获取学校性质标签类型
const getSchoolTypeTag = (type: string) => {
  switch (type) {
    case "01":
      return "success";
    case "02":
      return "warning";
    case "03":
      return "info";
    default:
      return "info";
  }
};

// 获取学校性质文本
const getSchoolTypeText = (type: string) => {
  const option = schoolTypeOptions.value.find((item) => item.value === type);
  return option ? option.label : type || "未知";
};

// 获取举办者性质文本
const getOrganizeTypeText = (code: string) => {
  const option = organizeTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "未知";
};

// 获取举办者级别文本
const getOrganizeLevelText = (code: string) => {
  const option = organizeLevelOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "未知";
};

// 获取高水平学校性质文本
const getHighLevelTypeText = (code: string) => {
  const option = highLevelTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "未知";
};

// 获取高水平学校级别文本
const getHighLevelGradeText = (code: string) => {
  const option = highLevelGradeOptions.value.find(
    (item) => item.value === code,
  );
  return option ? option.label : code || "未知";
};

// 获取办学类型文本
const getSchoolingTypeText = (code: string) => {
  const option = schoolingTypeOptions.value.find((item) => item.value === code);
  return option ? option.label : code || "未知";
};

// 获取上报状态显示文本
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

// 获取上报状态标签类型
const getReportStatusTagType = (status: string) => {
  switch (status) {
    case "0":
      return "info";
    case "1":
      return "success";
    case "2":
      return "danger";
    default:
      return "info";
  }
};

// 保存定时同步设置
const saveSyncTime = async () => {
  if (!syncTimeForm.value.syncTime) {
    ElMessage.warning("请选择同步时间");
    return;
  }
  try {
    await saveSyncSchedule(syncTimeForm.value);
    ElMessage.success(`定时同步设置已保存！`);
    showSyncTimeDialog.value = false;
  } catch (error) {
    console.error("保存定时同步设置失败:", error);
    ElMessage.error("保存失败，请重试");
  }
};

// 获取字典数据
const loadDictOptions = async () => {
  try {
    // 获取学校性质字典
    const schoolTypeResponse = await getDictOptions("XXXZDM");
    const schoolTypeData = schoolTypeResponse.data as any;
    if (schoolTypeData && schoolTypeData.code === 200) {
      schoolTypeOptions.value = schoolTypeData.data || [];
    }

    // 获取省份字典
    const provinceResponse = await getDictOptions("PROVINCE");
    const provinceData = provinceResponse.data as any;
    if (provinceData && provinceData.code === 200) {
      provinceOptions.value = provinceData.data || [];
    }

    // 获取学校举办者性质代码字典
    const organizeTypeResponse = await getDictOptions("XXJBZXZDM");
    const organizeTypeData = organizeTypeResponse.data as any;
    if (organizeTypeData && organizeTypeData.code === 200) {
      organizeTypeOptions.value = organizeTypeData.data || [];
    }

    // 获取学校举办者级别代码字典
    const organizeLevelResponse = await getDictOptions("XXJBZJBDM");
    const organizeLevelData = organizeLevelResponse.data as any;
    if (organizeLevelData && organizeLevelData.code === 200) {
      organizeLevelOptions.value = organizeLevelData.data || [];
    }

    // 获取高水平学校性质代码字典
    const highLevelTypeResponse = await getDictOptions("GSPXXXZDM");
    const highLevelTypeData = highLevelTypeResponse.data as any;
    if (highLevelTypeData && highLevelTypeData.code === 200) {
      highLevelTypeOptions.value = highLevelTypeData.data || [];
    }

    // 获取高水平学校级别代码字典
    const highLevelGradeResponse = await getDictOptions("GSPXXJBDM");
    const highLevelGradeData = highLevelGradeResponse.data as any;
    if (highLevelGradeData && highLevelGradeData.code === 200) {
      highLevelGradeOptions.value = highLevelGradeData.data || [];
    }

    // 获取办学类型代码字典
    const schoolingTypeResponse = await getDictOptions("BXLXDM");
    const schoolingTypeData = schoolingTypeResponse.data as any;
    if (schoolingTypeData && schoolingTypeData.code === 200) {
      schoolingTypeOptions.value = schoolingTypeData.data || [];
    }
  } catch (error) {
    console.error("获取字典数据失败:", error);
  }
};

// 详情对话框函数
const handleDetailClose = () => {
  viewDialogVisible.value = false;
  currentRecord.value = null;
};

// 初始化
onMounted(() => {
  getList();
  loadDictOptions();
});
</script>


