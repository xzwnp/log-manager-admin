import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

/** 查询应用 */
export const listApps = () => {
  return http.request<any>("get", "/api/sys/app/list");
};


// 查询告警规则
export const query = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/alert/rules/query", { data });
};

// 删除告警规则
export const del = (alertRuleId: number) => {
  let params = { alertRuleId };
  return http.request<CommonResponse>("post", "/api/alert/rules/delete", { params });
};

//添加告警规则
export const add = (data: object) => {
  return http.request<CommonResponse>("post", "/api/alert/rules/add", { data });
};
//编辑告警规则
export const edit = (data: object) => {
  return http.request<CommonResponse>("post", "/api/alert/rules/edit", { data });
};


//启用/禁用告警
export const enable = (alertRuleId: number, enabled: boolean) => {
  let params = { alertRuleId, enabled };
  return http.request<CommonResponse>("post", "/api/alert/rules/enable", { params });
};

//静默告警
export const mute = (alertRuleId: number, duration: number) => {
  let params = { alertRuleId, duration };
  return http.request<CommonResponse>("post", "/api/alert/rules/edit", { params });
};


