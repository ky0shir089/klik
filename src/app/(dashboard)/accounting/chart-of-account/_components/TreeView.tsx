import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuItem, SidebarMenuSub } from "@/components/ui/sidebar";
import { coaShowType } from "@/data/coa";
import { ChevronRight, Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const TreeView = ({ item }: { item: coaShowType }) => {
  const hasChildren = useMemo(
    () => !!(item.children && item.children.length > 0),
    [item.children]
  );

  const { code, description } = item;

  if (!hasChildren) {
    return (
      <div className="flex items-center">
        <span className="w-full p-1 rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {code} - {description}
        </span>
        <Link
          href={`?id=${item.id}`}
          replace
          className="p-1 rounded-full hover:bg-sidebar-accent"
        >
          <Pencil className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <Collapsible defaultOpen>
      <SidebarMenuItem>
        <div className="flex items-center">
          <CollapsibleTrigger className="rounded-full cursor-pointer group hover:bg-sidebar-accent">
            <ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
          </CollapsibleTrigger>
          <span className="w-full p-1 rounded-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            {code} - {description}
          </span>
          <Link
            href={`?id=${item.id}`}
            className="p-1 rounded-full hover:bg-sidebar-accent"
          >
            <Pencil className="size-4" />
          </Link>
        </div>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.children!.map((subItem: coaShowType) => (
              <TreeView key={subItem.id} item={subItem} />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default TreeView;
