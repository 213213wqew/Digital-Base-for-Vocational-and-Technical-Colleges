<template>
  <div class="course-schedule-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          class="compact-form"
        >
          <el-form-item label="课程名称" prop="kcmc">
            <el-input
              v-model="queryParams.kcmc"
              placeholder="请输入课程名称"
              clearable
              size="default"
            />
          </el-form-item>
          <el-form-item label="专业名称" prop="zymc">
            <el-input
              v-model="queryParams.zymc"
              placeholder="请输入专业名称"
              clearable
              size="default"
            />
          </el-form-item>
          <el-form-item label="年级" prop="nj">
            <el-input
              v-model="queryParams.nj"
              placeholder="请输入年级，如：2022"
              clearable
              size="default"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery" size="default">
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" size="default">
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
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
          <el-divider direction="vertical" />
        </div>
        <div class="header-title">排课数据编码管理</div>
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
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 135px)'"
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
            min-width="160"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kch"
            label="课程号"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kcmc"
            label="课程名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            label="专业名称"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="nj"
            label="年级"
            width="80"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="bjmc"
            label="班级名称"
            min-width="120"
            show-overflow-tooltip
            sortable="custom"
          />
          <el-table-column
            prop="kkxnd"
            label="开课学年度"
            width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="kkxqmText"
            label="开课学期"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="xqjText"
            label="星期几"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="skjc"
            label="上课节次"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="skrqDisplay"
            label="上课日期"
            width="120"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="jxbrs"
            label="教学班人数"
            width="100"
            align="center"
            sortable="custom"
          />
          <el-table-column
            prop="skdd"
            label="上课地点"
            min-width="150"
            show-overflow-tooltip
            sortable="custom"
          />
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
                :type="
                  (row.enableStatus === '1' ? 'success' : 'danger') as
                    | 'success'
                    | 'danger'
                "
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="1200px"
      :close-on-click-modal="false"
      append-to-body
      class="course-schedule-dialog"
      destroy-on-close
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
              <el-input
                v-model="form.zjsjwyxbs"
                placeholder="可选字段，留空时后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                readonly
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划课程号" prop="jhkch">
              <el-input
                v-model="form.jhkch"
                placeholder="请输入计划课程号，如：JH202401001"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排课号" prop="pkh">
              <el-input
                v-model="form.pkh"
                placeholder="请输入排课号，如：PK202401001"
                maxlength="80"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程号" prop="kch">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.kch"
                  placeholder="请搜索并选择课程号"
                  filterable
                  remote
                  :remote-method="searchCourseOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleCourseChange"
                >
                  <el-option
                    v-for="course in courseOptions"
                    :key="course.id"
                    :label="`${course.kch} - ${course.kcmc}`"
                    :value="course.kch"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：ZYGJX0101 课程基本数据子类表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程名称" prop="kcmc">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.kcmc"
                  placeholder="请搜索并选择课程名称"
                  filterable
                  remote
                  :remote-method="searchCourseOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleCourseNameChange"
                >
                  <el-option
                    v-for="course in courseOptions"
                    :key="`name-${course.id}`"
                    :label="`${course.kcmc} (${course.kch})`"
                    :value="course.kcmc"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：ZYGJX0101 课程基本数据子类表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业所属院系部" prop="zyssyxbmc">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.zyssyxbmc"
                  placeholder="请搜索并选择专业所属院系部"
                  filterable
                  remote
                  :remote-method="searchMajorOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleMajorDepartmentChange"
                >
                  <el-option
                    v-for="major in majorOptions"
                    :key="`dept-${major.zyh}`"
                    :label="major.zyssyxbmc"
                    :value="major.zyssyxbmc"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：专业设置数据子类表(ODS_ZYSZSJ)"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业名称" prop="zymc">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.zymc"
                  placeholder="请搜索并选择专业名称"
                  filterable
                  remote
                  :remote-method="searchMajorOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleMajorNameChange"
                >
                  <el-option
                    v-for="major in majorOptions"
                    :key="`name-${major.zyh}`"
                    :label="`${major.zymc} (${major.zyh})`"
                    :value="major.zymc"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：专业设置数据子类表(ODS_ZYSZSJ)"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业号" prop="zyh">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.zyh"
                  placeholder="请搜索并选择专业号"
                  filterable
                  remote
                  :remote-method="searchMajorOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleMajorChange"
                >
                  <el-option
                    v-for="major in majorOptions"
                    :key="major.zyh"
                    :label="`${major.zyh} - ${major.zymc}`"
                    :value="major.zyh"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：专业设置数据子类表(ODS_ZYSZSJ)"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年级" prop="nj">
              <el-input
                v-model="form.nj"
                placeholder="请输入年级，如：2022"
                maxlength="4"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级名称" prop="bjmc">
              <el-input
                v-model="form.bjmc"
                placeholder="请输入班级名称，如：计算机2022级1班"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学年度" prop="kkxnd">
              <el-input
                v-model="form.kkxnd"
                placeholder="请输入开课学年度，格式：YYYY-YYYY，如：2022-2023"
                maxlength="9"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开课学期" prop="kkxqm">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.kkxqm"
                  placeholder="请选择开课学期"
                  style="width: calc(100% - 32px)"
                  clearable
                >
                  <el-option
                    v-for="option in xqdmOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：字典数据 学期代码表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="周次" prop="zc">
              <el-input
                v-model="form.zc"
                placeholder="请输入周次，如：10"
                maxlength="10"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="星期几" prop="xqj">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.xqj"
                  placeholder="请选择星期几"
                  style="width: calc(100% - 32px)"
                >
                  <el-option label="星期一" value="1" />
                  <el-option label="星期二" value="2" />
                  <el-option label="星期三" value="3" />
                  <el-option label="星期四" value="4" />
                  <el-option label="星期五" value="5" />
                  <el-option label="星期六" value="6" />
                  <el-option label="星期日" value="7" />
                </el-select>
                <el-tooltip
                  content="数据来源：字典数据 星期代码表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上课节次" prop="skjc">
              <el-input
                v-model="form.skjc"
                placeholder="请输入上课节次，如：1-2或1-4"
                maxlength="5"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上课日期" prop="skrq">
              <el-date-picker
                v-model="form.skrq"
                type="date"
                placeholder="请选择上课日期"
                value-format="YYYYMMDD"
                format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上课时间" prop="sksj">
              <el-input
                v-model="form.sksj"
                placeholder="请输入上课时间，格式：hhmmss，如：141503"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教工号" prop="jgh">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.jgh"
                  placeholder="请搜索并选择教工号"
                  filterable
                  remote
                  :remote-method="searchTeacherOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleTeacherChange"
                >
                  <el-option
                    v-for="teacher in teacherOptions"
                    :key="teacher.jgh"
                    :label="`${teacher.jgh} - ${teacher.jsxm}`"
                    :value="teacher.jgh"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：ODS_JSHXSJ 教师画像数据子类表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教学班人数" prop="jxbrs">
              <el-input-number
                v-model="form.jxbrs"
                placeholder="请输入教学班人数"
                :min="0"
                :max="9999"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上课地点" prop="skdd">
              <el-input
                v-model="form.skdd"
                placeholder="请输入上课地点，如：教学楼A101"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="教室号" prop="jsh">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.jsh"
                  placeholder="请搜索并选择教室号"
                  filterable
                  remote
                  :remote-method="searchClassroomOptions"
                  :loading="false"
                  style="width: calc(100% - 32px)"
                  clearable
                  @change="handleClassroomChange"
                >
                  <el-option
                    v-for="classroom in classroomOptions"
                    :key="classroom.jsh"
                    :label="`${classroom.jsh} - ${classroom.jsmc}`"
                    :value="classroom.jsh"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：DS_JSJBSJ 教室基本数据子类表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授课地点类别" prop="skddlbm">
              <div
                style="
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  width: 100%;
                "
              >
                <el-select
                  v-model="form.skddlbm"
                  placeholder="请选择授课地点类别"
                  style="width: calc(100% - 32px)"
                  clearable
                >
                  <el-option
                    v-for="option in skddlbdmOptions"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                <el-tooltip
                  content="数据来源：字典数据 授课地点类别代码表"
                  placement="top"
                >
                  <el-icon
                    color="#E6A23C"
                    style="cursor: help; width: 24px; height: 24px"
                  >
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选用教材出版号" prop="xyjccbh">
              <el-input
                v-model="form.xyjccbh"
                placeholder="请输入选用教材出版号，多个用逗号隔开，如：9787040123456,9787040789012"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
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
            <el-form-item label="启用状态" prop="enableStatus">
              <el-select
                v-model="form.enableStatus"
                placeholder="请选择启用状态"
                style="width: 100%"
              >
                <el-option label="禁用" value="0" />
                <el-option label="启用" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="course-schedule-detail">
        <el-descriptions
          class="detail-descriptions"
          :column="2"
          size="large"
          border
        >
          <el-descriptions-item label="主键数据唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="计划课程号">
            <div class="detail-value">{{ form.jhkch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="排课号">
            <div class="detail-value">{{ form.pkh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程号">
            <div class="detail-value">{{ form.kch || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="课程名称">
            <div class="detail-value">{{ form.kcmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业所属院系部">
            <div class="detail-value">{{ form.zyssyxbmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业名称">
            <div class="detail-value">{{ form.zymc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="专业号">
            <div class="detail-value">{{ form.zyh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="年级">
            <div class="detail-value">{{ form.nj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="班级名称">
            <div class="detail-value">{{ form.bjmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开课学年度">
            <div class="detail-value">{{ form.kkxnd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="开课学期">
            <div class="detail-value">
              {{ getKkxqmText(form.kkxqm) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="周次">
            <div class="detail-value">{{ form.zc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="星期几">
            <div class="detail-value">{{ getXqjText(form.xqj) || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课节次">
            <div class="detail-value">{{ form.skjc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课日期">
            <div class="detail-value">
              {{ formatDisplayTime(form.skrq) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="上课时间">
            <div class="detail-value">{{ form.sksj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教工号">
            <div class="detail-value">{{ form.jgh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教学班人数">
            <div class="detail-value">{{ form.jxbrs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课地点">
            <div class="detail-value">{{ form.skdd || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="教室号">
            <div class="detail-value">{{ form.jsh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="上课地点类别码">
            <div class="detail-value">{{ form.skddlbm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="选用教材出版号" :span="2">
            <div class="detail-value">{{ form.xyjccbh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">
              {{ formatDisplayTime(form.sjcjsj) || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            v-if="dialogMode !== 'view'"
            type="primary"
            @click="handleSubmit"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import type { FormInstance } from "element-plus";
import {
  Search,
  Refresh,
  Plus,
  Edit,
  Delete,
  View,
  Download,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";

// API导入
import {
  getOdsPksjPage,
  getOdsPksjById,
  addOdsPksj,
  updateOdsPksj,
  deleteOdsPksj,
  batchDeleteOdsPksj,
  exportOdsPksj,
  getSystemSchoolCode,
  getXqdmOptions,
  getSkddlbdmOptions,
  searchCourses,
  searchMajors,
  searchTeachers,
  searchClassrooms,
  type OdsPksjInfo,
  type OdsPksjQuery,
  type OdsPksjForm,
  type DictOption,
  type CourseBasicInfo,
  type MajorBasicInfo,
  type TeacherBasicInfo,
  type ClassroomBasicInfo,
} from "@/api-code/code/code_base/zygjx/ods_pksj";

// 响应式数据
const loading = ref(false);
const total = ref(0);
const dataList = ref<OdsPksjInfo[]>([]);
const selectedRows = ref<OdsPksjInfo[]>([]);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const submitLoading = ref(false);

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增排课数据";
    case "edit":
      return "编辑排课数据";
    case "view":
      return "查看排课数据";
    default:
      return "排课数据";
  }
});

// 表单引用
const queryFormRef = ref<FormInstance>();
const formRef = ref<FormInstance>();

// 查询参数
const queryParams = reactive<OdsPksjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  kcmc: "",
  zymc: "",
  nj: "",
  pageNum: 1,
  pageSize: 100,
});

// 表单数据
const form = reactive<OdsPksjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  jhkch: "",
  pkh: "",
  kch: "",
  kcmc: "",
  zyssyxbmc: "",
  zymc: "",
  zyh: "",
  nj: "",
  bjmc: "",
  kkxnd: "",
  kkxqm: "",
  zc: "",
  xqj: "",
  skjc: "",
  skrq: "",
  sksj: "",
  jgh: "",
  jxbrs: undefined,
  skdd: "",
  jsh: "",
  skddlbm: "",
  xyjccbh: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 表单验证规则
const rules = reactive({
  zjsjwyxbs: [
    { max: 32, message: "主键数据唯一性标识长度不能超过32位", trigger: "blur" },
    {
      pattern: /^[A-Z0-9]*$/,
      message: "主键数据唯一性标识只能包含大写字母和数字",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "学校代码必填", trigger: "blur" },
    { len: 10, message: "学校代码必须为10位数字", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "学校代码必须为10位数字", trigger: "blur" },
  ],
  jhkch: [
    { required: true, message: "计划课程号必填", trigger: "blur" },
    { max: 50, message: "计划课程号长度不能超过50位", trigger: "blur" },
  ],
  pkh: [
    { required: true, message: "排课号必填", trigger: "blur" },
    { max: 80, message: "排课号长度不能超过80位", trigger: "blur" },
  ],
  kch: [
    { required: true, message: "课程号必填", trigger: "blur" },
    { max: 50, message: "课程号长度不能超过50位", trigger: "blur" },
  ],
  kcmc: [
    { required: true, message: "课程名称必填", trigger: "blur" },
    { max: 60, message: "课程名称长度不能超过60位", trigger: "blur" },
  ],
  zyssyxbmc: [
    { required: true, message: "专业所属院系部名称必填", trigger: "blur" },
    { max: 60, message: "专业所属院系部名称长度不能超过60位", trigger: "blur" },
  ],
  zymc: [
    { required: true, message: "专业名称必填", trigger: "blur" },
    { max: 60, message: "专业名称长度不能超过60位", trigger: "blur" },
  ],
  zyh: [
    { required: true, message: "专业号必填", trigger: "blur" },
    { max: 64, message: "专业号长度不能超过64位", trigger: "blur" },
  ],
  nj: [
    { required: true, message: "年级必填", trigger: "blur" },
    { len: 4, message: "年级必须为4位数字", trigger: "blur" },
    {
      pattern: /^\d{4}$/,
      message: "年级格式不正确，如：2022",
      trigger: "blur",
    },
  ],
  bjmc: [
    { required: true, message: "班级名称必填", trigger: "blur" },
    { max: 60, message: "班级名称长度不能超过60位", trigger: "blur" },
  ],
  kkxnd: [
    { required: true, message: "开课学年度必填", trigger: "blur" },
    { len: 9, message: "开课学年度格式：YYYY-YYYY", trigger: "blur" },
    {
      pattern: /^\d{4}-\d{4}$/,
      message: "开课学年度格式不正确，如：2022-2023",
      trigger: "blur",
    },
  ],
  kkxqm: [{ required: true, message: "开课学期必填", trigger: "change" }],
  zc: [
    { required: true, message: "周次必填", trigger: "blur" },
    { max: 10, message: "周次长度不能超过10位", trigger: "blur" },
  ],
  xqj: [{ required: true, message: "星期几必填", trigger: "change" }],
  skjc: [
    { required: true, message: "上课节次必填", trigger: "blur" },
    { max: 5, message: "上课节次长度不能超过5位", trigger: "blur" },
  ],
  skrq: [
    { required: true, message: "上课日期必填", trigger: "blur" },
    { len: 8, message: "上课日期格式：YYYYMMDD", trigger: "blur" },
    {
      pattern: /^\d{8}$/,
      message: "上课日期格式不正确，如：20240101",
      trigger: "blur",
    },
  ],
  sksj: [
    { required: true, message: "上课时间必填", trigger: "blur" },
    { len: 6, message: "上课时间格式：hhmmss", trigger: "blur" },
    {
      pattern: /^\d{6}$/,
      message: "上课时间格式不正确，如：083000",
      trigger: "blur",
    },
  ],
  jgh: [
    { required: true, message: "教工号必填", trigger: "blur" },
    { max: 200, message: "教工号长度不能超过200位", trigger: "blur" },
  ],
  jxbrs: [{ required: true, message: "教学班人数必填", trigger: "blur" }],
  skdd: [
    { required: true, message: "上课地点必填", trigger: "blur" },
    { max: 180, message: "上课地点长度不能超过180位", trigger: "blur" },
  ],
  jsh: [
    { required: true, message: "教室号必填", trigger: "blur" },
    { max: 80, message: "教室号长度不能超过80位", trigger: "blur" },
  ],
  skddlbm: [{ required: true, message: "授课地点类别必选", trigger: "change" }],
  sjcjsj: [
    { required: true, message: "数据采集时间必填", trigger: "change" },
    {
      len: 15,
      message: "数据采集时间格式：YYYYMMDD hhmmss",
      trigger: "change",
    },
    {
      pattern: /^\d{8} \d{6}$/,
      message: "数据采集时间格式不正确，如：20240412 141503",
      trigger: "change",
    },
  ],
});

// 系统学校代码
const systemSchoolCode = ref("");

// 字典数据选项
const xqdmOptions = ref<DictOption[]>([]); // 学期代码选项
const skddlbdmOptions = ref<DictOption[]>([]); // 授课地点类别代码选项
const courseOptions = ref<CourseBasicInfo[]>([]); // 课程选项
const majorOptions = ref<MajorBasicInfo[]>([]); // 专业选项
const teacherOptions = ref<TeacherBasicInfo[]>([]); // 教师选项
const classroomOptions = ref<ClassroomBasicInfo[]>([]); // 教室选项

// 获取系统学校代码
const loadSystemSchoolCode = async () => {
  try {
    const response = await getSystemSchoolCode();
    const result = response as unknown as {
      data: { code: number; data: string; message?: string };
    };
    if (result?.data?.code === 200 && result?.data?.data) {
      systemSchoolCode.value = result.data.data;
      console.log("获取系统学校代码成功:", systemSchoolCode.value);
    } else {
      console.warn(
        "获取系统学校代码失败:",
        result?.data?.message || "未知错误",
      );
      ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.warning("获取系统学校代码失败，请检查系统是否已配置学校信息");
  }
};

// 加载字典数据
const loadDictOptions = async () => {
  try {
    // 加载学期代码字典
    const xqdmResponse = (await getXqdmOptions()) as any;
    if (xqdmResponse.data?.code === 200 && xqdmResponse.data?.data) {
      xqdmOptions.value = xqdmResponse.data.data;
    }

    // 加载授课地点类别代码字典
    const skddlbdmResponse = (await getSkddlbdmOptions()) as any;
    if (skddlbdmResponse.data?.code === 200 && skddlbdmResponse.data?.data) {
      skddlbdmOptions.value = skddlbdmResponse.data.data;
    }
  } catch (error) {
    console.error("加载字典数据失败:", error);
    ElMessage.warning("加载字典数据失败");
  }
};

// 搜索课程数据
const searchCourseOptions = async (keyword: string) => {
  if (!keyword || keyword.length < 2) {
    courseOptions.value = [];
    return;
  }

  try {
    const response = (await searchCourses(keyword, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      courseOptions.value = response.data.data;
    } else {
      courseOptions.value = [];
    }
  } catch (error) {
    console.error("搜索课程失败:", error);
    courseOptions.value = [];
  }
};

// 处理课程号选择变化
const handleCourseChange = (selectedKch: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kch === selectedKch,
  );
  if (selectedCourse) {
    form.kcmc = selectedCourse.kcmc;
  }
};

// 处理课程名称选择变化
const handleCourseNameChange = (selectedKcmc: string) => {
  const selectedCourse = courseOptions.value.find(
    (course) => course.kcmc === selectedKcmc,
  );
  if (selectedCourse) {
    form.kch = selectedCourse.kch;
  }
};

// 搜索专业数据
const searchMajorOptions = async (keyword: string) => {
  if (!keyword || keyword.length < 1) {
    majorOptions.value = [];
    return;
  }

  try {
    const response = (await searchMajors(keyword, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      majorOptions.value = response.data.data;
    } else {
      majorOptions.value = [];
    }
  } catch (error) {
    console.error("搜索专业失败:", error);
    majorOptions.value = [];
  }
};

// 处理专业号选择变化
const handleMajorChange = (selectedZyh: string) => {
  const selectedMajor = majorOptions.value.find(
    (major) => major.zyh === selectedZyh,
  );
  if (selectedMajor) {
    form.zymc = selectedMajor.zymc;
    form.zyssyxbmc = selectedMajor.zyssyxbmc;
  }
};

// 处理专业名称选择变化
const handleMajorNameChange = (selectedZymc: string) => {
  const selectedMajor = majorOptions.value.find(
    (major) => major.zymc === selectedZymc,
  );
  if (selectedMajor) {
    form.zyh = selectedMajor.zyh;
    form.zyssyxbmc = selectedMajor.zyssyxbmc;
  }
};

// 处理专业所属院系部选择变化
const handleMajorDepartmentChange = (selectedZyssyxbmc: string) => {
  const selectedMajor = majorOptions.value.find(
    (major) => major.zyssyxbmc === selectedZyssyxbmc,
  );
  if (selectedMajor) {
    form.zyh = selectedMajor.zyh;
    form.zymc = selectedMajor.zymc;
  }
};

// 搜索教师数据
const searchTeacherOptions = async (keyword: string) => {
  if (!keyword || keyword.length < 1) {
    teacherOptions.value = [];
    return;
  }

  try {
    const response = (await searchTeachers(keyword, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      teacherOptions.value = response.data.data;
    } else {
      teacherOptions.value = [];
    }
  } catch (error) {
    console.error("搜索教师失败:", error);
    teacherOptions.value = [];
  }
};

// 处理教师选择变化
const handleTeacherChange = (selectedJgh: string) => {
  const selectedTeacher = teacherOptions.value.find(
    (teacher) => teacher.jgh === selectedJgh,
  );
  if (selectedTeacher) {
    // 这里只需要设置教工号，因为在表单中只有jgh字段
    form.jgh = selectedTeacher.jgh;
  }
};

// 搜索教室数据
const searchClassroomOptions = async (keyword: string) => {
  if (!keyword || keyword.length < 1) {
    classroomOptions.value = [];
    return;
  }

  try {
    const response = (await searchClassrooms(keyword, 50)) as any;
    if (response.data?.code === 200 && response.data?.data) {
      classroomOptions.value = response.data.data;
    } else {
      classroomOptions.value = [];
    }
  } catch (error) {
    console.error("搜索教室失败:", error);
    classroomOptions.value = [];
  }
};

// 处理教室选择变化
const handleClassroomChange = (selectedJsh: string) => {
  const selectedClassroom = classroomOptions.value.find(
    (classroom) => classroom.jsh === selectedJsh,
  );
  if (selectedClassroom) {
    // 这里只需要设置教室号，因为在表单中只有jsh字段
    form.jsh = selectedClassroom.jsh;
  }
};

// 页面加载时获取数据
onMounted(() => {
  loadSystemSchoolCode();
  loadDictOptions();
  getList();
});

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    const response = (await getOdsPksjPage(queryParams)) as any;
    if (response.data?.code === 200) {
      dataList.value = response.data.data.records || [];
      total.value = response.data.data.total || 0;
    } else {
      ElMessage.error(response.data?.message || "获取数据失败");
    }
  } catch (error) {
    console.error("获取排课数据失败:", error);
    ElMessage.error("获取数据失败，请重试");
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
  queryParams.pageSize = 20;
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  // 自动设置学校代码
  if (systemSchoolCode.value) {
    form.xxdm = systemSchoolCode.value;
  }
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleUpdate = async (row: OdsPksjInfo) => {
  try {
    const response = (await getOdsPksjById(row.id)) as any;
    if (response.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取排课数据详情失败:", error);
    ElMessage.error("获取详情失败，请重试");
  }
};

// 查看详情
const handleView = async (row: OdsPksjInfo) => {
  try {
    const response = (await getOdsPksjById(row.id)) as any;
    if (response.data?.code === 200) {
      Object.assign(form, response.data.data);
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(response.data?.message || "获取详情失败");
    }
  } catch (error) {
    console.error("获取排课数据详情失败:", error);
    ElMessage.error("获取详情失败，请重试");
  }
};

// 删除
const handleDelete = (row: OdsPksjInfo) => {
  ElMessageBox.confirm(`确定要删除排课数据"${row.kcmc}"吗？`, "确认删除", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const response = (await deleteOdsPksj(row.id)) as any;
      if (response.data?.code === 200) {
        ElMessage.success("删除成功");
        getList();
      } else {
        ElMessage.error(response.data?.message || "删除失败");
      }
    } catch (error) {
      console.error("删除排课数据失败:", error);
      ElMessage.error("删除失败，请重试");
    }
  });
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 条排课数据吗？`,
    "确认批量删除",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  ).then(async () => {
    try {
      const ids = selectedRows.value.map((row) => row.id);
      const response = (await batchDeleteOdsPksj(ids)) as any;
      if (response.data?.code === 200) {
        ElMessage.success("批量删除成功");
        selectedRows.value = [];
        getList();
      } else {
        ElMessage.error(response.data?.message || "批量删除失败");
      }
    } catch (error) {
      console.error("批量删除排课数据失败:", error);
      ElMessage.error("批量删除失败，请重试");
    }
  });
};

// 导出
const handleExport = async () => {
  try {
    ElMessage.info("正在导出，请稍候...");
    const response = (await exportOdsPksj(queryParams)) as any;

    // 创建下载链接
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `排课数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出排课数据失败:", error);
    ElMessage.error("导出失败，请重试");
  }
};

// 表单提交
const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      submitLoading.value = true;
      try {
        let response;
        if (dialogMode.value === "add") {
          response = (await addOdsPksj(form)) as any;
        } else {
          response = (await updateOdsPksj(form)) as any;
        }

        if (response.data?.code === 200) {
          ElMessage.success(
            dialogMode.value === "add" ? "新增成功" : "修改成功",
          );
          dialogVisible.value = false;
          getList();
        } else {
          ElMessage.error(response.data?.message || "操作失败");
        }
      } catch (error) {
        console.error("提交表单失败:", error);
        ElMessage.error("操作失败，请重试");
      } finally {
        submitLoading.value = false;
      }
    }
  });
};

// 重置表单
const resetForm: any = () => {
  Object.keys(form).forEach((key) => {
    if (key === "reportStatus") {
      form[key] = "0";
    } else if (key === "enableStatus") {
      form[key] = "1";
    } else if (key === "jxbrs") {
      form[key] = undefined;
    } else {
      form[key] = "";
    }
  });
  form.id = undefined;
  formRef.value?.clearValidate();
};

// 选择变化
const handleSelectionChange = (selection: OdsPksjInfo[]) => {
  selectedRows.value = selection;
};

// 行双击
const handleRowDblClick = (row: OdsPksjInfo) => {
  handleView(row);
};

// 分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  queryParams.pageNum = 1;
  getList();
};

// 当前页变化
const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 获取上报状态标签类型
const getReportStatusTagType = (
  status: string,
): "success" | "danger" | "info" => {
  const typeMap: Record<string, "success" | "danger" | "info"> = {
    "0": "info",
    "1": "success",
    "2": "danger",
  };
  return typeMap[status] || "info";
};

// 获取上报状态文本
const getReportStatusText = (status: string) => {
  const textMap = { "0": "未上报", "1": "已上报", "2": "上报失败" };
  return textMap[status as keyof typeof textMap] || "未知";
};

// 获取开课学期文本
const getKkxqmText = (kkxqm: string | undefined) => {
  if (!kkxqm) return "-";
  const kkxqmTextMap = { "1": "第一学期", "2": "第二学期", "3": "第三学期" };
  return kkxqmTextMap[kkxqm as keyof typeof kkxqmTextMap] || "-";
};

// 获取星期几文本
const getXqjText = (xqj: string | undefined) => {
  if (!xqj) return "-";
  const xqjTextMap = {
    "1": "星期一",
    "2": "星期二",
    "3": "星期三",
    "4": "星期四",
    "5": "星期五",
    "6": "星期六",
    "7": "星期日",
  };
  return xqjTextMap[xqj as keyof typeof xqjTextMap] || "-";
};

// 格式化日期时间
const formatDisplayTime = (dateStr: string | undefined) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};
</script>

<style scoped>
.course-schedule-management {
  padding: 0px;
}

.search-card {
  height: 60px;
  margin-bottom: 0px;
}

.search-bar {
  .el-form-item {
    margin-bottom: 0px;
  }
}

.table-card {
  margin-top: -10px;
  margin-bottom: 20px;
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #fafafa;

  .operation-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .el-button {
      font-size: 14px;
      height: 32px;
      padding: 0 15px;
    }

    .el-divider--vertical {
      height: 20px;
      margin: 0 12px;
    }
  }

  .header-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    flex: 1;
    text-align: center;
  }

  .placeholder {
    width: 100px;
    display: flex;
    justify-content: flex-end;
  }
}

.table-body {
  :deep(.el-table) {
    border-radius: 0;

    .el-table__header-wrapper {
      th {
        background-color: #f8f9fa;
        color: #606266;
        font-weight: 600;
        border-bottom: 1px solid #e4e7ed;
      }
    }

    .el-table__body-wrapper {
      tr:hover > td {
        background-color: #f5f7fa !important;
      }
    }
  }
}

.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  border-top: 1px solid #e4e7ed;
  background-color: #fafafa;

  .total-info {
    font-size: 14px;
    color: #606266;
  }

  .pagination-controls {
    :deep(.el-pagination) {
      .el-pagination__total,
      .el-pagination__jump {
        color: #606266;
        font-size: 13px;
      }

      .el-pagination__sizes .el-select .el-input__wrapper {
        height: 28px;
      }

      .el-pager li {
        font-size: 13px;
        min-width: 28px;
        height: 28px;
        line-height: 28px;
      }

      .el-pagination__jump .el-input__wrapper {
        height: 28px;
      }
    }
  }
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;

  .el-button {
    margin: 0 3px;
    padding: 0 5px;
    font-size: 14px;
  }
}

/* 弹窗样式 */
.course-schedule-dialog {
  :deep(.el-dialog__body) {
    padding: 16px 20px;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 20px 16px;
    border-top: 1px solid #e4e7ed;
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

/* 对话框样式 */
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

.dialog-footer {
  text-align: right;
}

/* 详情样式 */
.course-schedule-detail {
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
      padding: 8px 12px;
    }

    :deep(.el-descriptions__table) {
      margin-bottom: 0;
    }

    :deep(.el-descriptions-item__cell) {
      padding: 6px 0;
    }
  }

  .detail-value {
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
}

/* 按钮间距 */
:deep(.el-button + .el-button) {
  margin-left: 8px;
}

/* 卡片样式 */
:deep(.el-card) {
  .el-card__body {
    padding: 20px;
  }
}
</style>
