"use client";

import {
  sanitizeReturnPath,
  SESSION_EXPIRED_REASON,
} from "@/lib/auth-redirect";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signInSchema, signInSchemaType } from "@/lib/formSchema";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { signIn } from "../action";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasShownExpiredToastRef = useRef(false);

  const [isLoading, startTransition] = useTransition();

  const form = useForm<signInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      user_id: "",
      password: "",
    },
  });

  const nextPath = sanitizeReturnPath(searchParams.get("next"));
  const reason = searchParams.get("reason");

  useEffect(() => {
    if (
      reason === SESSION_EXPIRED_REASON &&
      !hasShownExpiredToastRef.current
    ) {
      hasShownExpiredToastRef.current = true;
      toast.error("Session expired, please log in again.");
    }
  }, [reason]);

  function onSubmit(values: signInSchemaType) {
    startTransition(async () => {
      const result = await signIn(values);

      if (result.success) {
        toast.success(result.message);
        if (result.data.change_password) {
          router.replace(`/change-password`);
        } else {
          router.replace(nextPath);
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                <LoadingSwap isLoading={isLoading}>Submit</LoadingSwap>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
