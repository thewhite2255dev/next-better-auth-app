import { ProfileForm } from "@/components/settings/profile-form";
import { SettingsHeader } from "@/components/settings/settings-header";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsProfilePage");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SettingsProfilePage() {
  const t = await getTranslations("SettingsProfilePage");

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader title={t("title")} description={t("description")} />
      <ProfileForm />
    </div>
  );
}
