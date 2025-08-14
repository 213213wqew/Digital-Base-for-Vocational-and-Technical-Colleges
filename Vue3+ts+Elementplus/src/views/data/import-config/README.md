# 通用Excel导入功能使用说明

## 1. 功能概述

通用Excel导入功能是一个可配置的、智能的Excel数据导入解决方案，支持98个数据表的统一导入管理。

### 1.1 核心特性

- **智能字段匹配**：支持精确匹配、模糊匹配、拼音匹配等多种匹配策略
- **可视化配置**：提供友好的配置管理界面
- **步骤化导入**：文件选择 → 字段映射 → 数据预览 → 执行导入
- **批量处理**：支持大文件分片处理和批量导入
- **错误处理**：详细的错误信息和回滚机制

### 1.2 技术架构

```
前端组件 (UniversalImportDialog)
    ↓
通用API (CommonImportAPI)
    ↓
后端服务 (CommonImportService)
    ↓
数据库配置 (sys_import_config)
```

## 2. 快速开始

### 2.1 在页面中使用

```vue
<template>
  <div>
    <!-- 导入按钮 -->
    <el-button type="success" @click="openImport">
      <el-icon><Upload /></el-icon>智能导入
    </el-button>
    
    <!-- 通用导入组件 -->
    <UniversalImportDialog
      ref="importRef"
      :table-name="'ods_sxbgjlsj'"
      :title="'实习报告记录数据智能导入'"
      @success="handleImportSuccess"
      @error="handleImportError"
    />
  </div>
</template>

<script setup>
import UniversalImportDialog from '@/components/CommonImport/UniversalImportDialog.vue'

const importRef = ref()

const openImport = () => {
  importRef.value.open()
}

const handleImportSuccess = (result) => {
  ElMessage.success(`导入成功：${result.successRows}条数据`)
  getList() // 刷新列表
}

const handleImportError = (error) => {
  ElMessage.error(`导入失败：${error.message}`)
}
</script>
```

### 2.2 组件Props说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| tableName | string | - | 表名标识（必填） |
| title | string | '数据导入' | 导入对话框标题 |
| config | ImportConfigVO | - | 表配置（可选，默认从数据库获取） |
| advancedConfig | object | - | 高级配置选项 |

### 2.3 高级配置

```typescript
const advancedConfig = {
  matchThreshold: 85,                    // 匹配阈值 60-100
  matchStrategies: ['exact', 'fuzzy', 'semantic'], // 匹配策略
  autoMapping: true,                     // 是否自动映射
  customRules: [                         // 自定义匹配规则
    {
      excelPattern: '学生编号',
      systemField: 'xh',
      priority: 1
    }
  ]
}
```

## 3. 配置管理

### 3.1 数据库配置

系统使用以下数据库表进行配置管理：

- `sys_import_config`：导入配置主表
- `sys_import_field_config`：字段配置表
- `sys_import_match_rule`：智能匹配规则表
- `sys_import_log`：导入日志表

### 3.2 配置示例

#### 3.2.1 主配置

```sql
INSERT INTO sys_import_config (
  table_name, table_label, module_name, api_base_path, 
  import_modes, template_exclude_fields, default_values, enable_status
) VALUES (
  'ods_sxbgjlsj', '实习报告记录数据表', 'zygjx', '/api/data/zygjx/ods_sxbgjlsj',
  '["insert", "upsert"]',
  '["zjsjwyxbs", "xxdm", "reportStatus", "enableStatus", "sjcjsj"]',
  '{"xxdm": "systemSchoolCode", "sjcjsj": "currentTimestamp", "reportStatus": "0", "enableStatus": "1"}',
  1
);
```

#### 3.2.2 字段配置

```sql
INSERT INTO sys_import_field_config (
  table_name, field_name, field_label, field_type, 
  is_required, is_default, max_length, field_example, sort_order, enable_status
) VALUES 
('ods_sxbgjlsj', 'xh', '学号', 'string', 1, 0, 50, '2021001', 10, 1),
('ods_sxbgjlsj', 'xsxm', '学生姓名', 'string', 1, 0, 60, '张三', 11, 1);
```

#### 3.2.3 匹配规则

```sql
INSERT INTO sys_import_match_rule (
  table_name, field_name, match_patterns, match_priority, 
  exact_match, match_strategy, confidence_threshold, enable_status
) VALUES 
('ods_sxbgjlsj', 'xh', '["学号", "XH", "StudentNo"]', 1, 1, 'exact', 100, 1),
('ods_sxbgjlsj', 'xsxm', '["学生姓名", "姓名", "Name"]', 1, 1, 'exact', 100, 1);
```

## 4. API接口

### 4.1 获取导入配置

```typescript
GET /api/common/import/{tableName}/config
```

### 4.2 解析Excel表头

```typescript
POST /api/common/import/{tableName}/parseHeaders
Content-Type: multipart/form-data
```

### 4.3 执行高级智能匹配

```typescript
POST /api/common/import/{tableName}/advancedMatch
Content-Type: application/json

{
  "headers": ["学号", "姓名", "班级"],
  "matchThreshold": 80,
  "matchStrategies": ["exact", "fuzzy", "pinyin"],
  "autoMapping": true
}
```

### 4.4 执行导入

```typescript
POST /api/common/import/{tableName}/import
Content-Type: multipart/form-data

{
  "file": File,
  "config": {
    "fieldMapping": {"学号": "xh", "姓名": "xsxm"},
    "unmappedFieldsDefaults": {"xxdm": "1000000001"},
    "startRow": 2,
    "autoGenerateId": true
  }
}
```

### 4.5 下载模板

```typescript
GET /api/common/import/{tableName}/template
```

## 5. 使用流程

### 5.1 导入步骤

1. **选择文件**：上传Excel文件，支持拖拽上传
2. **字段映射**：配置Excel列与系统字段的映射关系
3. **数据预览**：预览导入数据，确认数据正确性
4. **执行导入**：开始导入数据，显示进度和结果

### 5.2 智能匹配

系统支持多种匹配策略：

- **精确匹配**：字段名完全一致
- **模糊匹配**：包含关系、相似度匹配
- **拼音匹配**：中文拼音匹配
- **语义匹配**：同义词、近义词匹配

### 5.3 错误处理

- 文件格式验证
- 数据格式验证
- 必填字段检查
- 业务规则验证
- 事务回滚机制

## 6. 最佳实践

### 6.1 配置最佳实践

1. **字段配置**：必填字段要设置 `is_required = 1`
2. **匹配规则**：优先使用精确匹配，设置合理的优先级
3. **验证规则**：设置必要的格式验证和业务规则
4. **默认值**：为系统自动处理字段设置合适的默认值

### 6.2 使用最佳实践

1. **文件准备**：使用标准模板，确保数据格式正确
2. **字段映射**：仔细检查字段映射关系
3. **数据预览**：导入前预览数据，确认无误
4. **错误处理**：及时处理导入错误，分析失败原因

### 6.3 性能优化

1. **文件大小**：建议单次导入不超过10MB
2. **批量处理**：大文件使用分片处理
3. **数据库优化**：使用批量插入，优化索引
4. **并发控制**：避免同时导入同一表

## 7. 常见问题

### 7.1 导入失败排查

1. **检查配置**：确认表配置是否存在且正确
2. **检查文件**：确认Excel文件格式和内容
3. **检查映射**：确认字段映射关系
4. **查看日志**：查看详细的错误信息

### 7.2 性能问题

1. **文件过大**：使用分片处理或压缩文件
2. **网络问题**：检查网络连接和超时设置
3. **数据库问题**：检查数据库性能和连接数

### 7.3 匹配问题

1. **匹配率低**：调整匹配阈值和策略
2. **匹配错误**：检查匹配规则配置
3. **新增字段**：添加新的匹配规则

## 8. 扩展开发

### 8.1 添加新表

1. 在数据库中配置表信息
2. 配置字段定义和匹配规则
3. 在页面中使用通用组件

### 8.2 自定义验证

```typescript
const customValidation = (data: any, fieldName: string) => {
  if (fieldName === 'phone' && !/^1[3-9]\d{9}$/.test(data[fieldName])) {
    return { valid: false, message: '手机号格式不正确' }
  }
  return { valid: true }
}
```

### 8.3 自定义处理器

```java
@Component
public class CustomFieldProcessor implements FieldProcessor {
    @Override
    public Object process(String value, FieldConfig config) {
        // 自定义处理逻辑
        return processedValue;
    }
}
```

## 9. 更新日志

### v1.0.0 (2024-12-19)
- 初始版本发布
- 支持基础导入功能
- 支持智能字段匹配
- 支持配置化管理

### 计划功能
- 支持更多字段类型
- 增强匹配算法
- 添加数据预览功能
- 支持导入模板自定义 