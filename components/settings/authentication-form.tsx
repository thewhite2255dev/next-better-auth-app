"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";
import type { TwoFactorAuthFormValues } from "@/types/settings";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { ConfirmPasswordDialog } from "./confirm-password-dialog";
import { Switch } from "../ui/switch";
import { TotpSetupDialog } from "./totp-setup-dialog";
import { Card, CardContent } from "../ui/card";

export type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export function AuthenticationForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();
  const {
    data: session,
    refetch,
    isPending: loading,
  } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] =
    useState<boolean>(false);
  const [isTotpSetupDialogOpen, setIsTotpSetupDialogOpen] =
    useState<boolean>(false);

  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const [actionType, setActionType] = useState<"twoFactor" | "totp" | null>(
    null,
  );
  const [successfullyEnabled, setSuccessfullyEnabled] =
    useState<boolean>(false);

  function handleResetStates() {
    if (successfullyEnabled) {
      setIsTotpSetupDialogOpen(false);
    }

    setError("");
    setIsPasswordDialogOpen(false);
    setSuccessfullyEnabled(false);
  }

  async function handleTwoFactorToggle(enabled: boolean, password: string) {
    if (enabled) {
      await authClient.twoFactor.enable(
        { password },
        {
          onError: (ctx) => {
            setError(
              authError[ctx.error.code as string] || t("Form.errors.generic"),
            );
          },
          onSuccess: () => {
            toast.success(t("AuthenticationForm.twoFactor.success.enabled"));
            handleResetStates();
          },
        },
      );
    } else {
      await authClient.twoFactor.disable(
        { password },
        {
          onError: (ctx) => {
            setError(
              authError[ctx.error.code as string] || t("Form.errors.generic"),
            );
          },
          onSuccess: async () => {
            await authClient.updateUser(
              { totpEnabled: false },
              {
                onError: (ctx) => {
                  setError(
                    authError[ctx.error.code as string] ||
                      t("Form.errors.generic"),
                  );
                },
                onSuccess: () => {
                  toast.success(
                    t("AuthenticationForm.twoFactor.success.disabled"),
                  );
                  handleResetStates();
                },
              },
            );
          },
        },
      );
    }

    refetch();
    router.refresh();
  }

  async function handleTotpToggle(enabled: boolean, password: string) {
    if (!session?.user.twoFactorEnabled) return;

    if (enabled) {
      await authClient.twoFactor.enable(
        { password },
        {
          onError: (ctx) => {
            setError(
              authError[ctx.error.code as string] || t("Form.errors.generic"),
            );
          },
          onSuccess: async (ctx) => {
            setTwoFactorData(ctx?.data);
            await authClient.updateUser(
              { totpEnabled: true },
              {
                onError: (ctx) => {
                  setError(
                    authError[ctx.error.code as string] ||
                      t("Form.errors.generic"),
                  );
                },
                onSuccess: () => {
                  setIsTotpSetupDialogOpen(true);
                  toast.success(
                    t("AuthenticationForm.totp.success.qrGenerated"),
                  );
                  handleResetStates();
                },
              },
            );
          },
        },
      );
    } else {
      await authClient.updateUser({ totpEnabled: false });
      toast.success(t("AuthenticationForm.totp.success.enabled"));
      handleResetStates();
    }

    refetch();
    router.refresh();
  }

  function handleSubmit(values: TwoFactorAuthFormValues) {
    setError("");

    startTransition(async () => {
      if (pendingState === null || !actionType) return;

      if (actionType === "twoFactor") {
        await handleTwoFactorToggle(pendingState, values.password);
      } else if (actionType === "totp") {
        await handleTotpToggle(pendingState, values.password);
      }
    });
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <Card className="rounded-md p-4 shadow-none">
        <CardContent className="flex flex-col gap-4 p-0">
          <div className="flex items-center justify-between">
            <div>
              <Label>{t("AuthenticationForm.twoFactor.label")}</Label>
              <p>{t("AuthenticationForm.twoFactor.description")}</p>
            </div>
            <div>
              <Switch
                className="h-"
                checked={session?.user.twoFactorEnabled ?? false}
                onCheckedChange={(checked) => {
                  setActionType("twoFactor");
                  setPendingState(checked);
                  setIsPasswordDialogOpen(true);
                }}
                disabled={isPending}
              />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-md">
            <div>
              <Label>{t("AuthenticationForm.totp.label")}</Label>
              <p>{t("AuthenticationForm.totp.description")}</p>
            </div>
            <div>
              <Switch
                className="h-"
                disabled={isPending}
                checked={session?.user.totpEnabled ?? false}
                onCheckedChange={(checked) => {
                  setActionType("totp");
                  setPendingState(checked);
                  if (!session?.user.twoFactorEnabled) {
                    toast.error(t("AuthenticationForm.totp.requireTwoFactor"));
                    return;
                  }
                  setIsPasswordDialogOpen(true);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <ConfirmPasswordDialog
        title={
          actionType === "twoFactor"
            ? pendingState
              ? t("AuthenticationForm.twoFactor.enable")
              : t("AuthenticationForm.twoFactor.disable")
            : pendingState
              ? t("AuthenticationForm.totp.enable")
              : t("AuthenticationForm.totp.disable")
        }
        onSubmit={handleSubmit}
        onResetStates={handleResetStates}
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        loading={isPending}
        error={error}
      />
      <TotpSetupDialog
        onResetStates={handleResetStates}
        open={isTotpSetupDialogOpen}
        onOpenChange={setIsTotpSetupDialogOpen}
        loading={isPending}
        successfullyEnabled={successfullyEnabled}
        setSuccessfullyEnabled={setSuccessfullyEnabled}
        twoFactorData={twoFactorData}
      />
    </>
  );
}
