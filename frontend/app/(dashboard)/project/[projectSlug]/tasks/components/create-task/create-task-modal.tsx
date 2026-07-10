"use client";

import { FormResponse } from "@/app/common/interfaces/form-response.interface";
import { AlertBox } from "@/components/custom/alert-box";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useState } from "react";
import { ButtonCreate } from "@/components/custom/button-create";
import createTask from "../../actions/create-task";
import { TaskSelect } from "./task-select";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import getProject from "../../../actions/get-project";
import { Project } from "../../../interfaces/project.interface";
import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";
import getMembers from "@/app/(dashboard)/teams/[teamId]/members/actions/get-members";
import { UserIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/custom/form-error";

interface CreateTaskModalProps {
  projectId: number;
  teamId: number;
}

export function CreateTaskModal({ projectId, teamId }: CreateTaskModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState<string>(TASK_STATUS_LIST[0].value);
  const [priority, setPriority] = useState<string>(TASK_PRIORITY_LIST[0].value);
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [assigneeId, setAssigneeId] = useState<string>("");

  const resetFormToDefault = () => {
    setStatus(TASK_STATUS_LIST[0].value);
    setPriority(TASK_PRIORITY_LIST[0].value);
    setAssigneeId("");
  };

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      formData.append("status", status);
      formData.append("priority", priority);
      formData.append("assigneeId", assigneeId);

      const res = await createTask(projectId, formData);
      if (!res.error) {
        setModalVisible(false);
        resetFormToDefault();
      }
      return res;
    },
    null,
  );

  const handleOpenChange = (visible: boolean) => {
    setModalVisible(visible);
    if (!visible) {
      resetFormToDefault();
    }
  };

  useEffect(() => {
    if (modalVisible) {
      getMembers(teamId).then((data) => {
        if (!data.error && Array.isArray(data)) {
          const activeMembers = data.filter((m) => m.user.isActive);
          setMembers(activeMembers);
        }
      });
    }
  }, [modalVisible, teamId]);

  const mappedMembers = [
    {
      value: "",
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

  return (
    <Dialog open={modalVisible} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <ButtonCreate title="Create Task" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
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
              <Button
                type="button"
                variant="outline"
                onClick={resetFormToDefault}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
