"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import type { Session } from "better-auth";
import { Monitor, Smartphone, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { UAParser } from "ua-parser-js";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

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
          toast.success("Vous avez été déconnecté de tous les appareils.");
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
          <h3 className="text-lg font-medium">Other active sessions</h3>
          {otherSessions.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeOtherSessions}
            >
              {isPending ? <Spinner /> : "Revoke other sessions"}
            </Button>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="text-muted-foreground py-8 text-center">
              No other active sessions
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
    if (userAgentInfo == null) return "Unknown Device";
    if (userAgentInfo.browser.name == null && userAgentInfo.os.name == null) {
      return "Unknown Device";
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
            toast.success("Cette session a été déconnectée avec succès.");
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
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>{getBrowserInformation()}</CardTitle>
        {isCurrentSession && <Badge>Current session</Badge>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {userAgentInfo?.device.type === "mobile" ? (
              <Smartphone />
            ) : (
              <Monitor />
            )}
            <div>
              <p className="text-muted-foreground text-sm">
                Created: {formatDate(session.createdAt)}
              </p>
              <p className="text-muted-foreground text-sm">
                Expires: {formatDate(session.expiresAt)}
              </p>
            </div>
          </div>
          {!isCurrentSession && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRevokeSession}
            >
              {isPending ? <Spinner /> : <Trash2 />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
