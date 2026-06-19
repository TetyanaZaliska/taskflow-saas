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
import { CirclePlus, UserPlus } from "lucide-react";
import { useState } from "react";
import addMember from "../actions/add-member";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";

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

  const users = [
    "User 1...",
    "(GMT-8) Los Angeles",
    "(GMT-6) Chicago",
    "(GMT-5) Toronto",
    "(GMT-8) Vancouver",
    "(GMT-3) São Paulo",
  ] as const;

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
            <Combobox items={users}>
              <ComboboxInput placeholder="Select a user">
                <InputGroupAddon>
                  <UserPlus />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent alignOffset={-28} className="w-60">
                <ComboboxEmpty>No users found.</ComboboxEmpty>
                <ComboboxList>
                  {(user) => (
                    <ComboboxItem key={user} value={user}>
                      {user}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

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
