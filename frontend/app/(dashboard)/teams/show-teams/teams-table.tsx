import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTeams from "../actions/get-teams";
import TeamRow from "./team-row";

export default async function TeamsTable() {
  const teams = await getTeams();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] text-muted-foreground">ID</TableHead>
          <TableHead className="text-muted-foreground">Name</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Created
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </TableBody>
    </Table>
  );
}
