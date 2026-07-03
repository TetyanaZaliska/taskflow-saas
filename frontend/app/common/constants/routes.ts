export const routes = {
  public: {
    home: "/home",
    about: "/about",
    blog: "/blog",
    contacts: "/contacts",
  },
  auth: {
    login: "/login",
    signup: "/signup",
    forgotPassword: "/forgot-password",
  },

  app: {
    dashboard: "/dashboard",
    tasks: "/tasks",
    projects: "/projects",
    activities: "/activities",
    teams: "/teams",
    settings: "/settings",
    users: "/users",
    team: (teamId: string | number) => `/teams/${teamId}` as const,
    teamMembers: (teamId: string | number) =>
      `/teams/${teamId}/members` as const,
    teamProjects: (teamId: string | number) =>
      `/teams/${teamId}/projects` as const,
    project: (projectId: string | number) => `/project/${projectId}` as const,
    projectTasks: (projectId: string | number) =>
      `/project/${projectId}/tasks` as const,

    // User
    profile: "/profile",
  },

  // actions
  api: {
    logout: "/logout",
  },
} as const;
