"use client";

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
import { useActionState, useState } from "react";
import createProject from "../../actions/create-project";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonCreate } from "@/components/custom/button-create";
import { FormError } from "@/components/custom/form-error";

interface CreateProjectModalProps {
  teamId: number;
}

export function CreateProjectModal({ teamId }: CreateProjectModalProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const response = await createProject(teamId, formData);
      if (response && !response.error) {
        setModalVisible(false);
      }
      return response;
    },
    { error: "" },
  );

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogTrigger asChild>
        <ButtonCreate title="Create Project" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
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
                disabled={isPending}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                placeholder="Type your description here..."
                id="description"
                name="description"
                disabled={isPending}
              />
            </Field>

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
      </DialogContent>
    </Dialog>
  );
}
