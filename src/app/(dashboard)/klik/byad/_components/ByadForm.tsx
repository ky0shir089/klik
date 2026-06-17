"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  type Control,
  type UseFormGetValues,
  type UseFormSetValue,
  useForm,
  useFormState,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  memo,
  useState,
  useTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { byadSchema, byadSchemaType } from "@/lib/formSchema";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { NumericFormat } from "react-number-format";
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
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";

interface ByadFormProps {
  data?: byadShowType;
  branches: branchShowType[];
}

type ByadUnit = customerShowType["units"][number];
type ByadDetails = byadSchemaType["details"];

const EMPTY_DETAILS: ByadDetails = [];

const buildByadDetail = (unit: ByadUnit): ByadDetails[number] => ({
  unit_id: unit.id,
  byad_amount: unit.byad_amount,
});

const getSelectAllState = (
  selectedCount: number,
  totalCount: number,
): boolean | "indeterminate" => {
  if (totalCount === 0 || selectedCount === 0) {
    return false;
  }

  return selectedCount === totalCount ? true : "indeterminate";
};

const UnitRow = memo(
  ({
    item,
    index,
    isChecked,
    onCheckedChange,
  }: {
    item: ByadUnit;
    index: number;
    isChecked: boolean;
    onCheckedChange: (unit: ByadUnit, checked: boolean) => void;
  }) => {
    return (
      <TableRow>
        <TableCell>
          <Checkbox
            checked={isChecked}
            onCheckedChange={(checked) =>
              onCheckedChange(item, checked === true)
            }
          />
        </TableCell>
        <TableCell>{index + 1}</TableCell>
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
    control,
    getValues,
    setValue,
    units,
    isFetchingUnits,
  }: {
    control: Control<byadSchemaType>;
    getValues: UseFormGetValues<byadSchemaType>;
    setValue: UseFormSetValue<byadSchemaType>;
    units: ByadUnit[];
    isFetchingUnits: boolean;
  }) => {
    const details = useWatch({ control, name: "details" }) ?? EMPTY_DETAILS;
    const { errors } = useFormState({ control, name: "details" });

    const selectedUnitIds = useMemo(
      () => new Set(details.map((d) => d.unit_id)),
      [details],
    );

    const selectedVisibleCount = useMemo(
      () => units.filter((unit) => selectedUnitIds.has(unit.id)).length,
      [selectedUnitIds, units],
    );

    const allUnitDetails = useMemo(() => units.map(buildByadDetail), [units]);

    const handleRowCheck = useCallback(
      (unit: ByadUnit, checked: boolean) => {
        const currentDetails = getValues("details") || [];
        const hasDetail = currentDetails.some(
          (detail) => detail.unit_id === unit.id,
        );

        if (checked === hasDetail) {
          return;
        }

        const nextDetails = checked
          ? [...currentDetails, buildByadDetail(unit)]
          : currentDetails.filter((detail) => detail.unit_id !== unit.id);

        setValue("details", nextDetails, {
          shouldDirty: true,
          shouldValidate: true,
        });
      },
      [getValues, setValue],
    );

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        setValue("details", checked ? allUnitDetails : [], {
          shouldDirty: true,
          shouldValidate: true,
        });
      },
      [allUnitDetails, setValue],
    );

    const selectAllState = getSelectAllState(
      selectedVisibleCount,
      units.length,
    );
    const detailError = errors.details?.message?.toString();

    return (
      <div className="space-y-3">
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Checkbox
                    checked={selectAllState}
                    onCheckedChange={(checked) =>
                      handleSelectAll(checked === true)
                    }
                    disabled={isFetchingUnits || units.length === 0}
                  />
                </TableHead>
                <TableHead>No</TableHead>
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
                  <TableCell colSpan={9} className="h-24 text-center">
                    <Loader2 className="mx-auto animate-spin" />
                  </TableCell>
                </TableRow>
              ) : units.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Tidak ada data unit
                  </TableCell>
                </TableRow>
              ) : (
                units.map((item, index) => (
                  <UnitRow
                    key={item.id}
                    item={item}
                    index={index}
                    isChecked={selectedUnitIds.has(item.id)}
                    onCheckedChange={handleRowCheck}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {detailError && (
          <p className="text-[0.8rem] font-medium text-destructive">
            {detailError}
          </p>
        )}
      </div>
    );
  },
);

UnitTable.displayName = "UnitTable";

const FormSummary = memo(function FormSummary({
  control,
  units,
}: {
  control: Control<byadSchemaType>;
  units: ByadUnit[];
}) {
  const details = useWatch({ control, name: "details" }) ?? EMPTY_DETAILS;

  const unitPrices = useMemo(
    () => new Map(units.map((unit) => [unit.id, unit.price])),
    [units],
  );

  const totals = useMemo(() => {
    return details.reduce<{ amount: number; byad: number }>(
      (acc, item) => ({
        amount: acc.amount + (unitPrices.get(item.unit_id) ?? 0),
        byad: acc.byad + (item.byad_amount || 0),
      }),
      { amount: 0, byad: 0 },
    );
  }, [details, unitPrices]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Total Harga Terbentuk</Label>
        <NumericFormat
          value={totals.amount}
          customInput={Input}
          thousandSeparator="."
          decimalSeparator=","
          readOnly
          className="font-semibold bg-muted"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Total Amount BYAD</Label>
        <NumericFormat
          value={totals.byad}
          customInput={Input}
          thousandSeparator="."
          decimalSeparator=","
          readOnly
          className="font-semibold bg-muted"
        />
      </div>
    </>
  );
});
FormSummary.displayName = "FormSummary";

const ByadForm = ({ data, branches }: ByadFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();
  const latestUnitRequestId = useRef(0);

  const [internalUnits, setInternalUnits] = useState<customerShowType["units"]>(
    [],
  );
  const [openBranch, setOpenBranch] = useState(false);
  const [isFetchingUnits, setIsFetchingUnits] = useState(false);
  const [unitDateFrom, setUnitDateFrom] = useState("");
  const [unitDateTo, setUnitDateTo] = useState("");
  const isEdit = Boolean(data?.id);

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

  const { control, getValues, handleSubmit, reset, setValue } = form;
  const selectedBranch = useWatch({ control, name: "branch" }) ?? "";

  const clearUnitsAndDetails = useCallback(() => {
    latestUnitRequestId.current += 1;
    setInternalUnits([]);
    setIsFetchingUnits(false);
    setValue("details", [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue]);

  const fetchAndSetUnits = useCallback(
    async (
      branch: string,
      resetDetails: boolean,
      fromDate?: string,
      toDate?: string,
    ) => {
      const requestId = latestUnitRequestId.current + 1;
      latestUnitRequestId.current = requestId;

      if (!branch) {
        setInternalUnits([]);
        if (resetDetails) {
          setValue("details", [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
        return;
      }

      setIsFetchingUnits(true);
      try {
        const response = await selectByadUnit(branch, fromDate, toDate);
        if (requestId !== latestUnitRequestId.current) {
          return;
        }

        if (handleExpiredSession(response)) {
          return;
        }

        setInternalUnits(response?.data ?? []);
        if (resetDetails) {
          setValue("details", [], {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      } catch (error) {
        if (requestId !== latestUnitRequestId.current) {
          return;
        }

        console.error("Gagal mengambil data unit:", error);
        setInternalUnits([]);
        toast.error("Gagal mengambil data unit");
      } finally {
        if (requestId === latestUnitRequestId.current) {
          setIsFetchingUnits(false);
        }
      }
    },
    [handleExpiredSession, setValue],
  );

  const handleBranchSelect = useCallback(
    (branch: string, onChange: (value: string) => void) => {
      onChange(branch);
      setUnitDateFrom("");
      setUnitDateTo("");
      clearUnitsAndDetails();
      setOpenBranch(false);
    },
    [clearUnitsAndDetails],
  );

  const handleUnitDateFromChange = useCallback(
    (value: string) => {
      setUnitDateFrom(value);
      clearUnitsAndDetails();
      setUnitDateTo((currentToDate) => {
        if (!value) {
          return "";
        }

        if (!currentToDate || currentToDate >= value) {
          return currentToDate;
        }

        toast.error(
          "Tanggal 'Dari' tidak boleh lebih besar dari Tanggal 'Sampai'.",
        );
        return "";
      });
    },
    [clearUnitsAndDetails],
  );

  const handleUnitDateToChange = useCallback(
    (value: string) => {
      if (unitDateFrom && value && value < unitDateFrom) {
        toast.error("Tanggal 'Sampai' tidak boleh kurang dari Tanggal 'Dari'.");
        setUnitDateTo("");
        clearUnitsAndDetails();
        return;
      }

      setUnitDateTo(value);
      clearUnitsAndDetails();
    },
    [clearUnitsAndDetails, unitDateFrom],
  );

  function onSubmit(values: byadSchemaType) {
    startTransition(async () => {
      const result = data?.id
        ? await byadUpdate(data.id, values)
        : await byadStore(values);
      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        reset();
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

  useEffect(() => {
    if (!selectedBranch || !unitDateFrom || !unitDateTo) {
      return;
    }

    fetchAndSetUnits(selectedBranch, true, unitDateFrom, unitDateTo);
  }, [fetchAndSetUnits, selectedBranch, unitDateFrom, unitDateTo]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">
          {isEdit ? "Edit BYAD" : "Pembuatan BYAD"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid items-start grid-cols-1 gap-4 space-y-2 sm:grid-cols-2">
              <FormField
                control={control}
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
                control={control}
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
                            disabled={isFetchingUnits || isEdit}
                          >
                            {field.value || "Select Cabang"}
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
                                  key={item.pejabat_lelang}
                                  value={item.pejabat_lelang}
                                  onSelect={() => {
                                    handleBranchSelect(
                                      item.pejabat_lelang,
                                      field.onChange,
                                    );
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      item.pejabat_lelang === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {item.pejabat_lelang}
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

              <div className="flex flex-col gap-2">
                <Label htmlFor="byad-unit-date-from">Dari Tanggal Lelang</Label>
                <Input
                  id="byad-unit-date-from"
                  type="date"
                  value={unitDateFrom}
                  disabled={!selectedBranch}
                  onChange={(event) =>
                    handleUnitDateFromChange(event.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="byad-unit-date-to">Sampai Tanggal Lelang</Label>
                <Input
                  id="byad-unit-date-to"
                  type="date"
                  value={unitDateTo}
                  min={unitDateFrom}
                  disabled={!selectedBranch || !unitDateFrom}
                  onChange={(event) =>
                    handleUnitDateToChange(event.target.value)
                  }
                />
              </div>

              <FormField
                control={control}
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
                control={control}
                name="attachment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attachment</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        placeholder="Browse File"
                        accept=".pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Max file size 1MB. PDF format only.
                    </FormDescription>
                    {data?.attachment ? (
                      <div className="flex items-center gap-1 mt-2 text-sm">
                        <Paperclip className="size-4" />
                        <Link
                          href={`${env.NEXT_PUBLIC_BASE_URL}/storage/${data.attachment.path || ""}`}
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

              <FormSummary control={control} units={internalUnits} />
            </div>
            <UnitTable
              control={control}
              getValues={getValues}
              setValue={setValue}
              units={internalUnits}
              isFetchingUnits={isFetchingUnits}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isPending}
            >
              <LoadingSwap isLoading={isPending}>
                {isEdit ? "Update" : "Create"}
              </LoadingSwap>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ByadForm;
