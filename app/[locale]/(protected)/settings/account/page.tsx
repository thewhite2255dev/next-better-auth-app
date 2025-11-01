"use client";

import DeleteAccountButton from "@/components/settings/delete-account-button";
import { Header } from "../_components/header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function SettingsAccountPage() {
  const t = useTranslations("SettingsAccountPage");

  // function handleRevokeOtherSessions() {
  //     startTransition(async () => {
  //       await authClient.revokeOtherSessions(undefined, {
  //         onSuccess: () => {
  //           toast.success("Vous avez été déconnecté de tous les appareils.");
  //           router.refresh();
  //         },
  //         onError: () => {
  //           toast.error(t("Form.errors.generic"));
  //         },
  //       });
  //     });
  //   }

  return (
    <div className="flex flex-col gap-6">
      <Header title={t("title")} description={t("description")} />
      <div className="flex items-center justify-between">
        <Label>{t("delete.label")}</Label>
        <DeleteAccountButton>
          <Button variant="destructive">{t("delete.button")}</Button>
        </DeleteAccountButton>
      </div>
    </div>
  );
}
