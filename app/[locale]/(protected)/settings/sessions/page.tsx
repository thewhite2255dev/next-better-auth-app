import { SessionManagement } from "@/components/settings/session-management";
import { Header } from "../_components/header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";

export default async function SettingsSessionsPage() {
  const t = await getTranslations("SettingsSessionsPage");

  const session = await auth.api.getSession({ headers: await headers() });
  const sessions = await auth.api.listSessions({ headers: await headers() });

  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <Header title={t("title")} description={t("description")} />
      <SessionManagement
        currentSessionToken={session?.session.token}
        sessions={sessions}
      />
    </div>
  );
}
