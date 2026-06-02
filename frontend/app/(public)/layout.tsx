import { ThemeToggle } from "@/components/theme/theme-toggle";

import { Input } from "@/components/ui/input";
import { TopMenu } from "@/components/header/top-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="border-b bg-background">
        <div className="flex h-14 items-center gap-4 px-6">
          <h1 className="font-semibold">SomeLogo</h1>

          <TopMenu></TopMenu>

          <div className="flex-1">
            <Input placeholder="Search tasks..." className="max-w-sm" />
          </div>

          <ThemeToggle></ThemeToggle>

          <Settings2 />
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
    </>
  );
}

const Settings2 = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/tasks">Tasks</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
