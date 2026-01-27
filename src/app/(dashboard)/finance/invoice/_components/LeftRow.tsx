import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { useFormContext } from "react-hook-form";
import { invoiceSchemaType } from "@/lib/formSchema";
import { coaShowType } from "@/data/coa";

interface Props {
  index: number;
  coas: coaShowType[];
  onAmountChange: (val: number) => void;
}

export const LeftRow = memo(({ index, coas, onAmountChange }: Props) => {
  const { control } = useFormContext<invoiceSchemaType>();

  return (
    <TableRow className="h-12">
      <TableCell>{index + 1}</TableCell>

      <TableCell className="min-w-[180px]">
        <FormField
          control={control}
          name={`details.${index}.inv_coa_id`}
          render={({ field }) => (
            <FormItem>
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(v) => field.onChange(Number(v))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Code Trx" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {coas.map((c) => (
                    <SelectItem key={c.id} value={String(c.coa.id)}>
                      {c.coa.code} - {c.coa.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="min-w-60">
        <FormField
          control={control}
          name={`details.${index}.description`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Keterangan" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="min-w-40">
        <FormField
          control={control}
          name={`details.${index}.item_amount`}
          render={({ field }) => (
            <NumericFormat
              customInput={Input}
              thousandSeparator
              value={field.value}
              onValueChange={(v) => {
                const val = v.floatValue ?? 0;
                field.onChange(val);
                onAmountChange(val);
              }}
            />
          )}
        />
      </TableCell>
    </TableRow>
  );
});

LeftRow.displayName = "LeftRow";
