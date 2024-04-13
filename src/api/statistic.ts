import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

// 查询操作列表
export const listOperates = (appName: string, group: string) => {
  let params = { appName, group };
  return http.request<CommonResponse>("post", "/api/statistic/listOperates", { params });
};

// 查询操作列表
export const makeOperateStatistic = (data: any) => {
  return http.request<CommonResponse>("post", "/api/statistic/operateStatistic", { data });
};
