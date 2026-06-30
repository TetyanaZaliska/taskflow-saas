"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Team } from "../interfaces/team.interface";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { routes } from "@/app/common/constants/routes";

interface TeamRowProps {
  team: Team;
}

export default function TeamRow({ team }: TeamRowProps) {
  const router = useRouter();

  return (
    <TableRow
      onClick={() => router.push(routes.app.team(team.id))}
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">{team.id}</TableCell>
      <TableCell>{team.name}</TableCell>
      <TableCell className="text-right">{team.createdAt}</TableCell>
    </TableRow>
  );
}
