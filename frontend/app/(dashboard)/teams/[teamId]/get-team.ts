import { get } from "@/app/common/util/fetch";
import { Team } from "../interfaces/team.interface";

export default async function getTeam(teamId: number) {
  return get<Team>(`teams/${teamId}`);
}
