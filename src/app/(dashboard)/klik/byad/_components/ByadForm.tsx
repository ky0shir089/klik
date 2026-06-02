"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useForm, useWatch, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useState, useTransition, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { byadSchema, byadSchemaType } from "@/lib/formSchema";
import { LoadingSwap } from "@/components/ui/loading-swap";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { byadStore, byadUpdate } from "../action";
import { customerShowType } from "@/data/customer";
import { branchShowType, selectByadUnit } from "@/data/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { byadShowType } from "@/data/byad";
import { Paperclip, Loader2, Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { env } from "@/lib/env";
import { Label } from "@/components/ui/label";

interface iAppProps {
  data?: byadShowType;
  branches: branchShowType[];
}

const UnitRow = memo(
  ({
    item,
    isChecked,
    onCheckChange,
  }: {
    item: customerShowType["units"][number];
    isChecked: boolean;
    onCheckChange: (checked: boolean) => void;
  }) => {
    return (
      <TableRow>
        <TableCell>
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) => onCheckChange(checked === true)}
          />
        </TableCell>
        <TableCell>{item?.auction.auction_date}</TableCell>
        <TableCell>{item.auction.customer.name}</TableCell>
        <TableCell>{item.police_number}</TableCell>
        <TableCell>{item.chassis_number}</TableCell>
        <TableCell>{item.engine_number}</TableCell>
        <TableCell className="text-right">
          {item.price.toLocaleString("id-ID")}
        </TableCell>
        <TableCell className="text-right">
          {item.byad_amount.toLocaleString("id-ID")}
        </TableCell>
      </TableRow>
    );
  },
);
UnitRow.displayName = "UnitRow";

const UnitTable = memo(
  ({
    form,
    internalUnits,
    isFetchingUnits,
  }: {
    form: UseFormReturn<byadSchemaType>;
    internalUnits: customerShowType["units"];
    isFetchingUnits: boolean;
  }) => {
    const details: byadSchemaType["details"] =
      useWatch({ control: form.control, name: "details" }) || [];

    const handleRowCheck = useCallback(
      (checked: boolean, item: customerShowType["units"][number]) => {
        const currentDetails: byadSchemaType["details"] =
          form.getValues("details") || [];
        const newDetails = checked
          ? [
              ...currentDetails,
              {
                unit_id: item.id,
                byad_amount: item.byad_amount,
              },
            ]
          : currentDetails.filter((d) => d.unit_id !== item.id);

        form.setValue("details", newDetails, { shouldValidate: true });
      },
      [form],
    );

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        const newDetails = checked
          ? internalUnits.map((item: { id: number; byad_amount: number }) => ({
              unit_id: item.id,
              byad_amount: item.byad_amount,
            }))
          : [];
        form.setValue("details", newDetails, { shouldValidate: true });
      },
      [form, internalUnits],
    );

    const isAllSelected =
      internalUnits.length > 0 && details.length === internalUnits.length;
    const errors = form.formState.errors;

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked === true)
                    }
                    disabled={isFetchingUnits || internalUnits.length === 0}
                  />
                </TableHead>
                <TableHead>Tgl Lelang</TableHead>
                <TableHead>Nama Bidder</TableHead>
                <TableHead>Nopol</TableHead>
                <TableHead>Noka</TableHead>
                <TableHead>Nosin</TableHead>
                <TableHead className="text-right">Harga Lelang</TableHead>
                <TableHead className="text-right">Nilai BYAD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isFetchingUnits ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    <Loader2 className="mx-auto animate-spin" />
                  </TableCell>
                </TableRow>
              ) : internalUnits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="h-24 text-center">
                    Tidak ada data unit
                  </TableCell>
                </TableRow>
              ) : (
                internalUnits.map((item: customerShowType["units"][number]) => (
                  <UnitRow
                    key={item.id}
                    item={item}
                    isChecked={details.some((d) => d.unit_id === item.id)}
                    onCheckChange={(checked) => handleRowCheck(checked, item)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {errors.details && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {errors.details.message?.toString()}
          </p>
        )}
      </div>
    );
  },
);

UnitTable.displayName = "UnitTable";

const ByadForm = ({ data, branches }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [internalUnits, setInternalUnits] = useState<customerShowType["units"]>(
    [],
  );
  const [openBranch, setOpenBranch] = useState(false);
  const [isFetchingUnits, setIsFetchingUnits] = useState(false);

  const form = useForm<byadSchemaType>({
    resolver: zodResolver(byadSchema),
    defaultValues: {
      date: data?.date || new Date().toISOString().slice(0, 10),
      branch: data?.branch || "",
      description: data?.description || "",
      attachment: data?.attachment || null,
      status: data?.status || "NEW",
      details: data?.details ?? [],
    },
  });

  const details = form.watch("details");
  const byadAmount = details.reduce(
    (total, item) => total + item.byad_amount,
    0,
  );

  const fetchAndSetUnits = useCallback(
    async (branch: string, resetDetails: boolean) => {
      if (!branch) {
        setInternalUnits([]);
        if (resetDetails) {
          form.setValue("details", []);
        }
        return;
      }
      setIsFetchingUnits(true);
      try {
        const response = await selectByadUnit(branch);
        if (response?.data) {
          setInternalUnits(response.data);
          if (resetDetails) {
            form.setValue("details", []);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data unit:", error);
        toast.error("Gagal mengambil data unit");
      } finally {
        setIsFetchingUnits(false);
      }
    },
    [form],
  );

  function onSubmit(values: byadSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await byadUpdate(data.id, values)
        : await byadStore(values);

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/klik/byad");
      } else {
        toast.error(result.message);
      }
    });
  }

  useEffect(() => {
    const branch = data?.branch;
    if (branch) {
      fetchAndSetUnits(branch, false);
    }
  }, [data?.branch, fetchAndSetUnits]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Pembuatan BYAD</CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid items-start grid-cols-1 gap-4 space-y-2 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal</FormLabel>
                    <FormControl>
                      <Input type="date" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Cabang</FormLabel>
                    <Popover open={openBranch} onOpenChange={setOpenBranch}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-full justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                            disabled={isFetchingUnits || !!data?.id}
                          >
                            {field.value
                              ? branches.find(
                                  (b) => b.branch_name === field.value,
                                )?.branch_name
                              : "Select Cabang"}
                            <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                        <Command>
                          <CommandInput placeholder="Cari cabang..." />
                          <CommandList>
                            <CommandEmpty>Cabang tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {branches.map((item) => (
                                <CommandItem
                                  key={item.branch_id}
                                  value={item.branch_name}
                                  onSelect={() => {
                                    field.onChange(item.branch_name);
                                    fetchAndSetUnits(item.branch_name, true);
                                    setOpenBranch(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.branch_name === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {item.branch_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keterangan</FormLabel>
                    <FormControl>
                      <Input placeholder="Keterangan" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment (Max Size: 1MB)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Browse File"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    {data?.attachment ? (
                      <div className="flex items-center gap-1">
                        <Paperclip className="size-4" />
                        <Link
                          href={`${env.NEXT_PUBLIC_BASE_URL}/storage/${data.attachment.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600"
                        >
                          {data.attachment.filename}
                        </Link>
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <Label>Total Amount</Label>
                <Input
                  type="text"
                  placeholder="Total Amount"
                  required
                  value={Number(byadAmount).toLocaleString("id-ID")}
                  readOnly
                />
              </div>
            </div>

            <UnitTable
              form={form}
              internalUnits={internalUnits}
              isFetchingUnits={isFetchingUnits}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              <LoadingSwap isLoading={isPending}>
                {data?.id ? "Update" : "Create"}
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ByadForm;
