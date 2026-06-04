import { routes } from "./routes";

export const topMenu = [
  { title: "Home", path: routes.public.home },
  { title: "About", path: routes.public.about },
  { title: "Blog", path: routes.public.blog },
  { title: "Contacts", path: routes.public.contacts },
];

export const authMenu = [
  { title: "Login", path: routes.auth.login },
  { title: "Signup", path: routes.auth.signup },
];

export const dashboardMenu = [
  { title: "Dashboard", path: routes.app.dashboard },
  { title: "Activity", path: routes.app.activity },
  { title: "Projects", path: routes.app.projects },
  { title: "Settings", path: routes.app.settings },
  { title: "Tasks", path: routes.app.tasks },
  { title: "Team", path: routes.app.team },
];

export const settingsMenu = [
  { title: "Dashboard", path: routes.app.dashboard },
  { title: "Tasks", path: routes.app.tasks },
  { title: "Settings", path: routes.app.settings },
];
