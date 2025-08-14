<template>
  <el-dialog
    v-model="visible"
    title="编辑评价维度及结果"
    width="900px"
    :close-on-click-modal="false"
    append-to-body
    class="evaluation-dialog"
    destroy-on-close
  >
    <el-tabs v-model="activeEvaluationTab" class="evaluation-tabs">
      <el-tab-pane label="基本信息" name="basicInfo">
        <el-form :model="evaluationForm.基本信息" :rules="basicInfoRules" ref="basicInfoFormRef" label-width="150px">
          <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="学号" prop="学号"><el-input v-model="evaluationForm.基本信息.学号" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="姓名" prop="姓名"><el-input v-model="evaluationForm.基本信息.姓名" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="性别" prop="性别">
              <el-select v-model="evaluationForm.基本信息.性别" placeholder="请选择性别" style="width: 100%">
                <el-option label="男" value="男" />
                <el-option label="女" value="女" />
                <el-option label="未知" value="未知" />
              </el-select>
            </el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="政治面貌" prop="政治面貌">
              <el-select v-model="evaluationForm.基本信息.政治面貌" placeholder="请选择政治面貌" style="width: 100%">
                <el-option label="群众" value="群众" />
                <el-option label="党员" value="中共党员" />
                <el-option label="预备党员" value="中共预备党员" />
                <el-option label="共青团员" value="共青团员" />
              </el-select>
            </el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="专业号" prop="专业号">
              <el-select
                v-model="evaluationForm.基本信息.专业号"
                placeholder="请选择专业"
                style="width: 100%"
                filterable
                remote
                :remote-method="searchZyOptions"
                :loading="zyOptionsLoading"
                @change="handleZyChange"
                clearable
              >
                <el-option
                  v-for="option in zyOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="专业名称" prop="专业名称">
              <el-input v-model="evaluationForm.基本信息.专业名称" readonly placeholder="选择专业后自动填充" />
            </el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="班号" prop="班号"><el-input v-model="evaluationForm.基本信息.班号" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="班级名称" prop="班级名称"><el-input v-model="evaluationForm.基本信息.班级名称" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="入学年份"><el-input v-model="evaluationForm.基本信息.入学年份" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="学制码"><el-input v-model="evaluationForm.基本信息.学制码" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="教育教学" name="education">
        <el-form :model="evaluationForm.教育教学" label-width="150px">
           <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日应到课时数"><el-input v-model="evaluationForm.教育教学.今日应到课时数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日实到课时数"><el-input v-model="evaluationForm.教育教学.今日实到课时数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="网络课程在线学习时长"><el-input v-model="evaluationForm.教育教学.网络课程在线学习时长" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="取得证书名称"><el-input v-model="evaluationForm.教育教学.取得证书名称" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="赛事讲座参与" name="competition">
        <el-form :model="evaluationForm.赛事讲座参与" label-width="150px">
          <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参加课外赛事次数"><el-input v-model="evaluationForm.赛事讲座参与.参加课外赛事次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="课外赛事获奖奖项名称"><el-input v-model="evaluationForm.赛事讲座参与.课外赛事获奖奖项名称" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参加讲座次数"><el-input v-model="evaluationForm.赛事讲座参与.参加讲座次数" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="党建思政" name="partyBuilding">
        <el-form :model="evaluationForm.党建思政" label-width="180px">
          <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参与党员干部学习活动次数"><el-input v-model="evaluationForm.党建思政.参与党员干部学习活动次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参与党课活动次数"><el-input v-model="evaluationForm.党建思政.参与党课活动次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参与三会活动次数"><el-input v-model="evaluationForm.党建思政.参与三会活动次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参与主题党日活动次数"><el-input v-model="evaluationForm.党建思政.参与主题党日活动次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="参与思政活动次数"><el-input v-model="evaluationForm.党建思政.参与思政活动次数" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="管理服务" name="management">
        <el-form :model="evaluationForm.管理服务" label-width="150px">
          <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日一卡通认证次数"><el-input v-model="evaluationForm.管理服务.今日一卡通认证次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日一卡通消费次数"><el-input v-model="evaluationForm.管理服务.今日一卡通消费次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日一卡通消费金额"><el-input v-model="evaluationForm.管理服务.今日一卡通消费金额" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="今日借阅图书数量"><el-input v-model="evaluationForm.管理服务.今日借阅图书数量" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="信息化系统访问" name="systemAccess">
        <el-form :model="evaluationForm.信息化系统访问" label-width="150px">
          <el-row>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="信息化系统访问次数"><el-input v-model="evaluationForm.信息化系统访问.信息化系统访问次数" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="访问信息化系统编号"><el-input v-model="evaluationForm.信息化系统访问.访问信息化系统编号" /></el-form-item></el-col>
            <el-col style="margin-bottom: 20px;" :span="12"><el-form-item label="访问信息化系统名称"><el-input v-model="evaluationForm.信息化系统访问.访问信息化系统名称" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="综合评价" name="comprehensive">
        <el-form :model="evaluationForm.综合评价" label-width="150px">
          <el-row>
            <el-col :span="24"><el-form-item label="获得奖励及荣誉"><el-input type="textarea" :rows="3" v-model="evaluationForm.综合评价.获得奖励及荣誉" /></el-form-item></el-col>
            <el-col :span="24"><el-form-item label="综合评价评语"><el-input type="textarea" :rows="3" v-model="evaluationForm.综合评价.综合评价评语" /></el-form-item></el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import { getZyOptions, type ZyOption } from '@/api-code/code/code_base/zygxs/ods_xshxsj';

// --- 类型定义 ---
interface EvaluationData {
  [key: string]: string;
}

interface EvaluationFormType {
  基本信息: EvaluationData;
  教育教学: EvaluationData;
  赛事讲座参与: EvaluationData;
  党建思政: EvaluationData;
  管理服务: EvaluationData;
  信息化系统访问: EvaluationData;
  综合评价: EvaluationData;
  [key: string]: EvaluationData;
}

// --- Props and Emits ---
const props = defineProps<{
  modelValue: boolean;
  jsonData: string;
  studentId?: string;
  studentName?: string;
}>();

const emit = defineEmits(['impl:modelValue', 'impl:jsonData', 'impl-student-info']);

// --- 响应式数据 ---
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const activeEvaluationTab = ref('basicInfo');

const getDefaultEvaluationForm = (): EvaluationFormType => ({
  基本信息: { 学号: "", 姓名: "", 性别: "", 政治面貌: "", 专业号: "", 专业名称: "", 班号: "", 班级名称: "", 入学年份: "", 学制码: "" },
  教育教学: { 今日应到课时数: "", 今日实到课时数: "", 网络课程在线学习时长: "", 取得证书名称: "" },
  赛事讲座参与: { 参加课外赛事次数: "", 课外赛事获奖奖项名称: "", 参加讲座次数: "" },
  党建思政: { 参与党员干部学习活动次数: "", 参与党课活动次数: "", 参与三会活动次数: "", 参与主题党日活动次数: "", 参与思政活动次数: "" },
  管理服务: { 今日一卡通认证次数: "", 今日一卡通消费次数: "", 今日一卡通消费金额: "", 今日借阅图书数量: "" },
  信息化系统访问: { 信息化系统访问次数: "", 访问信息化系统编号: "", 访问信息化系统名称: "" },
  综合评价: { 获得奖励及荣誉: "", 综合评价评语: "" }
});

const evaluationForm = reactive<EvaluationFormType>(getDefaultEvaluationForm());

// --- 表单引用 ---
const basicInfoFormRef = ref<FormInstance>();

// --- 专业选项相关 ---
const zyOptions = ref<ZyOption[]>([]);
const zyOptionsLoading = ref(false);

// --- 表单验证规则 ---
const basicInfoRules = reactive({
  学号: [
    { required: true, message: '学号不能为空', trigger: 'blur' },
    { max: 20, message: '学号不能超过20个字符', trigger: 'blur' }
  ],
  姓名: [
    { required: true, message: '姓名不能为空', trigger: 'blur' },
    { max: 36, message: '姓名不能超过36个字符', trigger: 'blur' }
  ],
  性别: [
    { required: true, message: '性别不能为空', trigger: 'blur' }
  ],
  政治面貌: [
    { required: true, message: '政治面貌不能为空', trigger: 'blur' }
  ],
  专业号: [
    { required: true, message: '专业号不能为空', trigger: 'blur' }
  ],
  专业名称: [
    { required: true, message: '专业名称不能为空', trigger: 'blur' }
  ],
  班号: [
    { required: true, message: '班号不能为空', trigger: 'blur' }
  ],
  班级名称: [
    { required: true, message: '班级名称不能为空', trigger: 'blur' }
  ]
});

// --- 监听和方法 ---
// 加载专业选项
const loadZyOptions = async (keyword?: string) => {
  try {
    zyOptionsLoading.value = true;
    const response: any = await getZyOptions(keyword);
    if (response.data.code === 200) {
      zyOptions.value = response.data.data || [];
    } else {
      console.warn('获取专业选项失败:', response.data.message);
    }
  } catch (error) {
    console.error('获取专业选项失败:', error);
  } finally {
    zyOptionsLoading.value = false;
  }
};

// 搜索专业选项
const searchZyOptions = (keyword: string) => {
  if (keyword) {
    loadZyOptions(keyword);
  } else {
    loadZyOptions();
  }
};

// 专业选择变化处理
const handleZyChange = (value: string) => {
  if (value) {
    const selectedZy = zyOptions.value.find(option => option.value === value);
    if (selectedZy) {
      // 从专业名称中提取纯粹的名称部分，去掉前面的专业号
      let professionalName = selectedZy.label;
      if (professionalName.includes(' - ')) {
        // 如果包含 " - "，取后面的部分
        professionalName = professionalName.split(' - ')[1];
      } else if (professionalName.includes('-')) {
        // 如果包含 "-"，取后面的部分
        professionalName = professionalName.split('-')[1];
      }
      evaluationForm.基本信息.专业名称 = professionalName.trim();
    }
  } else {
    evaluationForm.基本信息.专业名称 = '';
  }
};

// 组件挂载时加载专业选项
onMounted(() => {
  loadZyOptions();
});

watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    try {
      const data = JSON.parse(props.jsonData || '{}');
      Object.assign(evaluationForm, getDefaultEvaluationForm()); // 重置表单以清除旧数据
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(evaluationForm, key)) {
          Object.assign(evaluationForm[key as keyof EvaluationFormType], data[key]);
        }
      }
    } catch (e) {
      // 如果JSON解析失败，使用默认空表单
      Object.assign(evaluationForm, getDefaultEvaluationForm());
    }
    // 当对话框打开时，从父组件同步学号和姓名
    evaluationForm.基本信息.学号 = props.studentId || evaluationForm.基本信息.学号 || "";
    evaluationForm.基本信息.姓名 = props.studentName || evaluationForm.基本信息.姓名 || "";
  }
});

const handleCancel = () => {
  visible.value = false;
};

const handleSubmit = () => {
  // 先验证基本信息表单
  basicInfoFormRef.value?.validate((valid: boolean) => {
    if (!valid) {
      // 如果验证失败，切换到基本信息标签页
      activeEvaluationTab.value = 'basicInfo';
      ElMessage.error("请完善基本信息中的必填项");
      return;
    }
    
    // 验证通过后，执行原有的提交逻辑
    // 将包含学号和姓名的完整JSON数据传回父组件
    emit('impl:jsonData', JSON.stringify(evaluationForm, null, 2));
    // 专门触发一个事件，将学号和姓名传回，用于更新父组件的表单
    emit('impl-student-info', {
      studentId: evaluationForm.基本信息.学号,
      studentName: evaluationForm.基本信息.姓名,
    });
    visible.value = false;
    ElMessage.success("评价维度及结果已更新");
  });
};
</script>

<style scoped>
.evaluation-tabs {
  max-height: 60vh;
  overflow-y: hidden;
}
.evaluation-tabs .el-tabs__content {
  max-height: calc(60vh - 40px); /* 减去tab头的高度 */
  overflow-y: auto;
  padding-right: 15px;
}
.dialog-footer {
  text-align: right;
}
</style> 