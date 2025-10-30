"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "react-qr-code";
import { toast } from "sonner";

import FormError from "@/components/layout/form-error";
import FormSuccess from "@/components/layout/form-success";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
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

import { authClient } from "@/lib/auth-client";
import { useAuthErrorMessages } from "@/hooks/use-auth-error-messages";
import { TwoFactorAuthFormSchema } from "@/schemas/auth";
import type { TwoFactorAuthFormValues } from "@/types/settings";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { PasswordInput } from "@/components/layout/password-input";
import { Download } from "lucide-react";
import { SiteConfig } from "@/lib/site-config";
import { Separator } from "@/components/ui/separator";

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export function AuthentificationForm() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();
  const { data: session, refetch } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [isVerifyingCode, startTransitionVerifyingCode] = useTransition();

  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const [totpCode, setTotpCode] = useState<string>("");
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

  const form = useForm<TwoFactorAuthFormValues>({
    resolver: zodResolver(TwoFactorAuthFormSchema(t)),
    defaultValues: { password: "" },
  });

  function handleVerifyTotp() {
    setSuccess("");
    setError("");

    startTransitionVerifyingCode(async () => {
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
            setSuccess("Le code a été vérifié avec succès.");
          },
        },
      );
    });
  }

  function handleResetStates() {
    if (successfullyEnabled) {
      setIsTotpSetupDialogOpen(false);
    }

    setError("");
    setSuccess("");
    setTotpCode("");
    setIsPasswordDialogOpen(false);
    setSuccessfullyEnabled(false);

    form.reset();
  }

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
            toast.success(
              "L'authentification à deux facteurs a été activée avec succès.",
            );
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
                    "L'authentification à deux facteurs a été désactivée avec succès.",
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
                  toast.success("Le QR code a été généré avec succès.");
                  handleResetStates();
                },
              },
            );
          },
        },
      );
    } else {
      await authClient.updateUser({ totpEnabled: false });
      toast.success(
        "L'application d'authentification a été activée avec succès.",
      );
      handleResetStates();
    }

    refetch();
    router.refresh();
  }

  function handleSubmit(values: TwoFactorAuthFormValues) {
    setSuccess("");
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

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-md">
        <CardHeader className="flex justify-between px-4">
          <div>
            <CardTitle>Authentification à deux facteurs</CardTitle>
            <CardDescription>
              Renforcez la sécurité de votre compte grâce à la vérification en
              deux étapes.
            </CardDescription>
          </div>
          <Switch
            checked={session?.user.twoFactorEnabled ?? false}
            onCheckedChange={(checked) => {
              setActionType("twoFactor");
              setPendingState(checked);
              setIsPasswordDialogOpen(true);
            }}
            disabled={isPending}
          />
        </CardHeader>
        <Separator />
        <CardHeader className="flex items-center justify-between px-4">
          <div>
            <CardTitle>Application d&apos;authentification</CardTitle>
            <CardDescription>
              Protégez votre compte avec des codes temporaires générés par une
              application.
            </CardDescription>
          </div>
          <Switch
            disabled={isPending}
            checked={session?.user.totpEnabled ?? false}
            onCheckedChange={(checked) => {
              setActionType("totp");
              setPendingState(checked);
              if (!session?.user.twoFactorEnabled) {
                toast.error(
                  "Veuillez vous assurez que l'authentification à deux facteurs est activé avant de continuer.",
                );
                return;
              }
              setIsPasswordDialogOpen(true);
            }}
          />
        </CardHeader>
      </Card>

      <AlertDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "twoFactor"
                ? pendingState
                  ? "Activer l'authentification à deux facteurs"
                  : "Désactiver l'authentification à deux facteurs"
                : pendingState
                  ? "Activer l'application d'authentification"
                  : "Désactiver l'application d'authentification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez saisir votre mot de passe pour confirmer cette action.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <PasswordInput field={field} loading={isPending} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <div className="flex justify-end gap-2">
                <AlertDialogCancel onClick={handleResetStates}>
                  Annuler
                </AlertDialogCancel>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Confirmer"}
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isTotpSetupDialogOpen}
        onOpenChange={setIsTotpSetupDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {successfullyEnabled
                ? "Enregistrez vos codes de secours"
                : "Configurer l'application d'authentification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {successfullyEnabled
                ? "Les codes de secours peuvent être utilisés comme mesure de sécurité supplémentaire si vous perdez l'accès à votre appareil."
                : "Scannez ce QR code avec votre application d'authentification puis saisissez le code."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {successfullyEnabled ? (
            <>
              <div className="my-3 flex items-center justify-center">
                {isPending ? (
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
                      `${SiteConfig.title} backup codes`.replaceAll(" ", "-"),
                      twoFactorData?.backupCodes,
                    );
                  }}
                >
                  <Download /> Télécharger
                </Button>
              )}
            </>
          ) : (
            <>
              <div className="my-3 flex justify-center">
                {isPending ? (
                  <Spinner />
                ) : (
                  twoFactorData && (
                    <QRCode value={twoFactorData.totpURI} className="size-36" />
                  )
                )}
              </div>
              <div className="space-y-2">
                <Label>Code à 6 chiffres</Label>
                <InputGroup>
                  <InputGroupInput
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    disabled={isVerifyingCode}
                  />
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      className="mr-[3px] h-6"
                      variant="secondary"
                      size="sm"
                      onClick={handleVerifyTotp}
                      disabled={isVerifyingCode || !totpCode}
                    >
                      {isVerifyingCode ? <Spinner /> : "Vérifier"}
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
                disabled={isVerifyingCode}
              >
                Retour
              </Button>
            )}
            <Button
              className="flex flex-grow"
              onClick={
                successfullyEnabled
                  ? handleResetStates
                  : () => {
                      setTotpCode("");
                      setError("");
                      setSuccess("");
                      setSuccessfullyEnabled(true);
                    }
              }
              disabled={isVerifyingCode}
            >
              {successfullyEnabled
                ? "J'ai enregistré mes codes de secours"
                : "Continuer"}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- DEBUG ---
      <div className="text-xs opacity-70">
        <p>TwoFactorData: {JSON.stringify(twoFactorData)}</p>
        <p>UserData: {JSON.stringify(session?.user)}</p>
      </div> */}
    </div>
  );
}
