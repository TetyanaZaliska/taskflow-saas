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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ButtonCreate } from "@/components/custom/button-create";
import createTask from "../../actions/create-task";
import { ChoosePriority } from "./choose-priority";
import { ChooseStatus } from "./choose-status";
import { TaskSelect } from "./task-select";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";

interface CreateTaskModalProps {
  projectId: number;
}

export function CreateTaskModal({ projectId }: CreateTaskModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState<FormResponse>();
  const [status, setStatus] = useState<string>(TASK_STATUS_LIST[0].value);
  const [priority, setPriority] = useState<string>(TASK_PRIORITY_LIST[0].value);

  const onClose = () => {
    setResponse(undefined);
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogTrigger asChild>
        <ButtonCreate title="Create Task" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          action={async (formData) => {
            const response = await createTask(projectId, formData);
            setResponse(response);
            if (!response.error) {
              onClose();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
            <DialogDescription>
              Fill the data to create a new task for your team.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Task title"
                required
              />
            </Field>
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
            {!!response?.error && (
              <AlertBox message={response.error}></AlertBox>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
