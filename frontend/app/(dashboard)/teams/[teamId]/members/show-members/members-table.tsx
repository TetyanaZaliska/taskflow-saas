import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getMembers from "../actions/get-members";
import MemberRow from "./member-row";

interface MembersTableProps {
  teamId: number;
}

export default async function MembersTable({ teamId }: MembersTableProps) {
  const members = await getMembers(teamId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground">Email</TableHead>
          <TableHead className="text-right text-muted-foreground">
            Role
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </TableBody>
    </Table>
  );
}
