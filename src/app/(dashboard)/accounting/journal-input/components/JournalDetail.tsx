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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { coaShowType } from "@/data/coa";
import { useFieldArray, useFormContext } from "react-hook-form";
import { journalInputSchemaType } from "@/lib/formSchema";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { memo, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface iAppProps {
  data?: journalInputSchemaType;
  coas: coaShowType[];
  totalDebit: number;
  totalCredit: number;
}

const CoaCombobox = ({
  value,
  onChange,
  coas,
  disabled,
}: {
  value: number;
  onChange: (value: number) => void;
  coas: coaShowType[];
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const selectedCoa = useMemo(
    () => coas.find((c) => c.id === value),
    [coas, value],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
          disabled={disabled}
        >
          {selectedCoa
            ? `${selectedCoa.code} - ${selectedCoa.description}`
            : "Select CoA"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            placeholder="Search CoA..."
            className="h-9"
            required
          />
          <CommandList>
            <CommandEmpty>No CoA found.</CommandEmpty>
            <CommandGroup>
              {coas.map((coa) => (
                <CommandItem
                  key={coa.id}
                  value={`${coa.id}|${coa.code}|${coa.description}`}
                  onSelect={(currentValue) => {
                    const id = currentValue.split("|")[0];
                    onChange(Number(id));
                    setOpen(false);
                  }}
                >
                  {coa.code} - {coa.description}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === coa.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CurrencyInput = ({
  value,
  onChange,
  readOnly,
}: {
  value: number;
  onChange: (val: number) => void;
  readOnly?: boolean;
}) => (
  <NumericFormat
    required
    value={value}
    customInput={Input}
    thousandSeparator
    onValueChange={(values) => {
      const val = values.floatValue ?? 0;
      onChange(val);
    }}
    readOnly={readOnly}
  />
);

const JournalDetailRow = memo(
  ({
    index,
    remove,
    data,
    coas,
  }: {
    index: number;
    remove: (index: number) => void;
    data?: journalInputSchemaType;
    coas: coaShowType[];
  }) => {
    const { control } = useFormContext<journalInputSchemaType>();
    const isReadOnly = !!data?.gl_no;

    return (
      <TableRow>
        <TableCell>{index + 1}</TableCell>
        <TableCell className="w-96">
          <FormField
            control={control}
            name={`details.${index}.coa_id`}
            render={({ field }) => (
              <FormItem>
                <CoaCombobox
                  value={field.value}
                  onChange={field.onChange}
                  coas={coas}
                  disabled={isReadOnly}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell>
          <FormField
            control={control}
            name={`details.${index}.debit`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    readOnly={isReadOnly}
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
            name={`details.${index}.credit`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    readOnly={isReadOnly}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        {!isReadOnly && (
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
        )}
      </TableRow>
    );
  },
);

JournalDetailRow.displayName = "JournalDetailRow";

export const defaultDetailItem: journalInputSchemaType["details"][number] = {
  coa_id: 0,
  debit: 0,
  credit: 0,
};

const JournalDetail = ({ data, coas, totalDebit, totalCredit }: iAppProps) => {
  const { control } = useFormContext<journalInputSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Code Trx</TableHead>
          <TableHead>Debit</TableHead>
          <TableHead>Credit</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {fields.map((field, index) => (
          <JournalDetailRow
            key={field.id}
            index={index}
            remove={remove}
            data={data}
            coas={coas}
          />
        ))}

        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {totalDebit.toLocaleString("id-ID")}
          </TableCell>
          <TableCell className="text-right">
            {totalCredit.toLocaleString("id-ID")}
          </TableCell>
        </TableRow>
      </TableBody>

      {!data?.gl_no && (
        <TableFooter>
          <TableRow>
            <TableCell colSpan={12}>
              <Button
                type="button"
                className="w-full text-white bg-indigo-500 hover:bg-indigo-600"
                onClick={() => append({ ...defaultDetailItem })}
              >
                <Plus className="mr-2 size-4" /> Add Item
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default JournalDetail;
