"use server";

import { get } from "@/app/common/util/fetch";
import { Team } from "../interfaces/team.interface";
import { routes } from "@/app/common/constants/routes";

export default async function getTeams() {
  return get<Team[]>(routes.app.teams, ["teams"]);
}
