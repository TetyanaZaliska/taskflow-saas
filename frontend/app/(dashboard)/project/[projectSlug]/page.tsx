import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { formatDate } from "@/app/common/util/format-date";
import getProject from "./actions/get-project";
import { redirect } from "next/navigation";

interface SingleTeamProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function Project({ params }: SingleTeamProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);

  if (isNaN(projectId)) {
    // Перенаправляємо на список проєктів команди
    redirect(routes.app.teams);
  }

  const project = await getProject(projectId);

  assertNoErrors(project, routes.app.teamProjects(project.teamId));

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {project.name}
      </h2>
      <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
        {formatDate(project.createdAt, true)}
      </h4>
      <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
        {formatDate(project.updatedAt, true)}
      </h4>
      <p>Some details will be soon</p>
      <Button variant="outline" className="w-full" asChild>
        <Link href="{routes.app.teamMembers(project.id)}">Task??</Link>
      </Button>
    </>
  );
}
