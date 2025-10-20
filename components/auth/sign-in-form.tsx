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
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormSchema } from "@/schemas/auth";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { SocialButtons, SocialDivider } from "./social-buttons";
import { useSession } from "@/lib/auth-client";
import FormError from "../layout/form-error";
import { VerifyEmailCard } from "./verify-email-card";
import { signInWithEmail } from "@/actions/auth/sign-in";
import { Spinner } from "../ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/redirect-config";

export function SignInForm() {
  const t = useTranslations();
  const router = useRouter();

  const { refetch } = useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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

  async function handleSubmit(values: SignInFormValues) {
    setError("");

    startTransition(async () => {
      const { success, error, verifyEmail } = await signInWithEmail(values);

      if (!success) {
        if (verifyEmail) {
          setStep("VerifyEmail");
          return;
        }

        setError(error as string);
        return;
      }

      refetch();
      router.push(DEFAULT_SIGN_IN_REDIRECT);
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
            error={error}
            setError={() => setError(error)}
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
                  {isPending ? <Spinner /> : t("Form.signIn.button")}
                </Button>
              </form>
            </Form>

            <SocialDivider text={t("Form.auth.orSignInWith")} />
            <SocialButtons providers={["google", "github"]} />
          </div>
        )}
      </AuthCard>
    </>
  );
}
