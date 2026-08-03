import { routes } from "@/app/common/constants/routes";
import getTeam from "../actions/get-team";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { CreateProjectModal } from "./componets/create-project/create-project-modal";
import ProjectsTable from "./componets/show-projects/projects-table";
import { Suspense } from "react";
import ProjectsTableSkeleton from "./componets/show-projects/projects-table-skeleton";
import { PAGE_LIMIT } from "@/app/common/constants/constants";

interface MembersProps {
  params: Promise<{ teamId: string }>;
  searchParams: Promise<{ page?: string; limit?: string }>;
}

export default async function Members({ params, searchParams }: MembersProps) {
  const teamId = +(await params).teamId;
  const team = await getTeam(teamId);

  assertNoErrors(team, routes.app.teams);

  const currentPage = parseInt((await searchParams).page || "1", 10);
  const currentLimit = parseInt(
    (await searchParams).limit || `${PAGE_LIMIT}`,
    10,
  );

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {team.name}
      </h2>
      <CreateProjectModal teamId={teamId} />
      <Suspense key={teamId} fallback={<ProjectsTableSkeleton />}>
        <ProjectsTable
          teamId={teamId}
          currentLimit={currentLimit}
          currentPage={currentPage}
        />
      </Suspense>
    </>
  );
}
