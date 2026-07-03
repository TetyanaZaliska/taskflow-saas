import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { InputGroupAddon } from "@/components/ui/input-group";
import { UserPlus } from "lucide-react";
import { useState } from "react";

interface ShowExistingUsersProps {
  teamId: number;
}

export function ShowExistingUsers({ teamId }: ShowExistingUsersProps) {
  const [value, setValue] = useState<string>("");

  const users = [
    "User 1...",
    "(GMT-8) Los Angeles",
    "(GMT-6) Chicago",
    "(GMT-5) Toronto",
    "(GMT-8) Vancouver",
    "(GMT-3) São Paulo",
  ] as const;

  return (
    <Combobox items={users} value={value} onValueChange={setValue}>
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
  );
}
