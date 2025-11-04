import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navigation } from "@/data/navigation";
import { getCookieData } from "@/lib/cookieData";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

async function AppSideMenu() {
  const user = (await getCookieData("user")) as string;

  if (!user) {
    redirect("/login");
  }

  const { data } = await navigation();

  return <AppSidebar user={JSON.parse(user)} navigation={data} />;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSideMenu />
      </Suspense>
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
