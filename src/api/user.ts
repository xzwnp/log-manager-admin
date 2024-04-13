import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

export type UserResult = {
  success: boolean;
  data: {
    /** 用户名 */
    username: string;
    /** 当前登陆用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>("post", "/api/sys/user/login", { data });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  console.log("调用刷新token接口");
  return http.request<RefreshTokenResult>("post", "/api/sys/user/refreshToken", { data });
};

// 查询用户
export const queryUser = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/user/query", { data });
};


// 添加用户
export const addUser = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/user/add", { data });
};

// 删除用户
export const deleteUser = (username: string) => {
  let params = { username };
  return http.request<CommonResponse>("post", "/api/sys/user/delete", { params });
};

// 修改密码
export const changePassword = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/user/changePassword", { data });
};
// 编辑个人信息
export const editUserProfile = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/user/profile/edit", { data });
};

//修改管理员权限
export const modifySysAdminRole = (username: string, isAdd: boolean) => {
  let params = { username, isAdd };
  return http.request<CommonResponse>("post", "/api/sys/user/modifySysAdminRole", { params });
};


