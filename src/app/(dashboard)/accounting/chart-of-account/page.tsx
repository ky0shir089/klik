import React, { Suspense } from "react";
import Unauthorized from "@/components/unauthorized";
import { coaIndex, coaShow, coaShowType } from "@/data/coa";
import { redirect } from "next/navigation";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import TreeView from "./_components/TreeView";
import CoaForm from "./_components/CoaForm";
import { selectCoa } from "@/data/select";
import { CoaFormSkeleton } from "./_components/CoaFormSkeleton";

const ChartOfAccountPage = async (props: {
  searchParams?: Promise<{
    id?: number;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const id = searchParams?.id || 0;

  const result = await coaIndex();
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;

  async function fetchCoa() {
    const { data: coas } = await selectCoa("PARENT");
    const show = await coaShow(id);

    return <CoaForm key={id} data={show.data} coas={coas} />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-3xl font-bold">Chart of Account</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item: coaShowType) => (
                  <React.Fragment key={item.id}>
                    <SidebarGroupLabel>{item.type}</SidebarGroupLabel>
                    <TreeView item={item} />
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <Suspense fallback={<CoaFormSkeleton />}>{fetchCoa()}</Suspense>
      </div>
    </>
  );
};

export default ChartOfAccountPage;
