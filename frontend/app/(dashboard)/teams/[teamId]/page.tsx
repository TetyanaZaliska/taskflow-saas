import Link from "next/link";
import getTeam from "./get-team";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { formatDate } from "@/app/common/util/format-date";

interface SingleTeamProps {
  params: Promise<{ teamId: string }>;
}

export default async function SingleTeam({ params }: SingleTeamProps) {
  const team = await getTeam(+(await params).teamId);

  assertNoErrors(team, routes.app.teams);

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {team.name}
      </h2>
      <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
        {formatDate(team.createdAt, true)}
      </h4>
      <p>Some details will be soon</p>
      <Button variant="outline" className="w-full" asChild>
        <Link href={routes.app.teamMembers(team.id)}>Members</Link>
      </Button>
      <Button variant="outline" className="w-full" asChild>
        <Link href={routes.app.teamProjects(team.id)}>Projects</Link>
      </Button>
    </>
  );
}
