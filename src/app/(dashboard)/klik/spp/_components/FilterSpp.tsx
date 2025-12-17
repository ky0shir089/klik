"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const FilterSpp = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [value, setValue] = useState<string>(
    () => searchParams.get("diff") ?? "0"
  );

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        setValue(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        params.set("diff", value);
        const newSearch = params.toString();
        replace(`${pathname}?${newSearch}`);
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Tidak Ada Selisih</SelectItem>
        <SelectItem value="1">Ada Selisih</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterSpp;
