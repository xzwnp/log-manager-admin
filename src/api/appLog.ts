import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

/** 查询可查看日志的App */
export const listApps = () => {
  return http.request<CommonResponse>("get", "/api/sys/app/list");
};

/** 查询应用日志 */
export const searchAppLogs = (params?: object) => {
  return http.request<CommonResponse>("get", "/api/log/search/app/search-logs", { params });
};


export const fixException = (exceptionMessage: string) => {
  let data = exceptionMessage;
  return http.request<CommonResponse>("post", "api/log/search/app/fix-exception", { data }, { timeout: 30 * 1000 });
};
