"use client";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { ReactNode } from "react";
import { AuthContext } from "./(auth)/auth-context";

interface AppProvidersProps {
  children: ReactNode;
  authenticated: boolean;
}

export default function AppProviders({
  children,
  authenticated,
}: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthContext.Provider value={authenticated}>
        {children}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}
