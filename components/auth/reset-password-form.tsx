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
import type { ResetPasswordFormValues } from "@/types/auth";
import { ResetPasswordFormSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EyeOff, Eye, Check } from "lucide-react";
import FormError from "../layout/form-error";
import { BackButton } from "./back-button";
import { resetPassword } from "@/actions/auth/reset-password";
import { notFound, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";

export function ResetPasswordForm() {
  const t = useTranslations();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordFormSchema(t)),
    defaultValues: {
      password: "",
    },
  });

  async function handleSubmit(values: ResetPasswordFormValues) {
    setError("");

    startTransition(async () => {
      const { success, error } = await resetPassword(values, token as string);

      if (!success) {
        setError(error || t("Form.errors.generic"));
        return;
      }

      setIsSubmitted(true);
      form.reset();
    });
  }

  if (!token) {
    notFound();
  }

  return (
    <AuthCard
      title={t("Form.resetPassword.title")}
      description={
        !isSubmitted ? t("Form.resetPassword.description.enterEmail") : ""
      }
      footer={
        <BackButton href="/auth/sign-in" label={t("Form.auth.backToSignIn")} />
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
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>{t("Form.signIn.fields.password")}</FormLabel>
                  <InputGroup>
                    <FormControl>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                      />
                    </FormControl>
                    {field.value !== "" && (
                      <InputGroupAddon align="inline-end">
                        {showPassword ? (
                          <EyeOff
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-4 w-4 cursor-default"
                          />
                        ) : (
                          <Eye
                            onClick={() => setShowPassword(!showPassword)}
                            className="h-4 w-4 cursor-default"
                          />
                        )}
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormError message={error} />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Spinner /> : t("Form.resetPassword.button")}
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
            {t("Form.resetPassword.successCard.description")}
          </p>
        </div>
      )}
    </AuthCard>
  );
}
