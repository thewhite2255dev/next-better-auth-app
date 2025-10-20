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
import type { SignUpFormValues } from "@/types/auth";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema } from "@/schemas/auth";
import { Link } from "@/i18n/navigation";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { SocialButtons, SocialDivider } from "./social-buttons";
import FormError from "../layout/form-error";
import { useSession } from "@/lib/auth-client";
import { signUpWithEmail } from "@/actions/auth/sign-up";
import { VerifyEmailCard } from "./verify-email-card";
import { Spinner } from "../ui/spinner";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

export function SignUpForm() {
  const t = useTranslations();

  const { refetch } = useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [step, setStep] = useState<"Credential" | "VerifyEmail">("Credential");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema(t)),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function handleSubmit(values: SignUpFormValues) {
    setError("");

    startTransition(async () => {
      const { success, error } = await signUpWithEmail(values);

      if (!success) {
        setError(error || t("Form.errors.generic"));
        return;
      }

      refetch();
      setStep("VerifyEmail");
    });
  }

  return (
    <>
      <AuthCard
        title={
          step === "Credential"
            ? t("Form.signUp.title")
            : t("Form.verifyEmail.pending.title")
        }
        description={step === "Credential" ? t("Form.signUp.description") : ""}
        footer={
          step === "Credential" ? (
            <p className="text-muted-foreground text-sm">
              {t.rich("Form.signUp.haveAccount", {
                link: (chunks) => (
                  <Link
                    href="/auth/sign-in"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          ) : (
            <BackButton
              href="/auth/sign-in"
              label={t("Form.auth.backToSignIn")}
            />
          )
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
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("Form.signUp.fields.name")}</FormLabel>
                        <FormControl>
                          <Input disabled={isPending} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("Form.signUp.fields.email")}</FormLabel>
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
                        <FormLabel>
                          {t("Form.signUp.fields.password")}
                        </FormLabel>
                        <InputGroup>
                          <FormControl>
                            <InputGroupInput
                              {...field}
                              type={showPassword ? "text" : "password"}
                              disabled={isPending}
                            />
                          </FormControl>
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
                        </InputGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={error} />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? <Spinner /> : t("Form.signUp.button")}
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
