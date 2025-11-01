"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { AuthCard } from "./auth-card";
import { useState, useTransition } from "react";
import type { ForgotPasswordFormValues } from "@/types/auth";
import { ForgotPasswordFormSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import FormError from "../layout/form-error";
import { BackButton } from "./back-button";
import { Button } from "../ui/button";
import FormSuccess from "../layout/form-success";
import { ResendButton } from "./resend-button";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  async function handleResendLink() {
    setError("");
    setSuccess("");

    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        await authClient.requestPasswordReset(
          {
            email: form.getValues("email") as string,
          },
          {
            onError: () => {
              setError(t("Form.errors.generic"));
              reject(new Error("Failed to resend link"));
            },
            onSuccess: () => {
              setSuccess(t("Form.verifyEmail.resend.states.success"));
              resolve();
            },
          },
        );
      });
    });
  }

  function handleSubmit(values: ForgotPasswordFormValues) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          ...values,
        },
        {
          onError: () => {
            setError(t("Form.errors.generic"));
          },
          onSuccess: () => {
            setIsSubmitted(true);
          },
        },
      );
    });
  }

  return (
    <AuthCard
      title={t("Form.forgotPassword.title")}
      description={!isSubmitted ? t("Form.forgotPassword.description") : ""}
      footer={
        !isSubmitted ? (
          <BackButton
            href="/auth/sign-in"
            label={t("Form.auth.backToSignIn")}
          />
        ) : (
          <p className="text-muted-foreground text-sm">
            {t.rich("Form.auth.editAccount", {
              button: (chunks) => (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                  }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {chunks}
                </button>
              ),
            })}
          </p>
        )
      }
    >
      {!isSubmitted ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("Form.fields.email")}</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Spinner /> : t("Form.forgotPassword.button")}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3">
              <Check className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-muted-foreground">
            {t.rich("Form.forgotPassword.successCard.description", {
              email: form.getValues("email"),
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
            })}
          </p>
          <FormError message={error} />
          <FormSuccess message={success} />
          <ResendButton
            variant="outline"
            label={t("Form.common.link")}
            handler={handleResendLink}
            isLoading={isPending}
          />
        </div>
      )}
    </AuthCard>
  );
}
