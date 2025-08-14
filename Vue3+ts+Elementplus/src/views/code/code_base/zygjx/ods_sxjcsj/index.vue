<template>
  <div class="entity-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item label="唯一性标识" prop="zjsjwyxbs">
            <el-input
              v-model="queryParams.zjsjwyxbs"
              placeholder="请输入主键数据唯一性标识"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="学校代码" prop="xxdm">
            <el-input
              v-model="queryParams.xxdm"
              placeholder="请输入学校代码"
              clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
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
          <el-form-item label="上报状态" prop="reportStatus">
            <el-select
              v-model="queryParams.reportStatus"
              placeholder="请选择上报状态"
              clearable
              style="width: 120px"
            >
              <el-option label="未上报" value="0" />
              <el-option label="已上报" value="1" />
              <el-option label="上报失败" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态" prop="enableStatus">
            <el-select
              v-model="queryParams.enableStatus"
              placeholder="请选择启用状态"
              clearable
              style="width: 120px"
            >
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
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
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </div>
        <div class="header-title">实习基础数据表编码管理</div>
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
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
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
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xsxm"
            label="学生姓名"
            width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="zymc"
            label="专业名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="bjmc"
            label="班级名称"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sxqymc"
            label="实习企业"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column label="实习状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.sxsfks === '1'" type="success">已开始</el-tag>
              <el-tag v-else type="info">未开始</el-tag>
              <br />
              <el-tag
                v-if="row.sxsfjs === '1'"
                type="warning"
                style="margin-top: 2px"
                >已结束</el-tag
              >
              <el-tag v-else type="primary" style="margin-top: 2px"
                >进行中</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            prop="xnzdjsxm"
            label="校内指导教师"
            width="150"
            show-overflow-tooltip
          />
          <el-table-column label="上报状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                @click="handleReportStatusClick(row)"
                style="cursor: pointer"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" width="100" align="center">
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
            show-overflow-tooltip
          >
            <template #default="{ row }">
              {{ formatDateTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="updateTime"
            label="更新时间"
            width="160"
            show-overflow-tooltip
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
              :type="getReportStatusTagType(currentRecord.reportStatus || '0')"
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
  type OdsSxjcsjInfo,
  type OdsSxjcsjQuery,
} from "@/api-code/code/code_base/zygjx/ods_sxjcsj";

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
  pageNum: 1,
  pageSize: 20,
});

// 对话框状态
const dialogVisible = ref(false);
const viewDialogVisible = ref(false);
const dialogType = ref<"add" | "edit" | "view">("add");
const activeTab = ref("basic");
const currentRecord = ref<OdsSxjcsjInfo | null>(null);

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
  xxdm: "",
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

const resetQuery = () => {
  queryParams.zjsjwyxbs = "";
  queryParams.xxdm = "";
  queryParams.xh = "";
  queryParams.xsxm = "";
  queryParams.sxqymc = "";
  queryParams.pageNum = 1;
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

// 重置表单
const resetForm = () => {
  currentRecord.value = null;
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: "",
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
const getReportStatusTagType = (status: string | number) => {
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

// 初始化
onMounted(() => {
  getList();
});
</script>

<style scoped lang="scss">
.entity-management {
  padding: 0px;

  .search-card {
    margin-bottom: 2px;

    :deep(.el-card__body) {
      padding: 8px 15px;
    }

    :deep(.el-form) {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }

    :deep(.el-form-item) {
      margin-bottom: 0;
      margin-right: 10px;
    }

    :deep(.el-form-item__label) {
      width: 70px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 160px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: auto;
      margin-right: 0;
    }
  }

  .table-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 10px 15px;
    }

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      position: relative;
    }
  }

  .table-body {
    margin-bottom: 8px;

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

  .operation-buttons {
    display: flex;
    align-items: center;

    .el-button {
      margin-right: 10px;
    }
  }

  .header-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .placeholder {
    flex: 1;
    display: flex;
    justify-content: flex-end;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    margin-top: 10px;

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

  .internship-dialog {
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
</style>
