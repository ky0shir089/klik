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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { workflowSchema, workflowSchemaType } from "@/lib/formSchema";
import { moduleShowType } from "@/data/module";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { Switch } from "@/components/ui/switch";
import { workflowStore, workflowUpdate } from "../action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { userShowType } from "@/data/user";

interface iAppProps {
  data?: moduleShowType;
  users: userShowType[];
}

const WorkflowForm = ({ data, users }: iAppProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<workflowSchemaType>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      name: data?.name || "",
      is_active: data?.is_active || true,
      details: data?.details || [],
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

    console.log(normalizedValues);
    startTransition(async () => {
      const result = data?.id
        ? await workflowUpdate(data?.id, values)
        : await workflowStore(values);

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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
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
