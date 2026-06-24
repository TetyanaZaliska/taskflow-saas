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
import { CirclePlus, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import addMember from "../actions/add-member";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { ChooseRole } from "./choose-role";
import { User } from "../interfaces/user.interface";
import { searchUsers } from "../actions/search-users";

interface AddMemberModalProps {
  teamId: number;
}

export function AddMemberModal({ teamId }: AddMemberModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [response, setResponse] = useState<FormResponse>();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const addMemberAction = addMember.bind(null, teamId);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.length < 2) {
        setUsers([]);
        return;
      }

      try {
        const users = await searchUsers(search);

        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search]);

  const onClose = () => {
    setResponse(undefined);
    setSelectedUser(null);
    setSearch("");
    setUsers([]);
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
            const response = await addMemberAction(formData);
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
          <FieldGroup className="mb-5">
            <Combobox
              items={users}
              name="userId"
              value={selectedUser}
              onValueChange={setSelectedUser}
              onInputValueChange={(value) => setSearch(value ?? "")}
            >
              <ComboboxInput placeholder="Select a user">
                <InputGroupAddon>
                  <UserPlus />
                </InputGroupAddon>
              </ComboboxInput>
              <ComboboxContent
                alignOffset={-28}
                className="w-60 pointer-events-auto"
              >
                <ComboboxEmpty>No users found.</ComboboxEmpty>
                <ComboboxList>
                  {(user) => (
                    <ComboboxItem key={user.id} value={user.id}>
                      {user.email}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <ChooseRole />

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
