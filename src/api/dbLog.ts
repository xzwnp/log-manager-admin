import { http } from "@/utils/http";

/** 查询可查看日志的App */
export const listApps = () => {
  return http.request<any>("get", "/api/sys/app/list");
};

/** 查询应用日志 */
export const searchDbLogs = (data?: object) => {
  return http.request<any>("post", "/api/log/search/db/search-logs", { data });
};
