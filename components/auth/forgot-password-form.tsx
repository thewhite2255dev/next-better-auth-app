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
import { AUTH_CONSTANTS } from "@/lib/auth-constants";
import { Input } from "../ui/input";
import { requestPasswordReset } from "@/lib/auth-client";
import { forgotPassword } from "@/actions/auth/forgot-password";
import { Spinner } from "../ui/spinner";

export function ForgotPasswordForm() {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(
    AUTH_CONSTANTS.VERIFY_EMAIL_RESEND_DELAY,
  );

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordFormSchema(t)),
    defaultValues: {
      email: "",
    },
  });

  const handleResendLink = () => {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.VERIFY_EMAIL_RESEND_DELAY);
    startTransition(async () => {
      const { error } = await requestPasswordReset({
        email: form.getValues("email") as string,
      });

      if (error) {
        setError(t("Form.errors.generic"));
      } else {
        setSuccess(t("Form.verifyEmail.resend.states.success"));
      }
    });
  };

  async function handleSubmit(values: ForgotPasswordFormValues) {
    setError("");

    startTransition(async () => {
      const { success, error } = await forgotPassword(values);

      if (!success) {
        setError(error as string);
        return;
      }

      setIsSubmitted(true);
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
            {t.rich("Form.editAccount", {
              button: (chunks) => (
                <button
                  onClick={() => {
                    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);
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
                  <FormLabel>{t("Form.forgotPassword.fields.email")}</FormLabel>
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
          <div className="py-2">
            <ResendButton
              variant="outline"
              label={t("Form.common.link")}
              handler={handleResendLink}
              initialCountdown={countdown}
              isLoading={isPending}
            />
          </div>
        </div>
      )}
    </AuthCard>
  );
}
