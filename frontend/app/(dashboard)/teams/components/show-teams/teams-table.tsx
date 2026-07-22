import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTeams from "../../actions/get-teams";
import TeamRow from "./team-row";
import { Team } from "../../interfaces/team.interface";
import { FormError } from "@/components/custom/form-error";

export default async function TeamsTable() {
  const teams = await getTeams();

  if (teams && "error" in teams) {
    return <FormError error={teams.error} />;
  }

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
        {teams.map((team: Team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </TableBody>
    </Table>
  );
}
