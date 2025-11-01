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
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/redirect-config";
import { PasswordInput } from "../layout/password-input";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";
import { checkTwoFactor } from "@/actions/auth/check-two-factor";
import TwoFactorForm from "./two-factor-form";

export function SignInForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();

  const { refetch } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [step, setStep] = useState<
    "Credential" | "TwoFactor" | "Totp" | "VerifyEmail"
  >("Credential");

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    },
  });

  function handleSubmit(values: SignInFormValues) {
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
              refetch();
              router.push(DEFAULT_SIGN_IN_REDIRECT);
            },
          },
        );
      }
    });
  }

  let AuthCardTitle = "";
  let AuthCardDescription = "";
  let AuthCardFooter = null;

  if (step === "TwoFactor" || step === "Totp")
    AuthCardTitle = t("Form.twoFactor.title");
  else if (step === "Credential") AuthCardTitle = t("Form.signIn.title");
  else if (step === "VerifyEmail")
    AuthCardTitle = t("Form.verifyEmail.pending.title");

  if (step === "Totp") {
    AuthCardDescription =
      "Ouvrez votre application d'authentification et saisissez le code généré ci-dessous.";
  } else if (step === "TwoFactor") {
    AuthCardDescription = t.rich("Form.twoFactor.description", {
      email: form.getValues("email"),
      strong: (chunks) => <span className="font-medium">{chunks}</span>,
    }) as string;
  } else if (step === "Credential") {
    AuthCardDescription = t("Form.signIn.description");
  }

  if (step === "Credential") {
    AuthCardFooter = (
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
    );
  } else {
    AuthCardFooter = (
      <BackButton
        onClick={() => {
          setError("");
          form.reset();
          setStep("Credential");
        }}
        label={t("Form.auth.backToSignIn")}
        type="button"
        className={step === "VerifyEmail" ? "cursor-pointer" : ""}
      />
    );
  }

  return (
    <AuthCard
      title={AuthCardTitle}
      description={AuthCardDescription}
      footer={AuthCardFooter}
    >
      {step === "VerifyEmail" && (
        <VerifyEmailCard
          email={form.getValues("email")}
          description={
            t.rich("Form.verifyEmail.pending.description", {
              email: form.getValues("email"),
              strong: (chunks) => <span className="font-medium">{chunks}</span>,
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
                    <FormLabel>{t("Form.fields.email")}</FormLabel>
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
                      <FormLabel>{t("Form.fields.password")}</FormLabel>
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
        <TwoFactorForm form={form} step={step} setStep={setStep} />
      )}
    </AuthCard>
  );
}
