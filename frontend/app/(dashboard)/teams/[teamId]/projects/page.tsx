import { routes } from "@/app/common/constants/routes";
import getTeam from "../get-team";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { CreateProjectModal } from "./create-project/create-project-modal";
import ProjectsTable from "./show-projects/projects-table";

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
      <CreateProjectModal teamId={teamId} />
      <ProjectsTable teamId={teamId} />
    </>
  );
}
