"use client";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { UserPlus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
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
import { FormError } from "@/components/custom/form-error";
import { assertValidResponse } from "@/app/common/util/assert-valid-response";

interface AddMemberFormProps {
  teamId: number;
  onSuccess: () => void;
}

export function AddMemberForm({ teamId, onSuccess }: AddMemberFormProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const [state, formAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const response = await addMember(teamId, formData);
      if (response && !response.error) {
        onSuccess();
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
  );
}
