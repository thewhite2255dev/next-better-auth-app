import { SettingsPreferencesSection } from "@/components/settings/settings-preferences-section";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsPreferencesPage");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SettingsPreferencesPage() {
  return <SettingsPreferencesSection />;
}
