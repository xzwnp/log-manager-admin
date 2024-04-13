import { http } from "@/utils/http";

/** 查询可查看日志的App */
export const listApps = () => {
  return http.request<any>("get", "/api/sys/app/list");
};
