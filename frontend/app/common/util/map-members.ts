// src/app/common/util/map-members.ts
import { UserIcon } from "lucide-react";
import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";
import { SelectOption } from "../interfaces/select-option.interface";

export function mapMembersToOptions(members: MemberWithUser[]): SelectOption[] {
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
