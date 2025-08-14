import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { getToken, removeToken } from "@/utils/token";
import { useUserStore } from "@/store/modules/user";
import router from "@/router";

// 创建axios实例
// const service: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL as string,
//   timeout: 15000,
// });

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',  // 修改为新的API前缀
  timeout: 15000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 添加用户信息到请求头（用于操作日志等功能）
    try {
      const userStore = useUserStore();
      if (userStore.isLoggedIn && userStore.userInfo.id) {
        // 添加用户基本信息（对中文字符进行编码）
        config.headers["X-User-Id"] = userStore.userInfo.id;
        config.headers["X-Username"] = encodeURIComponent(
          userStore.userInfo.username || "",
        );
        config.headers["X-Real-Name"] = encodeURIComponent(
          userStore.userInfo.nickname || "",
        );

        // 添加当前角色信息
        if (userStore.currentRoleId) {
          config.headers["X-Role-Id"] = userStore.currentRoleId;

          // 查找角色名称并编码
          const currentRole = userStore.userInfo.roles.find(
            (role) => role.id === userStore.currentRoleId,
          );
          if (currentRole) {
            config.headers["X-Role-Name"] = encodeURIComponent(
              currentRole.roleName || "",
            );
          }
        }
      }
    } catch (error) {
      // 如果获取用户信息失败，不影响请求继续
      console.warn("获取用户信息失败:", error);
    }

    // 添加租户ID（如果有多租户系统）
    // const tenantId = getTenantId();
    // if (tenantId) {
    //   config.headers['Tenant-Id'] = tenantId;
    // }

    return config;
  },
  (error) => {
    console.error("请求拦截器错误:", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 如果是blob类型的响应（如文件下载），直接返回
    if (response.config.responseType === "blob") {
      return response;
    }

    const res = response.data;

    // 调试输出
    console.log("响应数据:", {
      url: response.config.url,
      method: response.config.method,
      status: response.status,
      responseType: response.config.responseType,
      data: response.data,
    });

    // 如果状态码不是200，认为请求错误
    if (res.code && res.code !== 200) {
      // 根据不同的错误码处理不同的情况
      switch (res.code) {
        // 401: 未登录或token过期
        case 401:
          ElMessageBox.confirm(
            "登录状态已过期，您可以继续留在该页面，或者重新登录",
            "系统提示",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning",
            },
          ).then(() => {
            const userStore = useUserStore();
            userStore.logout();
            removeToken();
            router.push("/login");
          });
          break;

        // 403: 权限不足
        case 403:
          ElMessage({
            message: res.message || "权限不足，无法访问",
            type: "error",
            duration: 3 * 1000,
          });
          break;

        // 500: 服务器错误
        case 500:
          ElMessage({
            message: res.message || "服务器错误，请联系管理员",
            type: "error",
            duration: 3 * 1000,
          });
          break;

        // 其他错误
        default:
          ElMessage({
            message: res.message || "未知错误",
            type: "error",
            duration: 3 * 1000,
          });
      }
      return Promise.reject(new Error(res.message || "系统错误"));
    } else {
      // 请求成功，返回完整响应对象
      return response;
    }
  },
  (error) => {
    // 处理网络错误
    let message = "网络错误，请检查您的网络连接";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "未授权，请重新登录";
          // 清除用户信息并跳转到登录页
          const userStore = useUserStore();
          userStore.logout();
          removeToken();
          router.push("/login");
          break;
        case 403:
          message = "拒绝访问，没有权限";
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = "请求超时";
          break;
        case 500:
          message = "服务器内部错误";
          break;
        case 501:
          message = "服务未实现";
          break;
        case 502:
          message = "网关错误";
          break;
        case 503:
          message = "服务不可用";
          break;
        case 504:
          message = "网关超时";
          break;
        case 505:
          message = "HTTP版本不受支持";
          break;
        default:
          message = `未知错误: ${error.response.status}`;
      }
    }

    ElMessage({
      message,
      type: "error",
      duration: 5 * 1000,
    });

    return Promise.reject(error);
  },
);

// 定义API响应数据结构
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * API分页响应数据结构
 *
 * @export
 * @interface ApiPagedResponse
 * @template T
 */
export type ApiPagedResponse<T> = ApiResponse<{
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}>;

// 定义分页请求参数接口
export interface PageParams {
  current: number;
  size: number;
  [key: string]: any;
}

// 定义分页响应数据接口
export interface PageResult<T> {
  total: number;
  records: T[];
  current: number;
  size: number;
  pages: number;
}

// 权限验证处理
export const checkPermission = (permission: string | string[]): boolean => {
  const userStore = useUserStore();

  if (!permission) return false;

  return userStore.hasPermission(permission);
};

// 封装请求方法
export const request = {
  /**
   * GET请求
   * @param url 请求地址
   * @param params 请求参数或配置对象
   * @param config 请求配置
   * @returns Promise
   */
  get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    // 当params不是作为config对象的一部分传入时，将其转换为axios期望的格式
    if (params && typeof params === "object") {
      // 创建一个空的配置对象，避免undefined
      const axiosConfig = config || {};
      // 将params设置为请求参数
      return service.get(url, { ...axiosConfig, params });
    }
    return service.get(url, { params, ...config });
  },

  /**
   * POST请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.post(url, data, config);
  },

  /**
   * PUT请求
   * @param url 请求地址
   * @param data 请求数据
   * @param config 请求配置
   * @returns Promise
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return service.put(url, data, config);
  },

  /**
   * DELETE请求
   * @param url 请求地址
   * @param params 请求参数或请求体
   * @param config 请求配置
   * @returns Promise
   */
  delete<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    // 检查params是否包含data属性，如果有，则作为请求体传递
    if (params && params.data) {
      return service.delete(url, { ...config, data: params.data });
    }
    // 否则作为URL参数传递
    return service.delete(url, { params, ...config });
  },

  /**
   * 上传文件
   * @param url 上传地址
   * @param file 文件对象
   * @param onProgress 上传进度回调
   * @param config 请求配置
   * @returns Promise
   */
  upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return service.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
      ...config,
    });
  },

  /**
   * 下载文件
   * @param url 下载地址
   * @param params 请求参数
   * @param filename 文件名
   * @param config 请求配置
   * @returns Promise
   */
  download(
    url: string,
    params?: any,
    filename?: string,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    return service
      .get(url, {
        params,
        responseType: "blob",
        ...config,
      })
      .then((response) => {
        // 创建blob链接
        const blob = new Blob([response.data]);
        const downloadUrl = URL.createObjectURL(blob);

        // 创建a标签并模拟点击下载
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename || "文件下载";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // 释放blob链接
        URL.revokeObjectURL(downloadUrl);

        return blob;
      });
  },

  /**
   * 使用权限验证的请求
   * @param permission 所需权限
   * @param requestFn 请求函数
   * @returns Promise
   */
  withPermission<T = any>(
    permission: string | string[],
    requestFn: () => Promise<T>,
  ): Promise<T> {
    if (!checkPermission(permission)) {
      ElMessage.error("您没有执行此操作的权限");
      return Promise.reject(new Error("没有权限"));
    }
    return requestFn();
  },
};

// 兼容旧版导出方式
export const http = request;

export default request;
