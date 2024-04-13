import { http } from "@/utils/http";

/** 查询可查看日志的App */
export const listApps = () => {
  return http.request<any>("get", "/api/sys/app/list");
};

/** 查询应用日志 */
export const searchOperateLogs = (params?: object) => {
  return http.request<any>("get", "/api/log/search/operate/search-logs", { params });
};
