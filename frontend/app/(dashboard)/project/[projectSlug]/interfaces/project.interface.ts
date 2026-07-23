import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";

export interface Project {
  id: number;
  name: string;
  description: string;
  teamId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectWithMembers extends Project {
  team: {
    id: number;
    name: string;
    members: MemberWithUser[];
  };
}
