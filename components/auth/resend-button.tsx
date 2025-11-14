"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ResendButtonProps extends React.ComponentProps<"button"> {
  handler: () => Promise<void> | void;
  label: string;
  isLoading: boolean;
  countdownDelay?: number;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
}

export function ResendButton({
  isLoading,
  handler,
  label,
  countdownDelay = 30,
  variant = "default",
  ...props
}: ResendButtonProps) {
  const t = useTranslations();

  const [countdown, setCountdown] = useState<number>(0);

  async function handleResend() {
    if (countdown > 0) return;

    try {
      await handler();
      setCountdown(countdownDelay);
    } catch (error) {
      console.error("Resend failed:", error);
    }
  }

  useEffect(() => {
    let interval: number | undefined;

    if (countdown > 0) {
      interval = window.setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [countdown]);

  return (
    <Button
      type="button"
      variant={countdown > 0 ? null : variant}
      className={cn(
        "w-full",
        countdown > 0 ? "bg-muted/50 text-muted-foreground" : "",
      )}
      disabled={countdown > 0 || isLoading}
      onClick={handleResend}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : countdown > 0 ? (
        t("Form.auth.resendCountdown", { name: label, countdown })
      ) : (
        t("Form.auth.resendLabel", { name: label })
      )}
    </Button>
  );
}
