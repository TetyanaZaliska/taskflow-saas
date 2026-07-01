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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { CirclePlus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { User } from "../../members/interfaces/user.interface";
import createProject from "../actions/create-project";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateProjectModalProps {
  teamId: number;
}

export function CreateProjectModal({ teamId }: CreateProjectModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState<FormResponse>();

  const createProjectAction = createProject.bind(null, teamId);

  const onClose = () => {
    setResponse(undefined);
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <CirclePlus /> Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          action={async (formData) => {
            const response = await createProjectAction(formData);
            setResponse(response);
            if (!response.error) {
              onClose();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a new project</DialogTitle>
            <DialogDescription>
              Choose name for your new project and input description.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="mb-5">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Some Project"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                placeholder="Type your description here..."
                id="description"
                name="description"
              />
            </Field>

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
