"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { FeedbackDialog } from "./feedback-dialog";
import { SiteConfig } from "@/lib/site-config";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogIn, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { UserButton } from "./user-button";
import { Skeleton } from "../ui/skeleton";
import { DEFAULT_HOME_REDIRECT } from "@/lib/redirect-config";
import { MobileNav } from "./mobile-nav";

export type navItemsType = {
  label: string;
  href: string;
}[];

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const navItems: navItemsType = [];

  return (
    <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link
            href={DEFAULT_HOME_REDIRECT}
            className="group flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br from-blue-500 to-purple-600 shadow-lg transition-all group-hover:shadow-xl group-hover:shadow-purple-500/50">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
              {SiteConfig.name}
            </span>
          </Link>
        </div>
        <nav className="hidden gap-6 font-medium lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-foreground/70 hover:text-foreground transition-colors",
                pathname === item.href && "text-foreground font-semibold",
              )}
              data-prevent-nprogress={true}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <FeedbackDialog />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          {isPending ? (
            <Skeleton className="flex size-8 shrink-0 overflow-hidden rounded-md" />
          ) : session?.user ? (
            <UserButton />
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link href="/auth/sign-in">
                <LogIn className="h-4 w-4" />
                {t("signInButton")}
              </Link>
            </Button>
          )}
        </div>
        <MobileNav navItems={navItems} />
      </div>
    </header>
  );
}
