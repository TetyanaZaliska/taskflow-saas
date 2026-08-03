"use server";

import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { Project } from "../interfaces/project.interface";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
} from "@/app/common/constants/constants";
import {
  PaginatedResponse,
  PaginationQuery,
} from "@/app/common/interfaces/pagination.interface";

export default async function getProjects(
  teamId: number,
  query?: PaginationQuery,
) {
  const page = Number(query?.page) || DEFAULT_PAGE;
  const limit = Number(query?.limit) || DEFAULT_PAGE_LIMIT;

  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const url = `${routes.app.teamProjects(teamId)}?${searchParams.toString()}`;

  const response = await get<PaginatedResponse<Project>>(url, [
    `teams-${teamId}-projects`,
  ]);

  return response;
}
