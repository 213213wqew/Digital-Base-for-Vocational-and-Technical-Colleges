<template>
  <div class="debug-container">
    <h2>API调试页面</h2>

    <el-card>
      <h3>测试API连接</h3>
      <el-button @click="testGetTables" type="primary">测试获取表名</el-button>
      <el-button @click="testGetList" type="success"
        >测试获取配置列表</el-button
      >
      <el-button @click="testAddConfig" type="warning">测试新增配置</el-button>

      <div style="margin-top: 20px">
        <h4>响应结果：</h4>
        <pre>{{ responseText }}</pre>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import {
  getSyncConfigList,
  addSyncConfig,
  getAllTableNames,
} from "@/api/sync/scheduleConfig";

const responseText = ref("");

// 测试获取表名
const testGetTables = async () => {
  try {
    responseText.value = "正在获取表名...";
    const response = await getAllTableNames();
    responseText.value = JSON.stringify(response, null, 2);
    ElMessage.success("获取表名成功");
  } catch (error) {
    responseText.value = "错误: " + JSON.stringify(error, null, 2);
    ElMessage.error("获取表名失败");
  }
};

// 测试获取配置列表
const testGetList = async () => {
  try {
    responseText.value = "正在获取配置列表...";
    const response = await getSyncConfigList({
      pageNum: 1,
      pageSize: 10,
      moduleName: "",
      enabled: null,
    });
    responseText.value = JSON.stringify(response, null, 2);
    ElMessage.success("获取配置列表成功");
  } catch (error) {
    responseText.value = "错误: " + JSON.stringify(error, null, 2);
    ElMessage.error("获取配置列表失败");
  }
};

// 测试新增配置
const testAddConfig = async () => {
  try {
    responseText.value = "正在新增配置...";
    const testData = {
      moduleName: "测试模块",
      moduleCode: "test_module",
      sourceTable: "test_source",
      targetTable: "test_target",
      syncTime: "2024-12-20 02:00:00",
      enabled: true,
      sortOrder: 1,
      syncApiUrl: "/api/test",
      remark: "测试配置",
    };

    const response = await addSyncConfig(testData);
    responseText.value = JSON.stringify(response, null, 2);
    ElMessage.success("新增配置成功");
  } catch (error) {
    responseText.value = "错误: " + JSON.stringify(error, null, 2);
    ElMessage.error("新增配置失败");
  }
};
</script>

<style scoped>
.debug-container {
  padding: 20px;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  max-height: 400px;
  overflow-y: auto;
}
</style>
