<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="floating-shape shape-1"></div>
      <div class="floating-shape shape-2"></div>
      <div class="floating-shape shape-3"></div>
      <div class="floating-shape shape-4"></div>
      <div class="floating-shape shape-5"></div>

      <!-- 教育元素图标 -->
      <div class="edu-element books"></div>
      <div class="edu-element graduation"></div>
      <div class="edu-element school"></div>

      <!-- 网格背景 -->
      <div class="grid-overlay"></div>
    </div>

    <!-- 主要内容区域 -->
    <div class="login-content">
      <!-- 左侧介绍区域 -->
      <div class="login-intro">
        <div class="intro-header">
          <div class="logo-section">
            <div class="logo-icon">
              <el-icon size="60" color="#4169E1">
                <Management />
              </el-icon>
            </div>
            <div class="logo-text">
              <h1>智慧校园数字基座</h1>
              <p>Digital Campus Management Platform</p>
            </div>
          </div>

          <div class="intro-content">
            <h2>构建智慧教育新生态</h2>
            <div class="feature-list">
              <div class="feature-item">
                <el-icon><School /></el-icon>
                <span>统一身份认证管理</span>
              </div>
              <div class="feature-item">
                <el-icon><DataAnalysis /></el-icon>
                <span>数据驱动决策支持</span>
              </div>
              <div class="feature-item">
                <el-icon><Monitor /></el-icon>
                <span>全场景数字化服务</span>
              </div>
              <div class="feature-item">
                <el-icon><Connection /></el-icon>
                <span>开放式平台架构</span>
              </div>
            </div>
          </div>

          <div class="intro-stats">
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">服务学校</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50W+</div>
              <div class="stat-label">在线师生</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">系统稳定性</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-container">
        <div class="login-box">
          <div class="login-header">
            <h3>欢迎登录</h3>
            <p>请输入您的账号信息进入系统</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="请输入用户名"
                :prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                :prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <!-- 验证码 -->
            <el-form-item prop="captcha" v-if="showCaptcha">
              <div class="captcha-container">
                <el-input
                  v-model="loginForm.captcha"
                  placeholder="请输入验证码"
                  :prefix-icon="Key"
                  clearable
                  style="flex: 1"
                />
                <div class="captcha-image" @click="refreshCaptcha">
                  <img :src="captchaUrl" alt="验证码" />
                </div>
              </div>
            </el-form-item>

            <div class="login-options">
              <el-checkbox v-model="loginForm.rememberMe">
                记住密码
              </el-checkbox>
              <el-link type="primary" :underline="false"> 忘记密码？ </el-link>
            </div>

            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                style="width: 100%"
                @click="handleLogin"
              >
                <span v-if="!loading">立即登录</span>
                <span v-else>登录中...</span>
              </el-button>
            </el-form-item>

            <!-- 其他登录方式 -->
            <div class="other-login">
              <el-divider>
                <span style="color: #999; font-size: 12px">其他登录方式</span>
              </el-divider>
              <div class="other-login-buttons">
                <el-button circle :icon="Message" title="短信登录" />
                <el-button circle :icon="Iphone" title="扫码登录" />
                <el-button circle :icon="Reading" title="统一认证" />
              </div>
            </div>
          </el-form>

          <!-- 底部信息 -->
          <div class="login-footer">
            <p>© 2024 智慧校园数字基座管理平台</p>
            <div class="footer-links">
              <el-link type="info" :underline="false">隐私政策</el-link>
              <span>|</span>
              <el-link type="info" :underline="false">服务条款</el-link>
              <span>|</span>
              <el-link type="info" :underline="false">技术支持</el-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import {
  User,
  Lock,
  Key,
  Management,
  School,
  DataAnalysis,
  Monitor,
  Connection,
  Message,
  Iphone,
  Reading,
} from "@element-plus/icons-vue";
import { useUserStore } from "@/store/modules/user";
import type { LoginParams } from "@/types";

const router = useRouter();
const userStore = useUserStore();

const loading = ref(false);
const loginFormRef = ref();
const showCaptcha = ref(false);
const captchaUrl = ref("");

const loginForm = reactive<LoginParams>({
  username: "admin",
  password: "123456",
  captcha: "",
  rememberMe: false,
});

const loginRules = reactive({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "用户名长度在 2 到 20 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 3, message: "密码长度不能少于3位", trigger: "blur" },
  ],
  captcha: [
    {
      required: false,
      message: "请输入验证码",
      trigger: "blur",
      validator: (_rule: any, value: string, callback: any) => {
        if (showCaptcha.value && !value) {
          callback(new Error("请输入验证码"));
        } else {
          callback();
        }
      },
    },
  ],
});

// 生成验证码
const generateCaptcha = () => {
  // 这里应该调用后端API获取验证码
  captchaUrl.value = `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="40" fill="#f5f5f5"/>
      <text x="60" y="25" text-anchor="middle" font-size="18" fill="#666">${Math.random().toString(36).substr(2, 4).toUpperCase()}</text>
    </svg>
  `)}`;
};

const refreshCaptcha = () => {
  generateCaptcha();
};

const handleLogin = async () => {
  if (!loginFormRef.value) return;

  try {
    await loginFormRef.value.validate();
    loading.value = true;

    console.log("开始登录，提交的数据:", loginForm);

    // 临时测试，直接向后端发送请求，并强制跳转到首页
    try {
      await userStore.login(loginForm);
      console.log("登录成功，用户状态:", {
        token: userStore.token,
        userInfo: userStore.userInfo,
        isLoggedIn: userStore.isLoggedIn,
      });

      // 检查token是否设置成功
      if (!userStore.token) {
        console.error("登录成功但token未设置");
        ElMessage.warning("登录成功但token未正确设置，可能需要重新登录");
      }

      ElMessage.success("登录成功，欢迎回来！");

      // 简单的路由跳转，不需要强制刷新
      await router.push("/");
    } catch (error: any) {
      console.error("登录请求失败:", error);
      ElMessage.error("登录失败: " + (error.message || "用户名或密码错误"));
      showCaptcha.value = true;
      refreshCaptcha();
    }
  } catch (error: any) {
    console.error("表单验证失败:", error);
    ElMessage.error("请填写正确的登录信息");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 初始化验证码（如果需要）
  if (showCaptcha.value) {
    generateCaptcha();
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(
    125deg,
    #5e77fb 0%,
    #6d74f2 45%,
    #9088f3 75%,
    #a86fec 100%
  );
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

// 背景装饰
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -50%;
    width: 120%;
    height: 120%;
    background: radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.2) 0%,
      transparent 60%
    );
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -10%;
    left: -10%;
    width: 80%;
    height: 80%;
    background: radial-gradient(
      circle at bottom left,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 60%
    );
    z-index: -1;
  }

  .floating-shape {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    border-radius: 50%;
    animation: float 15s ease-in-out infinite;

    &.shape-1 {
      width: 300px;
      height: 300px;
      top: -10%;
      left: -5%;
      border-radius: 45% 55% 70% 30% / 30% 40% 60% 70%;
      animation:
        morphing 30s ease-in-out infinite,
        float 15s ease-in-out infinite alternate;
      opacity: 0.2;
    }

    &.shape-2 {
      width: 400px;
      height: 400px;
      top: 10%;
      right: -10%;
      border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      animation:
        morphing 25s ease-in-out infinite,
        float 20s ease-in-out infinite alternate-reverse;
      opacity: 0.15;
    }

    &.shape-3 {
      width: 250px;
      height: 250px;
      bottom: 30%;
      left: 10%;
      border-radius: 35% 65% 65% 35% / 65% 35% 65% 35%;
      animation:
        morphing 20s ease-in-out infinite,
        float 12s ease-in-out infinite alternate;
      opacity: 0.12;
    }

    &.shape-4 {
      width: 350px;
      height: 350px;
      bottom: -10%;
      right: 10%;
      border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%;
      animation:
        morphing 18s ease-in-out infinite,
        float 16s ease-in-out infinite alternate-reverse;
      opacity: 0.1;
    }

    &.shape-5 {
      display: none;
    }
  }

  // 添加校园元素装饰
  .edu-element {
    position: absolute;
    z-index: 0;
    opacity: 0.1;
    filter: brightness(2);

    &.books {
      width: 160px;
      height: 120px;
      top: 15%;
      right: 15%;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"/></svg>');
      background-repeat: no-repeat;
      background-size: contain;
      transform: rotate(-15deg);
    }

    &.graduation {
      width: 180px;
      height: 180px;
      bottom: 25%;
      left: 10%;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M5,13.18v4L12,21l7-3.82v-4L12,17L5,13.18z M12,3L1,9l11,6l9-4.91V17h2V9L12,3z"/></svg>');
      background-repeat: no-repeat;
      background-size: contain;
      transform: rotate(10deg);
    }

    &.school {
      width: 140px;
      height: 140px;
      top: 60%;
      right: 20%;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12,3L1,9l4,2.18v6L12,21l7-3.82v-6l2-1.09V17h2V9L12,3z M17,15.99l-5,2.73l-5-2.73v-3.72L12,15l5-2.73V15.99z"/></svg>');
      background-repeat: no-repeat;
      background-size: contain;
      transform: rotate(-5deg);
    }
  }

  // 添加网格装饰
  .grid-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image:
      linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: -1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes morphing {
  0% {
    border-radius: 45% 55% 70% 30% / 30% 40% 60% 70%;
  }
  25% {
    border-radius: 40% 60% 30% 70% / 50% 60% 40% 50%;
  }
  50% {
    border-radius: 60% 40% 50% 50% / 30% 30% 70% 70%;
  }
  75% {
    border-radius: 35% 65% 60% 40% / 60% 45% 55% 40%;
  }
  100% {
    border-radius: 45% 55% 70% 30% / 30% 40% 60% 70%;
  }
}

// 主要内容区域
.login-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 60px;
  z-index: 1;
  position: relative;
}

// 左侧介绍区域
.login-intro {
  flex: 1;
  color: white;

  .intro-header {
    .logo-section {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;

      .logo-icon {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 16px;
        padding: 20px;
        backdrop-filter: blur(10px);
      }

      .logo-text {
        h1 {
          font-size: 32px;
          font-weight: 700;
          margin: 0 0 8px 0;
          color: white;
        }

        p {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }
      }
    }

    .intro-content {
      margin-bottom: 40px;

      h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 24px;
        color: white;
      }

      .feature-list {
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;

          .el-icon {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px;
            color: white;
          }
        }
      }
    }

    .intro-stats {
      display: flex;
      gap: 40px;

      .stat-item {
        text-align: center;

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: white;
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }
      }
    }
  }
}

// 右侧登录表单
.login-form-container {
  width: 420px;
  flex-shrink: 0;
}

.login-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 40px;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  .login-header {
    text-align: center;
    margin-bottom: 32px;

    h3 {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    p {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
  }
}

.login-form {
  .el-form-item {
    margin-bottom: 24px;

    :deep(.el-input) {
      height: 48px;
      border-radius: 12px;

      .el-input__wrapper {
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;

        &:hover,
        &.is-focus {
          box-shadow: 0 4px 12px rgba(65, 105, 225, 0.2);
        }
      }

      .el-input__inner {
        height: 46px;
        font-size: 15px;
      }
    }
  }

  .captcha-container {
    display: flex;
    gap: 12px;
    align-items: center;

    .captcha-image {
      width: 120px;
      height: 48px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid #dcdfe6;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .el-button--primary {
    height: 48px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(135deg, #4169e1 0%, #6495ed 100%);
    border: none;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(65, 105, 225, 0.3);
    }
  }
}

.other-login {
  margin-top: 24px;

  .other-login-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 16px;

    .el-button {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid #e0e0e0;
      color: #666;
      transition: all 0.3s;

      &:hover {
        border-color: #4169e1;
        color: #4169e1;
        transform: scale(1.1);
      }
    }
  }
}

.login-footer {
  margin-top: 32px;
  text-align: center;

  p {
    font-size: 12px;
    color: #999;
    margin-bottom: 8px;
  }

  .footer-links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    font-size: 12px;

    span {
      color: #ddd;
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .login-content {
    flex-direction: column;
    gap: 40px;
    padding: 20px;
  }

  .login-intro {
    text-align: center;

    .intro-header .logo-section {
      justify-content: center;
    }

    .intro-stats {
      justify-content: center;
    }
  }

  .login-form-container {
    width: 100%;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  .login-box {
    padding: 30px 24px;
  }

  .login-intro .intro-header .logo-section {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .intro-stats {
    gap: 20px;

    .stat-item .stat-number {
      font-size: 24px;
    }
  }
}
</style>
