<template>
  <div class="user-guide">
    <el-card shadow="never" class="guide-card">
      <template #header>
        <div class="guide-header">
          <el-icon>
            <QuestionFilled />
          </el-icon>
          <span>常见问题解决指南</span>
        </div>
      </template>

      <el-collapse v-model="activeGuides" accordion>
        <!-- 文件上传问题 -->
        <el-collapse-item title="文件上传相关问题" name="upload">
          <div class="guide-content">
            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>文件格式不支持</h4>
              <p><strong>问题描述：</strong>上传时提示"文件格式不支持"</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>确保文件扩展名为 .xlsx 或 .xls</li>
                <li>如果是其他格式（如 .csv），请先用Excel打开并另存为Excel格式</li>
                <li>检查文件是否损坏，尝试用Excel软件打开验证</li>
              </ul>

            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>文件过大</h4>
              <p><strong>问题描述：</strong>文件大小超过限制</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>删除不必要的工作表和数据</li>
                <li>移除图片、图表等多媒体内容</li>
                <li>将大文件分批处理，每次导入不超过1万行</li>
                <li>压缩Excel文件（另存为时选择压缩选项）</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>文件为空或无数据</h4>
              <p><strong>问题描述：</strong>上传后提示文件为空</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>确保Excel文件包含数据行（不只是表头）</li>
                <li>检查是否选择了正确的工作表</li>
                <li>确认数据从第一行开始，没有空行</li>
                <li>移除隐藏的行和列</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>

        <!-- 字段匹配问题 -->
        <el-collapse-item title="字段匹配相关问题" name="matching">
          <div class="guide-content">
            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>必填字段缺失</h4>
              <p><strong>问题描述：</strong>系统提示必填字段未匹配</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>检查Excel文件是否包含所有必填字段的数据</li>
                <li>手动调整字段匹配关系</li>
                <li>参考字段说明，确保表头名称正确</li>

              </ul>
              <el-button size="small" type="success" @click="showFieldMapping">
                查看字段对照表
              </el-button>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>表头重复或不规范</h4>
              <p><strong>问题描述：</strong>表头匹配度低或无法识别</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>确保表头名称唯一，不重复</li>
                <li>使用中文表头名称，避免特殊字符</li>
                <li>参考系统提供的标准表头名称</li>
                <li>手动配置字段映射关系</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>智能匹配失败</h4>
              <p><strong>问题描述：</strong>自动匹配结果不准确</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>使用"重新智能匹配"功能</li>
                <li>手动调整匹配关系</li>
                <li>导入之前保存的匹配模板</li>
                <li>联系管理员更新匹配规则</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>

        <!-- 数据验证问题 -->
        <el-collapse-item title="数据验证相关问题" name="validation">
          <div class="guide-content">
            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>数据类型不匹配</h4>
              <p><strong>问题描述：</strong>数据类型与字段要求不符</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>数字字段：确保单元格格式为数字，移除文本内容</li>
                <li>日期字段：使用标准日期格式（如：2024-01-01）</li>
                <li>文本字段：移除前后空格和特殊字符</li>
                <li>布尔字段：使用"是/否"或"1/0"</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>字典值不存在</h4>
              <p><strong>问题描述：</strong>数据中包含系统不识别的值</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>检查数据是否使用了正确的字典值</li>
                <li>配置自定义匹配规则（如：男→1，女→2）</li>
                <li>联系管理员更新系统字典数据</li>
                <li>参考数据字典文档</li>
              </ul>
              <el-button size="small" type="info" @click="showDictionary">
                查看数据字典
              </el-button>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>必填值缺失</h4>
              <p><strong>问题描述：</strong>必填字段存在空值</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>检查Excel中必填字段是否有空单元格</li>
                <li>填充缺失的数据</li>
                <li>设置默认值规则</li>
                <li>联系业务人员确认数据完整性</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>

        <!-- 导入执行问题 -->
        <el-collapse-item title="导入执行相关问题" name="import">
          <div class="guide-content">
            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>权限不足</h4>
              <p><strong>问题描述：</strong>无法执行导入操作</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>联系管理员申请相应的导入权限</li>
                <li>确认当前角色是否有目标表的操作权限</li>
                <li>检查是否选择了正确的目标表</li>
                <li>确认账号状态是否正常</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>导入超时或失败</h4>
              <p><strong>问题描述：</strong>导入过程中断或失败</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>减少单次导入的数据量</li>
                <li>检查网络连接是否稳定</li>
                <li>避免在系统繁忙时段导入</li>
                <li>联系技术支持检查服务器状态</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>数据冲突</h4>
              <p><strong>问题描述：</strong>导入时提示数据冲突</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>选择合适的导入模式（插入/更新/覆盖）</li>
                <li>检查主键或唯一字段是否重复</li>
                <li>清理重复数据</li>
                <li>使用"跳过错误行"选项</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>

        <!-- 系统问题 -->
        <el-collapse-item title="系统相关问题" name="system">
          <div class="guide-content">
            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>会话过期</h4>
              <p><strong>问题描述：</strong>操作过程中提示会话过期</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>重新登录系统</li>
                <li>重新开始导入流程</li>
                <li>避免长时间停留在同一页面</li>
                <li>保存重要的配置信息</li>
              </ul>
            </div>

            <div class="problem-item">
              <h4><el-icon>
                  <Warning />
                </el-icon>网络连接异常</h4>
              <p><strong>问题描述：</strong>网络不稳定导致操作失败</p>
              <p><strong>解决方案：</strong></p>
              <ul>
                <li>检查网络连接是否正常</li>
                <li>刷新页面重试</li>
                <li>更换网络环境</li>
                <li>联系网络管理员</li>
              </ul>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 联系支持 -->
      <div class="support-section">
        <el-divider>需要更多帮助？</el-divider>
        <div class="support-actions">
          <el-button type="primary" @click="contactSupport">
            <el-icon>
              <Service />
            </el-icon>
            联系技术支持
          </el-button>
          <el-button @click="viewDocumentation">
            <el-icon>
              <Document />
            </el-icon>
            查看详细文档
          </el-button>
          <el-button @click="submitFeedback">
            <el-icon>
              <EditPen />
            </el-icon>
            提交问题反馈
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 字段对照表对话框 -->
    <el-dialog v-model="fieldMappingVisible" title="字段对照表" width="800px">
      <el-table :data="fieldMappingData" border>
        <el-table-column label="序号" width="55" type="index" align="center" />
        <el-table-column prop="fieldLabel" label="字段名称" width="150" />
        <el-table-column prop="fieldName" label="字段代码" width="150" />
        <el-table-column prop="fieldType" label="数据类型" width="100" />
        <el-table-column prop="required" label="是否必填" width="100">
          <template #default="{ row }">
            <el-tag :type="row.required ? 'danger' : 'info'" size="small">
              {{ row.required ? '必填' : '可选' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="fieldComment" label="说明" min-width="200" />
      </el-table>
    </el-dialog>

    <!-- 数据字典对话框 -->
    <el-dialog v-model="dictionaryVisible" title="数据字典" width="600px">
      <el-tabs v-model="activeDictTab">
        <el-tab-pane v-for="dict in dictionaryData" :key="dict.dictType" :label="dict.dictLabel" :name="dict.dictType">
          <el-table :data="dict.items" border size="small">
            <el-table-column label="序号" width="55" type="index" align="center" />
            <el-table-column prop="label" label="显示值" width="150" />
            <el-table-column prop="value" label="存储值" width="100" />
            <el-table-column prop="remark" label="说明" min-width="200" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  QuestionFilled,
  Warning,
  Service,
  Document,
  EditPen
} from '@element-plus/icons-vue'

// 响应式数据
const activeGuides = ref<string[]>([])
const fieldMappingVisible = ref(false)
const dictionaryVisible = ref(false)
const activeDictTab = ref('')

// 字段对照表数据
const fieldMappingData = ref([
  {
    fieldLabel: '姓名',
    fieldName: 'name',
    fieldType: 'VARCHAR',
    required: true,
    fieldComment: '用户真实姓名，不超过50个字符'
  },
  {
    fieldLabel: '性别',
    fieldName: 'gender',
    fieldType: 'INT',
    required: false,
    fieldComment: '1-男，2-女，0-未知'
  },
  {
    fieldLabel: '出生日期',
    fieldName: 'birth_date',
    fieldType: 'DATE',
    required: false,
    fieldComment: '格式：YYYY-MM-DD'
  },
  {
    fieldLabel: '手机号码',
    fieldName: 'phone',
    fieldType: 'VARCHAR',
    required: true,
    fieldComment: '11位手机号码'
  },
  {
    fieldLabel: '邮箱地址',
    fieldName: 'email',
    fieldType: 'VARCHAR',
    required: false,
    fieldComment: '有效的邮箱地址格式'
  }
])

// 数据字典数据
const dictionaryData = ref([
  {
    dictType: 'gender',
    dictLabel: '性别',
    items: [
      { label: '男', value: '1', remark: '男性' },
      { label: '女', value: '2', remark: '女性' },
      { label: '未知', value: '0', remark: '性别未知' }
    ]
  },
  {
    dictType: 'status',
    dictLabel: '状态',
    items: [
      { label: '启用', value: '1', remark: '正常状态' },
      { label: '禁用', value: '0', remark: '已禁用' },
      { label: '待审核', value: '2', remark: '等待审核' }
    ]
  }
])

// 方法

const showFieldMapping = () => {
  fieldMappingVisible.value = true
}

const showDictionary = () => {
  if (dictionaryData.value.length > 0) {
    activeDictTab.value = dictionaryData.value[0].dictType
  }
  dictionaryVisible.value = true
}

const contactSupport = () => {
  ElMessage.info('技术支持联系方式：support@example.com')
}

const viewDocumentation = () => {
  window.open('/docs/excel-import-guide', '_blank')
}

const submitFeedback = () => {
  ElMessage.info('问题反馈功能待实现')
}

// 生命周期
onMounted(() => {
  // 可以从API加载字段配置和数据字典
})
</script>

<style scoped lang="scss">
.user-guide {
  .guide-card {
    .guide-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #409eff;
    }
  }

  .guide-content {
    .problem-item {
      margin-bottom: 24px;
      padding: 16px;
      background-color: #fafafa;
      border-radius: 6px;
      border-left: 4px solid #e6a23c;

      &:last-child {
        margin-bottom: 0;
      }

      h4 {
        margin: 0 0 8px 0;
        color: #e6a23c;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      p {
        margin: 8px 0;
        color: #606266;
        font-size: 14px;
        line-height: 1.5;

        strong {
          color: #303133;
        }
      }

      ul {
        margin: 8px 0;
        padding-left: 20px;
        color: #606266;
        font-size: 14px;

        li {
          margin-bottom: 4px;
          line-height: 1.5;
        }
      }

      .el-button {
        margin-top: 12px;
      }
    }
  }

  .support-section {
    margin-top: 24px;
    text-align: center;

    .support-actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;

      .el-button {
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-guide {
    .support-section .support-actions {
      flex-direction: column;
      align-items: center;

      .el-button {
        width: 200px;
      }
    }
  }
}
</style>