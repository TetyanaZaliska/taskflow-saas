"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Member, MemberWithUser } from "../interfaces/member.interface";

interface MemberRowProps {
  member: MemberWithUser;
}

export default function MemberRow({ member }: MemberRowProps) {
  const router = useRouter();

  return (
    <TableRow
      onClick={() =>
        router.push(`/teams/${member.teamId}/members/${member.id}`)
      }
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">{member.user.email}</TableCell>
      <TableCell className="text-right">{member.role}</TableCell>
    </TableRow>
  );
}
