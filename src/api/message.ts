import { http } from "@/utils/http";
import { CommonResponse } from "@/utils/http/types";

/** 查询应用 */
export const listStationMessages = () => {
  return http.request<CommonResponse>("get", "/api/messaging/station-message/list");
};


