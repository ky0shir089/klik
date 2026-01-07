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
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { invoiceSchemaType } from "@/lib/formSchema";
import { pphShowType } from "@/data/pph";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface iAppProps {
  form: UseFormReturn<invoiceSchemaType>;
  coas: coaShowType[];
  pphs: pphShowType[];
}

const InvoiceDetail = ({ form, coas, pphs }: iAppProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const details = form.watch("details");
  console.log(details);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
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
        </TableRow>
      </TableHeader>

      <TableBody>
        {fields.map((field, index) => {
          // const pphId = details?.[index]?.pph_id;
          // const pph = pphs.find((item) => item.id === pphId);
          // console.log(fields);

          return (
            <TableRow key={field.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <FormField
                  control={form.control}
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
                            <SelectItem
                              key={item.id}
                              value={String(item.coa.id)}
                            >
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
                  control={form.control}
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
                  control={form.control}
                  name={`details.${index}.item_amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericFormat
                          value={field.value}
                          customInput={Input}
                          thousandSeparator
                          onValueChange={(values) => {
                            field.onChange(values.floatValue);
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
                  control={form.control}
                  name={`details.${index}.pph_id`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        required
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select PPH" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TableCell>
              <TableCell>
                <NumericFormat
                  // value={field.value}
                  customInput={Input}
                  thousandSeparator
                  readOnly
                />
              </TableCell>
              <TableCell>
                <FormField
                  control={form.control}
                  name={`details.${index}.pph_amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericFormat
                          value={field.value}
                          customInput={Input}
                          thousandSeparator
                          onValueChange={(values) => {
                            field.onChange(values.floatValue);
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
                  control={form.control}
                  name={`details.${index}.ppn_amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericFormat
                          value={field.value}
                          customInput={Input}
                          thousandSeparator
                          onValueChange={(values) => {
                            field.onChange(values.floatValue);
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
                  control={form.control}
                  name={`details.${index}.ppn_rate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <NumericFormat
                          value={field.value}
                          customInput={Input}
                          thousandSeparator
                          onValueChange={(values) => {
                            field.onChange(values.floatValue);
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
                  control={form.control}
                  name={`details.${index}.ppn_amount`}
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        required
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select PPH" />
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
        })}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={11}>
            <Button
              type="button"
              className="w-full"
              onClick={() =>
                append({
                  inv_coa_id: 0,
                  description: "",
                  item_amount: 0,
                  pph_id: 0,
                  pph_amount: 0,
                  ppn_rate: 0,
                  ppn_amount: 0,
                  rv_id: 0,
                  total_amount: 0,
                })
              }
            >
              <Plus className="mr-2 size-4" /> Add Item
            </Button>
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default InvoiceDetail;
