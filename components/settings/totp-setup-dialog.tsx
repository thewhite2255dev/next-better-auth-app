"use client";

import QRCode from "react-qr-code";
import FormError from "@/components/shared/form-error";
import FormSuccess from "@/components/shared/form-success";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { getSiteConfig } from "@/lib/site-config";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { useLocale, useTranslations } from "next-intl";
import type { TwoFactorData } from "./authentication-form";

interface TotpSetupDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  successfullyEnabled: boolean;
  setSuccessfullyEnabled: (value: boolean) => void;
  loading: boolean;
  twoFactorData: TwoFactorData | null;
  onResetStates: () => void;
}

export function TotpSetupDialog({
  open,
  onOpenChange,
  successfullyEnabled,
  setSuccessfullyEnabled,
  loading,
  twoFactorData,
  onResetStates,
}: TotpSetupDialogProps) {
  const t = useTranslations();
  const locale = useLocale();
  const siteConfig = getSiteConfig(locale);
  const router = useRouter();
  const { refetch } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [totpCode, setTotpCode] = useState<string>("");

  useEffect(() => {
    function handleResetStates() {
      setSuccess("");
      setError("");
      setTotpCode("");
    }
    handleResetStates();
  }, [open]);

  function downloadTxtFile(filename: string, text: string[]) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text.join("\n")),
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function handleVerifyTotp() {
    setSuccess("");
    setError("");

    startTransition(async () => {
      await authClient.twoFactor.verifyTotp(
        {
          code: totpCode,
        },
        {
          onError: () => {
            setError(t("Form.errors.invalidCode"));
          },
          onSuccess: () => {
            refetch();
            router.refresh();
            setSuccess(t("Form.success.verifyTotpCode"));
          },
        },
      );
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {successfullyEnabled
              ? t("TotpSetupDialog.title.backupCodes")
              : t("TotpSetupDialog.title.setup")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {successfullyEnabled
              ? t("TotpSetupDialog.description.backupCodes")
              : t("TotpSetupDialog.description.setup")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {successfullyEnabled ? (
          <>
            <div className="my-3 flex items-center justify-center">
              {loading ? (
                <Spinner />
              ) : (
                <div className="grid w-full grid-cols-2 place-items-center gap-2">
                  {twoFactorData?.backupCodes.map((v, i) => (
                    <div key={i} className="font-mono text-sm">
                      {v}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {twoFactorData?.backupCodes && (
              <Button
                variant="outline"
                onClick={() => {
                  downloadTxtFile(
                    `${siteConfig.siteName} backup codes`.replaceAll(" ", "-"),
                    twoFactorData?.backupCodes,
                  );
                }}
              >
                <Download /> {t("TotpSetupDialog.buttons.download")}
              </Button>
            )}
          </>
        ) : (
          <>
            <div className="my-3 flex justify-center">
              {loading ? (
                <Spinner />
              ) : (
                twoFactorData && (
                  <QRCode value={twoFactorData.totpURI} className="size-36" />
                )
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("TotpSetupDialog.fields.code")}</Label>
              <InputGroup>
                <InputGroupInput
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  disabled={isPending}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="button"
                    className="mr-[3px] h-6"
                    variant="secondary"
                    size="sm"
                    onClick={handleVerifyTotp}
                    disabled={isPending || !totpCode}
                  >
                    {isPending ? (
                      <Spinner />
                    ) : (
                      t("TotpSetupDialog.buttons.verify")
                    )}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
              <FormError message={error} />
              <FormSuccess message={success} />
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-2">
          {successfullyEnabled && (
            <Button
              variant="outline"
              onClick={() => {
                setError("");
                setSuccess("");
                setSuccessfullyEnabled(false);
              }}
              disabled={isPending}
            >
              {t("TotpSetupDialog.buttons.back")}
            </Button>
          )}
          <Button
            className="flex flex-grow"
            onClick={
              successfullyEnabled
                ? onResetStates
                : () => {
                    setTotpCode("");
                    setError("");
                    setSuccess("");
                    setSuccessfullyEnabled(true);
                  }
            }
            disabled={isPending}
          >
            {successfullyEnabled
              ? t("TotpSetupDialog.buttons.saved")
              : t("TotpSetupDialog.buttons.continue")}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
