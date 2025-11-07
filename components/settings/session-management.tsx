"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UAParser } from "ua-parser-js";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import type { Session } from "better-auth";
import { ConfirmActionDialog } from "../shared/confirm-action-dialog";

export function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const t = useTranslations();
  const router = useRouter();

  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  const [isPending, startTransition] = useTransition();

  function handleRevokeOtherSessions() {
    startTransition(async () => {
      await authClient.revokeOtherSessions(undefined, {
        onSuccess: () => {
          toast.success(t("SessionManagement.success.revokedAll"));
          router.refresh();
        },
        onError: () => {
          toast.error(t("Form.errors.generic"));
        },
      });
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && (
        <SessionCard session={currentSession} isCurrentSession />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">
            {t("SessionManagement.otherSessions.title")}
          </h3>
          {otherSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeOtherSessions}
            >
              {isPending ? (
                <Spinner />
              ) : (
                t("SessionManagement.otherSessions.revokeAll")
              )}
            </Button>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card className="rounded-md p-4 shadow-none">
            <CardContent className="text-muted-foreground p-0 py-8 text-center">
              {t("SessionManagement.otherSessions.empty")}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session,
  isCurrentSession = false,
}: {
  session: Session;
  isCurrentSession?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  const [isPending, startTransition] = useTransition();

  function getBrowserInformation() {
    if (userAgentInfo == null)
      return t("SessionManagement.session.unknownDevice");
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return t("SessionManagement.session.unknownDevice");
    }

    if (userAgentInfo.browser.name == null) return userAgentInfo.os.name;
    if (userAgentInfo.os.name == null) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name}, ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function handleRevokeSession() {
    startTransition(async () => {
      await authClient.revokeSession(
        {
          token: session.token,
        },
        {
          onSuccess: () => {
            toast.success(t("SessionManagement.success.revokedSession"));
            router.refresh();
          },
          onError: () => {
            toast.error(t("Form.errors.generic"));
          },
        },
      );
    });
  }

  return (
    <Card className="rounded-md p-4 shadow-none">
      <CardHeader className="flex justify-between p-0">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && (
          <Badge>{t("SessionManagement.currentSession")}</Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-muted-foreground text-sm">
                {t("SessionManagement.session.created")}:{" "}
                {formatDate(session.createdAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                {t("SessionManagement.session.expires")}:{" "}
                {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <ConfirmActionDialog onSubmit={handleRevokeSession}>
              <Button variant="destructive" size="sm">
                {isPending ? <Spinner /> : <Trash2 />}
              </Button>
            </ConfirmActionDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
