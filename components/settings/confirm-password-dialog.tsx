"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormError from "@/components/layout/form-error";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { PasswordInput } from "../layout/password-input";
import { TwoFactorAuthFormSchema } from "@/schemas/auth";
import type { TwoFactorAuthFormValues } from "@/types/settings";
import { useEffect } from "react";

interface ConfirmPasswordDialogProps {
  title: string;
  error: string;
  loading: boolean;
  onSubmit: (values: TwoFactorAuthFormValues) => void;
  onResetStates: () => void;
  open: boolean;
  onOpenChange: (value: boolean) => void;
}

export function ConfirmPasswordDialog({
  title,
  onSubmit,
  onResetStates,
  error,
  loading,
  open,
  onOpenChange,
}: ConfirmPasswordDialogProps) {
  const t = useTranslations();

  const form = useForm<TwoFactorAuthFormValues>({
    resolver: zodResolver(TwoFactorAuthFormSchema(t)),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    form.reset();
  }, [open, form]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("ConfirmPasswordDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Form.fields.password")}</FormLabel>
                  <PasswordInput field={field} loading={loading} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <div className="flex justify-end gap-2">
              <AlertDialogCancel onClick={onResetStates}>
                {t("ConfirmPasswordDialog.buttons.cancel")}
              </AlertDialogCancel>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Spinner />
                ) : (
                  t("ConfirmPasswordDialog.buttons.submit")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
