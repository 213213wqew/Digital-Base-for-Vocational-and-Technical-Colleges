/**
 * Token 工具类
 * 负责管理用户登录令牌的存储、获取和删除
 */

// Token 存储的键名
const TOKEN_KEY = "AUTH_TOKEN";

/**
 * 设置 Token 到本地存储
 * @param token 用户登录令牌
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从本地存储获取 Token
 * @returns 存储的令牌或 null
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 从本地存储移除 Token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};
