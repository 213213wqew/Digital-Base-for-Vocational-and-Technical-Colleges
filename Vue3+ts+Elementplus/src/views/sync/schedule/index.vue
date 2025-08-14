<template>
  <div class="sync-schedule-management">
    <!-- 搜索区域 -->
    <el-card class="search-card" shadow="never">
      <div class="search-bar">
        <el-form :model="queryParams" ref="queryRef" :inline="true">
          <el-form-item label="模块名称" prop="moduleName">
            <el-input
              v-model="queryParams.moduleName"
              placeholder="请输入模块名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="启用状态" prop="enabled">
            <el-select
              v-model="queryParams.enabled"
              placeholder="全部"
              clearable
            >
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">
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
            :disabled="selectedRows.length === 0"
            @click="handleBatchDelete"
          >
            <el-icon><Delete /></el-icon>批量删除
          </el-button>
          <el-button type="success" @click="handleReloadTasks">
            <el-icon><Refresh /></el-icon>重新加载任务
          </el-button>
          <el-button type="info" @click="handleTaskStatus">
            <el-icon><Monitor /></el-icon>任务状态
          </el-button>
        </div>
        <div class="header-title">定时同步配置列表</div>
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
          :data="configList"
          @selection-change="handleSelectionChange"
          border
          style="width: 100%"
          highlight-current-row
          :height="'calc(75vh - 90px)'"
          stripe
          size="default"
          :row-style="{ height: '42px' }"
          :cell-style="{ padding: '2px' }"
          row-key="id"
        >
          <el-table-column type="selection" width="45" fixed="left" />
          <el-table-column type="index" label="序号" width="50" fixed="left" />
          <el-table-column
            prop="moduleName"
            show-overflow-tooltip
            label="模块名称"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="moduleCode"
            show-overflow-tooltip
            label="模块代码"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="sourceTable"
            show-overflow-tooltip
            label="源表"
            min-width="120"
            sortable="custom"
          />
          <el-table-column
            prop="targetTable"
            show-overflow-tooltip
            label="目标表"
            min-width="120"
            sortable="custom"
          />
          <el-table-column prop="syncCycleType" label="周期类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getCycleTypeColor(row.syncCycleType) as any">
                {{ getCycleTypeLabel(row.syncCycleType) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="syncTime"
            show-overflow-tooltip
            label="同步时间"
            min-width="160"
            sortable="custom"
          >
            <template #default="{ row }">
              {{ formatDateTime(row.syncTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cronExpression"
            show-overflow-tooltip
            label="Cron表达式"
            min-width="150"
          />
          <el-table-column
            prop="sortOrder"
            label="执行顺序"
            width="80"
            sortable="custom"
          />
          <el-table-column prop="enabled" label="状态" width="80">
            <template #default="scope">
              <el-tag :type="scope.row.enabled ? 'success' : 'info'">
                {{ scope.row.enabled ? "启用" : "禁用" }}
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
                  @click="handleEdit(row)"
                >
                  <el-icon><Edit /></el-icon>编辑
                </el-button>
                <el-button
                  link
                  type="warning"
                  size="small"
                  @click="handleTest(row)"
                >
                  <el-icon><Monitor /></el-icon>测试
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
            :page-sizes="[10, 20, 50, 100]"
            layout="sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            small
          />
        </div>
      </div>
    </el-card>

    <!-- 配置对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增配置' : '编辑配置'"
      width="700px"
      :close-on-click-modal="false"
      append-to-body
      class="sync-schedule-dialog draggable-dialog"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="120px"
        class="dialog-form"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="模块名称" prop="moduleName">
              <el-input
                v-model="formData.moduleName"
                placeholder="请输入模块名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模块代码" prop="moduleCode">
              <el-input
                v-model="formData.moduleCode"
                placeholder="请输入模块代码"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="源表名" prop="sourceTable">
              <el-select
                v-model="formData.sourceTable"
                placeholder="请选择源表名"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="table in tableOptions"
                  :key="table"
                  :label="table"
                  :value="table"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标表名" prop="targetTable">
              <el-select
                v-model="formData.targetTable"
                placeholder="请选择目标表名"
                clearable
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="table in tableOptions"
                  :key="table"
                  :label="table"
                  :value="table"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="同步周期" prop="syncCycleType">
              <el-select
                v-model="formData.syncCycleType"
                placeholder="请选择同步周期"
                @change="onCycleTypeChange"
                style="width: 100%"
              >
                <el-option
                  v-for="type in cycleTypeOptions"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                >
                  <span>{{ type.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{
                    type.description
                  }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行顺序" prop="sortOrder">
              <el-input-number
                v-model="formData.sortOrder"
                :min="1"
                :max="100"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 周期性配置 -->
        <div
          v-if="formData.syncCycleType && formData.syncCycleType !== 'ONCE'"
          class="cycle-config-section"
        >
          <el-divider content-position="left">
            <span class="config-title">周期性配置</span>
          </el-divider>

          <!-- 每天配置 -->
          <div
            v-if="formData.syncCycleType === 'DAILY'"
            style="
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            "
          >
            <div
              style="
                margin-bottom: 20px;
                font-weight: bold;
                color: #409eff;
                border-bottom: 2px solid #409eff;
                padding-bottom: 10px;
              "
            >
              ⏰ 每天执行时间设置
            </div>
            <div
              style="
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 25px;
                  padding: 30px;
                  background: #f5f7fa;
                  border-radius: 10px;
                "
              >
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    小时
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.hour"
                    :min="0"
                    :max="23"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    分钟
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.minute"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    秒
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.second"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 每周配置 -->
          <div
            v-if="formData.syncCycleType === 'WEEKLY'"
            style="
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            "
          >
            <div
              style="
                margin-bottom: 20px;
                font-weight: bold;
                color: #409eff;
                border-bottom: 2px solid #409eff;
                padding-bottom: 10px;
              "
            >
              📅 每周执行配置
            </div>

            <!-- 星期选择 -->
            <div
              style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">选择星期</div>
              <el-select
                v-model="cycleConfigData.dayOfWeek"
                placeholder="请选择星期"
                style="width: 100%"
              >
                <el-option label="星期一" :value="1" />
                <el-option label="星期二" :value="2" />
                <el-option label="星期三" :value="3" />
                <el-option label="星期四" :value="4" />
                <el-option label="星期五" :value="5" />
                <el-option label="星期六" :value="6" />
                <el-option label="星期日" :value="7" />
              </el-select>
            </div>

            <!-- 时间选择 -->
            <div
              style="
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">
                选择执行时间
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 25px;
                  padding: 30px;
                  background: #f5f7fa;
                  border-radius: 10px;
                "
              >
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    小时
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.hour"
                    :min="0"
                    :max="23"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    分钟
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.minute"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    秒
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.second"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 每月配置 -->
          <div
            v-if="formData.syncCycleType === 'MONTHLY'"
            style="
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            "
          >
            <div
              style="
                margin-bottom: 20px;
                font-weight: bold;
                color: #409eff;
                border-bottom: 2px solid #409eff;
                padding-bottom: 10px;
              "
            >
              📅 每月执行配置
            </div>

            <!-- 日期选择 -->
            <div
              style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">
                选择执行日期
              </div>
              <div style="display: flex; align-items: center; gap: 8px">
                <span style="color: #606266">每月</span>
                <el-input-number
                  v-model="cycleConfigData.dayOfMonth"
                  :min="1"
                  :max="31"
                  style="width: 100px"
                />
                <span style="color: #606266">号执行</span>
              </div>
            </div>

            <!-- 时间选择 -->
            <div
              style="
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">
                选择执行时间
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 25px;
                  padding: 30px;
                  background: #f5f7fa;
                  border-radius: 10px;
                "
              >
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    小时
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.hour"
                    :min="0"
                    :max="23"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    分钟
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.minute"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    秒
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.second"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- 每年配置 -->
          <div
            v-if="formData.syncCycleType === 'YEARLY'"
            style="
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-top: 20px;
            "
          >
            <div
              style="
                margin-bottom: 20px;
                font-weight: bold;
                color: #409eff;
                border-bottom: 2px solid #409eff;
                padding-bottom: 10px;
              "
            >
              📅 每年执行配置
            </div>

            <!-- 日期选择 -->
            <div
              style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">
                选择执行日期
              </div>
              <div style="display: flex; align-items: center; gap: 15px">
                <div style="display: flex; align-items: center; gap: 8px">
                  <span style="color: #606266">月份：</span>
                  <el-input-number
                    v-model="cycleConfigData.month"
                    :min="1"
                    :max="12"
                    style="width: 100px"
                  />
                  <span style="color: #606266">月</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px">
                  <span style="color: #606266">日期：</span>
                  <el-input-number
                    v-model="cycleConfigData.dayOfMonth"
                    :min="1"
                    :max="31"
                    style="width: 100px"
                  />
                  <span style="color: #606266">号</span>
                </div>
              </div>
            </div>

            <!-- 时间选择 -->
            <div
              style="
                background: white;
                padding: 25px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="margin-bottom: 15px; font-weight: 500">
                选择执行时间
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 25px;
                  padding: 30px;
                  background: #f5f7fa;
                  border-radius: 10px;
                "
              >
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    小时
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.hour"
                    :min="0"
                    :max="23"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    分钟
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.minute"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
                <div
                  style="
                    font-size: 32px;
                    color: #409eff;
                    font-weight: bold;
                    margin-top: 20px;
                  "
                >
                  :
                </div>
                <div style="text-align: center">
                  <div
                    style="
                      margin-bottom: 12px;
                      color: #606266;
                      font-size: 14px;
                      font-weight: 500;
                    "
                  >
                    秒
                  </div>
                  <el-input-number
                    v-model="cycleConfigData.second"
                    :min="0"
                    :max="59"
                    size="large"
                    style="width: 120px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 一次性配置 -->
        <div
          v-if="!formData.syncCycleType || formData.syncCycleType === 'ONCE'"
        >
          <el-form-item label="同步时间" prop="syncTime">
            <el-date-picker
              v-model="formData.syncTime"
              type="datetime"
              placeholder="选择同步时间"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </div>

        <el-form-item label="同步接口" prop="syncApiUrl">
          <el-input
            v-model="formData.syncApiUrl"
            placeholder="请输入同步接口URL"
          />
        </el-form-item>

        <el-form-item label="启用状态" prop="enabled">
          <el-switch
            v-model="formData.enabled"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Delete,
  Edit,
  Monitor,
  Search,
  Refresh,
} from "@element-plus/icons-vue";
import {
  getSyncConfigList,
  addSyncConfig,
  updateSyncConfig,
  deleteSyncConfig,
  batchDeleteSyncConfig,
  testSyncFunction,
  getAllTableNames,
  reloadAllTasks,
  getTaskStatus,
  getCycleTypes,
  type SyncScheduleConfig,
  type SyncCycleTypeOption,
} from "@/api/sync/scheduleConfig";

// 页面状态
const loading = ref(false);
const dialogVisible = ref(false);
const dialogType = ref<"add" | "edit">("add");
const selectedRows = ref<SyncScheduleConfig[]>([]);
const total = ref(0);

// 表名选项
const tableOptions = ref<string[]>([]);
// 周期类型选项
const cycleTypeOptions = ref<SyncCycleTypeOption[]>([]);

// 表单引用
const queryRef = ref();
const formRef = ref();

// 查询参数
const queryParams = reactive({
  pageNum: 1,
  pageSize: 100,
  moduleName: "",
  enabled: undefined as boolean | undefined,
});

// 配置列表
const configList = ref<SyncScheduleConfig[]>([]);

// 获取默认同步时间（今天凌晨2点）
const getDefaultSyncTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day} 02:00:00`;
};

// 表单数据
const formData = ref<Partial<SyncScheduleConfig>>({
  id: undefined,
  moduleName: "",
  moduleCode: "",
  sourceTable: "",
  targetTable: "",
  syncTime: getDefaultSyncTime(),
  syncCycleType: "ONCE",
  cycleConfig: "",
  sortOrder: 1,
  syncApiUrl: "/api/meta/meta-base/zygxx/ods-xxjbsj/sync/fetch-data",
  enabled: true,
  remark: "",
});

// 周期配置数据
const cycleConfigData = ref({
  hour: 2,
  minute: 0,
  second: 0,
  dayOfWeek: 1,
  dayOfMonth: 1,
  month: 1,
});

// 表单验证规则
const rules = {
  moduleName: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
  moduleCode: [{ required: true, message: "请输入模块代码", trigger: "blur" }],
  sourceTable: [{ required: true, message: "请输入源表名", trigger: "blur" }],
  targetTable: [{ required: true, message: "请输入目标表名", trigger: "blur" }],
  syncTime: [{ required: true, message: "请选择同步时间", trigger: "blur" }],
  syncCycleType: [
    { required: true, message: "请选择同步周期", trigger: "blur" },
  ],
  sortOrder: [{ required: true, message: "请输入执行顺序", trigger: "blur" }],
};

// 获取周期类型标签
const getCycleTypeLabel = (type: string) => {
  const option = cycleTypeOptions.value.find((opt) => opt.value === type);
  return option ? option.label : type || "一次性";
};

// 获取周期类型颜色
const getCycleTypeColor = (type: string) => {
  const colorMap: Record<string, string> = {
    ONCE: "info",
    DAILY: "success",
    WEEKLY: "warning",
    MONTHLY: "primary",
    YEARLY: "danger",
  };
  return colorMap[type] || "info";
};

// 周期类型变化处理
const onCycleTypeChange = (type: string) => {
  // 重置周期配置数据
  cycleConfigData.value = {
    hour: 2,
    minute: 0,
    second: 0,
    dayOfWeek: 1,
    dayOfMonth: 1,
    month: 1,
  };

  // 如果是一次性任务，设置默认时间
  if (type === "ONCE") {
    formData.value.syncTime = getDefaultSyncTime();
  }
};

// 生成周期配置JSON
const generateCycleConfig = () => {
  if (
    !formData.value.syncCycleType ||
    formData.value.syncCycleType === "ONCE"
  ) {
    return "";
  }

  const config: any = {
    hour: cycleConfigData.value.hour,
    minute: cycleConfigData.value.minute,
    second: cycleConfigData.value.second,
  };

  switch (formData.value.syncCycleType) {
    case "WEEKLY":
      config.dayOfWeek = cycleConfigData.value.dayOfWeek;
      break;
    case "MONTHLY":
      config.dayOfMonth = cycleConfigData.value.dayOfMonth;
      break;
    case "YEARLY":
      config.month = cycleConfigData.value.month;
      config.dayOfMonth = cycleConfigData.value.dayOfMonth;
      break;
  }

  return JSON.stringify(config);
};

// 解析周期配置JSON
const parseCycleConfig = (configJson: string) => {
  if (!configJson) return;

  try {
    const config = JSON.parse(configJson);
    cycleConfigData.value = {
      hour: config.hour || 2,
      minute: config.minute || 0,
      second: config.second || 0,
      dayOfWeek: config.dayOfWeek || 1,
      dayOfMonth: config.dayOfMonth || 1,
      month: config.month || 1,
    };
  } catch (error) {
    console.error("解析周期配置失败:", error);
  }
};

// 获取列表数据
const getList = async () => {
  loading.value = true;
  try {
    console.log("开始获取同步配置列表...");
    const response = await getSyncConfigList({
      pageNum: queryParams.pageNum,
      pageSize: queryParams.pageSize,
      moduleName: queryParams.moduleName,
      enabled: queryParams.enabled,
    });

    console.log("API响应:", response);

    if (response.data && response.data.code === 200) {
      const result = response.data.data;
      configList.value = result.records || [];
      total.value = result.total || 0;
      ElMessage.success(`数据加载成功，共${total.value}条记录`);
    } else {
      console.warn("API响应异常:", response);
      ElMessage.error(
        "获取数据失败：" + (response.data?.message || "接口返回异常"),
      );
    }
  } catch (error) {
    console.error("获取配置列表失败:", error);
    ElMessage.error("获取数据失败：" + (error as any)?.message || "网络错误");
  } finally {
    loading.value = false;
  }
};

// 重置查询
const resetQuery = () => {
  queryParams.moduleName = "";
  queryParams.enabled = undefined;
  queryParams.pageNum = 1;
  getList();
};

// 分页处理
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getList();
};

const handleCurrentChange = (val: number) => {
  queryParams.pageNum = val;
  getList();
};

// 选择处理
const handleSelectionChange = (selection: SyncScheduleConfig[]) => {
  selectedRows.value = selection;
};

// 新增
const handleAdd = () => {
  console.log("点击新增按钮");
  formData.value = {
    id: undefined,
    moduleName: "",
    moduleCode: "",
    sourceTable: "",
    targetTable: "",
    syncTime: getDefaultSyncTime(),
    syncCycleType: "ONCE",
    cycleConfig: "",
    sortOrder: 1,
    syncApiUrl: "/api/meta/meta-base/zygxx/ods-xxjbsj/sync/fetch-data",
    enabled: true,
    remark: "",
  };
  dialogType.value = "add";
  dialogVisible.value = true;
  console.log("对话框应该打开了");
};

// 编辑
const handleEdit = (row: SyncScheduleConfig) => {
  formData.value = { ...row };

  // 解析周期配置
  if (row.cycleConfig) {
    parseCycleConfig(row.cycleConfig);
  }

  dialogType.value = "edit";
  dialogVisible.value = true;
};

// 删除
const handleDelete = async (row: SyncScheduleConfig) => {
  try {
    await ElMessageBox.confirm("确定删除该配置吗？", "确认删除", {
      type: "warning",
    });

    const response = await deleteSyncConfig(row.id!);
    if (response.data.code === 200) {
      ElMessage.success("删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "删除失败");
    }
  } catch (error) {
    if ((error as any) !== "cancel") {
      console.error("删除失败:", error);
      ElMessage.error("删除失败：" + (error as any)?.message || "未知错误");
    }
  }
};

// 批量删除
const handleBatchDelete = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning("请选择要删除的数据");
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${selectedRows.value.length} 条记录吗？`,
      "确认删除",
      {
        type: "warning",
      },
    );

    const ids = selectedRows.value
      .map((item) => item.id!)
      .filter((id) => id !== undefined);
    const response = await batchDeleteSyncConfig(ids);

    if (response.data.code === 200) {
      ElMessage.success("批量删除成功");
      getList();
    } else {
      ElMessage.error(response.data.message || "批量删除失败");
    }
  } catch (error) {
    if ((error as any) !== "cancel") {
      console.error("批量删除失败:", error);
      ElMessage.error("批量删除失败：" + (error as any)?.message || "未知错误");
    }
  }
};

// 测试同步
const handleTest = async (row: SyncScheduleConfig) => {
  try {
    await ElMessageBox.confirm("确定要测试该模块的同步功能吗？", "确认测试", {
      type: "info",
    });

    loading.value = true;
    console.log("开始测试同步功能，配置ID:", row.id);

    const response = await testSyncFunction(row.id!);
    console.log("测试同步响应:", response);

    if (response.data.code === 200) {
      ElMessage.success(`测试成功: ${response.data.data}`);
    } else {
      ElMessage.error("测试失败：" + (response.data.message || "未知错误"));
    }
  } catch (error) {
    if ((error as any) !== "cancel") {
      console.error("测试同步失败:", error);
      ElMessage.error("测试失败：" + (error as any)?.message || "网络错误");
    }
  } finally {
    loading.value = false;
  }
};

// 重新加载任务
const handleReloadTasks = async () => {
  try {
    loading.value = true;
    console.log("开始重新加载定时任务...");

    const response = await reloadAllTasks();
    console.log("重新加载任务响应:", response);

    if (response.data.code === 200) {
      ElMessage.success(`重新加载成功: ${response.data.data}`);
    } else {
      ElMessage.error("重新加载失败：" + (response.data.message || "未知错误"));
    }
  } catch (error) {
    console.error("重新加载任务失败:", error);
    ElMessage.error("重新加载失败：" + (error as any)?.message || "网络错误");
  } finally {
    loading.value = false;
  }
};

// 查看任务状态
const handleTaskStatus = async () => {
  try {
    console.log("查看任务状态...");

    const response = await getTaskStatus();
    console.log("任务状态响应:", response);

    if (response.data.code === 200) {
      ElMessage.info(`任务状态: ${response.data.data}`);
    } else {
      ElMessage.error("获取状态失败：" + (response.data.message || "未知错误"));
    }
  } catch (error) {
    console.error("获取任务状态失败:", error);
    ElMessage.error("获取状态失败：" + (error as any)?.message || "网络错误");
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  try {
    console.log("开始提交表单:", formData.value);
    await formRef.value.validate();

    // 生成周期配置JSON
    const cycleConfig = generateCycleConfig();
    const submitData = {
      ...formData.value,
      cycleConfig,
    };

    let response;
    if (dialogType.value === "add") {
      // 新增时移除id字段
      delete submitData.id;
      response = await addSyncConfig(submitData as SyncScheduleConfig);
      console.log("新增响应:", response);
    } else {
      response = await updateSyncConfig(submitData as SyncScheduleConfig);
      console.log("更新响应:", response);
    }

    if (response.data.code === 200) {
      ElMessage.success(dialogType.value === "add" ? "新增成功" : "更新成功");
      dialogVisible.value = false;
      getList();
    } else {
      ElMessage.error("保存失败：" + (response.data.message || "未知错误"));
    }
  } catch (error) {
    console.error("保存失败:", error);
    ElMessage.error("保存失败：" + (error as any)?.message || "网络错误");
  }
};

// 格式化时间
const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return dateTime;
};

// 获取表名列表
const getTableList = async () => {
  try {
    const response = await getAllTableNames();
    if (response.data.code === 200) {
      tableOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("获取表名列表失败:", error);
    // 使用默认表名
    tableOptions.value = [
      "school_ods_xxjbsj",
      "meta_base_zygxx_ods_xxjbsj",
      "school_info",
      "school_college",
    ];
  }
};

// 获取周期类型列表
const getCycleTypeList = async () => {
  try {
    const response = await getCycleTypes();
    if (response.data.code === 200) {
      cycleTypeOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("获取周期类型列表失败:", error);
    // 使用默认周期类型
    cycleTypeOptions.value = [
      { value: "ONCE", label: "一次性", description: "只执行一次" },
      { value: "DAILY", label: "每天", description: "每天执行一次" },
      { value: "WEEKLY", label: "每周", description: "每周执行一次" },
      { value: "MONTHLY", label: "每月", description: "每月执行一次" },
      { value: "YEARLY", label: "每年", description: "每年执行一次" },
    ];
  }
};

// 页面加载时获取数据
onMounted(() => {
  getList();
  getTableList();
  getCycleTypeList();
});
</script>

<style scoped lang="scss">
.sync-schedule-management {
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
      width: 50px;
      text-align: right;
      padding-right: 4px;
      font-size: 14px;
    }

    :deep(.el-input__wrapper),
    :deep(.el-select) {
      width: 210px;
      font-size: 14px;
    }

    :deep(.el-button) {
      font-size: 14px;
    }

    :deep(.el-form-item:last-child) {
      margin-left: 0;
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

  .cycle-config-section {
    background-color: #f5f7fa;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;

    .el-divider {
      margin: 0 0 20px 0;
    }
  }

  .dialog-footer {
    padding-top: 10px;
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
  }

  // 弹窗表单样式
  :deep(.dialog-form) {
    .el-form-item {
      margin-bottom: 24px;

      .el-form-item__label {
        width: auto;
        margin-right: 16px;
        font-weight: 500;
        color: #303133;
        font-size: 14px;
      }

      .el-input,
      .el-select,
      .el-input-number {
        width: 100%;
      }
    }

    // 周期配置区域样式
    .cycle-config-section {
      margin-top: 30px;

      .config-title {
        font-size: 16px;
        font-weight: 600;
        color: #409eff;
      }

      .config-content {
        padding: 24px;
        background: #fafbfc;
        border-radius: 8px;
        margin-top: 20px;
        border: 1px solid #e4e7ed;
      }

      // 时间配置标题
      .time-config-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 12px;
        border-bottom: 2px solid #409eff;

        .el-icon {
          margin-right: 8px;
          color: #409eff;
          font-size: 18px;
        }

        span {
          font-size: 15px;
          font-weight: 600;
          color: #303133;
        }
      }

      // 时间输入行样式
      .time-inputs-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: white;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        border: 1px solid #e4e7ed;

        .time-input-group {
          display: flex;
          flex-direction: column;
          align-items: center;

          label {
            font-size: 13px;
            color: #606266;
            margin-bottom: 8px;
            font-weight: 500;
            text-align: center;
          }

          .el-input-number {
            width: 90px !important;

            :deep(.el-input__wrapper) {
              border-radius: 8px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
              border: 1px solid #dcdfe6;
              transition: all 0.3s ease;

              &:hover {
                border-color: #409eff;
                box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
              }

              &.is-focus {
                border-color: #409eff;
                box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
              }
            }

            :deep(.el-input__inner) {
              text-align: center;
              font-weight: 600;
              font-size: 16px;
              color: #303133;
            }
          }
        }

        .time-separator {
          font-size: 24px;
          font-weight: bold;
          color: #409eff;
          margin: 0 8px;
          margin-top: 20px;
        }
      }

      // 配置行样式
      .config-row {
        display: flex;
        gap: 24px;
        margin-bottom: 20px;

        .config-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          border: 1px solid #e4e7ed;

          &.full-width {
            width: 100%;
          }

          .config-label {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: #303133;
            white-space: nowrap;
            min-width: 80px;

            .el-icon {
              margin-right: 6px;
              color: #409eff;
            }
          }

          .el-input-number {
            width: 120px !important;

            :deep(.el-input__wrapper) {
              border-radius: 6px;
            }
          }

          .date-input {
            width: 120px !important;
          }

          .date-suffix {
            font-weight: 500;
            color: #606266;
            margin-left: 4px;
          }

          .week-select {
            flex: 1;

            :deep(.el-input__wrapper) {
              border-radius: 6px;
            }
          }
        }
      }
    }
  }
}
</style>
