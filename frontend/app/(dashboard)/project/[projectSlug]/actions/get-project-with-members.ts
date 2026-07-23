import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { ProjectWithMembers } from "../interfaces/project-with-members.interface";

export default async function getProjectWithMembers(projectId: number) {
  return get<ProjectWithMembers>(
    `${routes.app.project(projectId)}/with-members`,
  );
}
