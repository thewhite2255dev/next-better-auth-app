"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { type ComponentProps, useTransition } from "react";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface SetPasswordButtonProps extends ComponentProps<typeof Button> {
  email: string;
  children: React.ReactNode;
}

export function SetPasswordButton({
  email,
  children,
  ...props
}: SetPasswordButtonProps) {
  const t = useTranslations();

  const [isPending, startTransition] = useTransition();

  async function handleResendLink() {
    if (!email) return null;

    startTransition(async () => {
      await authClient.requestPasswordReset(
        {
          email,
        },
        {
          onError: () => {
            toast.error(t("Form.errors.generic"));
          },
          onSuccess: () => {
            toast.success(t("SetPasswordButton.success"));
          },
        },
      );
    });
  }

  return (
    <Button {...props} onClick={handleResendLink}>
      {isPending ? <Spinner /> : children}
    </Button>
  );
}
