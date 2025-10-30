"use client";

import { useSession } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { SignOut } from "@/components/auth/sign-out-button";
import { UserCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const t = useTranslations("DashboardPage");
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <main className="mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6">
        <Skeleton className="h-8 w-48 rounded-md" />
        <Skeleton className="h-6 w-64 rounded-md" />
        <Skeleton className="h-6 w-56 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </main>
    );
  }

  if (!session?.user) {
    return <p className="mt-8 text-center">Redirecting...</p>;
  }

  const { user } = session;

  return (
    <main className="text-foreground mx-auto flex h-screen max-w-md flex-col items-center justify-center space-y-4 p-6">
      <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
      <UserCircle className="size-6" />
      <p>
        {t("welcome")}, {user.name} !
      </p>
      <p>
        {t("email")} : {user.email}
      </p>
      <SignOut>
        <Button variant="outline">{t("signOut")}</Button>
      </SignOut>
    </main>
  );
}
