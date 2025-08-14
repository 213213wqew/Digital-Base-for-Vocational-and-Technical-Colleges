<template>
  <el-dialog
    v-model="dialogVisible"
    title="评价维度及结果"
    width="800px"
    :close-on-click-modal="false"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="160px"
      class="evaluation-form"
    >
      <el-collapse v-model="activeNames">
        <!-- 基本信息 -->
        <el-collapse-item title="基本信息" name="basic">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="教工号" prop="basic.jgh">
                <el-input v-model="form.basic.jgh" placeholder="请输入教工号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="教师姓名" prop="basic.jsxm">
                <el-input v-model="form.basic.jsxm" placeholder="请输入教师姓名" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="性别" prop="basic.xb">
                <el-select v-model="form.basic.xb" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="男" />
                  <el-option label="女" value="女" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="政治面貌" prop="basic.zzmm">
                <el-input v-model="form.basic.zzmm" placeholder="请输入政治面貌" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="最高学历" prop="basic.zgxl">
                <el-input v-model="form.basic.zgxl" placeholder="请输入最高学历" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="年龄" prop="basic.nl">
                <el-input-number v-model="form.basic.nl" :min="0" placeholder="请输入年龄" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="教龄" prop="basic.jl">
                <el-input-number v-model="form.basic.jl" :min="0" placeholder="请输入教龄" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="本校教龄" prop="basic.bxjl">
                <el-input-number v-model="form.basic.bxjl" :min="0" placeholder="请输入本校教龄" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="所在院系" prop="basic.szyx">
                <el-input v-model="form.basic.szyx" placeholder="请输入所在院系" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所在部门" prop="basic.szbm">
                <el-input v-model="form.basic.szbm" placeholder="请输入所在部门" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="教职工类别" prop="basic.jzglb">
                <el-input v-model="form.basic.jzglb" placeholder="请输入教职工类别" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否双师型教师" prop="basic.sfssx">
                <el-select v-model="form.basic.sfssx" placeholder="请选择" style="width: 100%">
                  <el-option label="是" value="是" />
                  <el-option label="否" value="否" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 教育教学 -->
        <el-collapse-item title="教育教学" name="teaching">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任教专业号" prop="teaching.rjzyh">
                <el-input v-model="form.teaching.rjzyh" placeholder="请输入任教专业号" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任教专业名称" prop="teaching.rjzymc">
                <el-input v-model="form.teaching.rjzymc" placeholder="请输入任教专业名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任教班级名称" prop="teaching.rjbjmc">
                <el-input v-model="form.teaching.rjbjmc" placeholder="请输入任教班级名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任教课程号" prop="teaching.rjkch">
                <el-input v-model="form.teaching.rjkch" placeholder="请输入任教课程号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="任教课程名称" prop="teaching.rjkcmc">
                <el-input v-model="form.teaching.rjkcmc" placeholder="请输入任教课程名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="今日应到课时数" prop="teaching.jrydkss">
                <el-input-number v-model="form.teaching.jrydkss" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="今日实到课时数" prop="teaching.jrsdkss">
                <el-input-number v-model="form.teaching.jrsdkss" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="指导毕业论文获奖次数" prop="teaching.zdbylwhjcs">
                <el-input-number v-model="form.teaching.zdbylwhjcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="指导竞赛获奖次数" prop="teaching.zdjshjcs">
                <el-input-number v-model="form.teaching.zdjshjcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 党建思政 -->
        <el-collapse-item title="党建思政" name="party">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与党员干部学习活动次数" prop="party.cydygbxxhdcs">
                <el-input-number v-model="form.party.cydygbxxhdcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参与党课活动次数" prop="party.cydkhdcs">
                <el-input-number v-model="form.party.cydkhdcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与三会活动次数" prop="party.cyshhdcs">
                <el-input-number v-model="form.party.cyshhdcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="参与主题党日活动次数" prop="party.cyztdrhdcs">
                <el-input-number v-model="form.party.cyztdrhdcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与思政活动次数" prop="party.cyszhdcs">
                <el-input-number v-model="form.party.cyszhdcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 教研科研 -->
        <el-collapse-item title="教研科研" name="research">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="国家级教学能力大赛获奖数量" prop="research.gjjjxnldshjsl">
                <el-input-number v-model="form.research.gjjjxnldshjsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省部级教学能力大赛获奖数量" prop="research.sbjjxnldshjsl">
                <el-input-number v-model="form.research.sbjjxnldshjsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="国家级教学成果奖数量" prop="research.gjjjxcgjsl">
                <el-input-number v-model="form.research.gjjjxcgjsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="科研项目数量" prop="research.kyxmsl">
                <el-input-number v-model="form.research.kyxmsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="科研项目名称" prop="research.kyxmmc">
                <el-input v-model="form.research.kyxmmc" type="textarea" :rows="2" placeholder="请输入科研项目名称" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发表论文数量" prop="research.fblwsl">
                <el-input-number v-model="form.research.fblwsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发布专利数量" prop="research.fbzlsl">
                <el-input-number v-model="form.research.fbzlsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="发表专著数量" prop="research.fbzzsl">
                <el-input-number v-model="form.research.fbzzsl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主讲学术讲座次数" prop="research.zjxsjzcs">
                <el-input-number v-model="form.research.zjxsjzcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与学术讲座次数" prop="research.cyxsjzcs">
                <el-input-number v-model="form.research.cyxsjzcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 管理服务 -->
        <el-collapse-item title="管理服务" name="management">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="今日一卡通认证次数" prop="management.jryktrzcs">
                <el-input-number v-model="form.management.jryktrzcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="今日一卡通消费次数" prop="management.jryktxfcs">
                <el-input-number v-model="form.management.jryktxfcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="今日一卡通消费金额" prop="management.jryktxfje">
                <el-input-number v-model="form.management.jryktxfje" :min="0" :precision="2" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="今日借阅图书数量" prop="management.jrjytssl">
                <el-input-number v-model="form.management.jrjytssl" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 信息化系统访问 -->
        <el-collapse-item title="信息化系统访问" name="system">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="信息化系统访问次数" prop="system.xxhxtfwcs">
                <el-input-number v-model="form.system.xxhxtfwcs" :min="0" placeholder="请输入" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="访问信息化系统编号" prop="system.fwxxhxtbh">
                <el-input v-model="form.system.fwxxhxtbh" placeholder="请输入访问信息化系统编号" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 综合评价 -->
        <el-collapse-item title="综合评价" name="evaluation">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="获得奖励及荣誉" prop="evaluation.hdjljry">
                <el-input v-model="form.evaluation.hdjljry" type="textarea" :rows="3" placeholder="请输入获得奖励及荣誉" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="综合评价评语" prop="evaluation.zhpjpy">
                <el-input v-model="form.evaluation.zhpjpy" type="textarea" :rows="3" placeholder="请输入综合评价评语" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  modelValue: boolean;
  initialValue?: string;
  jgh?: string;
  jsxm?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', payload: { jsonString: string; jgh: string; jsxm: string }): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const activeNames = ref(['basic']);
const formRef = ref<any>();

const enToZhMap: Record<string, string> = {
  basic: "基本信息", jgh: "教工号", jsxm: "教师姓名", xb: "性别", zzmm: "政治面貌",
  zgxl: "最高学历", nl: "年龄", jl: "教龄", bxjl: "本校教龄", szyx: "所在院系",
  szbm: "所在部门", jzglb: "教职工类别", sfssx: "是否双师型教师",
  teaching: "教育教学", rjzyh: "任教专业号", rjzymc: "任教专业名称", rjbjmc: "任教班级名称",
  rjkch: "任教课程号", rjkcmc: "任教课程名称", jrydkss: "今日应到课时数", jrsdkss: "今日实到课时数",
  zdbylwhjcs: "指导毕业论文获奖次数", zdjshjcs: "指导竞赛获奖次数",
  party: "党建思政", cydygbxxhdcs: "参与党员干部学习活动次数", cydkhdcs: "参与党课活动次数",
  cyshhdcs: "参与三会活动次数", cyztdrhdcs: "参与主题党日活动次数", cyszhdcs: "参与思政活动次数",
  research: "教研科研", gjjjxnldshjsl: "国家级教学能力大赛获奖数量", sbjjxnldshjsl: "省部级教学能力大赛获奖数量",
  gjjjxcgjsl: "国家级教学成果奖数量", kyxmsl: "科研项目数量", kyxmmc: "科研项目名称",
  fblwsl: "发表论文数量", fbzlsl: "发布专利数量", fbzzsl: "发表专著数量",
  zjxsjzcs: "主讲学术讲座次数", cyxsjzcs: "参与学术讲座次数",
  management: "管理服务", jryktrzcs: "今日一卡通认证次数", jryktxfcs: "今日一卡通消费次数",
  jryktxfje: "今日一卡通消费金额", jrjytssl: "今日借阅图书数量",
  system: "信息化系统访问", xxhxtfwcs: "信息化系统访问次数", fwxxhxtbh: "访问信息化系统编号",
  evaluation: "综合评价", hdjljry: "获得奖励及荣誉", zhpjpy: "综合评价评语",
};
const zhToEnMap: Record<string, string> = Object.fromEntries(Object.entries(enToZhMap).map(([k, v]) => [v, k]));

const createInitialFormState = () => ({
  basic: {
    jgh: '', jsxm: '', xb: '', zzmm: '', zgxl: '', nl: null, jl: null, bxjl: null,
    szyx: '', szbm: '', jzglb: '', sfssx: ''
  },
  teaching: {
    rjzyh: '', rjzymc: '', rjbjmc: '', rjkch: '', rjkcmc: '', jrydkss: null,
    jrsdkss: null, zdbylwhjcs: null, zdjshjcs: null
  },
  party: {
    cydygbxxhdcs: null, cydkhdcs: null, cyshhdcs: null, cyztdrhdcs: null, cyszhdcs: null
  },
  research: {
    gjjjxnldshjsl: null, sbjjxnldshjsl: null, gjjjxcgjsl: null, kyxmsl: null,
    kyxmmc: '', fblwsl: null, fbzlsl: null, fbzzsl: null, zjxsjzcs: null, cyxsjzcs: null
  },
  management: {
    jryktrzcs: null, jryktxfcs: null, jryktxfje: null, jrjytssl: null
  },
  system: {
    xxhxtfwcs: null, fwxxhxtbh: ''
  },
  evaluation: {
    hdjljry: '', zhpjpy: ''
  }
});

const form = reactive(createInitialFormState());
type FormState = ReturnType<typeof createInitialFormState>;

watch(() => props.modelValue, (isVisible) => {
  if (isVisible) {
    const initialState = createInitialFormState();
    if (props.initialValue) {
      try {
        const parsedValue = JSON.parse(props.initialValue);
        const englishKeyData: Partial<FormState> = {};
        for (const zhKey in parsedValue) {
          const enKey = zhToEnMap[zhKey] as keyof FormState;
          if (enKey && initialState.hasOwnProperty(enKey)) {
            const subObject: any = {};
            const zhSubObject = parsedValue[zhKey];
            for (const zhSubKey in zhSubObject) {
              const enSubKey = zhToEnMap[zhSubKey];
              if (enSubKey) {
                subObject[enSubKey] = zhSubObject[zhSubKey];
              }
            }
            englishKeyData[enKey] = subObject;
          }
        }
        for (const key in initialState) {
          const typedKey = key as keyof FormState;
          if (englishKeyData.hasOwnProperty(typedKey) && englishKeyData[typedKey]) {
            Object.assign(initialState[typedKey], englishKeyData[typedKey]);
          }
        }
      } catch (e) {
        console.warn('Initial value is not a valid JSON. Ignoring.', e);
      }
    }
    Object.assign(form, initialState);

    if (!form.basic.jgh && props.jgh) {
      form.basic.jgh = props.jgh;
    }
    if (!form.basic.jsxm && props.jsxm) {
      form.basic.jsxm = props.jsxm;
    }
  }
}, { immediate: true });

const handleClose = () => {
  dialogVisible.value = false;
};

const handleSubmit = () => {
  try {
    const chineseKeyData: Record<string, any> = {};
    for (const enKey in form) {
      const typedEnKey = enKey as keyof FormState;
      const zhKey = enToZhMap[typedEnKey];
      if (zhKey) {
        chineseKeyData[zhKey] = {};
        const enSubObject = form[typedEnKey];
        for (const enSubKey in enSubObject) {
          const zhSubKey = enToZhMap[enSubKey];
          if (zhSubKey) {
            const value = (enSubObject as any)[enSubKey];
            if (value !== null && value !== '' && value !== undefined) {
              chineseKeyData[zhKey][zhSubKey] = value;
            }
          }
        }
        if (Object.keys(chineseKeyData[zhKey]).length === 0) {
          delete chineseKeyData[zhKey];
        }
      }
    }
    const payload = {
      jsonString: JSON.stringify(chineseKeyData, null, 2),
      jgh: form.basic.jgh,
      jsxm: form.basic.jsxm,
    };
    emit('submit', payload);
    handleClose();
  } catch (e) {
    ElMessage.error('数据格式化为JSON失败');
    console.error(e);
  }
};
</script>

<style scoped>
.evaluation-form {
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 16px;
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
  font-weight: bold;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}
</style> 