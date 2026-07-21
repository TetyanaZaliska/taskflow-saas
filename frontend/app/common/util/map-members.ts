// src/app/common/util/map-members.ts
import { UserIcon } from "lucide-react";
import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";

export interface DropdownOption {
  value: string;
  label: string;
  icon: typeof UserIcon;
  color?: string;
}

export function mapMembersToOptions(
  members: MemberWithUser[],
): DropdownOption[] {
  return [
    {
      value: "null",
      label: "No assignee",
      icon: UserIcon,
      color: "text-muted-foreground",
    },
    ...members.map((member) => ({
      value: String(member.user.id),
      label: member.user.email,
      icon: UserIcon,
    })),
  ];
}
