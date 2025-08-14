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
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出Excel
          </el-button>
        </div>
        <div class="header-title">
          <h3>实习基础数据数据清洗</h3>
        </div>
        <div class="right-buttons">
          <!-- 导入按钮 -->
          <el-tooltip content="导入Excel数据" placement="top">
            <el-button class="import-button" @click="handleImport">
              <el-icon><Upload /></el-icon>导入
            </el-button>
          </el-tooltip>
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
            prop="xh"
            show-overflow-tooltip
            label="学号"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="xsxm"
            show-overflow-tooltip
            label="学生姓名"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="zymc"
            show-overflow-tooltip
            label="专业名称"
            min-width="180"
            sortable="custom"
          />
          <el-table-column
            prop="bjmc"
            show-overflow-tooltip
            label="班级名称"
            min-width="150"
            sortable="custom"
          />
          <el-table-column
            prop="sxqymc"
            show-overflow-tooltip
            label="实习企业"
            min-width="200"
            sortable="custom"
          />
          <el-table-column 
            prop="sxsfks" 
            label="实习是否开始" 
            min-width="120" 
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.sxsfks === '1' ? 'success' : 'info'"
                size="small"
              >
                {{ row.sxsfks === '1' ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column 
            prop="sxsfjs" 
            label="实习是否结束" 
            min-width="120" 
            align="center"
            sortable="custom"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.sxsfjs === '1' ? 'warning' : 'primary'"
                size="small"
              >
                {{ row.sxsfjs === '1' ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="xnzdjsxm"
            show-overflow-tooltip
            label="校内指导教师"
            min-width="150"
            sortable="custom"
          />
          <el-table-column label="上报状态" width="100" align="center" prop="reportStatus" sortable="custom">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center" prop="enableStatus" sortable="custom">
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
            prop="createTime"
            show-overflow-tooltip
            label="创建时间"
            min-width="160"
            sortable="custom"
          />
          <el-table-column
            prop="updateTime"
            show-overflow-tooltip
            label="更新时间"
            min-width="160"
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
      class="internship-dialog"
      destroy-on-close
    >
      <!-- 查看模式 - 描述列表 -->
      <div v-if="dialogType === 'view'" class="internship-detail">
        <el-descriptions class="detail-descriptions" :column="2" border>
          <el-descriptions-item label="主键数据唯一性标识">
            <span class="detail-value">{{ form.zjsjwyxbs || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <span class="detail-value">{{ form.xxdm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学号">
            <span class="detail-value">{{ form.xh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学生姓名">
            <span class="detail-value">{{ form.xsxm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="专业号">
            <span class="detail-value">{{ form.zyh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="专业名称">
            <span class="detail-value">{{ form.zymc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="班级名称">
            <span class="detail-value">{{ form.bjmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学制码">
            <span class="detail-value">{{ form.xzm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="学期码">
            <span class="detail-value">{{ form.xqm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="入学年份">
            <span class="detail-value">{{ form.rxnf || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习企业名称" :span="2">
            <span class="detail-value">{{ form.sxqymc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习企业行业类别码">
            <span class="detail-value">{{ form.sxqyhylbm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="是否对口">
            <el-tag :type="form.sfdk === '1' ? 'success' : 'info'" size="small">
              {{ form.sfdk === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实习是否开始">
            <el-tag
              :type="form.sxsfks === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sxsfks === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实习是否结束">
            <el-tag
              :type="form.sxsfjs === '1' ? 'warning' : 'primary'"
              size="small"
            >
              {{ form.sxsfjs === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="实习开始日期">
            <span class="detail-value">{{ form.sxksrq || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习结束日期">
            <span class="detail-value">{{ form.sxjsrq || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习安排码">
            <span class="detail-value">{{ form.sxapm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习形式码">
            <span class="detail-value">{{ form.sxxsm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习时长(周)">
            <span class="detail-value">{{ form.sxsc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习成绩">
            <span class="detail-value">{{ form.sxcj || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习内容" :span="2">
            <span class="detail-value">{{ form.sxnr || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习地点省">
            <span class="detail-value">{{ form.sxddszsjgmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="实习地点市">
            <span class="detail-value">{{ form.sxddszshjgmc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="校内指导教师姓名">
            <span class="detail-value">{{ form.xnzdjsxm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="校内指导教师工号">
            <span class="detail-value">{{ form.xnzdjsgh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="校内指导教师电话">
            <span class="detail-value">{{ form.xnzdjsdh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="校级监督咨询电话">
            <span class="detail-value">{{ form.xjjdzxdh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="企业指导人员姓名">
            <span class="detail-value">{{ form.qyzmzdryxm || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="企业指导人员电话">
            <span class="detail-value">{{ form.qyzmzdrydh || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="支付实习学生生均报酬">
            <span class="detail-value">{{ form.zfsxxssjbc || "-" }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="是否签订三方协议">
            <el-tag
              :type="form.sfqdsfxy === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sfqdsfxy === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否跨省实习">
            <el-tag
              :type="form.sfkssx === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sfkssx === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="是否赴国外实习">
            <el-tag
              :type="form.sffgwsx === '1' ? 'success' : 'info'"
              size="small"
            >
              {{ form.sffgwsx === "1" ? "是" : "否" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间" :span="2">
            <span class="detail-value">{{
              formatDisplayTime(form.sjcjsj || "")
            }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- 新增/编辑模式 - 表单 -->
      <div v-else class="internship-form">
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
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    placeholder="可选填写，不填由系统自动生成32位唯一编码"
                    maxlength="32"
                    show-word-limit
                    style="text-transform: uppercase"
                    clearable
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
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学号" prop="xh">
                  <el-input
                    v-model="form.xh"
                    placeholder="请输入学号"
                    maxlength="32"
                    show-word-limit
                    clearable
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
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="专业号" prop="zyh">
                  <el-input
                    v-model="form.zyh"
                    placeholder="请输入专业号"
                    maxlength="10"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="专业名称" prop="zymc">
                  <el-input
                    v-model="form.zymc"
                    placeholder="请输入专业名称"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="班级名称" prop="bjmc">
                  <el-input
                    v-model="form.bjmc"
                    placeholder="请输入班级名称"
                    maxlength="50"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学制码" prop="xzm">
                  <el-select
                    v-model="form.xzm"
                    placeholder="请选择学制码"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="三年制" value="3" />
                    <el-option label="四年制" value="4" />
                    <el-option label="五年制" value="5" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="学期码" prop="xqm">
                  <el-select
                    v-model="form.xqm"
                    placeholder="请选择学期码"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="第一学期" value="1" />
                    <el-option label="第二学期" value="2" />
                    <el-option label="第三学期" value="3" />
                    <el-option label="第四学期" value="4" />
                    <el-option label="第五学期" value="5" />
                    <el-option label="第六学期" value="6" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入学年份" prop="rxnf">
                  <el-date-picker
                    v-model="form.rxnf"
                    type="year"
                    placeholder="请选择入学年份"
                    value-format="YYYY"
                    format="YYYY年"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
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
            </el-row>
          </div>

          <!-- 实习信息 -->
          <div class="form-section">
            <div class="section-title">实习信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习是否开始" prop="sxsfks">
                  <el-select
                    v-model="form.sxsfks"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习是否结束" prop="sxsfjs">
                  <el-select
                    v-model="form.sxsfjs"
                    placeholder="请选择"
                    style="width: 100%"
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习开始日期" prop="sxksrq">
                  <el-date-picker
                    v-model="form.sxksrq"
                    type="date"
                    placeholder="请选择实习开始日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习结束日期" prop="sxjsrq">
                  <el-date-picker
                    v-model="form.sxjsrq"
                    type="date"
                    placeholder="请选择实习结束日期"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="实习企业名称" prop="sxqymc">
                  <el-input
                    v-model="form.sxqymc"
                    placeholder="请输入实习企业名称"
                    maxlength="100"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习企业行业类别码" prop="sxqyhylbm">
                  <el-input
                    v-model="form.sxqyhylbm"
                    placeholder="请输入实习企业行业类别码"
                    maxlength="10"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否对口" prop="sfdk">
                  <el-select
                    v-model="form.sfdk"
                    placeholder="请选择是否对口"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习安排码" prop="sxapm">
                  <el-select
                    v-model="form.sxapm"
                    placeholder="请选择实习安排码"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="学校统一安排" value="1" />
                    <el-option label="学生自主选择" value="2" />
                    <el-option label="校企合作安排" value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习形式码" prop="sxxsm">
                  <el-select
                    v-model="form.sxxsm"
                    placeholder="请选择实习形式码"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="集中实习" value="1" />
                    <el-option label="分散实习" value="2" />
                    <el-option label="顶岗实习" value="3" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习时长(周)" prop="sxsc">
                  <el-input-number
                    v-model="form.sxsc"
                    placeholder="请输入实习时长"
                    :min="0"
                    :max="999"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习成绩" prop="sxcj">
                  <el-input-number
                    v-model="form.sxcj"
                    placeholder="请输入实习成绩"
                    :min="0"
                    :max="100"
                    :precision="1"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="实习内容" prop="sxnr">
                  <el-input
                    v-model="form.sxnr"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入实习内容"
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习地点省" prop="sxddszsjgbm">
                  <el-input
                    v-model="form.sxddszsjgbm"
                    placeholder="省机构编码"
                    maxlength="12"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习地点省名称" prop="sxddszsjgmc">
                  <el-input
                    v-model="form.sxddszsjgmc"
                    placeholder="省机构名称"
                    maxlength="70"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="实习地点市编码" prop="sxddszshjgbm">
                  <el-input
                    v-model="form.sxddszshjgbm"
                    placeholder="市机构编码"
                    maxlength="12"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实习地点市名称" prop="sxddszshjgmc">
                  <el-input
                    v-model="form.sxddszshjgmc"
                    placeholder="市机构名称"
                    maxlength="70"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="是否签订三方协议" prop="sfqdsfxy">
                  <el-select
                    v-model="form.sfqdsfxy"
                    placeholder="请选择"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否跨省实习" prop="sfkssx">
                  <el-select
                    v-model="form.sfkssx"
                    placeholder="请选择"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="是否赴国外实习" prop="sffgwsx">
                  <el-select
                    v-model="form.sffgwsx"
                    placeholder="请选择"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 指导信息 -->
          <div class="form-section">
            <div class="section-title">指导信息</div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="校内指导教师姓名" prop="xnzdjsxm">
                  <el-input
                    v-model="form.xnzdjsxm"
                    placeholder="请输入校内指导教师姓名"
                    maxlength="36"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="校内指导教师工号" prop="xnzdjsgh">
                  <el-input
                    v-model="form.xnzdjsgh"
                    placeholder="请输入校内指导教师工号"
                    maxlength="32"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="校内指导教师电话" prop="xnzdjsdh">
                  <el-input
                    v-model="form.xnzdjsdh"
                    placeholder="请输入校内指导教师电话"
                    maxlength="11"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="校级监督咨询电话" prop="xjjdzxdh">
                  <el-input
                    v-model="form.xjjdzxdh"
                    placeholder="请输入校级监督咨询电话"
                    maxlength="11"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="企业指导人员姓名" prop="qyzmzdryxm">
                  <el-input
                    v-model="form.qyzmzdryxm"
                    placeholder="请输入企业指导人员姓名"
                    maxlength="36"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="企业指导人员电话" prop="qyzmzdrydh">
                  <el-input
                    v-model="form.qyzmzdrydh"
                    placeholder="请输入企业指导人员电话"
                    maxlength="11"
                    show-word-limit
                    clearable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 其他信息 -->
          <div class="form-section">
            <div class="section-title">其他信息</div>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="支付实习学生生均报酬" prop="zfsxxssjbc">
                  <el-input-number
                    v-model="form.zfsxxssjbc"
                    placeholder="请输入支付实习学生生均报酬"
                    :min="0"
                    :precision="2"
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
            @click="handleFormSubmit"
            >确定</el-button
          >
        </div>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="实习基础数据详情"
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
          <el-descriptions-item label="专业号">{{
            currentRecord.zyh || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="专业名称">{{
            currentRecord.zymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="班级名称">{{
            currentRecord.bjmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习是否开始">{{
            currentRecord.sxsfks === "1" ? "是" : "否"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习是否结束">{{
            currentRecord.sxsfjs === "1" ? "是" : "否"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习企业名称" :span="2">{{
            currentRecord.sxqymc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习地点省">{{
            currentRecord.sxddszsjgmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="实习地点市">{{
            currentRecord.sxddszshjgmc || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="校内指导教师">{{
            currentRecord.xnzdjsxm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="企业指导人员">{{
            currentRecord.qyzmzdryxm || "-"
          }}</el-descriptions-item>
          <el-descriptions-item label="数据采集时间">{{
            formatDisplayDateTime(currentRecord.sjcjsj)
          }}</el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusType(currentRecord.reportStatus || '0')"
              size="small"
            >
              {{ getReportStatusText(currentRecord.reportStatus || "0") }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="currentRecord.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ currentRecord.enableStatus === '1' ? '启用' : '禁用' }}
            </el-tag>
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

    <!-- 导入对话框 -->
    <el-dialog
      title="导入实习基础数据"
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
            <!-- 导入模式说明 -->
            <div class="import-mode-description">
              <h4 style="color: #f56c6c;">导入模式:</h4>
              <div class="mode-info">
                <el-icon style="color: #67c23a;"><CircleCheckFilled /></el-icon>
                <span style="color: #67c23a; font-weight: 600;">根据学号更新</span>
              </div>
              <p style="color: #606266; font-size: 13px; margin-top: 8px;">
                如果Excel中的学号在系统中已存在，将更新该学生的实习信息；如果不存在，则新增记录。
              </p>
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
  Upload,
  UploadFilled,
  Warning,
  CircleCheckFilled,
} from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  pageOdsSxjcsj,
  getOdsSxjcsjById,
  addOdsSxjcsj,
  updateOdsSxjcsj,
  deleteOdsSxjcsj,
  batchDeleteOdsSxjcsj,
  exportOdsSxjcsj,
  updateOdsSxjcsjReportStatus,
  updateOdsSxjcsjEnableStatus,
  
  parseExcelHeaders,
  importOdsSxjcsjWithMapping,
  downloadTemplate,
  getSystemFields,
  getEducationSystemOptions,
  getSemesterOptions,
  getYesNoOptions,
  getInternshipArrangementOptions,
  getInternshipFormOptions,
  type OdsSxjcsjInfo,
  type OdsSxjcsjQuery,
  type ExcelParseResult,
  type FieldMapping,
  type ImportConfig,
  type SystemField,
} from "@/api-data/data/data_base/zygjx/ods_sxjcsj";
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";
import ProgressDialog from "@/components/ProgressDialog/index.vue";

// 状态定义
const loading = ref(false);
const dataList = ref<OdsSxjcsjInfo[]>([]);
const total = ref(0);
const selectedIds = ref<number[]>([]);
const queryParams = reactive<OdsSxjcsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  xh: "",
  xsxm: "",
  sxqymc: "",
  reportStatus: "", // 上报状态
  pageNum: 1,
  pageSize: 100,
  orderByColumn: "", // 排序字段
  isAsc: "asc", // 排序方式
});

// 导入相关状态
const importDialogVisible = ref(false);
const fieldMappingDialogVisible = ref(false);
const currentExcelFile = ref<File | null>(null);
const excelParseResult = ref<ExcelParseResult | null>(null);
const fieldMapping = ref<FieldMapping>({});
const systemFields = ref<SystemField[]>([]);
const importProcessing = ref(false);
const uploadRef = ref();

// 进度条相关状态
const importProgressVisible = ref(false);
const importProgressTitle = ref('数据导入');
const importProgress = ref(0);
const importStatus = ref<'loading' | 'success' | 'error'>('loading');
const importStatusText = ref('准备导入...');
const importDetailInfo = ref('');

// 字典数据
const educationSystemOptions = ref<Array<{ value: string; label: string }>>([]);
const semesterOptions = ref<Array<{ value: string; label: string }>>([]);
const yesNoOptions = ref<Array<{ value: string; label: string }>>([]);
const internshipArrangementOptions = ref<Array<{ value: string; label: string }>>([]);
const internshipFormOptions = ref<Array<{ value: string; label: string }>>([]);

// 系统学校代码
const systemSchoolCode = ref<string>("");

// 未映射字段表单数据
const unmappedFieldsForm = ref<Record<string, any>>({});

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const activeTab = ref("basic");
const currentRecord = ref<OdsSxjcsjInfo | null>(null);

// 采集时间范围
const sjcjsjRange = ref<[string, string] | undefined>(undefined);

// 组件引用
const queryForm = ref<FormInstance>();
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 计算属性 - 对话框标题
const dialogTitle = computed(() => {
  const titles = {
    add: "新增实习基础数据",
    edit: "编辑实习基础数据",
    view: "查看实习基础数据",
  };
  return titles[dialogType.value];
});

// 表单数据
const form = reactive<OdsSxjcsjInfo>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: systemSchoolCode.value,
  xh: "",
  xsxm: "",
  zyh: "",
  zymc: "",
  bjmc: "",
  xzm: "",
  xqm: "",
  sxsfks: "",
  sxsfjs: "",
  sxqyhylbm: "",
  sxnr: "",
  sfdk: "",
  sxapm: "",
  sxxsm: "",
  sxsc: undefined,
  sxcj: undefined,
  sxksrq: "",
  sxjsrq: "",
  sxqymc: "",
  sxddszsjgbm: "",
  sxddszsjgmc: "",
  sxddszshjgbm: "",
  sxddszshjgmc: "",
  xnzdjsgh: "",
  xnzdjsxm: "",
  xnzdjsdh: "",
  qyzmzdryxm: "",
  qyzmzdrydh: "",
  zfsxxssjbc: undefined,
  xjjdzxdh: "",
  sfqdsfxy: "",
  sfkssx: "",
  sffgwsx: "",
  rxnf: "",
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
    { max: 32, message: "学号长度不能超过32位", trigger: "blur" },
  ],
  xsxm: [
    { required: true, message: "请输入学生姓名", trigger: "blur" },
    { max: 36, message: "学生姓名长度不能超过36位", trigger: "blur" },
  ],
  sjcjsj: [
    { required: true, message: "请选择数据采集时间", trigger: "change" },
  ],
});

// 时间格式化方法
const formatDisplayTime = (timeStr: string) => {
  if (!timeStr) return "-";
  if (timeStr.length === 14) {
    // 格式化: YYYYMMDDHHmmss -> YYYY-MM-DD HH:mm:ss
    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(8, 10);
    const minute = timeStr.substring(10, 12);
    const second = timeStr.substring(12, 14);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
  return timeStr;
};

// 获取列表数据
const getList = async () => {
  try {
    loading.value = true;
    const response = await pageOdsSxjcsj(queryParams);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      dataList.value = (apiResponse.data.data.records || []).map(
        (item: any) => ({
          ...item,
          statusLoading: false,
        }),
      );
      total.value = apiResponse.data.data.total || 0;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取数据失败");
    }
  } catch (error: any) {
    console.error("获取列表失败:", error);
    ElMessage.error(error.message || "获取列表失败");
  } finally {
    loading.value = false;
  }
};

// 查询与重置
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
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.xh = "";
  queryParams.xsxm = "";
  queryParams.sxqymc = "";
  queryParams.reportStatus = ""; // 重置上报状态
  queryParams.sjcjsjStart = ""; // 重置采集时间开始
  queryParams.sjcjsjEnd = ""; // 重置采集时间结束
  queryParams.pageNum = 1;
  sjcjsjRange.value = undefined; // 重置采集时间范围
  getList();
};

// 表格选择和分页
const handleSelectionChange = (selection: OdsSxjcsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id as number);
};

const handleSizeChange = (size: number) => {
  queryParams.pageSize = size;
  getList();
};

const handleCurrentChange = (current: number) => {
  queryParams.pageNum = current;
  getList();
};

/** 表格排序事件处理 */
const handleSortChange = (column: { prop: string; order: string }) => {
  console.log('排序变化:', column);
  queryParams.orderByColumn = column.prop;
  queryParams.isAsc = column.order === 'ascending' ? 'asc' : 'desc';
  getList();
};

// 重置表单
const resetForm = () => {
  currentRecord.value = null;
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    xh: "",
    xsxm: "",
    zyh: "",
    zymc: "",
    bjmc: "",
    xzm: "",
    xqm: "",
    sxsfks: "",
    sxsfjs: "",
    sxqyhylbm: "",
    sxnr: "",
    sfdk: "",
    sxapm: "",
    sxxsm: "",
    sxsc: undefined,
    sxcj: undefined,
    sxksrq: "",
    sxjsrq: "",
    sxqymc: "",
    sxddszsjgbm: "",
    sxddszsjgmc: "",
    sxddszshjgbm: "",
    sxddszshjgmc: "",
    xnzdjsgh: "",
    xnzdjsxm: "",
    xnzdjsdh: "",
    qyzmzdryxm: "",
    qyzmzdrydh: "",
    zfsxxssjbc: undefined,
    xjjdzxdh: "",
    sfqdsfxy: "",
    sfkssx: "",
    sffgwsx: "",
    rxnf: "",
    sjcjsj: "",
    reportStatus: "0",
    enableStatus: "1",
  });
};

// CRUD操作
const handleAdd = () => {
  resetForm();
  dialogType.value = "add";
  dialogVisible.value = true;
  activeTab.value = "basic";
};

const handleEdit = async (row: OdsSxjcsjInfo) => {
  resetForm();
  try {
    loading.value = true;
    const response = await getOdsSxjcsjById(row.id as number);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      Object.assign(form, apiResponse.data.data);
      dialogType.value = "edit";
      dialogVisible.value = true;
      activeTab.value = "basic";
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleView = async (row: OdsSxjcsjInfo) => {
  try {
    loading.value = true;
    const response = await getOdsSxjcsjById(row.id as number);
    const apiResponse = response as unknown as {
      data: { code: number; data: any; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      Object.assign(form, apiResponse.data.data);
      dialogType.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error(apiResponse?.data?.message || "获取详情失败");
    }
  } catch (error: any) {
    ElMessage.error(error.message || "获取详情失败");
  } finally {
    loading.value = false;
  }
};

const handleDelete = (row: OdsSxjcsjInfo) => {
  const systemInfo = row.xsxm || row.zjsjwyxbs || "未知记录";
  const confirmMessage = `确定要删除以下实习基础数据吗？

学生姓名：${systemInfo}
唯一标识：${row.zjsjwyxbs || "无"}

删除后将无法恢复！`;

  ElMessageBox.confirm(confirmMessage, "删除确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response = await deleteOdsSxjcsj(row.id as number);
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("删除成功");
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

const handleBatchDelete = () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  const confirmMessage = `确定要批量删除选中的 ${selectedIds.value.length} 条实习基础数据吗？

删除后将无法恢复！`;

  ElMessageBox.confirm(confirmMessage, "批量删除确认", {
    confirmButtonText: "确定删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        loading.value = true;
        const response = await batchDeleteOdsSxjcsj(selectedIds.value);
        const apiResponse = response as unknown as {
          data: { code: number; message?: string };
        };
        if (apiResponse?.data?.code === 200) {
          ElMessage.success("批量删除成功");
          getList();
        } else {
          ElMessage.error(apiResponse?.data?.message || "批量删除失败");
        }
      } catch (error: any) {
        ElMessage.error(error.message || "批量删除失败");
      } finally {
        loading.value = false;
      }
    })
    .catch(() => {
      ElMessage.info("已取消删除");
    });
};

// 导出Excel
const handleExport = async () => {
  try {
    loading.value = true;
    ElMessage.info("正在导出数据，请稍候...");

    const response = await exportOdsSxjcsj(queryParams);

    let blob: Blob;
    if (response.data instanceof Blob) {
      blob = response.data;
    } else if (response instanceof Blob) {
      blob = response;
    } else {
      throw new Error("服务器返回了错误的响应格式");
    }

    if (blob.size === 0) {
      throw new Error("导出的文件为空，请检查数据或联系管理员");
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.style.display = "none";
    link.href = url;

    const now = new Date();
    const dateStr = now.toLocaleDateString("zh-CN").replace(/\//g, "-");
    const timeStr = now.getTime();
    link.download = `实习基础数据_${dateStr}_${timeStr}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    ElMessage.success("导出成功");
  } catch (error: any) {
    console.error("导出失败:", error);
    ElMessage.error(error.message || "导出失败，请重试");
  } finally {
    loading.value = false;
  }
};

// 表单相关函数
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    const valid = await formRef.value.validate();
    if (!valid) return;

    submitLoading.value = true;

    if (dialogType.value === "add") {
      const response = await addOdsSxjcsj(form);
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("新增成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(apiResponse?.data?.message || "新增失败");
      }
    } else {
      const response = await updateOdsSxjcsj(form);
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("修改成功");
        dialogVisible.value = false;
        getList();
      } else {
        ElMessage.error(apiResponse?.data?.message || "修改失败");
      }
    }
  } catch (error) {
    console.error("提交失败:", error);
    ElMessage.error("操作失败");
  } finally {
    submitLoading.value = false;
  }
};

// 详情对话框函数
const handleDetailClose = () => {
  viewDialogVisible.value = false;
};

// 状态处理函数
const getReportStatusType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "info"; // 默认为info
  }
  switch (String(status)) {
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

const getEnableStatusType = (
  status: string,
): "success" | "info" | "warning" | "danger" => {
  if (!status && status !== "0") {
    return "success"; // 默认为success
  }
  switch (String(status)) {
    case "0":
      return "danger";
    case "1":
      return "success";
    default:
      return "info";
  }
};

const getEnableStatusText = (status: string): string => {
  console.log("启用状态值:", status, "类型:", typeof status);
  if (!status && status !== "0") {
    return "启用"; // 默认为启用
  }
  switch (String(status)) {
    case "0":
      return "禁用";
    case "1":
      return "启用";
    default:
      return "未知";
  }
};

const getReportStatusText = (status: string | number): string => {
  switch (String(status)) {
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

const handleReportStatusClick = async (row: OdsSxjcsjInfo) => {
  try {
    const { value } = await ElMessageBox.prompt(
      "请输入新的上报状态 (0-未上报, 1-已上报, 2-上报失败)",
      "修改上报状态",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[0-2]$/,
        inputErrorMessage: "请输入有效的状态值 (0, 1, 2)",
      },
    );

    if (value !== null) {
      const response = await updateOdsSxjcsjReportStatus(
        row.id as number,
        value,
      );
      const apiResponse = response as unknown as {
        data: { code: number; message?: string };
      };
      if (apiResponse?.data?.code === 200) {
        ElMessage.success("上报状态修改成功");
        row.reportStatus = value;
      } else {
        ElMessage.error(apiResponse?.data?.message || "修改失败");
      }
    }
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "修改上报状态失败");
    }
  }
};

const handleEnableStatusChange = async (
  row: OdsSxjcsjInfo & { statusLoading?: boolean },
) => {
  try {
    (row as any).statusLoading = true;
    const response = await updateOdsSxjcsjEnableStatus(
      row.id as number,
      row.enableStatus as string,
    );
    const apiResponse = response as unknown as {
      data: { code: number; message?: string };
    };
    if (apiResponse?.data?.code === 200) {
      ElMessage.success("启用状态修改成功");
    } else {
      ElMessage.error(apiResponse?.data?.message || "修改失败");
      row.enableStatus = row.enableStatus === "1" ? "0" : "1";
    }
  } catch (error: any) {
    ElMessage.error(error.message || "修改启用状态失败");
    row.enableStatus = row.enableStatus === "1" ? "0" : "1";
  } finally {
    (row as any).statusLoading = false;
  }
};

// 格式化函数
const formatDisplayDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";

  if (dateTimeStr.length === 14) {
    return `${dateTimeStr.substring(0, 4)}-${dateTimeStr.substring(4, 6)}-${dateTimeStr.substring(6, 8)} ${dateTimeStr.substring(8, 10)}:${dateTimeStr.substring(10, 12)}:${dateTimeStr.substring(12, 14)}`;
  }
  return dateTimeStr;
};

const formatDateTime = (dateTimeStr: string | undefined): string => {
  if (!dateTimeStr) return "-";

  try {
    const date = new Date(dateTimeStr);
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateTimeStr;
  }
};

// ============== 导入相关方法 ==============

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

// 加载字典数据
const loadDictData = async () => {
  try {
    educationSystemOptions.value = getEducationSystemOptions();
    semesterOptions.value = getSemesterOptions();
    yesNoOptions.value = getYesNoOptions();
    internshipArrangementOptions.value = getInternshipArrangementOptions();
    internshipFormOptions.value = getInternshipFormOptions();
  } catch (error) {
    ElMessage.error("加载字典数据失败");
  }
};

// 加载系统字段定义
const loadSystemFields = () => {
  const baseFields = getSystemFields();
  
  // 为选择类型的字段设置实际的选项数据
  systemFields.value = baseFields.map(field => {
    const updatedField = { ...field };
    
    switch (field.field) {
      case 'xzm':
        updatedField.options = educationSystemOptions.value;
        break;
      case 'xqm':
        updatedField.options = semesterOptions.value;
        break;
      case 'sfdk':
      case 'sxsfks':
      case 'sxsfjs':
      case 'sfqdsfxy':
      case 'sfkssx':
      case 'sffgwsx':
        updatedField.options = yesNoOptions.value;
        break;
      case 'sxapm':
        updatedField.options = internshipArrangementOptions.value;
        break;
      case 'sxxsm':
        updatedField.options = internshipFormOptions.value;
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

// 导入操作
const handleImport = () => {
  importDialogVisible.value = true;
};

// 导入提示内容
const importTipContent = `导入说明：
1. 请先下载导入模板，按模板格式填写数据
2. 模板第一行为字段中文名称，请勿修改
3. 从第二行开始录入数据
4. 必填字段不能为空
5. 支持.xls和.xlsx格式文件
6. 如果学号已存在，系统将更新该记录`;

// 下载模板
const handleDownloadTemplate = async () => {
  try {
    const response: any = await downloadTemplate({
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
    link.download = `实习基础数据导入模板_${new Date().getTime()}.xlsx`;
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
  
  // 自动设置学校代码的默认值
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
  
  // 定义匹配规则 - 使用更精确的匹配
  const matchRules: { [key: string]: string[] } = {
    'xxdm': ['学校代码', 'xxdm', 'schoolcode'],
    'xh': ['学号', 'xh', 'studentno', '学生学号'],
    'xsxm': ['学生姓名', 'xsxm', 'studentname', '姓名'],
    'zyh': ['专业号', 'zyh', 'majorcode', '专业代码'],
    'zymc': ['专业名称', 'zymc', 'majorname', '专业'],
    'bjmc': ['班级名称', 'bjmc', 'classname', '班级'],
    'xzm': ['学制码', 'xzm', '学制'],
    'xqm': ['学期码', 'xqm', '学期'],
    'sxsfks': ['实习是否开始', 'sxsfks', '是否开始'],
    'sxsfjs': ['实习是否结束', 'sxsfjs', '是否结束'],
    'sxqyhylbm': ['实习企业行业类别码', 'sxqyhylbm', '行业类别码'],
    'sxnr': ['实习内容', 'sxnr', '内容'],
    'sfdk': ['是否对口', 'sfdk'],
    'sxapm': ['实习安排码', 'sxapm', '安排码'],
    'sxxsm': ['实习形式码', 'sxxsm', '形式码'],
    'sxsc': ['实习时长', 'sxsc', '时长'],
    'sxcj': ['实习成绩', 'sxcj', '成绩'],
    'sxksrq': ['实习开始日期', 'sxksrq', '开始日期'],
    'sxjsrq': ['实习结束日期', 'sxjsrq', '结束日期'],
    'sxqymc': ['实习企业名称', 'sxqymc', '实习企业', '企业名称'],
    'sxddszsjgbm': ['实习地点所在省机构编码', 'sxddszsjgbm', '省机构编码'],
    'sxddszsjgmc': ['实习地点所在省机构名称', 'sxddszsjgmc', '省机构名称'],
    'sxddszshjgbm': ['实习地点所在市机构编码', 'sxddszshjgbm', '市机构编码'],
    'sxddszshjgmc': ['实习地点所在市机构名称', 'sxddszshjgmc', '市机构名称'],
    'xnzdjsgh': ['校内指导教师工号', 'xnzdjsgh', '教师工号'],
    'xnzdjsxm': ['校内指导教师姓名', 'xnzdjsxm', '指导教师', '校内指导教师'],
    'xnzdjsdh': ['校内指导教师电话', 'xnzdjsdh', '教师电话'],
    'qyzmzdryxm': ['企业专门指导人员姓名', 'qyzmzdryxm', '企业指导人员'],
    'qyzmzdrydh': ['企业专门指导人员电话', 'qyzmzdrydh', '企业人员电话'],
    'zfsxxssjbc': ['支付实习学生生均报酬', 'zfsxxssjbc', '生均报酬'],
    'xjjdzxdh': ['校级监督咨询电话', 'xjjdzxdh', '监督电话'],
    'sfqdsfxy': ['是否签订三方协议', 'sfqdsfxy', '三方协议'],
    'sfkssx': ['是否跨省实习', 'sfkssx', '跨省实习'],
    'sffgwsx': ['是否赴国外实习', 'sffgwsx', '国外实习'],
    'rxnf': ['入学年份', 'rxnf', '入学年度'],
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
      updateByStudentNumber: true, // 根据学号更新数据
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
      response = (await importOdsSxjcsjWithMapping(currentExcelFile.value, config)) as any;
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
      
      const result = response.data.data;
      importDetailInfo.value = `成功导入 ${result.successCount || 0} 条，更新 ${result.updateCount || 0} 条`;
      
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
  const mappedFields = Object.values(fieldMapping.value).filter(field => field && field.trim() !== '');
  const defaults: Record<string, string> = {};
  
  // 定义所有必填字段及其默认值
  const requiredFieldsWithDefaults = [
    { field: 'xzm', defaultValue: '3' }, // 默认：三年制
    { field: 'xqm', defaultValue: '1' }, // 默认：第一学期
    { field: 'sxsfks', defaultValue: '0' }, // 默认：否
    { field: 'sxsfjs', defaultValue: '0' }, // 默认：否
    { field: 'sfdk', defaultValue: '0' }, // 默认：否
    { field: 'sxapm', defaultValue: '1' }, // 默认：学校统一安排
    { field: 'sxxsm', defaultValue: '1' }, // 默认：集中实习
    { field: 'sfqdsfxy', defaultValue: '0' }, // 默认：否
    { field: 'sfkssx', defaultValue: '0' }, // 默认：否
    { field: 'sffgwsx', defaultValue: '0' }, // 默认：否
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

// 获取列数据预览
const getColumnPreview = (columnIndex: number) => {
  if (!excelParseResult.value?.dataPreview) return [];
  return excelParseResult.value.dataPreview.map(row => row[columnIndex]).slice(0, 3);
};

// 字段映射变更事件
const onFieldMappingChange = () => {
  // 触发响应式更新
  fieldMapping.value = { ...fieldMapping.value };
  // 调试日志
  console.log('字段映射已更新:', fieldMapping.value);
  console.log('已映射字段:', Object.values(fieldMapping.value).filter(field => field && field.trim() !== ''));
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
  return Object.values(fieldMapping.value).filter(field => field && field.trim() !== '').length;
};

// 获取必填字段数量
const getRequiredFieldsCount = () => {
  return systemFields.value.filter(field => field.required).length;
};

// 获取未设置必填字段数量
const getUnsetRequiredFieldsCount = () => {
  const mappedFields = Object.values(fieldMapping.value).filter(field => field && field.trim() !== '');
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
  const mappedFields = Object.values(fieldMapping.value).filter(field => field && field.trim() !== '');
  const hasMapping = mappedFields.includes(fieldName);
  const hasDefaultValue = unmappedFieldsForm.value[fieldName] !== undefined && unmappedFieldsForm.value[fieldName] !== '';
  return {
    isMapped: hasMapping,
    hasDefault: hasDefaultValue,
    isSet: hasMapping || hasDefaultValue
  };
};

// 获取未映射的字段
const getUnmappedFields = () => {
  // 过滤掉空值，只获取实际已映射的字段
  const mappedFields = Object.values(fieldMapping.value).filter(field => field && field.trim() !== '');
  // 定义不需要在未映射字段中显示的字段
  const excludeFields = [
    'zjsjwyxbs',    // 主键唯一标识 - 系统自动生成
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
    // 检查字段是否已被映射
    return !mappedFields.includes(field.field);
  });
};

// 获取字段对应的选项
const getFieldOptions = (fieldName: string) => {
  switch (fieldName) {
    case 'xzm':
      return educationSystemOptions.value;
    case 'xqm':
      return semesterOptions.value;
    case 'sfdk':
    case 'sxsfks':
    case 'sxsfjs':
    case 'sfqdsfxy':
    case 'sfkssx':
    case 'sffgwsx':
      return yesNoOptions.value;
    case 'sxapm':
      return internshipArrangementOptions.value;
    case 'sxxsm':
      return internshipFormOptions.value;
    default:
      return [];
  }
};

// 获取字段示例
const getFieldExample = (fieldName: string) => {
  // 定义字段示例数据
  const fieldExamples: Record<string, string> = {
    'xxdm': '10001',
    'xh': '2023001',
    'xsxm': '张三',
    'zyh': '001',
    'zymc': '计算机应用技术',
    'bjmc': '计算机201班',
    'xzm': '3',
    'xqm': '1',
    'sxsfks': '是',
    'sxsfjs': '否',
    'sxqyhylbm': '6411',
    'sxnr': '软件开发实习',
    'sfdk': '是',
    'sxapm': '1',
    'sxxsm': '1',
    'sxsc': '16',
    'sxcj': '85.5',
    'sxksrq': '20240301',
    'sxjsrq': '20240630',
    'sxqymc': '腾讯科技有限公司',
    'sxddszsjgbm': '110000',
    'sxddszsjgmc': '北京市',
    'sxddszshjgbm': '110100',
    'sxddszshjgmc': '东城区',
    'xnzdjsgh': 'T001',
    'xnzdjsxm': '李老师',
    'xnzdjsdh': '13800138001',
    'qyzmzdryxm': '王工程师',
    'qyzmzdrydh': '13900139001',
    'zfsxxssjbc': '3000',
    'xjjdzxdh': '4008001234',
    'sfqdsfxy': '是',
    'sfkssx': '否',
    'sffgwsx': '否',
    'rxnf': '2023',
    'sjcjsj': '20240105 101010'
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

// 初始化
onMounted(async () => {
  await loadDictData(); // 先加载字典数据
  loadSystemSchoolCode();
  loadSystemFields(); // 然后加载系统字段
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

  .internship-dialog {
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
}

.dialog-footer {
  padding-top: 10px;
  margin-top: 8px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

:deep(.el-descriptions__label) {
  width: 140px;
  font-weight: bold;
}

:deep(.el-tabs__content) {
  padding: 20px 0;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

:deep(.el-descriptions-item__label) {
  font-weight: bold;
  color: #606266;
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
.internship-form {
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
.internship-detail {
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

/* 表单样式 */
.internship-form {
  .form-container {
    max-height: 450px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 8px;
    padding-bottom: 3px;
  }

  .form-section {
    margin-bottom: 15px;

    .section-title {
      font-size: 13px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 10px;
      padding-bottom: 3px;
      border-bottom: 1px solid #dcdfe6;
      position: relative;
    }
  }

  :deep(.el-row) {
    margin-bottom: 3px;
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
}

/* 详情样式 */
.internship-detail {
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
      .import-mode-description {
        margin-bottom: 20px;
        padding: 16px;
        background-color: #f0f9ff;
        border-radius: 6px;
        border: 1px solid #e1f5fe;
        
        h4 {
          margin: 0 0 12px 0;
          color: #303133;
          font-size: 16px;
        }
        
        .mode-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
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
