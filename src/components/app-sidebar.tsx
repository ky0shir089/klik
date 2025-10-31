"use client";

import * as React from "react";
import { Command } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { navigationType } from "@/data/navigation";

interface User {
  name: string;
  user_id: string;
}

export function AppSidebar({
  user,
  navigation,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: User;
  navigation: navigationType[];
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8">
                  <Command className="size-4" />
                </div>

                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-medium truncate">Klik</span>
                  <span className="text-xs truncate">Lelang</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
