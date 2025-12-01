import React, { Suspense } from "react";
import Unauthorized from "@/components/unauthorized";
import { coaIndex, coaShow, coaShowType } from "@/data/coa";
import { notFound, redirect } from "next/navigation";
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
import { TreeViewSkeleton } from "./_components/TreeViewSkeleton";

const RenderTree = async () => {
  const result = await coaIndex();
  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  const { data } = result;

  return (
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
  );
};

const RenderForm = async ({ id }: { id: number | null }) => {
  const [result, { data: coas }] = await Promise.all([
    id ? coaShow(id) : Promise.resolve({ data: null }),
    selectCoa("PARENT"),
  ]);

  if (result.isUnauthorized) {
    redirect("/login");
  }
  if (result.isForbidden) {
    return <Unauthorized />;
  }
  if (result.isNotFound) {
    return notFound();
  }

  const { data } = result;

  return <CoaForm data={data} coas={coas} />;
};

const ChartOfAccountPage = async (props: {
  searchParams?: Promise<{
    id?: number;
  }>;
}) => {
  const searchParams = await props.searchParams;
  const id = Number(searchParams?.id) || null;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="mb-4 text-3xl font-bold">Chart of Account</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<TreeViewSkeleton />}>
          <RenderTree />
        </Suspense>

        <Suspense key={id} fallback={<CoaFormSkeleton />}>
          <RenderForm id={id} />
        </Suspense>
      </div>
    </>
  );
};

export default ChartOfAccountPage;
