"use client";

import { TreeView, TreeDataItem } from "@/components/tree-view";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TreeForm = ({ data }: { data: TreeDataItem[] }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSelect = (item: TreeDataItem) => {
    console.log(item);
    if (item) {
      const params = new URLSearchParams(searchParams);
      params.set("coaId", item.id);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="border-2 border-primary">
      <TreeView data={data} onSelectChange={handleSelect} />
    </div>
  );
};

export default TreeForm;
