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
    activity: "/activity",
    team: "/team",
    settings: "/settings",

    // User
    profile: "/profile",
  },

  // actions
  api: {
    logout: "/logout",
  },
} as const;
