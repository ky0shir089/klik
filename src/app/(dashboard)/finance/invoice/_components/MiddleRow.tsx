import { memo, useCallback } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { FormField, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { invoiceSchemaType } from "@/lib/formSchema";
import { pphShowType } from "@/data/pph";
import { rvShowType } from "@/data/rv";
import { RvSelector } from "./RvSelector";

interface Props {
  index: number;
  pphs: pphShowType[];
  rvs: rvShowType[];
}

export const MiddleRow = memo(({ index, pphs, rvs }: Props) => {
  const { control, getValues, setValue } = useFormContext<invoiceSchemaType>();

  const calculate = useCallback(
    (type: "pph_id" | "ppn_rate", value: number) => {
      const amount = getValues(`details.${index}.item_amount`) ?? 0;
      const pphId =
        type === "pph_id" ? value : getValues(`details.${index}.pph_id`);
      const ppnRate =
        type === "ppn_rate"
          ? value
          : (getValues(`details.${index}.ppn_rate`) ?? 0);

      const pph = pphs.find((p) => p.id === Number(pphId));
      const pphRate = pph?.rate ?? 0;

      const pphAmount = (amount * pphRate) / 100;
      const ppnAmount = (amount * ppnRate) / 100;

      setValue(`details.${index}.pph_rate`, pphRate);
      setValue(`details.${index}.pph_amount`, pphAmount);
      setValue(`details.${index}.ppn_amount`, ppnAmount);
      setValue(`details.${index}.total_amount`, amount + ppnAmount - pphAmount);
    },
    [getValues, index, pphs, setValue],
  );

  return (
    <TableRow className="h-12">
      <TableCell className="min-w-[140px]">
        <FormField
          control={control}
          name={`details.${index}.pph_id`}
          render={({ field }) => (
            <Select
              value={field.value ? String(field.value) : ""}
              onValueChange={(v) => {
                const val = Number(v);
                field.onChange(val);
                calculate("pph_id", val);
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="PPH" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {pphs.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </TableCell>

      <TableCell className="min-w-[100px]">
        <FormField
          control={control}
          name={`details.${index}.pph_rate`}
          render={({ field }) => (
            <NumericFormat
              customInput={Input}
              readOnly
              value={field.value}
              className="bg-muted"
            />
          )}
        />
      </TableCell>

      {/* Amount PPH */}
      <TableCell className="min-w-40">
        <FormField
          control={control}
          name={`details.${index}.pph_amount`}
          render={({ field }) => (
            <NumericFormat
              customInput={Input}
              readOnly
              thousandSeparator
              value={field.value}
              className="bg-muted"
            />
          )}
        />
      </TableCell>

      <TableCell className="min-w-[100px]">
        <FormField
          control={control}
          name={`details.${index}.ppn_rate`}
          render={({ field }) => (
            <NumericFormat
              customInput={Input}
              value={field.value}
              onValueChange={(v) => {
                const val = v.floatValue ?? 0;
                field.onChange(val);
                calculate("ppn_rate", val);
              }}
            />
          )}
        />
      </TableCell>

      {/* Amount PPN */}
      <TableCell className="min-w-40">
        <FormField
          control={control}
          name={`details.${index}.ppn_amount`}
          render={({ field }) => (
            <NumericFormat
              customInput={Input}
              readOnly
              thousandSeparator
              value={field.value}
              className="bg-muted"
            />
          )}
        />
      </TableCell>

      <TableCell className="min-w-40]">
        <FormField
          control={control}
          name={`details.${index}.rv_id`}
          render={({ field }) => (
            <RvSelector
              rv={rvs}
              value={field.value}
              onSelect={(item) => field.onChange(item.id)}
            />
          )}
        />
      </TableCell>
    </TableRow>
  );
});

MiddleRow.displayName = "MiddleRow";
