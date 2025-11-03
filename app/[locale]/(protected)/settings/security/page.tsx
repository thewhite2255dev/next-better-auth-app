import { AuthenticationForm } from "@/components/settings/authentication-form";
import { SettingsHeader } from "@/components/settings/settings-header";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SetPasswordButton } from "@/components/settings/set-password-button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsSecurityPage");

  return {
    title: t("twoFactor.title"),
    description: t("twoFactor.description"),
  };
}

export default async function SettingsSecurityPage() {
  const t = await getTranslations("SettingsSecurityPage");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential",
  );

  return (
    <div className="flex flex-col gap-6">
      {hasPasswordAccount ? (
        <>
          <SettingsHeader
            title={t("changePassword.title")}
            description={t("changePassword.description")}
          />
          <ChangePasswordForm />
        </>
      ) : (
        <>
          <SettingsHeader
            title={t("setPassword.title")}
            description={t("setPassword.description")}
          />
          <SetPasswordButton
            className="w-max"
            variant="outline"
            email={session?.user.email ?? ""}
          >
            {t("setPassword.button")}
          </SetPasswordButton>
        </>
      )}
      {hasPasswordAccount && (
        <>
          <SettingsHeader
            title={t("twoFactor.title")}
            description={t("twoFactor.description")}
          />
          <AuthenticationForm />
        </>
      )}
    </div>
  );
}
