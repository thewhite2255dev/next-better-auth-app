import { SessionManagement } from "@/components/settings/session-management";
import { SettingsHeader } from "@/components/settings/settings-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("SettingsSessionsPage");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SettingsSessionsPage() {
  const t = await getTranslations("SettingsSessionsPage");

  const session = await auth.api.getSession({ headers: await headers() });
  const sessions = await auth.api.listSessions({ headers: await headers() });

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader title={t("title")} description={t("description")} />
      <SessionManagement
        currentSessionToken={session?.session.token}
        sessions={sessions}
      />
    </div>
  );
}
