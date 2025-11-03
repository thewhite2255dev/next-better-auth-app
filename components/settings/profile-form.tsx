"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { ProfileFormSchema } from "@/schemas/settings";
import type { ProfileFormValues } from "@/types/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import FormError from "../shared/form-error";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import { maskEmail } from "@/lib/utils";

export function ProfileForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();

  const {
    data: session,
    isPending: loading,
    refetch,
  } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema(t)),
    defaultValues: {
      name: "",
      bio: "",
      location: "",
    },
  });

  useEffect(() => {
    if (session?.user) {
      form.reset({
        name: session.user.name || "",
        bio: session.user.bio || "",
        location: session.user.location || "",
      });
    }
  }, [session, form]);

  function handleSubmit(values: ProfileFormValues) {
    setError("");

    startTransition(async () => {
      await authClient.updateUser(
        {
          ...values,
        },
        {
          onError: async (ctx) => {
            toast.error(
              authError[ctx.error.code as string] || t("Form.errors.generic"),
            );
          },
          onSuccess: () => {
            toast.success(t("Form.profileForm.success"));
            refetch();
            router.refresh();
          },
        },
      );
    });
  }

  if (loading) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.name")}</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem className="w-full">
          <FormLabel>{t("Form.fields.email")}</FormLabel>
          <FormControl>
            <Input
              disabled
              defaultValue={maskEmail(session?.user.email ?? "")}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.bio")}</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  maxLength={200}
                  disabled={isPending}
                  {...field}
                />
              </FormControl>
              <FormDescription className="flex items-center justify-end">
                {field.value?.length} / 200
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("Form.fields.location")}</FormLabel>
              <FormControl>
                <Input disabled={isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : t("Form.profileForm.updateButton")}
        </Button>
      </form>
    </Form>
  );
}
