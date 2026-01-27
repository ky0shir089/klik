import { memo } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { invoiceSchemaType } from "@/lib/formSchema";

interface Props {
  index: number;
  remove: (index: number) => void;
}

export const RightRow = memo(({ index, remove }: Props) => {
  const { control } = useFormContext<invoiceSchemaType>();

  return (
    <TableRow className="h-12">
      <TableCell>
        <FormField
          control={control}
          name={`details.${index}.total_amount`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <NumericFormat
                  customInput={Input}
                  readOnly
                  thousandSeparator
                  value={field.value}
                  className="bg-muted"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={() => remove(index)}
        >
          <Trash className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
});

RightRow.displayName = "RightRow";
