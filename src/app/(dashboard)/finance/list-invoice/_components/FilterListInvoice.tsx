"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { typeTrxShowType } from "@/data/type-trx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface iAppProps {
  typeTrxes: typeTrxShowType[];
}

const FilterListInvoice = ({ typeTrxes }: iAppProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [typeTrx, setTypeTrx] = useState<string>(
    () => searchParams.get("type_trx_id") ?? ""
  );
  const [method, setMethod] = useState<string>(
    () => searchParams.get("method") ?? ""
  );

  return (
    <div className="flex gap-2">
      <Select
        value={typeTrx}
        onValueChange={(value) => {
          setTypeTrx(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", "1");
          params.set("type_trx_id", value);
          const newSearch = params.toString();
          replace(`${pathname}?${newSearch}`);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Type Trx" />
        </SelectTrigger>
        <SelectContent>
          {typeTrxes.map((typeTrx) => (
            <SelectItem key={typeTrx.id} value={typeTrx.id}>
              {typeTrx.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={method}
        onValueChange={(value) => {
          setMethod(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", "1");
          params.set("method", value);
          const newSearch = params.toString();
          replace(`${pathname}?${newSearch}`);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="BANK">BANK</SelectItem>
          <SelectItem value="KAS">KAS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterListInvoice;
