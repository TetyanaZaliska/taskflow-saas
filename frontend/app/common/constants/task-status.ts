export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export const TASK_STATUS_LIST = [
  { value: TASK_STATUS.TODO, label: "Todo" },
  { value: TASK_STATUS.IN_PROGRESS, label: "In progress" },
  { value: TASK_STATUS.DONE, label: "Done" },
];
