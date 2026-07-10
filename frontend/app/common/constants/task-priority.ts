import { SignalHigh, SignalLow, SignalMedium } from "lucide-react";

export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export const TASK_PRIORITY_LIST = [
  { value: TASK_PRIORITY.LOW, label: "Low", icon: SignalLow },
  { value: TASK_PRIORITY.MEDIUM, label: "Medium", icon: SignalMedium },
  { value: TASK_PRIORITY.HIGH, label: "High", icon: SignalHigh },
];
