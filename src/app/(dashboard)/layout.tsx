import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigation } from "@/data/navigation";
import {
  redirectIfUnauthorized,
  redirectToMissingSession,
} from "@/lib/server-auth";
import { getSessionUser } from "@/lib/session-user";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    await redirectToMissingSession();
  }

  const sessionUser = user!;
  const result = await navigation();

  await redirectIfUnauthorized(result);

  const navigationItems = Array.isArray(result?.data) ? result.data : [];

  return (
    <SidebarProvider>
      <AppSidebar user={sessionUser} navigation={navigationItems} />
      <SidebarInset>
        <header className="flex items-center h-16 gap-2 shrink-0">
          <div className="flex items-center w-full gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-col flex-1 gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
