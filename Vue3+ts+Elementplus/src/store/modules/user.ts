import { defineStore } from "pinia";
import type { UserInfo, LoginParams, LoginResult } from "@/types";
import { authApi } from "@/api/auth";
import { removeToken, getToken, setToken } from "@/utils/token";

interface UserState {
  token: string;
  userInfo: UserInfo;
  currentRoleId: string;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: getToken() || "",
    userInfo: {
      id: "",
      username: "",
      nickname: "",
      avatar: "",
      email: "",
      phone: "",
      status: 1,
      roles: [],
      permissions: [],
      createTime: "",
    },
    currentRoleId: "",
  }),

  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token,

    // 用户角色代码列表
    roleCodes: (state) => state.userInfo.roles.map((role) => role.roleCode),

    // 用户权限代码列表
    permissionCodes: (state) => state.userInfo.permissions,

    // 是否是超级管理员
    isAdmin: (state) =>
      state.userInfo.roles.some((role) => role.roleCode === "admin"),

    // 用户显示名称
    displayName: (state) => state.userInfo.nickname || state.userInfo.username,

    // 用户头像
    avatarUrl: (state) => state.userInfo.avatar || "/default-avatar.png",

    // 当前角色
    currentRole: (state) => {
      if (!state.currentRoleId && state.userInfo.roles.length > 0) {
        // 如果没有设置当前角色ID但有角色，使用第一个角色
        return state.userInfo.roles[0];
      }
      return (
        state.userInfo.roles.find((role) => role.id === state.currentRoleId) ||
        null
      );
    },
  },

  actions: {
    // 登录
    async login(loginParams: LoginParams): Promise<void> {
      try {
        const response = await authApi.login(loginParams);

        // 检查响应结构

        // 从响应中提取数据
        let loginData: LoginResult | null = null;

        // 分析响应结构
        if (response.data && response.data.code === 200 && response.data.data) {
          // 标准后端返回格式 {data: 200, data: {token, userInfo}, message: 'success'}

          loginData = response.data.data as LoginResult;
        } else if (response.data && (response.data as any).token) {
          // 直接返回数据的情况

          loginData = response.data as any as LoginResult;
        } else if (response.data) {
          // 其他格式，尝试查找token和userInfo

          const anyData = response.data as any;
          if (anyData.token) {
            loginData = {
              token: anyData.token,
              userInfo: anyData.userInfo || {
                id: "",
                username: "",
                nickname: "",
                avatar: "",
                email: "",
                phone: "",
                status: 1,
                roles: [],
                permissions: [],
                createTime: "",
              },
            };
          }
        }

        if (!loginData) {
          throw new Error("登录响应格式错误，无法提取数据");
        }

        if (!loginData.token) {
          throw new Error("登录响应中没有token");
        }
        // 设置token和用户信息
        this.token = loginData.token;
        if (loginData.userInfo) {
          this.userInfo = loginData.userInfo;

          // 自动设置默认角色：如果用户有角色且未设置当前角色，使用第一个角色
          if (
            this.userInfo.roles &&
            this.userInfo.roles.length > 0 &&
            !this.currentRoleId
          ) {
            this.currentRoleId = this.userInfo.roles[0].id;
            // 保存默认角色到localStorage
            localStorage.setItem("current-role-id", this.userInfo.roles[0].id);
            console.log("自动设置默认角色:", this.userInfo.roles[0]);
          }
        } else {
          // 如果响应中没有用户信息，需要单独获取
          try {
            const userInfoResponse = await authApi.getUserInfo();
            // 从响应中提取用户信息
            let extractedUserInfo: UserInfo | null = null;

            if (
              userInfoResponse.data &&
              userInfoResponse.data.code === 200 &&
              userInfoResponse.data.data
            ) {
              extractedUserInfo = userInfoResponse.data.data;
            } else if (userInfoResponse.data) {
              const anyData = userInfoResponse.data as any;
              if (anyData.id || anyData.username) {
                extractedUserInfo = anyData as UserInfo;
              }
            }

            if (extractedUserInfo) {
              this.userInfo = extractedUserInfo;

              // 获取用户信息后，同样设置默认角色
              if (
                this.userInfo.roles &&
                this.userInfo.roles.length > 0 &&
                !this.currentRoleId
              ) {
                this.currentRoleId = this.userInfo.roles[0].id;
                localStorage.setItem(
                  "current-role-id",
                  this.userInfo.roles[0].id,
                );
                console.log(
                  "获取用户信息后设置默认角色:",
                  this.userInfo.roles[0],
                );
              }
            }
          } catch (error) {}
        }

        setToken(this.token);

        // 如果选择记住密码，保存到localStorage
        if (loginParams.rememberMe) {
          localStorage.setItem("rememberedUsername", loginParams.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }
      } catch (error) {
        console.error("登录失败:", error);
        throw error;
      }
    },

    // 登出
    async logout(): Promise<void> {
      try {
        if (this.token) {
          await authApi.logout();
        }
      } catch (error) {
        console.error("登出失败:", error);
      } finally {
        this.token = "";
        this.userInfo = {
          id: "",
          username: "",
          nickname: "",
          avatar: "",
          email: "",
          phone: "",
          status: 1,
          roles: [],
          permissions: [],
          createTime: "",
        };
        // 清空当前角色ID
        this.currentRoleId = "";
        removeToken();

        // 清除其他store数据
        const { usePermissionStore } = await import("./permission");
        const { useAppStore } = await import("./app");
        const { useMenuStore } = await import("./menu");

        // 重置菜单状态
        useMenuStore().resetMenuState();

        usePermissionStore().resetRoutes();
        useAppStore().resetState();

        // 重定向到登录页
        window.location.href = "/login";
      }
    },

    // 获取用户信息
    async getUserInfo(): Promise<UserInfo> {
      try {
        const response = await authApi.getUserInfo();

        let userInfo: UserInfo | null = null;

        if (response.data && response.data.code === 200 && response.data.data) {
          // 标准响应格式
          userInfo = response.data.data;
        } else if (response.data) {
          // 尝试直接获取
          const anyData = response.data as any;
          if (anyData.id || anyData.username) {
            userInfo = anyData as UserInfo;
          }
        }

        if (!userInfo) {
          throw new Error("无法从响应中提取用户信息");
        }

        this.userInfo = userInfo;
        return userInfo;
      } catch (error) {
        throw error;
      }
    },

    // 更新用户信息
    async updateUserInfo(userInfo: Partial<UserInfo>): Promise<void> {
      try {
        // 调用接口更新用户信息
        this.userInfo = { ...this.userInfo, ...userInfo };
      } catch (error) {
        console.error("更新用户信息失败:", error);
        throw error;
      }
    },

    // 切换角色
    switchRole(roleId: string): void {
      if (roleId && this.userInfo.roles.some((role) => role.id === roleId)) {
        this.currentRoleId = roleId;

        // 记录当前角色ID到localStorage
        localStorage.setItem("current-role-id", roleId);

        // 清除当前角色的权限缓存，后续会重新加载
        import("./permission")
          .then((module) => {
            const permissionStore = module.usePermissionStore();
            permissionStore.resetRoutes();
          })
          .catch((error) => {
            console.error("重置权限失败:", error);
          });
      }
    },

    // 修改密码
    async changePassword(
      oldPassword: string,
      newPassword: string,
    ): Promise<void> {
      try {
        await authApi.changePassword(oldPassword, newPassword);
      } catch (error) {
        console.error("修改密码失败:", error);
        throw error;
      }
    },

    // 刷新Token
    async refreshToken(): Promise<void> {
      try {
        // 获取当前token作为refreshToken参数
        const currentToken = this.token;
        const data = await authApi.refreshToken(currentToken);
        this.token = data.token;
        setToken(data.token);
      } catch (error) {
        console.error("刷新Token失败:", error);
        this.logout();
        throw error;
      }
    },

    // 检查权限
    hasPermission(permission: string | string[]): boolean {
      if (this.isAdmin) return true;

      if (Array.isArray(permission)) {
        return permission.some((p) => this.permissionCodes.includes(p));
      }

      return this.permissionCodes.includes(permission);
    },

    // 检查角色
    hasRole(role: string | string[]): boolean {
      if (this.isAdmin) return true;

      if (Array.isArray(role)) {
        return role.some((r) => this.roleCodes.includes(r));
      }

      return this.roleCodes.includes(role);
    },

    // 恢复登录状态
    restoreLoginState(): void {
      const token = getToken();
      if (token) {
        this.token = token;
        console.log("开始恢复登录状态 - user.ts");
        // 尝试获取用户信息
        this.getUserInfo()
          .then(async () => {
            // 尝试从localStorage恢复当前角色ID
            const savedRoleId = localStorage.getItem("current-role-id");
            console.log("用户信息加载完成，准备加载菜单", {
              userId: this.userInfo.id,
              savedRoleId,
              rolesCount: this.userInfo.roles.length,
            });

            // 如果有保存的角色ID且该角色存在于用户角色列表中
            if (
              savedRoleId &&
              this.userInfo.roles.some((role) => role.id === savedRoleId)
            ) {
              this.currentRoleId = savedRoleId;

              // 完全禁用自动菜单加载
              /*
            try {
              const { useMenuStore } = await import('./menu')
              const menuStore = useMenuStore()
              await menuStore.getUserMenuPermissions(this.userInfo.id, savedRoleId)
            } catch (error) {
              console.error('恢复角色菜单权限失败:', error)
            }
            */
              console.log("禁用恢复登录状态时的菜单加载", { savedRoleId });
            }
            // 如果没有保存的角色ID或角色ID不存在，但有角色，则使用第一个角色
            else if (this.userInfo.roles.length > 0) {
              this.currentRoleId = this.userInfo.roles[0].id;

              // 完全禁用自动菜单加载
              /*
            try {
              const { useMenuStore } = await import('./menu')
              const menuStore = useMenuStore()
              await menuStore.getUserMenuPermissions(this.userInfo.id, this.userInfo.roles[0].id)
            } catch (error) {
              console.error('获取默认角色菜单权限失败:', error)
            }
            */
              console.log("禁用恢复登录状态时的菜单加载(默认角色)", {
                defaultRoleId: this.userInfo.roles[0].id,
              });
            } else {
              // 如果没有角色，使用用户ID获取菜单权限（兼容无角色情况）
              /*
            try {
              const { useMenuStore } = await import('./menu')
              const menuStore = useMenuStore()
              await menuStore.getUserMenuPermissions(this.userInfo.id)
            } catch (error) {
              console.error('获取用户菜单权限失败:', error)
            }
            */
              console.log("禁用恢复登录状态时的菜单加载(无角色)");
            }
          })
          .catch((error) => {
            console.error("恢复登录状态失败:", error);
          });
      }
    },

    // 重置状态
    resetState(): void {
      this.token = "";
      this.userInfo = {
        id: "",
        username: "",
        nickname: "",
        avatar: "",
        email: "",
        phone: "",
        status: 1,
        roles: [],
        permissions: [],
        createTime: "",
      };
      removeToken();
    },
  },

  // 持久化配置
  persist: {
    key: "user-store",
    storage: localStorage,
    paths: ["userInfo", "currentRoleId"], // 持久化用户信息和当前角色ID
  },
});
