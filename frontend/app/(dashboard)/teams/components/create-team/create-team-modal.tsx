"use client";

import { FormResponse } from "@/app/common/interfaces/form-response.interface";
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
import { useActionState, useState } from "react";
import createTeam from "../../actions/create-team";
import { ButtonCreate } from "@/components/custom/button-create";
import { FormError } from "@/components/custom/form-error";

export function CreateTeamModal() {
  const [modalVisible, setModalVisible] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const response = await createTeam(formData);
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
        <ButtonCreate title="Create Team" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        {modalVisible && (
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>Create your team</DialogTitle>
              <DialogDescription>
                Choose name for your new team.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Frontend Team"
                  required
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
        )}
      </DialogContent>
    </Dialog>
  );
}
