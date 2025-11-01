import DeleteAccountButton from "@/components/settings/delete-account-button";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

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
        <DeleteAccountButton hasPasswordAccount={hasPasswordAccount}>
          <Button variant="destructive">{t("delete.button")}</Button>
        </DeleteAccountButton>
      </div>
    </div>
  );
}
