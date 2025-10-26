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
import { useAuthErrorMessages } from "@/hooks/use-better-auth-error";
import { TwoFactorAuthFormSchema } from "@/schemas/auth";
import type { TwoFactorAuthFormValues } from "@/types/auth";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/navigation";
import { PasswordInput } from "@/components/layout/password-input";

type TwoFactorData = {
  totpURI: string;
  backupCodes: string[];
};

export default function SettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const authError = useAuthErrorMessages();
  const { data: session, refetch } = authClient.useSession();

  const [isPending, startTransition] = useTransition();
  const [isVerifyingTotp, startTransitionVerifyingTotp] = useTransition();

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [totpOpen, setTotpOpen] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(
    null,
  );
  const [totpCode, setTotpCode] = useState("");
  const [pendingState, setPendingState] = useState<boolean | null>(null);
  const [actionType, setActionType] = useState<"twoFactor" | "totp" | null>(
    null,
  );

  const form = useForm<TwoFactorAuthFormValues>({
    resolver: zodResolver(TwoFactorAuthFormSchema(t)),
    defaultValues: { password: "" },
  });

  async function handleTwoFactorToggle(enabled: boolean, password: string) {
    if (enabled) {
      const { error } = await authClient.twoFactor.enable({ password });
      if (error)
        return setError(
          authError[error.code as string] || t("Form.errors.generic"),
        );

      toast.success("Authentification à deux facteurs activée !");
      handleResetStates();
    } else {
      const { error } = await authClient.twoFactor.disable({ password });
      if (error)
        return setError(
          authError[error.code as string] || t("Form.errors.generic"),
        );

      await authClient.updateUser({ totpEnabled: false });
      toast.success("Authentification à deux facteurs désactivée !");
      handleResetStates();
    }

    refetch();
    router.refresh();
  }

  async function handleTotpToggle(enabled: boolean, password: string) {
    if (!session?.user.twoFactorEnabled) return;

    if (enabled) {
      const { data, error } = await authClient.twoFactor.enable({ password });
      if (error)
        return setError(
          authError[error.code as string] || t("Form.errors.generic"),
        );

      setTwoFactorData(data);
      setTotpOpen(true);
      toast.success("QR Code généré !");
      handleResetStates();
      await authClient.updateUser({ totpEnabled: true });
    } else {
      const { error } = await authClient.twoFactor.disable({ password });
      if (error)
        return setError(
          authError[error.code as string] || t("Form.errors.generic"),
        );

      await authClient.updateUser({ totpEnabled: false });
      toast.success("Application d'authentification désactivée !");
      handleResetStates();
    }

    refetch();
    router.refresh();
  }

  function handleVerifyTotp() {
    setSuccess("");
    setError("");

    startTransitionVerifyingTotp(async () => {
      const { error } = await authClient.twoFactor.verifyTotp({
        code: totpCode,
      });

      if (error) {
        toast.error("Le code TOTP est invalide.");
        return;
      }

      toast.success("Le code TOTP a été vérifié avec succès !");
      refetch();
      router.refresh();
      setTotpOpen(false);
    });
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

  function handleResetStates() {
    setError("");
    setSuccess("");
    setTotpCode("");
    setOpen(false);
    form.reset();
  }

  return (
    <div className="container mx-auto flex flex-col gap-4 py-8">
      {/* --- SWITCH PRINCIPAL 2FA --- */}
      <Card>
        <CardHeader className="flex justify-between p-4">
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
              setOpen(true);
            }}
          />
        </CardHeader>
      </Card>

      {/* --- SWITCH TOTP APP --- */}
      <Card>
        <CardHeader className="flex items-center justify-between p-4">
          <div>
            <CardTitle>Application d&apos;authentification</CardTitle>
            <CardDescription>
              Protégez votre compte avec des codes temporaires générés par une
              application.
            </CardDescription>
          </div>
          <Switch
            checked={session?.user.totpEnabled ?? false}
            onCheckedChange={(checked) => {
              setActionType("totp");
              setPendingState(checked);
              if (!session?.user.twoFactorEnabled) {
                toast.error(
                  "Activez d'abord l'authentification à deux facteurs avant d'activer l'application.",
                );
                return;
              }
              setOpen(true);
            }}
          />
        </CardHeader>
      </Card>

      {/* --- MODALE DE CONFIRMATION PAR MOT DE PASSE --- */}
      <AlertDialog open={open} onOpenChange={setOpen}>
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
                  Fermer
                </AlertDialogCancel>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Spinner /> : "Confirmer"}
                </Button>
              </div>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- MODALE TOTP QR CODE --- */}
      <AlertDialog open={totpOpen} onOpenChange={setTotpOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Application d&apos;authentification
            </AlertDialogTitle>
            <AlertDialogDescription>
              Scannez ce QR code avec votre application d&apos;authentification
              puis saisissez le code.
            </AlertDialogDescription>
          </AlertDialogHeader>

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
                disabled={isVerifyingTotp}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  className="mr-[3px] h-6"
                  variant="secondary"
                  size="sm"
                  onClick={handleVerifyTotp}
                  disabled={isVerifyingTotp || !totpCode}
                >
                  {isVerifyingTotp ? <Spinner /> : "Vérifier"}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <FormError message={error} />
            <FormSuccess message={success} />
          </div>

          <div className="flex items-center justify-end gap-2">
            <AlertDialogCancel onClick={handleResetStates}>
              Fermer
            </AlertDialogCancel>
            <Button disabled={isVerifyingTotp}>Confirmer</Button>
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
