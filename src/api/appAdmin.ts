import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

// 查询应用
export const queryApps = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/app/query", { data });
};

// 查询应用
export const queryAppDetail = (appName: string) => {
  let params = { appName };
  return http.request<CommonResponse>("post", "/api/sys/app/detail", { params });
};

// 导入应用
export const importApps = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/sys/app/import", { data });
};

// 删除应用
export const deleteApp = (appName: string) => {
  let params = { appName };
  return http.request<CommonResponse>("post", "/api/sys/app/delete", { params });
};

//修改管理员
export const modifyAppAdmin = (appName: string, username: string, isAdd: boolean) => {
  let params = { appName, username, isAdd };
  return http.request<CommonResponse>("post", "/api/sys/app/modifyAppAdmin", { params });
};

//修改成员
export const modifyAppUser = (appName: string, username: string, isAdd: boolean) => {
  let params = { appName, username, isAdd };
  return http.request<CommonResponse>("post", "/api/sys/app/modifyAppUser", { params });
};

//编辑应用信息
export const modifyAppInfo = (data: object) => {

  return http.request<CommonResponse>("post", "/api/sys/app/modifyAppInfo", { data });
};

//启用/禁用APp
export const enableApp = (appName:string,enabled:boolean) => {
  let params ={appName,enabled}
  return http.request<CommonResponse>("post", "/api/sys/app/enable", { params });
};
