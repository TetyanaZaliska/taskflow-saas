"use server";

import { get } from "@/app/common/util/fetch";
import { Team } from "../interfaces/team.interface";

export default async function getTeams() {
  return get<Team[]>("teams");
}
