import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import getProject from "./actions/get-project";
import { redirect } from "next/navigation";
import { toSlug } from "@/app/common/util/to-slug";
import { ProjectDetails } from "./components/project-details";

interface ProjectProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function Project({ params }: ProjectProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);

  if (isNaN(projectId)) {
    redirect(routes.app.teams);
  }

  const project = await getProject(projectId);

  assertNoErrors(project, routes.app.teams);

  const taskLink = routes.app.projectTasks(
    `${project.id}-${toSlug(project.name)}`,
  );

  return <ProjectDetails project={project} taskLink={taskLink} />;
}
