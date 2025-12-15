import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { metaProps } from "./columns";

const Pagination = ({ meta }: { meta: metaProps }) => {
  console.log(meta)
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [pageSize, setPageSize] = useState(
    Number(searchParams.get("size")) || 10
  );

  function createPageURL(pageNumber: number | string, size: number | string) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    params.set("size", size.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between px-2 mt-4">
      <div className="hidden text-sm text-muted-foreground sm:flex">
        Showing {meta?.from} to {meta?.to} of {meta?.total} results
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Per page</p>
          <Select
            value={`${meta?.per_page}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
              createPageURL(1, Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => setCurrentPage(1)}
            disabled={meta?.prev_page_url ? false : true}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={meta?.prev_page_url ? false : true}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {meta?.last_page}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={meta?.next_page_url ? false : true}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => setCurrentPage(meta?.last_page)}
            disabled={meta?.next_page_url ? false : true}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
