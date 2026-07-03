export const TASK_PRIORITY = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export const TASK_PRIORITY_LIST = [
  { value: TASK_PRIORITY.TODO, label: "Todo" },
  { value: TASK_PRIORITY.IN_PROGRESS, label: "In progress" },
  { value: TASK_PRIORITY.DONE, label: "Done" },
];
