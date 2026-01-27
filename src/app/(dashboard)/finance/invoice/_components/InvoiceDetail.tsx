import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { coaShowType } from "@/data/coa";
import { useFieldArray, useFormContext } from "react-hook-form";
import { invoiceSchemaType } from "@/lib/formSchema";
import { pphShowType } from "@/data/pph";
import { Button } from "@/components/ui/button";
import { Plus, Trash, X } from "lucide-react";
import { memo, useCallback } from "react";
import { rvShowType } from "@/data/rv";
import { RvSelector } from "./RvSelector";

interface iAppProps {
  coas: coaShowType[];
  pphs: pphShowType[];
  rvs: rvShowType[];
}

const InvoiceDetailRow = memo(
  ({
    index,
    remove,
    coas,
    pphs,
    rvs,
  }: {
    index: number;
    remove: (index: number) => void;
    coas: coaShowType[];
    pphs: pphShowType[];
    rvs: rvShowType[];
  }) => {
    const { control, setValue, getValues } =
      useFormContext<invoiceSchemaType>();

    const calculateValues = useCallback(
      (type: "item_amount" | "pph_id" | "ppn_rate", value: number) => {
        const currentItemAmount =
          type === "item_amount"
            ? value
            : (getValues(`details.${index}.item_amount`) ?? 0);

        const currentPphId =
          type === "pph_id" ? value : getValues(`details.${index}.pph_id`);

        const currentPpnRate =
          type === "ppn_rate"
            ? value
            : (getValues(`details.${index}.ppn_rate`) ?? 0);

        const pph = pphs.find((p) => p.id === Number(currentPphId));
        const pphRate = pph?.rate ?? 0;

        const pphAmount = (currentItemAmount * pphRate) / 100;
        const ppnAmount = (currentItemAmount * currentPpnRate) / 100;
        const totalAmount = currentItemAmount + ppnAmount - pphAmount;

        if (type === "pph_id") {
          setValue(`details.${index}.pph_rate`, pphRate);
        }
        setValue(`details.${index}.pph_amount`, pphAmount);
        setValue(`details.${index}.ppn_amount`, ppnAmount);
        setValue(`details.${index}.total_amount`, totalAmount);
      },
      [getValues, index, pphs, setValue],
    );

    return (
      <TableRow>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.inv_coa_id`}
            render={({ field }) => (
              <FormItem>
                <Select
                  required
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Code Trx" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {coas.map((item) => (
                      <SelectItem key={item.id} value={String(item.coa.id)}>
                        {item.coa.code} - {item.coa.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Keterangan" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.item_amount`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    required
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    onValueChange={(values) => {
                      const val = values.floatValue ?? 0;
                      field.onChange(val);
                      calculateValues("item_amount", val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.pph_id`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-1">
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => {
                    const valNum = Number(val);
                    field.onChange(valNum);
                    calculateValues("pph_id", valNum);
                  }}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select PPh" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pphs.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.value && (
                  <Button
                    size="icon-xs"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(undefined);
                      calculateValues("pph_id", 0);
                    }}
                    className="mr-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={4} />
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.pph_rate`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    decimalScale={0}
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.pph_amount`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.ppn_rate`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    onValueChange={(values) => {
                      const val = values.floatValue ?? 0;
                      field.onChange(val);
                      calculateValues("ppn_rate", val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.ppn_amount`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    required
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="w-[150px]">
          <FormField
            control={control}
            name={`details.${index}.rv_id`}
            render={({ field }) => (
              <FormItem className="flex items-center gap-1">
                <RvSelector
                  rv={rvs}
                  value={field.value}
                  onSelect={(item) => field.onChange(item.id)}
                />
                {field.value && (
                  <Button
                    size="icon-xs"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      field.onChange(undefined);
                      calculateValues("pph_id", 0);
                    }}
                    className="mr-2 text-muted-foreground hover:text-foreground"
                  >
                    <X size={4} />
                  </Button>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.total_amount`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <NumericFormat
                    required
                    value={field.value}
                    customInput={Input}
                    thousandSeparator
                    readOnly
                    className="bg-muted"
                  />
                </FormControl>
                <FormMessage />
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
  },
);

InvoiceDetailRow.displayName = "InvoiceDetailRow";

export const defaultDetailItem: invoiceSchemaType["details"][number] = {
  inv_coa_id: 0,
  description: "",
  item_amount: null,
  pph_id: null,
  pph_rate: 0,
  pph_amount: 0,
  ppn_rate: 0,
  ppn_amount: 0,
  rv_id: null,
  total_amount: 0,
};

const InvoiceDetail = ({ coas, pphs, rvs }: iAppProps) => {
  const { control } = useFormContext<invoiceSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1080px]">
        <TableHeader>
          <TableRow>
            <TableHead>Code Trx</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Amount Item</TableHead>
            <TableHead>PPH</TableHead>
            <TableHead>% Rate</TableHead>
            <TableHead>Amount PPH</TableHead>
            <TableHead>% PPN</TableHead>
            <TableHead>Amount PPN</TableHead>
            <TableHead>No Reff</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {fields.map((field, index) => (
            <InvoiceDetailRow
              key={field.id}
              index={index}
              remove={remove}
              coas={coas}
              pphs={pphs}
              rvs={rvs}
            />
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={12}>
              <Button
                type="button"
                className="w-full text-white bg-indigo-500 hover:bg-indigo-600"
                onClick={() => append(defaultDetailItem)}
              >
                <Plus className="mr-2 size-4" /> Add Item
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default InvoiceDetail;
