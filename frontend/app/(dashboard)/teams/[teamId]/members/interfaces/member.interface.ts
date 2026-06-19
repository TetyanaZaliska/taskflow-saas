export type TeamRole = "ADMIN" | "MEMBER";

export interface Member {
  id: number;
  userId: number;
  teamId: number;
  role: TeamRole;
  createdAt: string;
}

export type MemberWithUser = Member & {
  user: {
    id: number;
    email: string;
  };
};
