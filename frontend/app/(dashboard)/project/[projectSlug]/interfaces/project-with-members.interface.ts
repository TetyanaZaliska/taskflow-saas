import { MemberWithUser } from "@/app/(dashboard)/teams/[teamId]/members/interfaces/member.interface";
import { Project } from "./project.interface";

export interface ProjectWithMembers extends Project {
  team: {
    id: number;
    name: string;
    members: MemberWithUser[];
  };
}
