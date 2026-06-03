"use client";

import { Input } from "../ui/input";
import { ThemeToggle } from "../theme/theme-toggle";
import { TopMenu } from "./top-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/app/(auth)/auth-context";

export default function Header() {
  const isAuthenticated = useContext(AuthContext);

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-6">
        <h1 className="font-semibold">TaskFlow</h1>

        <TopMenu></TopMenu>

        <div className="flex-1">
          <Input placeholder="Search tasks..." className="max-w-sm" />
        </div>

        <ThemeToggle></ThemeToggle>
        {isAuthenticated ? <Settings /> : ""}
        <Settings />
      </div>
    </header>
  );
}

const Settings = () => {
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
          <DropdownMenuItem asChild variant="destructive">
            <Link href="#" key="Logout">
              Logout
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
