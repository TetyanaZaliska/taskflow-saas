"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { MemberWithUser } from "../../interfaces/member.interface";
import { routes } from "@/app/common/constants/routes";
import removeMember from "../../actions/remove-member";
import { toast } from "sonner";
import { ButtonDelete } from "@/components/custom/button-delete";

interface MemberRowProps {
  member: MemberWithUser;
}

export default function MemberRow({ member }: MemberRowProps) {
  // const router = useRouter();

  // const handleRouteUser = () =>
  //   router.push(`${routes.app.teamMembers(member.teamId)}/${member.user.id}`);

  const handleRemoveMember = async () => {
    const res = await removeMember(member.teamId, member.user.id);

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
      <TableCell className="font-medium">{member.user.email}</TableCell>
      <TableCell className="text-right">{member.role}</TableCell>
      <TableCell className="text-right">
        <ButtonDelete onClick={handleRemoveMember} />
      </TableCell>
    </TableRow>
  );
}
