"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Member, MemberWithUser } from "../interfaces/member.interface";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import deleteMember from "../actions/delete-member";
import { toast } from "sonner";

interface MemberRowProps {
  member: MemberWithUser;
}

export default function MemberRow({ member }: MemberRowProps) {
  const router = useRouter();

  const handleRouteUser = () =>
    router.push(`${routes.app.teamMembers(member.teamId)}/${member.user.id}`);

  const handleDelete = async () => {
    const res = await deleteMember(member.teamId, member.user.id);

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Team member was deleted!", { position: "top-right" });
    }
  };

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell onClick={handleRouteUser} className="font-medium">
        {member.user.email}
      </TableCell>
      <TableCell onClick={handleRouteUser} className="text-right">
        {member.role}
      </TableCell>
      <TableCell className="text-right">
        <Button onClick={handleDelete} variant="destructive" className="w-min">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
