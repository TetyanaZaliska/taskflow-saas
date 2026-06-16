import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getTeams from "../actions/get-teams";

export default async function TeamsTable() {
  const teams = await getTeams();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.id}</TableCell>
            <TableCell>{team.name}</TableCell>
            <TableCell className="text-right">{team.createdAt}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
