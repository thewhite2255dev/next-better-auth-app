import DeleteAccountDialog from "@/components/settings/delete-account-dialog";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsAccountPage");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SettingsAccountPage() {
  const t = await getTranslations("SettingsAccountPage");

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential",
  );

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader title={t("title")} description={t("description")} />
      <div className="flex items-center justify-between">
        <Label>{t("delete.label")}</Label>
        <DeleteAccountDialog hasPasswordAccount={hasPasswordAccount}>
          <Button variant="destructive">{t("delete.button")}</Button>
        </DeleteAccountDialog>
      </div>
    </div>
  );
}
