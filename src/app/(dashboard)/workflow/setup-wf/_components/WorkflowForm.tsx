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
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { workflowSchema, workflowSchemaType } from "@/lib/formSchema";
import { useExpiredSessionRedirect } from "@/hooks/use-expired-session-redirect";
import { moduleShowType } from "@/data/module";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Switch } from "@/components/ui/switch";
import { workflowStore, workflowUpdate } from "../action";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { userShowType } from "@/data/user";
import { NumericFormat } from "react-number-format";
import { typeTrxShowType } from "@/data/type-trx";

interface iAppProps {
  data?: moduleShowType;
  users: userShowType[];
  typeTrxes: typeTrxShowType[];
}

const WorkflowForm = ({ data, users, typeTrxes }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleExpiredSession = useExpiredSessionRedirect();

  const form = useForm<workflowSchemaType>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: data?.name || "",
      min_amount: data?.min_amount || 0,
      max_amount: data?.max_amount || null,
      is_active: data?.is_active || true,
      details: data?.details || [],
      type_trx: data?.type_trx || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  function onSubmit(values: workflowSchemaType) {
    const normalizedValues = {
      ...values,
      details: values.details.map((detail, index) => ({
        ...detail,
        sequence: index + 1,
      })),
    };

    startTransition(async () => {
      const result = data?.id
        ? await workflowUpdate(data?.id, normalizedValues)
        : await workflowStore(normalizedValues);

      if (handleExpiredSession(result)) {
        return;
      }

      if (result.success) {
        form.reset();
        toast.success(result.message);
        router.push("/workflow/setup-wf");
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Switch
                      className="h-6 w-11 [&>span]:h-5 [&>span]:w-5 [&>span[data-state=checked]]:translate-x-5"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />

                    <span>{field.value ? "ACTIVE" : "INACTIVE"}</span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_trx"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type Transactions</FormLabel>
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
                          {field.value?.length > 0
                            ? typeTrxes
                                .filter((t) => field.value.includes(t.id))
                                .map((t) => t.name)
                                .join(", ")
                            : "Select types..."}
                        </span>
                        <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search type..." />
                      <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          {typeTrxes.map((type) => (
                            <CommandItem
                              key={type.id}
                              value={type.name}
                              onSelect={() => {
                                const current = field.value || [];
                                const updated = current.includes(type.id)
                                  ? current.filter(
                                      (id: number) => id !== type.id,
                                    )
                                  : [...current, type.id];
                                field.onChange(updated);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.includes(type.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {type.name}
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
            name="min_amount"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Min Amount</FormLabel>
                <FormControl>
                  <NumericFormat
                    required
                    value={Number(field.value)}
                    customInput={Input}
                    thousandSeparator
                    onValueChange={(values) => {
                      const val = values.floatValue ?? 0;
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_amount"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Max Amount</FormLabel>
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

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <FormLabel className="text-base font-semibold">
              Workflow Steps (Assigned Users)
            </FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({ sequence: fields.length + 1, user_id: 0 })
              }
            >
              <Plus className="mr-2 size-4" />
              Add User
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name={`details.${index}.user_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Step {index + 1}</FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(parseInt(val))}
                        value={field.value ? String(field.value) : ""}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => remove(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          {form.formState.errors.details?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.details.root.message}
            </p>
          )}
        </div>

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
  );
};

export default WorkflowForm;
