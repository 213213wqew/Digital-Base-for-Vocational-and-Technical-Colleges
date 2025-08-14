<template>
  <div class="ods-yqsbjbsj-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          class="search-form"
        >
          <el-form-item label="仪器号" prop="yqh">
          <el-input
            v-model="queryParams.yqh"
            placeholder="请输入仪器号"
            clearable
              @keyup.enter="handleQuery"
          />
          </el-form-item>
          <el-form-item label="仪器名称" prop="yqmc">
          <el-input
            v-model="queryParams.yqmc"
            placeholder="请输入仪器名称"
            clearable
              @keyup.enter="handleQuery"
          />
          </el-form-item>
          <el-form-item label="生产厂家" prop="sccj">
          <el-input
            v-model="queryParams.sccj"
            placeholder="请输入生产厂家"
            clearable
              @keyup.enter="handleQuery"
          />
          </el-form-item>
          <el-form-item label="设备负责人" prop="sbfzrxm">
          <el-input
            v-model="queryParams.sbfzrxm"
            placeholder="请输入设备负责人姓名"
            clearable
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item class="search-buttons">
            <el-button
              type="primary"
              @click="handleQuery"
              style="margin-left: 8px"
            >
              <el-icon><Search /></el-icon>搜索
            </el-button>
            <el-button @click="resetQuery" style="margin-left: 8px">
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
        <div class="header-title">仪器设备基本数据数据清洗</div>
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
          @row-click="handleRowClick"
          @row-dblclick="handleRowDblClick"
          :height="'calc(75vh - 160px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column
            prop="zjsjwyxbs"
            label="唯一性标识"
            min-width="160"
            show-overflow-tooltip
          />
          <el-table-column
            prop="xxdm"
            label="学校代码"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="yqh"
            label="仪器号"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="yqmc"
            label="仪器名称"
            min-width="180"
            show-overflow-tooltip
          />
          <el-table-column
            prop="yqywmc"
            label="仪器英文名称"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="cqm"
            label="产权"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="syzkm"
            label="使用状况"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sccj"
            label="生产厂家"
            min-width="150"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sbfzrxm"
            label="设备负责人"
            min-width="120"
            show-overflow-tooltip
          />
          <el-table-column
            prop="yqjg"
            label="仪器价格"
            min-width="120"
            align="right"
          >
            <template #default="{ row }">
              <span v-if="row.yqjg">{{ row.yqjg.toLocaleString() }}</span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="gzrq"
            label="购置日期"
            min-width="120"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sfjmgzyq"
            label="是否精密贵重"
            min-width="120"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="sjcjsj"
            label="数据采集时间"
            min-width="160"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            label="上报状态"
            width="100"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <el-tag
                :type="getReportStatusTagType(row.reportStatus)"
                size="small"
              >
                {{ getReportStatusText(row.reportStatus) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="启用状态"
            width="100"
            align="center"
            fixed="right"
          >
            <template #default="{ row }">
              <el-tag
                :type="row.enableStatus === '1' ? 'success' : 'danger'"
                size="small"
              >
                {{ row.enableStatus === "1" ? "启用" : "禁用" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="200"
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

    <!-- 添加/编辑/查看对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="50%"
      :close-on-click-modal="false"
      append-to-body
      class="ods-yqsbjbsj-dialog"
      destroy-on-close
      @close="handleFormClose"
    >
      <el-form
        v-if="dialogMode !== 'view'"
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="170px"
      >
            <el-row :gutter="20">
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                placeholder="可不填，后端自动生成32位唯一编码"
                maxlength="32"
                show-word-limit
                style="text-transform: uppercase"
                  />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="学校代码" prop="xxdm">
              <el-input
                v-model="form.xxdm"
                placeholder="系统自动获取学校代码"
                maxlength="10"
                :disabled="true"
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="仪器号" prop="yqh">
              <el-input
                v-model="form.yqh"
                placeholder="请输入仪器号"
                maxlength="120"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="仪器名称" prop="yqmc">
              <el-input
                v-model="form.yqmc"
                placeholder="请输入仪器名称"
                maxlength="200"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="仪器英文名称" prop="yqywmc">
                  <el-input
                    v-model="form.yqywmc"
                    placeholder="请输入仪器英文名称"
                maxlength="180"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="学校单位层次" prop="xxdwccm">
              <el-select
                v-model="form.xxdwccm"
                placeholder="请选择学校单位层次"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in xxdwccmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="产权" prop="cqm">
                  <el-select
                    v-model="form.cqm"
                    placeholder="请选择产权"
                    style="width: 100%"
                clearable
                  >
                    <el-option
                      v-for="item in cqmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="使用状况" prop="syzkm">
                  <el-select
                    v-model="form.syzkm"
                    placeholder="请选择使用状况"
                    style="width: 100%"
                clearable
                  >
                    <el-option
                      v-for="item in syzkmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="高校资产分类" prop="gxzcflm">
              <el-select
                v-model="form.gxzcflm"
                placeholder="请选择高校资产分类"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in gxzcflmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="仪器型号" prop="yqxh">
                  <el-input
                v-model="form.yqxh"
                placeholder="请输入仪器型号"
                maxlength="300"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="出厂日期" prop="ccrq">
              <el-date-picker
                v-model="form.ccrq"
                type="date"
                placeholder="请选择出厂日期"
                value-format="YYYYMMDD"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="生产国别/地区" prop="scgbdqm">
              <el-select
                v-model="form.scgbdqm"
                placeholder="请选择生产国别/地区"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in scgbdqmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="经费科目" prop="jfkmm">
              <el-select
                v-model="form.jfkmm"
                placeholder="请选择经费科目"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in jfkmmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="购置日期" prop="gzrq">
              <el-date-picker
                v-model="form.gzrq"
                type="date"
                placeholder="请选择购置日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="生产厂家" prop="sccj">
              <el-input
                v-model="form.sccj"
                placeholder="请输入生产厂家"
                maxlength="180"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="出厂号" prop="cch">
              <el-input
                v-model="form.cch"
                placeholder="请输入出厂号"
                maxlength="30"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="单据号" prop="djh">
              <el-input
                v-model="form.djh"
                placeholder="请输入单据号"
                maxlength="150"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="房间号" prop="fjh">
              <el-input
                v-model="form.fjh"
                placeholder="请输入房间号"
                maxlength="60"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="房间名称" prop="fjmc">
              <el-input
                v-model="form.fjmc"
                placeholder="请输入房间名称"
                maxlength="150"
                show-word-limit
              />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="设备负责人号" prop="sbfzrh">
                  <el-input
                    v-model="form.sbfzrh"
                    placeholder="请输入设备负责人号"
                maxlength="20"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="设备负责人姓名" prop="sbfzrxm">
              <el-input
                v-model="form.sbfzrxm"
                placeholder="请输入设备负责人姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="价格币种" prop="jgbz">
              <el-select
                v-model="form.jgbz"
                placeholder="请选择价格币种"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in jgbzOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="仪器价格" prop="yqjg">
              <el-input-number
                v-model="form.yqjg"
                :precision="2"
                :step="0.01"
                :min="0"
                placeholder="请输入仪器价格"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="财务账号" prop="cwzh">
              <el-input
                v-model="form.cwzh"
                placeholder="请输入财务账号"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="财务管理人姓名" prop="cwglrxm">
              <el-input
                v-model="form.cwglrxm"
                placeholder="请输入财务管理人姓名"
                maxlength="36"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="供货商" prop="ghs">
              <el-input
                v-model="form.ghs"
                placeholder="请输入供货商"
                maxlength="60"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="保修截止日期" prop="bxjzrq">
              <el-date-picker
                v-model="form.bxjzrq"
                type="date"
                placeholder="请选择保修截止日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="设备来源" prop="sblym">
              <el-select
                v-model="form.sblym"
                placeholder="请选择设备来源"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in sblymOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="捐赠企业统一社会信用代码" prop="jzqydm">
              <el-input
                v-model="form.jzqydm"
                placeholder="请输入捐赠企业统一社会信用代码"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="捐赠企业名称" prop="jzqymc">
              <el-input
                v-model="form.jzqymc"
                placeholder="请输入捐赠企业名称"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
                <el-form-item label="是否精密贵重仪器" prop="sfjmgzyq">
                  <el-select
                    v-model="form.sfjmgzyq"
                placeholder="请选择是否精密贵重仪器"
                    style="width: 100%"
                clearable
                  >
                    <el-option
                      v-for="item in sfjmgzyqOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="资产基础分类" prop="zcjcflm">
              <el-select
                v-model="form.zcjcflm"
                placeholder="请选择资产基础分类"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="item in zcjcflmOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>  
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="数据采集时间" prop="sjcjsj">
              <el-date-picker
                v-model="form.sjcjsj"
                type="datetime"
                placeholder="请选择数据采集时间"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYYMMDDHHmmss"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-bottom: 18px">
            <el-form-item label="启用状态" prop="enableStatus">
              <el-radio-group v-model="form.enableStatus">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 18px">
                <el-form-item label="技术指标" prop="jszb">
                  <el-input
                    v-model="form.jszb"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入技术指标"
                maxlength="2000"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="24" style="margin-bottom: 18px">
                <el-form-item label="仪器配置" prop="yqpz">
                  <el-input
                    v-model="form.yqpz"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入仪器配置"
                maxlength="999"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="24" style="margin-bottom: 18px">
                <el-form-item label="仪器说明" prop="yqsm">
                  <el-input
                    v-model="form.yqsm"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入仪器说明"
                maxlength="2000"
                show-word-limit
                  />
                </el-form-item>
              </el-col>
          <el-col :span="24" style="margin-bottom: 18px">
            <el-form-item label="仪器图片" prop="tp">
              <div class="image-input-wrapper">
                <el-radio-group v-model="imageInputType" class="mb-10">
                  <el-radio label="url">图片地址</el-radio>
                  <el-radio label="upload">图片上传</el-radio>
                </el-radio-group>
                
                <template v-if="imageInputType === 'url'">
                  <el-input
                    v-model="form.tp"
                    placeholder="请输入图片URL地址"
                    maxlength="500"
                    show-word-limit
                  />
                </template>
                
                <template v-else>
                  <el-upload
                    class="avatar-uploader"
                    :auto-upload="false"
                    :show-file-list="false"
                    accept=".jpg,.jpeg,.png"
                    :on-change="handleAvatarChange"
                  >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                  </el-upload>
                  <div v-if="imageUrl" style="margin-top: 10px">
                    <el-button type="danger" size="small" @click="handleRemoveImage">移除图片</el-button>
                  </div>
                </template>
              </div>
            </el-form-item>
          </el-col>
            </el-row>
      </el-form>

      <!-- 查看模式 -->
      <div v-else class="yqsbjbsj-detail">
        <el-descriptions :column="2" size="large" border>
          <el-descriptions-item label="唯一性标识">
            <div class="detail-value">{{ form.zjsjwyxbs || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校代码">
            <div class="detail-value">{{ form.xxdm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器号">
            <div class="detail-value">{{ form.yqh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器名称">
            <div class="detail-value">{{ form.yqmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器英文名称">
            <div class="detail-value">{{ form.yqywmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="学校单位层次">
            <div class="detail-value">
              {{ form.xxdwccmText || form.xxdwccm || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="产权">
            <div class="detail-value">
              {{ form.cqmText || form.cqm || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="使用状况">
            <div class="detail-value">
              {{ form.syzkmText || form.syzkm || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="高校资产分类">
            <div class="detail-value">
              {{ form.gxzcflmText || form.gxzcflm || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器型号">
            <div class="detail-value">{{ form.yqxh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="出厂日期">
            <div class="detail-value">{{ form.ccrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="生产国别/地区">
            <div class="detail-value">
              {{ form.scgbdqmText || form.scgbdqm || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="购置日期">
            <div class="detail-value">{{ form.gzrq || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="生产厂家">
            <div class="detail-value">{{ form.sccj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="房间号">
            <div class="detail-value">{{ form.fjh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="房间名称">
            <div class="detail-value">{{ form.fjmc || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="设备负责人号">
            <div class="detail-value">{{ form.sbfzrh || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="设备负责人姓名">
            <div class="detail-value">{{ form.sbfzrxm || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器价格">
            <div class="detail-value">
              {{ form.yqjg ? form.yqjg.toLocaleString() : "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="是否精密贵重仪器">
            <div class="detail-value">
              {{ form.sfjmgzyqText || form.sfjmgzyq || "-" }}
            </div>
          </el-descriptions-item>
          <el-descriptions-item label="数据采集时间">
            <div class="detail-value">{{ form.sjcjsj || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="启用状态">
            <el-tag
              :type="form.enableStatus === '1' ? 'success' : 'danger'"
              size="small"
            >
              {{ form.enableStatus === "1" ? "启用" : "禁用" }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上报状态">
            <el-tag
              :type="getReportStatusTagType(form.reportStatus)"
              size="small"
            >
              {{ getReportStatusText(form.reportStatus) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">
            <div class="detail-value">{{ form.createTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="更新时间">
            <div class="detail-value">{{ form.updateTime || "-" }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="仪器图片" :span="2">
            <img
              v-if="form.tp"
              :src="form.tp"
              class="avatar"
              style="width: 178px; height: 178px"
            />
            <span v-else>-</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
            v-if="dialogMode !== 'view'"
          type="primary"
          :loading="submitLoading"
            @click="handleFormSubmit"
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
  getOdsYqsbjbsjPage,
  getOdsYqsbjbsjById,
  addOdsYqsbjbsj,
  updateOdsYqsbjbsj,
  deleteOdsYqsbjbsj,
  batchDeleteOdsYqsbjbsj,
  exportOdsYqsbjbsj,
  getXxdwccmOptions,
  getCqmOptions,
  getSyzkmOptions,
  getGxzcflmOptions,
  getScgbdqmOptions,
  getJfkmmOptions,
  getJgbzOptions,
  getSblymOptions,
  getSfjmgzyqOptions,
  getZcjcflmOptions,
  type OdsYqsbjbsjInfo,
  type OdsYqsbjbsjQuery,
  type OdsYqsbjbsjForm,
  type DictOption,
} from "@/api-data/data/data_base/zygzc/ods_yqsbjbsj";

// 兼容旧API，后面可以修改
import { getSystemSchoolCode } from "@/api-data/data/data_base/zygxx/ods_xxhxtjssj";

// 响应式数据
const loading = ref(false);
const dataList = ref<OdsYqsbjbsjInfo[]>([]);
const total = ref(0);
const dialogVisible = ref(false);
const dialogMode = ref<"add" | "edit" | "view">("add");
const selectedIds = ref<number[]>([]);
const systemSchoolCode = ref("");

// 计算属性
const dialogTitle = computed(() => {
  switch (dialogMode.value) {
    case "add":
      return "新增仪器设备基本数据";
    case "edit":
      return "编辑仪器设备基本数据";
    case "view":
      return "查看仪器设备基本数据";
    default:
      return "仪器设备基本数据";
  }
});

// 搜索条件
const queryParams = reactive<OdsYqsbjbsjQuery>({
  zjsjwyxbs: "",
  xxdm: "",
  yqh: "",
  yqmc: "",
  sccj: "",
  sbfzrxm: "",
  pageNum: 1,
  pageSize: 20,
});

const queryFormRef = ref<FormInstance>();

// 表单相关
const form = reactive<OdsYqsbjbsjForm>({
  zjsjwyxbs: "",
  xxdm: "",
  yqmc: "",
  sjcjsj: "",
});
const formRef = ref<FormInstance>();
const submitLoading = ref(false);

// 图片相关
const imageUrl = ref("");
const imageFile = ref<File | null>(null);
// 在 script setup 中修改默认值
const imageInputType = ref('url'); // 默认使用图片地址

// 字典数据
const xxdwccmOptions = ref<DictOption[]>([]);
const cqmOptions = ref<DictOption[]>([]);
const syzkmOptions = ref<DictOption[]>([]);
const gxzcflmOptions = ref<DictOption[]>([]);
const scgbdqmOptions = ref<DictOption[]>([]);
const jfkmmOptions = ref<DictOption[]>([]);
const jgbzOptions = ref<DictOption[]>([]);
const sblymOptions = ref<DictOption[]>([]);
const sfjmgzyqOptions = ref<DictOption[]>([]);
const zcjcflmOptions = ref<DictOption[]>([]);

// 表单验证规则
const formRules = reactive({
  zjsjwyxbs: [
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (!value) {
          callback(); // 为空时通过验证，后端会自动生成
        } else if (value.length !== 32) {
          callback(new Error("唯一编码必须是32位"));
        } else if (!/^[A-Z0-9]+$/.test(value)) {
          callback(new Error("只能包含大写字母和数字"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { pattern: /^\d{10}$/, message: "必须是10位数字", trigger: "blur" },
  ],
  yqh: [
    { required: true, message: "请输入仪器号", trigger: "blur" },
    { max: 120, message: "仪器号长度不能超过120位", trigger: "blur" },
  ],
  yqmc: [
    { required: true, message: "请输入仪器名称", trigger: "blur" },
    { max: 200, message: "仪器名称长度不能超过200位", trigger: "blur" },
  ],
  yqywmc: [{ max: 180, message: "仪器英文名称长度不能超过180位", trigger: "blur" }],
  xxdwccm: [{ required: true, message: "请选择学校单位层次", trigger: "change" }],
  syzkm: [{ required: true, message: "请选择使用状况", trigger: "change" }],
  gxzcflm: [{ required: true, message: "请选择高校资产分类", trigger: "change" }],
  yqxh: [
    { required: true, message: "请输入仪器型号", trigger: "blur" },
    { max: 300, message: "仪器型号长度不能超过300位", trigger: "blur" },
  ],
  ccrq: [{ required: true, message: "请选择出厂日期", trigger: "change" }],
  scgbdqm: [{ required: true, message: "请选择生产国别/地区", trigger: "change" }],
  jfkmm: [{ required: true, message: "请选择经费科目", trigger: "change" }],
  gzrq: [{ required: true, message: "请选择购置日期", trigger: "change" }],
  sccj: [
    { required: true, message: "请输入生产厂家", trigger: "blur" },
    { max: 180, message: "生产厂家长度不能超过180位", trigger: "blur" },
  ],
  cch: [
    { required: true, message: "请输入出厂号", trigger: "blur" },
    { max: 30, message: "出厂号长度不能超过30位", trigger: "blur" },
  ],
  djh: [
    { required: true, message: "请输入单据号", trigger: "blur" },
    { max: 150, message: "单据号长度不能超过150位", trigger: "blur" },
  ],
  fjh: [
    { required: true, message: "请输入房间号", trigger: "blur" },
    { max: 60, message: "房间号长度不能超过60位", trigger: "blur" },
  ],
  fjmc: [
    { required: true, message: "请输入房间名称", trigger: "blur" },
    { max: 150, message: "房间名称长度不能超过150位", trigger: "blur" },
  ],
  sbfzrh: [
    { required: true, message: "请输入设备负责人号", trigger: "blur" },
    { max: 20, message: "设备负责人号长度不能超过20位", trigger: "blur" },
  ],
  sbfzrxm: [
    { required: true, message: "请输入设备负责人姓名", trigger: "blur" },
    { max: 36, message: "设备负责人姓名长度不能超过36位", trigger: "blur" },
  ],
  jszb: [
    { required: true, message: "请输入技术指标", trigger: "blur" },
    { max: 2000, message: "技术指标长度不能超过2000位", trigger: "blur" },
  ],
  yqpz: [
    { required: true, message: "请输入仪器配置", trigger: "blur" },
    { max: 999, message: "仪器配置长度不能超过999位", trigger: "blur" },
  ],
  cwzh: [{ max: 20, message: "财务账号长度不能超过20位", trigger: "blur" }],
  cwglrxm: [{ max: 36, message: "财务管理人姓名长度不能超过36位", trigger: "blur" }],
  ghs: [{ max: 60, message: "供货商长度不能超过60位", trigger: "blur" }],
  bxjzrq: [{ required: true, message: "请选择保修截止日期", trigger: "change" }],
  sblym: [{ required: true, message: "请选择设备来源", trigger: "change" }],
  jzqydm: [{ max: 18, message: "捐赠企业统一社会信用代码长度不能超过18位", trigger: "blur" }],
  jzqymc: [{ max: 200, message: "捐赠企业名称长度不能超过200位", trigger: "blur" }],
  sfjmgzyq: [{ required: true, message: "请选择是否精密贵重仪器", trigger: "change" }],
  sjcjsj: [{ required: true, message: "请选择数据采集时间", trigger: "change" }],
  enableStatus: [{ required: true, message: "请选择启用状态", trigger: "change" }],
});

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
      return "warning";
  }
};

// 查询列表
const getList = async () => {
  loading.value = true;
  try {
    const response = await getOdsYqsbjbsjPage(queryParams);
    if ((response.data as any).code === 200) {
      dataList.value = (response.data as any).data.records;
      total.value = (response.data as any).data.total;
    } else {
      ElMessage.error((response.data as any).msg || "查询失败");
    }
  } catch (error) {
    console.error("查询仪器设备基本数据失败:", error);
    ElMessage.error("查询失败");
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
  getList();
};

// 新增
const handleAdd = () => {
  resetForm();
  dialogMode.value = "add";
  dialogVisible.value = true;
};

// 编辑
const handleEdit = async (row: OdsYqsbjbsjInfo) => {
  try {
    const response = await getOdsYqsbjbsjById(row.id);
    if ((response.data as any).code === 200) {
      const data = (response.data as any).data;
      // 确保 gxzcflm 是字符串
      if (Array.isArray(data.gxzcflm)) {
        data.gxzcflm = data.gxzcflm[data.gxzcflm.length - 1];
      }
      Object.assign(form, data);
      if (form.tp) {
        imageUrl.value = form.tp;
        imageInputType.value = 'url'; // 编辑时也默认使用图片地址
      }
      dialogMode.value = "edit";
      dialogVisible.value = true;
    } else {
      ElMessage.error((response.data as any).msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取仪器设备基本数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 查看详情
const handleView = async (row: OdsYqsbjbsjInfo) => {
  try {
    const response = await getOdsYqsbjbsjById(row.id);
    if ((response.data as any).code === 200) {
      Object.assign(form, (response.data as any).data);
      if (form.tp) {
        imageUrl.value = form.tp;
        imageInputType.value = 'url'; // 查看时也默认使用图片地址
      }
      dialogMode.value = "view";
      dialogVisible.value = true;
    } else {
      ElMessage.error((response.data as any).msg || "获取详情失败");
    }
  } catch (error) {
    console.error("获取仪器设备基本数据详情失败:", error);
    ElMessage.error("获取详情失败");
  }
};

// 删除
const handleDelete = async (row: OdsYqsbjbsjInfo) => {
  try {
    await ElMessageBox.confirm("确定要删除这条仪器设备基本数据吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });

    const response = await deleteOdsYqsbjbsj(row.id);
    if ((response.data as any).code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error((response.data as any).msg || "删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除仪器设备基本数据失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedIds.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      },
    );

    const response = await batchDeleteOdsYqsbjbsj(selectedIds.value);
    if ((response.data as any).code === 200) {
      ElMessage.success("批量删除成功");
      selectedIds.value = [];
      getList();
    } else {
      ElMessage.error((response.data as any).msg || "批量删除失败");
    }
  } catch (error) {
    if (error !== "cancel") {
      console.error("批量删除仪器设备基本数据失败:", error);
      ElMessage.error("批量删除失败");
    }
  }
};

// 导出
const handleExport = async () => {
  try {
    const response = await exportOdsYqsbjbsj(queryParams);
    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `仪器设备基本数据_${new Date().getTime()}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出仪器设备基本数据失败:", error);
    ElMessage.error("导出失败");
  }
};

// 表单提交
const handleFormSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitLoading.value = true;

    // 确保 gxzcflm 是字符串
    const submitForm = { ...form };
    if (Array.isArray(submitForm.gxzcflm)) {
      submitForm.gxzcflm = submitForm.gxzcflm[submitForm.gxzcflm.length - 1];
    }

    let response;
    if (dialogMode.value === "add") {
      response = await addOdsYqsbjbsj(submitForm);
    } else {
      response = await updateOdsYqsbjbsj(submitForm);
    }

    if ((response.data as any).code === 200) {
      ElMessage.success(
        `${dialogMode.value === "add" ? "新增" : "修改"}成功`,
      );
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error(
        (response.data as any).msg ||
          `${dialogMode.value === "add" ? "新增" : "修改"}失败`,
      );
    }
  } catch (error) {
    console.error("提交表单失败:", error);
  } finally {
    submitLoading.value = false;
  }
};

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    id: undefined,
    zjsjwyxbs: "",
    xxdm: systemSchoolCode.value,
    yqh: "",
    yqmc: "",
    yqywmc: "",
    xxdwccm: "",
    cqm: "",
    syzkm: "",
    gxzcflm: "",
    yqxh: "",
    ccrq: "",
    scgbdqm: "",
    jfkmm: "",
    gzrq: "",
    sccj: "",
    cch: "",
    djh: "",
    tp: "",
    fjh: "",
    fjmc: "",
    sbfzrh: "",
    sbfzrxm: "",
    jszb: "",
    yqpz: "",
    jgbz: "",
    yqjg: undefined,
    yqsm: "",
    cwzh: "",
    cwglrxm: "",
    ghs: "",
    bxjzrq: "",
    sblym: "",
    jzqydm: "",
    jzqymc: "",
    sfjmgzyq: "",
    zcjcflm: "",
    sjcjsj: "",
    enableStatus: "1",
    reportStatus: "0",
  });
  imageUrl.value = "";
  imageFile.value = null;
  imageInputType.value = 'url'; // 重置时也默认使用图片地址
  formRef.value?.clearValidate();
};

// 关闭表单对话框
const handleFormClose = () => {
  dialogVisible.value = false;
  resetForm();
};

// 表格选择变化
const handleSelectionChange = (selection: OdsYqsbjbsjInfo[]) => {
  selectedIds.value = selection.map((item) => item.id);
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

// 行点击事件
const handleRowClick = () => {};
// 行双击
const handleRowDblClick = (row: OdsYqsbjbsjInfo) => {
  handleView(row);
};

// 图片改变事件
const handleAvatarChange = (file: any) => {
  const isJPG = file.raw.type === "image/jpeg" || file.raw.type === "image/png";
  const isLt2M = file.raw.size / 1024 / 1024 < 2;

  if (!isJPG) {
    ElMessage.error("上传图片只能是 JPG/PNG 格式!");
    return false;
  }
  if (!isLt2M) {
    ElMessage.error("上传图片大小不能超过 2MB!");
    return false;
  }

  imageFile.value = file.raw;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string;
    form.tp = e.target?.result as string;
  };
  reader.readAsDataURL(file.raw);
};

// 移除图片
const handleRemoveImage = () => {
  imageUrl.value = "";
  imageFile.value = null;
  form.tp = "";
};

// 加载字典数据
const loadDictData = async () => {
  try {
    const [
      xxdwccmRes,
      cqmRes,
      syzkmRes,
      gxzcflmRes,
      scgbdqmRes,
      jfkmmRes,
      jgbzRes,
      sblymRes,
      sfjmgzyqRes,
      zcjcflmRes,
    ] = await Promise.all([
      getXxdwccmOptions(),
      getCqmOptions(),
      getSyzkmOptions(),
      getGxzcflmOptions(),
      getScgbdqmOptions(),
      getJfkmmOptions(),
      getJgbzOptions(),
      getSblymOptions(),
      getSfjmgzyqOptions(),
      getZcjcflmOptions(),
    ]);

    xxdwccmOptions.value = (xxdwccmRes.data as any).data || [];
    cqmOptions.value = (cqmRes.data as any).data || [];
    syzkmOptions.value = (syzkmRes.data as any).data || [];
    gxzcflmOptions.value = (gxzcflmRes.data as any).data || [];
    console.log("|||||||||||");
    console.log(gxzcflmOptions.value);
    
    scgbdqmOptions.value = (scgbdqmRes.data as any).data || [];
    jfkmmOptions.value = (jfkmmRes.data as any).data || [];
    jgbzOptions.value = (jgbzRes.data as any).data || [];
    sblymOptions.value = (sblymRes.data as any).data || [];
    sfjmgzyqOptions.value = (sfjmgzyqRes.data as any).data || [];
    zcjcflmOptions.value = (zcjcflmRes.data as any).data || [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
  }
};

// 获取系统学校代码
const getSystemSchoolCodeData = async () => {
  try {
    const response: any = await getSystemSchoolCode();
    if (response.data.code === 200) {
      systemSchoolCode.value = response.data.data;
      queryParams.xxdm = response.data.data;
      form.xxdm = response.data.data;
    } else {
      ElMessage.error(response.data.msg || "获取学校代码失败");
    }
  } catch (error) {
    console.error("获取系统学校代码失败:", error);
    ElMessage.error("获取学校代码失败");
  }
};

// 页面加载
onMounted(() => {
  getSystemSchoolCodeData();
  getList();
  loadDictData();
});
</script>

<style lang="scss" scoped>
.ods-yqsbjbsj-management {
  padding: 0px;
}

  .search-card {
  margin-bottom: 8px;
}

    .search-bar {
  padding: 8px;
}

.search-form {
        display: flex;
        align-items: center;
  flex-wrap: wrap;
        gap: 8px;
}

.search-buttons {
  margin-bottom: 0;
  margin-right: 0;
}

:deep(.el-form-item) {
  margin-bottom: 0;
  margin-right: 8px;
}

:deep(.el-form-item__content) {
        display: flex;
  align-items: center;
      }

:deep(.el-button) {
  height: 32px;
  padding: 8px 15px;
  }

  .table-card {
  margin-top: -10px;
}

    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
  margin-bottom: 20px;
  padding: 0 2px;
}

      .operation-buttons {
        display: flex;
  gap: 10px;
      }

      .header-title {
        font-size: 16px;
  font-weight: bold;
        color: #303133;
      }

      .action-buttons {
        display: flex;
  gap: 2px;

  :deep(.el-button) {
    padding: 0 4px;
  }
}

    .pagination-wrapper {
      display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  padding: 2px 2px;
}

.total-info {
      color: #606266;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ods-yqsbjbsj-dialog {
  border-radius: 8px;
}

.yqsbjbsj-detail {
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px 0;
}

.detail-value {
  color: #303133;
  font-weight: 500;
  word-break: break-all;
}

.detail-value:empty::before {
  content: "-";
  color: #909399;
}

:deep(.el-table .el-table__body-wrapper .el-table__row:hover) {
  background-color: #f5f7fa;
}

:deep(.ods-yqsbjbsj-dialog .el-dialog__header) {
  background: linear-gradient(90deg, #409eff 0%, #67c23a 100%);
  color: white;
  border-radius: 8px 8px 0 0;
  padding: 15px 20px;
}

:deep(.ods-yqsbjbsj-dialog .el-dialog__title) {
  color: white;
      font-weight: 600;
}

:deep(.ods-yqsbjbsj-dialog .el-dialog__headerbtn) {
  top: 50%;
  transform: translateY(-50%);
}

:deep(.ods-yqsbjbsj-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 18px;
}

:deep(.ods-yqsbjbsj-dialog .el-dialog__body) {
  padding: 20px 24px;
  max-height: 70vh;
  overflow-y: auto;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #303133;
}

// 图片上传样式
.avatar-uploader {
  :deep(.el-upload) {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
    &:hover {
      border-color: #409eff;
    }
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
          text-align: center;
  line-height: 178px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}

.image-input-wrapper {
  .mb-10 {
    margin-bottom: 10px;
  }
  
  .el-input {
    margin-top: 10px;
  }
}
</style>