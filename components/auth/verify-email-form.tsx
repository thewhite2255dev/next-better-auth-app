"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useState } from "react";
import { verifyEmail } from "@/actions/auth/verify-email";
import { MailCheck, XCircle } from "lucide-react";
import { notFound, useSearchParams } from "next/navigation";
import { AuthCard } from "./auth-card";
import { BackButton } from "./back-button";
import { Spinner } from "../ui/spinner";

export function VerifyEmailForm() {
  const t = useTranslations();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const handleSubmit = async () => {
      setError("");

      const result = await verifyEmail(token as string);

      if (result?.success) {
        setSuccess(result?.success);
      }

      if (result?.error) {
        setError(result?.error);
      }

      setIsLoading(false);
    };

    handleSubmit();
  }, [token]);

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
      {isLoading && (
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
          <p className="text-muted-foreground">
            {t("Form.verifyEmail.successCard.description")}
          </p>
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
