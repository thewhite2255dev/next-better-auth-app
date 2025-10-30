"use client";

import { Header } from "../_components/header";
import { useTranslations } from "next-intl";

export default function SettingsSessionsPage() {
  const t = useTranslations("SettingsSessions");
  return (
    <div className="flex flex-col gap-6">
      <Header title={t("title")} description={t("description")} />
      {/* TODO: list active sessions, allow revoke */}
    </div>
  );
}
