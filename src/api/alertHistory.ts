import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

/** 查询应用 */
export const listApps = () => {
  return http.request<any>("get", "/api/sys/app/list");
};


// 查询告警历史
export const query = (data?: object) => {
  return http.request<CommonResponse>("post", "/api/alert/rules/query", { data });
};



