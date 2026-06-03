import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface DashboardProvidersProps {
  children: ReactNode;
}

export default function DashboardProviders({
  children,
}: DashboardProvidersProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarProvider>
  );
}
