"use client";

import { useActionNotify } from "@/hooks/use-activity-notify";
import updateTask from "../../actions/update-task";
import { TaskWithProject } from "../../interfaces/task.interface";
import { formatDate } from "@/app/common/util/format-date";
import { TaskFieldDropdown } from "../../components/show-tasks/task-field-dropdown";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { AlertCircle, UserIcon } from "lucide-react";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { AutoSaveTextarea } from "./auto-save-textarea";
import { useEffect, useMemo, useState } from "react";
import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";
import getMembers from "@/app/(dashboard)/teams/[teamId]/members/actions/get-members";

interface TaskDetailsProps {
  task: TaskWithProject;
}

export function TaskDetails({ task }: TaskDetailsProps) {
  const { handleResult } = useActionNotify();
  const [members, setMembers] = useState<MemberWithUser[]>([]);

  const handleUpdateFields = async (formData: FormData) => {
    const res = await updateTask(task.projectId, task.id, formData);

    handleResult(res);
  };

  useEffect(() => {
    getMembers(task.project.teamId).then((data) => {
      if (Array.isArray(data)) {
        setMembers(data);
      }
    });
  }, [task.project.teamId]);

  const mappedMembers = useMemo(() => {
    return [
      {
        value: "null",
        label: "No assignee",
        icon: UserIcon,
        color: "text-muted-foreground",
      },
      ...members.map((member) => ({
        value: String(member.user.id),
        label: member.user.email,
        icon: UserIcon,
      })),
    ];
  }, [members]);

  return (
    <>
      <AutoSaveTextarea
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        initialValue={task.title}
        fieldName="title"
        onUpdate={handleUpdateFields}
      />

      <div className="flex flex-row gap-4">
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
        <TaskFieldDropdown
          currentValue={task.assigneeId?.toString() || "null"}
          options={mappedMembers}
          fieldName="assigneeId"
          onUpdate={handleUpdateFields}
          defaultIcon={AlertCircle}
          showLabel
        />
      </div>
      <AutoSaveTextarea
        initialValue={task.description}
        fieldName="description"
        onUpdate={handleUpdateFields}
      />

      <div className="flex justify-between w-full border-b border-t">
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Updated: {formatDate(task.updatedAt, true)}
        </h4>
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Created: {formatDate(task.createdAt, true)}
        </h4>
      </div>
    </>
  );
}
