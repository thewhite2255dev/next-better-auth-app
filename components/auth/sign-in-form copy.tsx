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
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import type { SignInFormValues } from "@/types/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "@/schemas/auth";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { SocialButtons, SocialDivider } from "./social-buttons";
import { authClient } from "@/lib/auth-client";
import FormError from "../layout/form-error";
import { VerifyEmailCard } from "./verify-email-card";
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
import { AUTH_CONSTANTS } from "@/lib/auth-constants";
import { PasswordInput } from "../layout/password-input";
import { useAuthErrorMessages } from "@/hooks/use-better-auth-error";
import { checkTwoFactor } from "@/actions/auth/check-two-factor";

export function SignInForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<
    "Credential" | "TwoFactor" | "Totp" | "VerifyEmail"
  >("Credential");
  const [countdown, setCountdown] = useState<number>(
    AUTH_CONSTANTS.TWO_FA_RESEND_DELAY,
  );

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  function handleResendCode() {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.VERIFY_EMAIL_RESEND_DELAY);
    startTransition(async () => {
      await authClient.twoFactor.sendOtp({
        fetchOptions: {
          onError: () => {
            setError(t("Form.errors.generic"));
          },
          onSuccess: () => {
            setSuccess(t("Form.twoFactor.resend.states.success"));
          },
        },
      });
    });
  }

  function handleTwoFactorAuth() {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.TWO_FA_RESEND_DELAY);

    startTransition(async () => {
      await authClient.twoFactor.sendOtp({
        fetchOptions: {
          onError: () => {
            setError(t("Form.errors.generic"));
          },
          onSuccess: () => {
            setStep("TwoFactor");
            setSuccess(t("Form.twoFactor.resend.states.success"));
          },
        },
      });
    });
  }

  function handleSubmit(values: SignInFormValues) {
    setSuccess("");
    setError("");

    startTransition(async () => {
      if (step === "Credential") {
        await authClient.signIn.email(
          {
            email: values.email,
            password: values.password,
          },
          {
            onError: async (ctx) => {
              if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
                setStep("VerifyEmail");
                return;
              }

              setError(
                authError[ctx.error.code as string] || t("Form.errors.generic"),
              );
            },
            onSuccess: async (ctx) => {
              if (ctx.data.twoFactorRedirect) {
                const { totp } = await checkTwoFactor(values.email);

                if (totp) {
                  setStep("Totp");
                } else {
                  await authClient.twoFactor.sendOtp({
                    fetchOptions: {
                      onError: () => {
                        setError(t("Form.errors.generic"));
                      },
                      onSuccess: () => {
                        setStep("TwoFactor");
                      },
                    },
                  });
                }
              }

              router.push(DEFAULT_SIGN_IN_REDIRECT);
            },
          },
        );
      }

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
              router.push(DEFAULT_SIGN_IN_REDIRECT);
            },
          },
        );
      }
    });
  }

  return (
    <>
      <AuthCard
        title={
          step === "TwoFactor" || step === "Totp"
            ? t("Form.twoFactor.title")
            : step === "Credential"
              ? t("Form.signIn.title")
              : t("Form.verifyEmail.pending.title")
        }
        description={
          step === "Totp"
            ? "Ouvrez votre application d'authentification et saisissez le code généré ci-dessous."
            : step === "TwoFactor"
              ? (t.rich("Form.twoFactor.description", {
                  email: form.getValues("email"),
                  strong: (chunks) => (
                    <span className="font-medium">{chunks}</span>
                  ),
                }) as string)
              : step === "Credential"
                ? t("Form.signIn.description")
                : ""
        }
        footer={
          <>
            {step === "TwoFactor" && (
              <BackButton
                onClick={() => {
                  setError("");
                  form.reset();
                  setStep("Credential");
                }}
                label={t("Form.auth.backToSignIn")}
              />
            )}
            {step === "Totp" && (
              <BackButton
                onClick={() => {
                  setError("");
                  form.reset();
                  setStep("Credential");
                }}
                label={t("Form.auth.backToSignIn")}
              />
            )}
            {step === "VerifyEmail" && (
              <BackButton
                onClick={() => {
                  setError("");
                  form.reset();
                  setStep("Credential");
                }}
                type="button"
                className="cursor-pointer"
                label={t("Form.auth.backToSignIn")}
              />
            )}
            {step === "Credential" && (
              <p className="text-muted-foreground text-sm">
                {t.rich("Form.signIn.createAccount", {
                  link: (chunks) => (
                    <Link
                      href="/auth/sign-up"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            )}
          </>
        }
      >
        {step === "VerifyEmail" && (
          <VerifyEmailCard
            email={form.getValues("email")}
            description={
              t.rich("Form.verifyEmail.pending.description", {
                email: form.getValues("email"),
                strong: (chunks) => (
                  <span className="font-medium">{chunks}</span>
                ),
              }) as string
            }
          />
        )}
        {step === "Credential" && (
          <div className="space-y-4">
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
                      <FormLabel>{t("Form.signIn.fields.email")}</FormLabel>
                      <FormControl>
                        <Input disabled={isPending} type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          {t("Form.signIn.fields.password")}
                        </FormLabel>
                        <Link
                          href="/auth/forgot-password"
                          className="text-primary text-sm underline-offset-4 hover:underline"
                        >
                          {t("Form.signIn.forgotPassword")}
                        </Link>
                      </div>
                      <PasswordInput field={field} loading={isPending} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={error} />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Spinner /> : t("Form.signIn.button")}
                </Button>
              </form>
            </Form>

            <SocialDivider text={t("Form.auth.orSignInWith")} />
            <SocialButtons providers={["google", "github"]} />
          </div>
        )}
        {(step === "TwoFactor" || step === "Totp") && (
          <div className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
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
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Spinner /> : t("Form.twoFactor.button")}
                </Button>
              </form>
            </Form>
            {step === "TwoFactor" ? (
              <ResendButton
                variant="outline"
                label={t("Form.common.code")}
                handler={handleResendCode}
                initialCountdown={countdown}
                isLoading={isPending}
              />
            ) : (
              <Button
                onClick={handleTwoFactorAuth}
                variant="outline"
                className="w-full"
                disabled={isPending}
              >
                {isPending ? <Spinner /> : "Recevoir le code via email"}
              </Button>
            )}
          </div>
        )}
      </AuthCard>
    </>
  );
}
