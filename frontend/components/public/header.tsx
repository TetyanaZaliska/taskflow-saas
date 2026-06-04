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
import { authMenu, settingsMenu } from "@/app/common/constants/menus";

export default function Header() {
  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center gap-4 px-6">
        <h1 className="font-semibold">TaskFlow</h1>

        <TopMenu></TopMenu>

        <div className="flex-1">
          <Input placeholder="Search tasks..." className="max-w-sm" />
        </div>

        <ThemeToggle></ThemeToggle>
        <Settings />
      </div>
    </header>
  );
}

const Settings = () => {
  const isAuthenticated = useContext(AuthContext);
  const settings = isAuthenticated ? settingsMenu : authMenu;

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
          {settings.map((setting) => (
            <DropdownMenuItem key={setting.title} asChild>
              <Link href={setting.path}>{setting.title}</Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {isAuthenticated ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild variant="destructive">
                <Link href="#" key="Logout">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
