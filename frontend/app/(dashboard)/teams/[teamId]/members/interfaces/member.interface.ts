import { TEAM_ROLES } from "@/app/common/constants/team-roles";
import { User } from "./user.interface";

export type TeamRole = (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES];

export interface Member {
  id: number;
  userId: number;
  teamId: number;
  role: TeamRole;
  createdAt: string;
}

export type MemberWithUser = Member & {
  user: User;
};
