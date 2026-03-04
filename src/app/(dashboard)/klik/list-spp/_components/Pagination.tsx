"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface SppPaginationMeta {
  page: number;
  limit: number;
  offset: number;
  total: number;
  last_page: number;
}

const PAGE_SIZES = [10, 30, 50, 100];

const Pagination = ({ meta }: { meta: SppPaginationMeta }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("rows")) || meta?.limit;

  function navigate(page: number, size: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("rows", size.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <p className="text-sm text-muted-foreground">
        Showing {meta?.total > 0 ? meta?.offset + 1 : 0} to{" "}
        {meta?.offset + pageSize > meta?.total
          ? meta?.total
          : meta?.offset + pageSize}{" "}
        of {meta?.total} results
      </p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">Per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => navigate(1, Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZES.map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(currentPage - 1, pageSize)}
            disabled={currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <span className="text-sm px-2">
            Page {currentPage} of {meta?.last_page}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => navigate(currentPage + 1, pageSize)}
            disabled={currentPage === meta?.last_page}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
