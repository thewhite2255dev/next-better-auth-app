/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { SignInFormValues } from "@/types/auth";
import { authClient } from "@/lib/auth-client";
import FormError from "../layout/form-error";
import { Spinner } from "../ui/spinner";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPGroup,
} from "@/components/ui/input-otp";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/redirect-config";
import { ResendButton } from "./resend-button";
import FormSuccess from "../layout/form-success";
import { useRouter } from "@/i18n/navigation";

interface TwoFactorFormProps {
  form: any;
  step: string;
  setStep: (value: "Credential" | "TwoFactor" | "Totp" | "VerifyEmail") => void;
}

export default function TwoFactorForm({
  form,
  step,
  setStep,
}: TwoFactorFormProps) {
  const t = useTranslations();
  const router = useRouter();

  const { refetch } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [isResendingCode, startTransitionResendingCode] = useTransition();
  const [isEnablingTwoFactorAuth, startTransitionTwoFactorAuth] =
    useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleResendCode() {
    setError("");
    setSuccess("");

    return new Promise<void>((resolve, reject) => {
      startTransitionResendingCode(async () => {
        await authClient.twoFactor.sendOtp({
          fetchOptions: {
            onError: () => {
              setError(t("Form.errors.generic"));
              reject(new Error("Failed to send OTP"));
            },
            onSuccess: () => {
              setSuccess(t("Form.twoFactor.resend.states.success"));
              resolve();
            },
          },
        });
      });
    });
  }

  async function handleTwoFactorAuth() {
    setError("");
    setSuccess("");

    return new Promise<void>((resolve, reject) => {
      startTransitionTwoFactorAuth(async () => {
        await authClient.twoFactor.sendOtp({
          fetchOptions: {
            onError: () => {
              setError(t("Form.errors.generic"));
              reject(new Error("Failed to send OTP"));
            },
            onSuccess: () => {
              setStep("TwoFactor");
              setSuccess(t("Form.twoFactor.resend.states.success"));
              resolve();
            },
          },
        });
      });
    });
  }

  function handleSubmit(values: SignInFormValues) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      if (step === "TwoFactor") {
        await authClient.twoFactor.verifyOtp(
          {
            code: values.code as string,
          },
          {
            onError: () => {
              setError(t("Form.errors.invalidCode"));
            },
            onSuccess: () => {
              refetch();
              router.push(DEFAULT_SIGN_IN_REDIRECT);
            },
          },
        );
      }

      if (step === "Totp") {
        await authClient.twoFactor.verifyTotp(
          {
            code: values.code as string,
          },
          {
            onError: () => {
              setError(t("Form.errors.invalidCode"));
            },
            onSuccess: () => {
              refetch();
              router.push(DEFAULT_SIGN_IN_REDIRECT);
            },
          },
        );
      }
    });
  }

  return (
    <div className="space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex items-center justify-center">
                  <FormControl>
                    <InputOTP
                      {...field}
                      disabled={isPending}
                      required
                      inputMode="numeric"
                      maxLength={6}
                      onInput={(e) => {
                        const input = e.currentTarget;
                        input.value = input.value.replace(/\D/g, "");
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full"
            disabled={isPending || isEnablingTwoFactorAuth || isResendingCode}
          >
            {isPending ? <Spinner /> : t("Form.twoFactor.button")}
          </Button>
        </form>
      </Form>
      {step === "TwoFactor" ? (
        <ResendButton
          variant="outline"
          label={t("Form.common.code")}
          handler={handleResendCode}
          isLoading={isResendingCode}
        />
      ) : (
        <Button
          onClick={handleTwoFactorAuth}
          variant="outline"
          className="w-full"
          disabled={isEnablingTwoFactorAuth}
        >
          {isEnablingTwoFactorAuth ? (
            <Spinner />
          ) : (
            t("Form.twoFactor.receiveCodeViaEmail")
          )}
        </Button>
      )}
    </div>
  );
}
