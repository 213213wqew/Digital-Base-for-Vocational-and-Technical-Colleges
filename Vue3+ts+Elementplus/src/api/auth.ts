import type { LoginParams, LoginResult, UserInfo } from "@/types";
import { http } from "@/utils/request";
import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/utils/request";

/**
 * 认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   * @param data 登录参数
   * @returns 登录响应
   */
  login(data: LoginParams): Promise<AxiosResponse<ApiResponse<LoginResult>>> {
    return http.post("/api/auth/login", data);
  },

  /**
   * 用户登出
   */
  logout(): Promise<void> {
    return http.post("/api/auth/logout");
  },

  /**
   * 获取用户信息
   * @returns 用户信息
   */
  getUserInfo(): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
    return http.get("/api/auth/info");
  },

  /**
   * 刷新令牌
   * @param refreshToken 刷新令牌
   * @returns 新的访问令牌
   */
  refreshToken(refreshToken: string): Promise<{ token: string }> {
    return http.post("/api/auth/refresh", { refreshToken });
  },

  /**
   * 修改密码
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   */
  changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return http.post("/api/user/change-password", { oldPassword, newPassword });
  },

  /**
   * 更新用户信息
   * @param data 用户信息
   * @returns 更新后的用户信息
   */
  updateUserInfo(data: Partial<UserInfo>): Promise<UserInfo> {
    return http.put("/api/user/info", data);
  },
};
