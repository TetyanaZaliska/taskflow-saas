"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionState, useState } from "react";
import createTask from "../../actions/create-task";
import { TaskSelect } from "./task-select";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/custom/form-error";
import { SelectOption } from "@/app/common/interfaces/select-option.interface";

interface CreateTaskFormProps {
  projectId: number;
  mappedMembers: SelectOption[];
  onSuccess: () => void;
}

export function CreateTaskForm({
  projectId,
  mappedMembers,
  onSuccess,
}: CreateTaskFormProps) {
  const [status, setStatus] = useState<string>(TASK_STATUS_LIST[0].value);
  const [priority, setPriority] = useState<string>(TASK_PRIORITY_LIST[0].value);
  const [assigneeId, setAssigneeId] = useState<string>("");

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      formData.append("status", status);
      formData.append("priority", priority);
      formData.append("assigneeId", assigneeId);

      const res = await createTask(projectId, formData);
      if (!res.error) {
        onSuccess();
      }
      return res;
    },
    null,
  );

  return (
    <form action={formAction}>
      <DialogHeader>
        <DialogTitle>Create new task</DialogTitle>
        <DialogDescription>
          Fill the data to create a new task for your team.
        </DialogDescription>
      </DialogHeader>
      <FieldGroup>
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            id="title"
            name="title"
            type="text"
            placeholder="Task title"
            required
          />
        </Field>

        <Field>
          <FieldLabel>Description</FieldLabel>
          <Textarea
            placeholder="Type your description here..."
            id="description"
            name="description"
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <TaskSelect
            items={mappedMembers}
            value={assigneeId}
            onChange={setAssigneeId}
            placeholder="Search team member..."
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <TaskSelect
            items={TASK_STATUS_LIST}
            value={status}
            onChange={setStatus}
            placeholder="Change status to..."
            className="w-[168px]"
          />
          <TaskSelect
            items={TASK_PRIORITY_LIST}
            value={priority}
            onChange={setPriority}
            placeholder="Change priority to..."
            className="w-[168px]"
          />
        </div>
        <FormError error={state?.error} />
      </FieldGroup>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </DialogFooter>
    </form>
  );
}
