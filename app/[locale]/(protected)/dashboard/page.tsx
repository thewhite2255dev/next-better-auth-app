import { Skeleton } from "@/components/ui/skeleton";
import { SignOut } from "@/components/auth/sign-out-button";
import {
  UserCircle,
  Mail,
  Calendar,
  Shield,
  Settings,
  Sliders,
  KeyRound,
  TrendingUp,
  Zap,
  LogOut,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Link } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import { generateAvatarFallback, getNamePart, maskEmail } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DashboardPage");

  return {
    title: t("dashboard"),
    description: t("welcome"),
  };
}

export default async function DashboardPage() {
  const t = await getTranslations("DashboardPage");
  const locale = await getLocale();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <main className="container min-h-screen py-6">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-64 rounded-lg" />
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </main>
    );
  }

  const createdAt = session.session.createdAt
    ? new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(session.session.createdAt))
    : "N/A";

  return (
    <>
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl [animation-delay:4s]" />
      </div>

      <main className="relative min-h-screen">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
                {t("dashboard")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("welcome")}, {session.user.name} 👋
              </p>
            </div>
            <SignOut className="w-max">
              <Button variant="outline" size="lg" className="group">
                <LogOut className="h-4 w-4" />
                {t("signOut")}
              </Button>
            </SignOut>
          </div>

          {/* Profile Card */}
          <Card className="border-primary/20 from-card to-card/50 overflow-hidden bg-linear-to-br transition-all">
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="border-primary/20 ring-primary/10 size-16 border-4 ring-4 lg:size-20">
                    <AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-linear-to-br text-2xl font-bold">
                      {generateAvatarFallback(session?.user.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-lg font-bold md:text-2xl">
                        {getNamePart(session.user.name, 1)}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="bg-linear-to-r from-emerald-500/10 to-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      >
                        {session?.user.role === "ADMIN" && t("administrator")}
                        {session?.user.role === "USER" && t("user")}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">
                        {maskEmail(session.user.email)}
                      </span>
                    </div>
                  </div>
                </div>
                <Link href="/settings/profile">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <Card className="group relative overflow-hidden border-blue-500/20 bg-linear-to-br from-blue-500/5 to-blue-600/5">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/20 blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("status.verified")}
                </CardTitle>
                <Shield className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">
                    {session.user.emailVerified
                      ? t("status.yes")
                      : t("status.no")}
                  </div>
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {t("status.securityEnhanced")}
                </p>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-purple-500/20 bg-linear-to-br from-purple-500/5 to-purple-600/5">
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-500/20 blur-2xl transition-all group-hover:scale-150" />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {t("status.memberSince")}
                </CardTitle>
                <Calendar className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent className="relative">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">
                    {new Intl.DateTimeFormat(locale, {
                      month: "short",
                      year: "numeric",
                    }).format(new Date(session.session.createdAt))}
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {createdAt}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="border-primary/20 from-card to-card/50 bg-linear-to-br">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-primary h-5 w-5" />
                {t("quickActions.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/settings/profile">
                  <Button
                    variant="outline"
                    className="hover:border-primary h-auto w-full flex-col gap-2 py-6"
                  >
                    <UserCircle className="h-6 w-6" />
                    <span className="font-semibold">
                      {t("quickActions.profile")}
                    </span>
                  </Button>
                </Link>
                <Link href="/settings/security">
                  <Button
                    variant="outline"
                    className="hover:border-primary h-auto w-full flex-col gap-2 py-6"
                  >
                    <Shield className="h-6 w-6" />
                    <span className="font-semibold">
                      {t("quickActions.security")}
                    </span>
                  </Button>
                </Link>
                <Link href="/settings/preferences">
                  <Button
                    variant="outline"
                    className="hover:border-primary h-auto w-full flex-col gap-2 py-6"
                  >
                    <Sliders className="h-6 w-6" />
                    <span className="font-semibold">
                      {t("quickActions.preferences")}
                    </span>
                  </Button>
                </Link>
                <Link href="/settings/sessions">
                  <Button
                    variant="outline"
                    className="hover:border-primary h-auto w-full flex-col gap-2 py-6"
                  >
                    <KeyRound className="h-6 w-6" />
                    <span className="font-semibold">
                      {t("quickActions.sessions")}
                    </span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
