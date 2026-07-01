"use server";

import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { Project } from "../interfaces/project.interface";

export default async function getProjects(teamId: number) {
  const response = await get<Project[]>(routes.app.teamProjects(teamId), [
    `teams-${teamId}-projects`,
  ]);

  return response;
}
