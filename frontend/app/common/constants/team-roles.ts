export const TEAM_ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export const TEAM_ROLES_LIST = [
  { value: TEAM_ROLES.ADMIN, label: "Admin" },
  { value: TEAM_ROLES.MEMBER, label: "Member" },
];
