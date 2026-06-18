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
import addMember from "../actions/add-member";

interface AddMemberModalProps {
  teamId: number;
}

export function AddMemberModal({ teamId }: AddMemberModalProps) {
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
          <CirclePlus /> Add Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form
          action={async (formData) => {
            const response = await addMember(formData);
            setResponse(response);
            if (!response.error) {
              onClose();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Add a new team member</DialogTitle>
            <DialogDescription>Choose a new member</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <input type="hidden" name="teamId" value={teamId} />
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
