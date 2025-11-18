"use client";

import * as React from "react";
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
import Image from "next/image";

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
                <Image
                  src="https://kliklelang.co.id/img/logo-klik.svg"
                  width={0}
                  height={0}
                  alt="logo_klik"
                  className="object-contain h-auto mx-auto w-28"
                  loading="eager"
                />
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
