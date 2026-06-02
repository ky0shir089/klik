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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useTransition,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import {
  invoiceExternalSchema,
  invoiceExternalSchemaType,
} from "@/lib/formSchema";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { useAuthenticatedFileDownload } from "@/hooks/use-authenticated-file-download";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Check, ChevronsUpDown, Paperclip, Loader2 } from "lucide-react";
import { invoiceShowType } from "@/data/invoice";
import Link from "next/link";
import { env } from "@/lib/env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierShowType } from "@/data/supplier";
import { SupplierSelector } from "./SupplierSelector";
import { downloadListUnit, invoiceExternalStore } from "../action";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { customerShowType } from "@/data/customer";
import { NumericFormat } from "react-number-format";
import { useDebounce } from "@/hooks/use-debounce";
import { selectPaidOffUnit } from "@/data/select";

type Unit = customerShowType["units"][number];

interface iAppProps {
  data?: invoiceShowType;
  units: Unit[];
  countUnit: number;
  feeAmount: number;
}

const InvoiceExternalForm = ({
  data,
  countUnit,
  feeAmount,
  units: initialUnits,
}: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();
  const downloadFile = useAuthenticatedFileDownload();

  const fromDate = searchParams.get("from_date");
  const toDate = searchParams.get("to_date");

  const defaultValues = useMemo(
    () => ({
      date: new Date().toISOString().slice(0, 10),
      due_date: 15,
      supplier_id: 1,
      description: "",
      signatory: "Jason Arisonka",
      attachment: null,
      status: "REQUEST",
      total_amount: 0,
      total_amount_manual: 0,
      from_date: fromDate ? new Date(fromDate).toISOString().slice(0, 10) : "",
      to_date: toDate ? new Date(toDate).toISOString().slice(0, 10) : "",
      units: [],
    }),
    [fromDate, toDate],
  );

  const form = useForm<invoiceExternalSchemaType>({
    resolver: zodResolver(invoiceExternalSchema),
    defaultValues,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [fetchedUnits, setFetchedUnits] = useState<Unit[]>(initialUnits || []);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function fetchUnits() {
      if (!fromDate || !toDate) {
        setFetchedUnits(initialUnits || []);
        return;
      }

      setIsLoadingUnits(true);
      try {
        const response = await selectPaidOffUnit(
          1,
          10,
          debouncedSearchQuery,
          fromDate,
          toDate,
        );
        if (handleExpiredSession(response)) {
          return;
        }

        const { data: result } = response;
        if (result?.data && !ignore) {
          setFetchedUnits(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch units:", error);
      } finally {
        setIsLoadingUnits(false);
      }
    }

    fetchUnits();
    return () => {
      ignore = true;
    };
  }, [
    debouncedSearchQuery,
    fromDate,
    toDate,
    initialUnits,
    handleExpiredSession,
  ]);

  const selectedUnitIds = form.watch("units");

  const selectedUnitsData = useMemo(() => {
    if (!selectedUnitIds?.length) return [];

    // Combine initial and fetched units to ensure we have data for all selections
    const allAvailable = [...initialUnits, ...fetchedUnits];
    const unitMap = new Map(allAvailable.map((u) => [u.id, u]));

    return selectedUnitIds
      .map((id) => unitMap.get(id))
      .filter((u): u is Unit => !!u);
  }, [selectedUnitIds, initialUnits, fetchedUnits]);

  const totals = useMemo(() => {
    const selectedFeeSum = selectedUnitsData.reduce(
      (sum, unit) => sum + Number(unit.fee_amount),
      0,
    );

    return {
      count: Math.max(0, countUnit - selectedUnitsData.length),
      fee: Math.max(0, feeAmount - selectedFeeSum),
    };
  }, [selectedUnitsData, countUnit, feeAmount]);

  const updateSearchParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const handleSupplierSelect = useCallback(
    (item: supplierShowType) => {
      form.setValue("supplier_id", item.id);
    },
    [form],
  );

  async function downloadUnit() {
    startTransition(async () => {
      const file = await downloadListUnit(fromDate!, toDate!);
      downloadFile(file, `List_Unit_${fromDate}-${toDate}.xlsx`);
    });
  }

  function onSubmit(values: invoiceExternalSchemaType) {
    startTransition(async () => {
      const result = await invoiceExternalStore(values);

      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/finance/invoice-external");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {data?.id
            ? `Edit Invoice External - ${data.invoice_external_no}`
            : "Create Invoice External"}
        </CardTitle>
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
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jatuh Tempo (dalam hari)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Jatuh Tempo (dalam hari)"
                        required
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <SupplierSelector
                      value={field.value}
                      onSelect={handleSupplierSelect}
                    />
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

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
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
                name="signatory"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Penandatangan</FormLabel>
                    <FormControl>
                      <Input placeholder="Penandatangan" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid items-start grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20 sm:grid-cols-2">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="from_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dari Tanggal Lelang</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value);
                            if (value) {
                              const currentToDate = searchParams.get("to_date");
                              if (currentToDate && currentToDate < value) {
                                updateSearchParam("to_date", null);
                                toast.error(
                                  "Tanggal 'Dari' tidak boleh lebih besar dari Tanggal 'Sampai'.",
                                );
                              }
                            }
                            updateSearchParam("from_date", value || null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="to_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sampai Tanggal Lelang</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          value={field.value}
                          min={form.getValues("from_date")}
                          disabled={!form.getValues("from_date")}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val);
                            const fromDate = form.getValues("from_date");
                            if (fromDate && val && val < fromDate) {
                              toast.error(
                                "Tanggal 'Sampai' tidak boleh kurang dari Tanggal 'Dari'.",
                              );
                              return;
                            }
                            updateSearchParam("to_date", val || null);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pilih unit yang akan dikecualikan dari pencairan
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between h-auto min-h-10 py-2 px-3",
                                !field.value?.length && "text-muted-foreground",
                              )}
                            >
                              <span className="flex-1 text-left whitespace-normal">
                                {field.value && field.value.length > 0
                                  ? selectedUnitsData
                                      .map((u) => u.police_number)
                                      .join(", ")
                                  : "Select Unit..."}
                              </span>
                              <ChevronsUpDown className="ml-2 opacity-50 size-4 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command shouldFilter={false}>
                            {/* Disable internal filtering */}
                            <CommandInput
                              placeholder="Search Nopol/Nosin/Noka..."
                              value={searchQuery}
                              onValueChange={setSearchQuery}
                            />
                            <CommandList>
                              {isLoadingUnits ? (
                                <div className="flex items-center justify-center py-6">
                                  <Loader2 className="size-4 animate-spin text-muted-foreground" />
                                </div>
                              ) : fetchedUnits.length === 0 ? (
                                <CommandEmpty>
                                  {!fromDate || !toDate
                                    ? "Pilih tanggal lelang terlebih dahulu."
                                    : "No unit found."}
                                </CommandEmpty>
                              ) : (
                                <CommandGroup>
                                  {fetchedUnits.map((unit) => (
                                    <CommandItem
                                      key={unit.id}
                                      value={unit.police_number}
                                      onSelect={() => {
                                        const currentSelectedIds =
                                          field.value || [];
                                        const updatedSelectedIds =
                                          currentSelectedIds.includes(unit.id)
                                            ? currentSelectedIds.filter(
                                                (id: number) => id !== unit.id,
                                              )
                                            : [...currentSelectedIds, unit.id];
                                        field.onChange(updatedSelectedIds);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 size-4",
                                          field.value?.includes(unit.id)
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {unit.police_number} -{" "}
                                      {unit.engine_number} -{" "}
                                      {unit.chassis_number}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fetchedUnits.length > 0 ? (
                  <Button
                    variant="outline"
                    className="text-teal-500"
                    disabled={isPending}
                    onClick={downloadUnit}
                  >
                    Download list unit
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="grid items-center grid-cols-3 gap-4">
              <div className="space-y-2">
                <FormLabel>Total Unit</FormLabel>
                <Input type="number" value={totals.count} readOnly />
              </div>

              <div className="space-y-2">
                <FormLabel>Total Amount Real</FormLabel>
                <NumericFormat
                  required
                  value={totals.fee}
                  customInput={Input}
                  thousandSeparator
                  decimalScale={0}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <FormField
                control={form.control}
                name="total_amount_manual"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Tagihan</FormLabel>
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
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              <LoadingSwap isLoading={isPending}>Create</LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InvoiceExternalForm;
