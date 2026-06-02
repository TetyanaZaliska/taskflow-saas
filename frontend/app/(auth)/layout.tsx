import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TopMenu } from "@/components/header/top-menu";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="flex h-14 items-center gap-4 px-6">
          <h1 className="font-semibold">TaskFlow</h1>

          <TopMenu></TopMenu>

          <div className="flex-1">
            <Input placeholder="Search tasks..." className="max-w-sm" />
          </div>

          <ThemeToggle></ThemeToggle>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
}
