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
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import createTeam from "./create-team";

export function CreateTeamModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState<FormResponse>();

  const onClose = () => {
    setResponse(undefined);
    setModalVisible(false);
  };

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          <CirclePlus /> Create Team
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          action={async (formData) => {
            const response = await createTeam(formData);
            setResponse(response);
            if (!response.error) {
              onClose();
            }
          }}
        >
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
