"use client";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormError from "../layout/form-error";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { PasswordInput } from "../layout/password-input";
import { authClient } from "@/lib/auth-client";
import type { ChangePasswordFormValues } from "@/types/settings";
import { ChangePasswordFormSchema } from "@/schemas/settings";
import { toast } from "sonner";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";

export function ChangePasswordForm() {
  const t = useTranslations();
  const auth = useAuthErrorMessages();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema(t)),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function handleSubmit(values: ChangePasswordFormValues) {
    setError("");

    startTransition(async () => {
      await authClient.changePassword(
        {
          ...values,
          revokeOtherSessions: true,
        },
        {
          onError: (ctx) => {
            setError(auth[ctx.error.code] || t("Form.errors.generic"));
          },
          onSuccess: () => {
            toast.success("Le mot de passe a été modifié avec succès.");
            form.reset();
          },
        },
      );
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {t("Form.changePassword.fields.currentPassword")}
              </FormLabel>
              <PasswordInput field={field} loading={isPending} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {t("Form.changePassword.fields.newPassword")}
              </FormLabel>
              <PasswordInput field={field} loading={isPending} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : t("Form.changePassword.submitButton")}
        </Button>
      </form>
    </Form>
  );
}
