"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Team } from "../interfaces/team.interface";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/app/common/constants/routes";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import removeTeam from "../actions/remove-team";

interface TeamRowProps {
  team: Team;
}

export default function TeamRow({ team }: TeamRowProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await removeTeam(team.id);
    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Team member was deleted!", { position: "top-right" });
    }
  };

  const handleRouteTeam = () => router.push(routes.app.team(team.id));

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell onClick={handleRouteTeam} className="font-medium">
        {team.id}
      </TableCell>
      <TableCell onClick={handleRouteTeam}>{team.name}</TableCell>
      <TableCell onClick={handleRouteTeam} className="text-right">
        {team.createdAt}
      </TableCell>
      <TableCell className="text-right">
        <Button onClick={handleDelete} variant="destructive" className="w-min">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
