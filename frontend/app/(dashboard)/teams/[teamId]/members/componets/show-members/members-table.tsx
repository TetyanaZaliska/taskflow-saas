import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import getMembers from "../../actions/get-members";
import MemberRow from "./member-row";
import { MemberWithUser } from "../../interfaces/member.interface";

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
          <TableHead className="text-right text-muted-foreground">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member: MemberWithUser) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </TableBody>
    </Table>
  );
}
