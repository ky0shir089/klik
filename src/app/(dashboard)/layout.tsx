import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigation } from "@/data/navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const user = cookieStore.get("user")?.value;

  if (!user) {
    redirect("/login");
  }

  const { data } = await navigation();

  return (
    <SidebarProvider>
      <AppSidebar user={JSON.parse(user)} navigation={data} />
      <SidebarInset>
        <header className="sticky top-0 flex items-center h-16 gap-2 shrink-0">
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
