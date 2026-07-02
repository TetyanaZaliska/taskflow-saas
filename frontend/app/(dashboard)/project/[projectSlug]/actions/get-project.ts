import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { Project } from "../interfaces/project.interface";

export default async function getProject(projectId: number) {
  return get<Project>(routes.app.project(projectId));
}
