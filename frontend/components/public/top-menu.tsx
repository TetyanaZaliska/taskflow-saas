"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { topMenu } from "@/app/common/constants/menus";

export function TopMenu() {
  const pages = topMenu;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {pages.map((page) => (
          <NavigationMenuItem key={page.title}>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={page.path}>{page.title}</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
