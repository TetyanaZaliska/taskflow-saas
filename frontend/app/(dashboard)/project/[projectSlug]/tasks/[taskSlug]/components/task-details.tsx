"use client";

import { useActionNotify } from "@/hooks/use-activity-notify";
import updateTask from "../../actions/update-task";
import { Task } from "../../interfaces/task.interface";
import { formatDate } from "@/app/common/util/format-date";
import { TaskFieldDropdown } from "../../components/show-tasks/task-field-dropdown";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { AlertCircle } from "lucide-react";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { Textarea } from "@/components/ui/textarea";
import { AutoSaveTextarea } from "./auto-save-textarea";

interface TaskDetailsProps {
  task: Task;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { handleResult } = useActionNotify();

  const handleUpdateFields = async (formData: FormData) => {
    const res = await updateTask(task.projectId, task.id, formData);

    handleResult(res);
  };

  return (
    <>
      <AutoSaveTextarea
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        initialValue={task.title}
        fieldName="title"
        onUpdate={handleUpdateFields}
      />
      <div className="flex justify-between w-full">
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Updated: {formatDate(task.updatedAt, true)}
        </h4>
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Created: {formatDate(task.createdAt, true)}
        </h4>
      </div>
      <AutoSaveTextarea
        initialValue={task.description}
        fieldName="description"
        onUpdate={handleUpdateFields}
      />
      <p>{task.assigneeId}</p>
      <p>{task.authorId}</p>
      <TaskFieldDropdown
        currentValue={task.priority}
        options={TASK_PRIORITY_LIST}
        fieldName="priority"
        onUpdate={handleUpdateFields}
        defaultIcon={AlertCircle}
        showLabel
      />
      <TaskFieldDropdown
        currentValue={task.status}
        options={TASK_STATUS_LIST}
        fieldName="status"
        onUpdate={handleUpdateFields}
        defaultIcon={AlertCircle}
        showLabel
      />
    </>
  );
}
