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

const FilterRv = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const [value, setValue] = useState<string>(
    () => searchParams.get("tab") ?? "rv"
  );

  return (
    <Select
      value={value}
      onValueChange={(value) => {
        setValue(value);
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", "1");
        params.set("tab", value);
        const newSearch = params.toString();
        replace(`${pathname}?${newSearch}`);
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="rv">Ada RV</SelectItem>
        <SelectItem value="noRv">Tidak Ada RV</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default FilterRv;
