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
import { FieldGroup } from "@/components/ui/field";
import { UserPlus } from "lucide-react";
import { useActionState, useEffect, useState, useTransition } from "react";
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
import { User } from "../../interfaces/user.interface";
import addMember from "../../actions/add-member";
import { searchUsers } from "../../actions/search-users";
import { ButtonCreate } from "@/components/custom/button-create";
import { FormError } from "@/components/custom/form-error";
import { assertValidResponse } from "@/app/common/util/assert-valid-response";

interface AddMemberModalProps {
  teamId: number;
}

export function AddMemberModal({ teamId }: AddMemberModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const onClose = () => {
    setSelectedUser(null);
    setSearch("");
    setUsers([]);
    setModalVisible(false);
  };

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const response = await addMember(teamId, formData);
      if (response && !response.error) {
        onClose();
      }
      return response;
    },
    { error: "" },
  );

  useEffect(() => {
    let isCurrent = true;
    const timeout = setTimeout(async () => {
      if (search.length < 2) {
        setUsers([]);
        return;
      }

      try {
        const users = await searchUsers(search);

        if (!isCurrent) return;

        assertValidResponse(users);

        setUsers(users);
      } catch (error) {
        console.error(error);
        if (isCurrent) setUsers([]);
      }
    }, 300);

    return () => {
      isCurrent = false;
      clearTimeout(timeout);
    };
  }, [search]);

  return (
    <Dialog open={modalVisible} onOpenChange={setModalVisible}>
      <DialogTrigger asChild>
        <ButtonCreate title="Add Member" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Add a new team member</DialogTitle>
            <DialogDescription>Choose a new member</DialogDescription>
          </DialogHeader>
          <FieldGroup className="mb-5">
            <Combobox
              items={users}
              name="email"
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
                    <ComboboxItem key={user.id} value={user.email}>
                      {user.email}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <ChooseRole />

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
