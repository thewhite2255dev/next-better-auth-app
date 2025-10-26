"use client";

import { useTranslations } from "next-intl";
import { useEffect, useTransition } from "react";
import { useState } from "react";
import { MailCheck, XCircle } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { Spinner } from "../ui/spinner";
import { authClient } from "@/lib/auth-client";

export function VerifyEmailForm() {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    function handleSubmit() {
      setError("");

      startTransition(async () => {
        if (token == null) return;

        await authClient.verifyEmail(
          {
            query: {
              token,
            },
          },
          {
            onError: () => {
              setError(t("Form.errors.token.invalid"));
            },
            onSuccess: () => {
              setSuccess(t("Form.verifyEmail.successCard.description"));
            },
          },
        );
      });
    }
    handleSubmit();
  }, [token, t]);

  if (!token) {
    notFound();
  }

  return (
    <AuthCard
      title={t("Form.verifyEmail.title")}
      footer={
        <BackButton href="/auth/sign-in" label={t("Form.auth.backToSignIn")} />
      }
    >
      {isPending && (
        <div className="flex justify-center">
          <Spinner className="text-muted-foreground h-6 w-6" />
        </div>
      )}
      {success && (
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-emerald-100 p-3">
              <MailCheck className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <p className="text-muted-foreground">{success}</p>
        </div>
      )}
      {error && (
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-muted-foreground">{error}</p>
        </div>
      )}
    </AuthCard>
  );
}
