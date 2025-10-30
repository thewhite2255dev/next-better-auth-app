"use client";

import { AuthentificationForm } from "@/components/settings/authentication-form";
import { Header } from "../_components/header";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { useTranslations } from "next-intl";

export default function SettingsSecurityPage() {
  const t = useTranslations("SettingsSecurity");
  return (
    <div className="flex flex-col gap-6">
      <Header
        title={t("changePassword.title")}
        description={t("changePassword.description")}
      />
      <ChangePasswordForm />
      <Header
        title={t("twoFactor.title")}
        description={t("twoFactor.description")}
      />
      <AuthentificationForm />
    </div>
  );
}
