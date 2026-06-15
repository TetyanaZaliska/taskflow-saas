import {
  Activity,
  Box,
  ClipboardList,
  Settings,
  SquareTerminal,
  Users,
} from "lucide-react";
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
  { title: "Dashboard", path: routes.app.dashboard, icon: SquareTerminal },
  { title: "Activities", path: routes.app.activities, icon: Activity },
  { title: "Projects", path: routes.app.projects, icon: Box },
  { title: "Settings", path: routes.app.settings, icon: Settings },
  { title: "Tasks", path: routes.app.tasks, icon: ClipboardList },
  { title: "Teams", path: routes.app.teams, icon: Users },
];

export const settingsMenu = [
  { title: "Dashboard", path: routes.app.dashboard },
  { title: "Tasks", path: routes.app.tasks },
  { title: "Settings", path: routes.app.settings },
];
