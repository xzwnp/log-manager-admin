import { dayjs, cloneDeep, getRandomIntBetween } from "./utils";
import GroupLine from "@iconify-icons/ri/group-line";
import Question from "@iconify-icons/ri/question-answer-line";
import CheckLine from "@iconify-icons/ri/chat-check-line";
import Smile from "@iconify-icons/ri/star-smile-line";

const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

/** 应用数量、用户数量、日志数量、用户满意度 */
const chartData = [
  {
    icon: Smile,
    bgColor: "#eff8f4",
    color: "#26ce83",
    duration: 1500,
    name: "应用数量",
    value: 16,
    percent: "+33.33%",
    data: [5, 8, 9, 9, 12, 12, 16]
  },
  {
    icon: GroupLine,
    bgColor: "#effaff",
    color: "#41b6ff",
    duration: 2200,
    name: "用户数量",
    value: 36,
    percent: "+38.46%",
    data: [8, 12, 12, 18, 26, 26, 36] // 平滑折线图数据
  },
  {
    icon: CheckLine,
    bgColor: "#fff5f4",
    color: "#e85f33",
    duration: 1600,
    name: "日志数量",
    value: 344379,
    percent: "+74.5%",
    data: [221600, 114800, 125500, 78800, 348210, 197300, 344379]
  },
  {
    icon: Question,
    bgColor: "#f6f4fe",
    color: "#7846e5",
    duration: 100,
    name: "告警次数",
    value: 19,
    percent: "+11%",
    data: [8, 12, 12, 18, 26, 17, 19] // 平滑折线图数据
  }
];

/** 分析概览 */
const barChartData = [
  {
    appLogData: [2101, 5288, 4239, 4962, 6752, 5208, 7450],
    dbLogData: [2216, 1148, 1255, 1788, 4821, 1973, 4379],
    operateLogData: [216, 148, 125, 178, 482, 197, 439]
  },
  {
    appLogData: [2101, 3280, 4400, 4962, 5752, 6889, 7600],
    dbLogData: [2116, 3148, 3255, 3788, 4821, 4970, 5390],
    operateLogData: [216, 148, 125, 178, 421, 173, 379]
  }
];


/** 数据统计 */
const tableData = Array.from({ length: 30 }).map((_, index) => {
  return {
    id: index + 1,
    appLogNumber: getRandomIntBetween(23500, 29999),
    dbLogNumber: getRandomIntBetween(13500, 17999),
    operateLogNumber: getRandomIntBetween(126, 4699),
    alertNumber: getRandomIntBetween(15, 85),
    date: dayjs().subtract(index, "day").format("YYYY-MM-DD")
  };
});

export { chartData, barChartData, tableData };
