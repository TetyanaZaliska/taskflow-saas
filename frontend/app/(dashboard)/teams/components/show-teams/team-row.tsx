"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Team } from "../../interfaces/team.interface";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/app/common/constants/routes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import removeTeam from "../../actions/remove-team";
import { formatDate } from "@/app/common/util/format-date";
import { ButtonDelete } from "@/components/custom/button-delete";

interface TeamRowProps {
  team: Team;
}

export default function TeamRow({ team }: TeamRowProps) {
  const router = useRouter();

  const handleDeleteTeam = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const res = await removeTeam(team.id);
    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Team was successfully deleted!", {
        position: "top-right",
      });
      router.refresh();
    }
  };

  const handleRouteTeam = () => router.push(routes.app.team(team.id));

  return (
    <TableRow
      onClick={handleRouteTeam}
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">{team.id}</TableCell>
      <TableCell>{team.name}</TableCell>
      <TableCell suppressHydrationWarning className="text-right">
        {formatDate(team.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <ButtonDelete onClick={handleDeleteTeam} />
      </TableCell>
    </TableRow>
  );
}
