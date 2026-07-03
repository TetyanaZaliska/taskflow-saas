export const TASK_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export const TASK_PRIORITY_LIST = [
  { value: TASK_PRIORITY.LOW, label: "Low" },
  { value: TASK_PRIORITY.MEDIUM, label: "Medium" },
  { value: TASK_PRIORITY.HIGH, label: "High" },
];
