"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bankAccountShowType } from "@/data/bank-account";
import { typeTrxShowType } from "@/data/type-trx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface iAppProps {
  typeTrxes: typeTrxShowType[];
  banks: bankAccountShowType[];
}

const FilterListRv = ({ typeTrxes, banks }: iAppProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [typeTrx, setTypeTrx] = useState<string>(
    () => searchParams.get("type_trx_id") ?? ""
  );
  const [method, setMethod] = useState<string>(
    () => searchParams.get("method") ?? ""
  );
  const [bank, setBank] = useState<string>(
    () => searchParams.get("bank_account_id") ?? ""
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

      <Select
        value={bank}
        onValueChange={(value) => {
          setBank(value);
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", "1");
          params.set("bank_account_id", value);
          const newSearch = params.toString();
          replace(`${pathname}?${newSearch}`);
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Bank" />
        </SelectTrigger>
        <SelectContent>
          {banks.map((bank) => (
            <SelectItem key={bank.id} value={bank.account_number}>
              {bank.bank.name} - {bank.account_number}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterListRv;
