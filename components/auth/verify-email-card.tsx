"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import FormError from "../shared/form-error";
import FormSuccess from "../shared/form-success";
import { ResendButton } from "./resend-button";
import { authClient } from "@/lib/auth-client";

interface VerifyEmailCardProps {
  description: string;
  email: string;
}

export function VerifyEmailCard({ email, description }: VerifyEmailCardProps) {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  async function handleResendLink() {
    setError("");
    setSuccess("");

    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        await authClient.sendVerificationEmail(
          { email },
          {
            onError: () => {
              setError(t("Form.errors.generic"));
              reject(new Error("Failed to resend verification email"));
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

  return (
    <div className="space-y-4 text-center">
      <div className="mb-4 flex justify-center">
        <div className="rounded-full bg-emerald-100 p-3">
          <Check className="h-6 w-6 text-emerald-600" />
        </div>
      </div>
      <p className="text-muted-foreground">{description}</p>
      <FormError message={error} />
      <FormSuccess message={success} />
      <ResendButton
        variant="outline"
        label={t("Form.common.link")}
        handler={handleResendLink}
        isLoading={isPending}
      />
    </div>
  );
}
