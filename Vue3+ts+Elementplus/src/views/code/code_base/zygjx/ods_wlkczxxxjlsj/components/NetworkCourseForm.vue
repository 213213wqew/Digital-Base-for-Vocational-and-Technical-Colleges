<template>
  <div class="network-course-form">
    <el-card class="form-card" shadow="never">
      <div class="form-header">
        <div class="form-title">
          {{
            isEdit
              ? "编辑网络课程在线学习记录数据"
              : "新增网络课程在线学习记录数据"
          }}
        </div>
      </div>

      <div class="form-body">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="160px"
          class="form-container"
        >
          <div class="form-section">
            <div class="section-title">基础信息</div>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="主键数据唯一性标识" prop="zjsjwyxbs">
                  <el-input
                    v-model="form.zjsjwyxbs"
                    placeholder="请输入主键数据唯一性标识"
                    maxlength="32"
                    show-word-limit
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学校代码" prop="xxdm">
                  <el-input
                    v-model="form.xxdm"
                    placeholder="请输入学校代码"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="网络课程编号" prop="wlkcbh">
                  <el-input
                    v-model="form.wlkcbh"
                    placeholder="请输入网络课程编号"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="网络课程名称" prop="wlkcmc">
                  <el-input
                    v-model="form.wlkcmc"
                    placeholder="请输入网络课程名称"
                    maxlength="200"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="网络课程来源码" prop="wlkclym">
                  <el-select
                    v-model="form.wlkclym"
                    placeholder="请选择网络课程来源"
                    style="width: 100%"
                    clearable
                  >
                    <el-option
                      v-for="item in courseSourceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属平台名称" prop="wlkcssptmc">
                  <el-input
                    v-model="form.wlkcssptmc"
                    placeholder="请输入网络课程所属平台名称"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section">
            <div class="section-title">教师信息</div>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="主讲教师工号" prop="zjjsgh">
                  <el-input
                    v-model="form.zjjsgh"
                    placeholder="请输入主讲教师工号"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主讲教师姓名" prop="zjjsxm">
                  <el-input
                    v-model="form.zjjsxm"
                    placeholder="请输入主讲教师姓名"
                    maxlength="100"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section">
            <div class="section-title">学习数据</div>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="学生学习日期" prop="xsxxrq">
                  <el-date-picker
                    v-model="form.xsxxrq"
                    type="date"
                    placeholder="请选择学生学习日期"
                    style="width: 100%"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学生学习时长" prop="xsxxsc">
                  <el-input-number
                    v-model="form.xsxxsc"
                    :min="0"
                    :max="999999"
                    :precision="0"
                    placeholder="请输入学生学习时长（分钟）"
                    style="width: 100%"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="学生学习人次" prop="xsxxrc">
                  <el-input-number
                    v-model="form.xsxxrc"
                    :min="0"
                    :max="999999"
                    :precision="0"
                    placeholder="请输入学生学习人次"
                    style="width: 100%"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="学生提交作业数" prop="xstjzys">
                  <el-input-number
                    v-model="form.xstjzys"
                    :min="0"
                    :max="999999"
                    :precision="0"
                    placeholder="请输入学生提交作业数"
                    style="width: 100%"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="答疑讨论数" prop="dytls">
                  <el-input-number
                    v-model="form.dytls"
                    :min="0"
                    :max="999999"
                    :precision="0"
                    placeholder="请输入答疑讨论数"
                    style="width: 100%"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="录入日期" prop="lrrq">
                  <el-date-picker
                    v-model="form.lrrq"
                    type="date"
                    placeholder="请选择录入日期"
                    style="width: 100%"
                    value-format="YYYYMMDD"
                    format="YYYY-MM-DD"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <div class="form-section">
            <div class="section-title">管理信息</div>
            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="数据采集时间" prop="sjcjsj">
                  <el-date-picker
                    v-model="form.sjcjsj"
                    type="datetime"
                    placeholder="请选择数据采集时间"
                    style="width: 100%"
                    value-format="YYYYMMDDHHmmss"
                    format="YYYY-MM-DD HH:mm:ss"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上报状态" prop="reportStatus">
                  <el-select
                    v-model="form.reportStatus"
                    placeholder="请选择上报状态"
                    style="width: 100%"
                    clearable
                  >
                    <el-option label="未上报" value="0" />
                    <el-option label="已上报" value="1" />
                    <el-option label="上报失败" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="30">
              <el-col :span="12">
                <el-form-item label="启用状态" prop="enableStatus">
                  <el-select
                    v-model="form.enableStatus"
                    placeholder="请选择启用状态"
                    style="width: 100%"
                    clearable
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

      <div class="form-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">
          {{ isEdit ? "保 存" : "确 定" }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  addOdsWlkczxxxjlsj,
  updateOdsWlkczxxxjlsj,
  getCourseSourceOptions,
  type OdsWlkczxxxjlsjForm,
  type DictOption,
} from "@/api-code/code/code_base/zygjx/ods_wlkczxxxjlsj";

// Props
interface Props {
  formData: OdsWlkczxxxjlsjForm;
  isEdit: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  formData: () => ({}),
  isEdit: false,
});

// Emits
const emit = defineEmits<{
  save: [];
  cancel: [];
}>();

// 表单引用
const formRef = ref<FormInstance>();

// 表单数据
const form = reactive<OdsWlkczxxxjlsjForm>({
  id: undefined,
  zjsjwyxbs: "",
  xxdm: "",
  wlkcbh: "",
  wlkcmc: "",
  wlkclym: "",
  wlkcssptmc: "",
  zjjsgh: "",
  zjjsxm: "",
  xsxxrq: "",
  xsxxsc: undefined,
  xsxxrc: undefined,
  xstjzys: undefined,
  dytls: undefined,
  lrrq: "",
  sjcjsj: "",
  reportStatus: "0",
  enableStatus: "1",
});

// 字典选项
const courseSourceOptions = ref<DictOption[]>([]);

// 表单验证规则
const rules: FormRules = {
  zjsjwyxbs: [
    { required: true, message: "请输入主键数据唯一性标识", trigger: "blur" },
    {
      max: 32,
      message: "主键数据唯一性标识长度不能超过32个字符",
      trigger: "blur",
    },
  ],
  xxdm: [
    { required: true, message: "请输入学校代码", trigger: "blur" },
    { max: 20, message: "学校代码长度不能超过20个字符", trigger: "blur" },
  ],
  wlkcbh: [
    { required: true, message: "请输入网络课程编号", trigger: "blur" },
    { max: 50, message: "网络课程编号长度不能超过50个字符", trigger: "blur" },
  ],
  wlkcmc: [
    { required: true, message: "请输入网络课程名称", trigger: "blur" },
    { max: 200, message: "网络课程名称长度不能超过200个字符", trigger: "blur" },
  ],
  wlkclym: [
    { required: true, message: "请选择网络课程来源", trigger: "change" },
  ],
  wlkcssptmc: [
    { required: true, message: "请输入网络课程所属平台名称", trigger: "blur" },
    { max: 100, message: "所属平台名称长度不能超过100个字符", trigger: "blur" },
  ],
  zjjsgh: [
    { max: 50, message: "主讲教师工号长度不能超过50个字符", trigger: "blur" },
  ],
  zjjsxm: [
    { max: 100, message: "主讲教师姓名长度不能超过100个字符", trigger: "blur" },
  ],
  xsxxrq: [
    { required: true, message: "请选择学生学习日期", trigger: "change" },
  ],
  xsxxsc: [
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "学习时长应为0-999999之间的数字",
      trigger: "blur",
    },
  ],
  xsxxrc: [
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "学习人次应为0-999999之间的数字",
      trigger: "blur",
    },
  ],
  xstjzys: [
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "提交作业数应为0-999999之间的数字",
      trigger: "blur",
    },
  ],
  dytls: [
    {
      type: "number",
      min: 0,
      max: 999999,
      message: "答疑讨论数应为0-999999之间的数字",
      trigger: "blur",
    },
  ],
  lrrq: [{ required: true, message: "请选择录入日期", trigger: "change" }],
  reportStatus: [
    { required: true, message: "请选择上报状态", trigger: "change" },
  ],
  enableStatus: [
    { required: true, message: "请选择启用状态", trigger: "change" },
  ],
};

/** 加载字典数据 */
const loadDictOptions = async () => {
  try {
    const courseSourceRes = await getCourseSourceOptions();
    courseSourceOptions.value =
      (courseSourceRes.data as any)?.code === 200
        ? (courseSourceRes.data as any)?.data || []
        : [];
  } catch (error) {
    console.error("加载字典数据失败:", error);
    ElMessage.warning("字典数据加载失败，部分功能可能受影响");
  }
};

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();

    const submitData = { ...form };
    // 处理数值类型字段，空值设为0
    if (submitData.xsxxsc === undefined || submitData.xsxxsc === null) {
      submitData.xsxxsc = 0;
    }
    if (submitData.xsxxrc === undefined || submitData.xsxxrc === null) {
      submitData.xsxxrc = 0;
    }
    if (submitData.xstjzys === undefined || submitData.xstjzys === null) {
      submitData.xstjzys = 0;
    }
    if (submitData.dytls === undefined || submitData.dytls === null) {
      submitData.dytls = 0;
    }

    if (props.isEdit) {
      const response = await updateOdsWlkczxxxjlsj(submitData);
      if ((response.data as any)?.code === 200) {
        ElMessage.success("更新成功");
        emit("save");
      } else {
        ElMessage.error((response.data as any)?.message || "更新失败");
      }
    } else {
      const response = await addOdsWlkczxxxjlsj(submitData);
      if ((response.data as any)?.code === 200) {
        ElMessage.success("新增成功");
        emit("save");
      } else {
        ElMessage.error((response.data as any)?.message || "新增失败");
      }
    }
  } catch (error) {
    console.error("表单提交失败:", error);
    ElMessage.error("操作失败，请稍后重试");
  }
};

/** 取消操作 */
const handleCancel = () => {
  emit("cancel");
};

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields();
};

// 监听formData变化，更新表单
watch(
  () => props.formData,
  (newData) => {
    if (newData) {
      Object.assign(form, newData);
    }
  },
  { immediate: true, deep: true },
);

// 组件挂载时加载字典数据
onMounted(() => {
  loadDictOptions();
});

// 暴露方法
defineExpose({
  resetForm,
});
</script>

<style scoped lang="scss">
.network-course-form {
  padding: 0px;

  .form-card {
    margin-bottom: 10px;

    :deep(.el-card__body) {
      padding: 0;
    }
  }

  .form-header {
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    background-color: #f5f7fa;

    .form-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .form-body {
    padding: 30px;

    .form-container {
      max-height: 650px;
      overflow-y: auto;
    }

    .form-section {
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }

      .section-title {
        font-size: 15px;
        font-weight: 600;
        color: #409eff;
        margin-bottom: 20px;
        padding-bottom: 8px;
        border-bottom: 2px solid #409eff;
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 25px;
    }

    :deep(.el-form-item__label) {
      font-size: 14px;
      color: #606266;
      font-weight: 500;
      line-height: 32px;
    }

    :deep(.el-input__wrapper) {
      font-size: 14px;
      height: 36px;
      border-radius: 6px;
    }

    :deep(.el-select) {
      font-size: 14px;

      .el-input__wrapper {
        height: 36px;
        border-radius: 6px;
      }
    }

    :deep(.el-input-number) {
      .el-input__wrapper {
        height: 36px;
        border-radius: 6px;
      }
    }

    :deep(.el-date-editor.el-input) {
      width: 100%;

      .el-input__wrapper {
        height: 36px;
        border-radius: 6px;
      }
    }

    :deep(.el-textarea__inner) {
      font-size: 14px;
      border-radius: 6px;
    }
  }

  .form-footer {
    padding: 15px 30px;
    border-top: 1px solid #ebeef5;
    background-color: #f5f7fa;
    text-align: right;

    .el-button {
      margin-left: 15px;
      padding: 8px 20px;
      font-size: 14px;
      border-radius: 6px;
    }
  }
}
</style>
