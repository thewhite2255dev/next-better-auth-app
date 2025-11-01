"use client";

import { ProfileForm } from "@/components/settings/profile-form";
import { SettingsHeader } from "@/components/settings/settings-header";
import { useTranslations } from "next-intl";

export default function SettingsProfilePage() {
  const t = useTranslations("SettingsProfilePage");
  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader title={t("title")} description={t("description")} />
      <ProfileForm />
    </div>
  );
}
