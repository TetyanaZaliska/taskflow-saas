import {
  CheckCircle2,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CirclePercent,
  ListTodo,
  Square,
  SquareCheck,
  Timer,
  TrendingUp,
} from "lucide-react";

export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export const TASK_STATUS_LIST = [
  {
    value: TASK_STATUS.TODO,
    label: "Todo",
    icon: Circle,
    color: "!text-muted-foreground",
  },
  {
    value: TASK_STATUS.IN_PROGRESS,
    label: "In progress",
    icon: TrendingUp,
    color: "!text-yellow-500",
  },
  {
    value: TASK_STATUS.DONE,
    label: "Done",
    icon: CircleCheck,
    color: "!text-blue-500",
  },
];
