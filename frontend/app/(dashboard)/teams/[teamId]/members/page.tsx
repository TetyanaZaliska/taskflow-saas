import { routes } from "@/app/common/constants/routes";
import getTeam from "../get-team";
import { AddMemberModal } from "./add-member/add-member-modal";
import MembersTable from "./show-members/members-table";
import { assertNoErrors } from "@/app/common/util/error-redirect";

interface MembersProps {
  params: Promise<{ teamId: string }>;
}

export default async function Members({ params }: MembersProps) {
  const teamId = +(await params).teamId;
  const team = await getTeam(teamId);

  assertNoErrors(team, routes.app.teams);

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {team.name}
      </h2>
      <AddMemberModal teamId={teamId} />
      <MembersTable teamId={teamId} />
    </>
  );
}
