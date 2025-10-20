"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import FormError from "../layout/form-error";
import FormSuccess from "../layout/form-success";
import { AUTH_CONSTANTS } from "@/lib/auth-constants";
import { ResendButton } from "./resend-button";
import { sendVerificationEmail } from "@/lib/auth-client";

interface VerifyEmailCardProps {
  description: string;
  email: string;
  error: string;
  setError: (value: string) => void;
}

export function VerifyEmailCard({
  email,
  description,
  error,
  setError,
}: VerifyEmailCardProps) {
  const t = useTranslations();

  const [countdown, setCountdown] = useState<number>(
    AUTH_CONSTANTS.VERIFY_EMAIL_RESEND_DELAY,
  );
  const [isPending, startTransition] = useTransition();
  // const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleResendLink = () => {
    setError("");
    setSuccess("");
    setCountdown(AUTH_CONSTANTS.VERIFY_EMAIL_RESEND_DELAY);
    startTransition(async () => {
      const { error } = await sendVerificationEmail({ email });

      if (error) {
        setError(t("Form.errors.generic"));
      } else {
        setSuccess(t("Form.verifyEmail.resend.states.success"));
      }
    });
  };

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
  );
}
