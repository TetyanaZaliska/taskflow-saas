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
    team: (teamId: string | number) => `/teams/${teamId}` as const,
    teamMembers: (teamId: string | number) =>
      `/teams/${teamId}/members` as const,
    settings: "/settings",
    users: "/users",

    // User
    profile: "/profile",
  },

  // actions
  api: {
    logout: "/logout",
  },
} as const;
