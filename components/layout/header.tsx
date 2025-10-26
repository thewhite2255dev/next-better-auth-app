"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { SiteConfig } from "@/lib/site-config";
import { useSession } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { useTranslations } from "next-intl";
import { UserButton } from "./user-button";
import { Skeleton } from "../ui/skeleton";

export type navItemsType = {
  label: string;
  href: string;
}[];

export function Header() {
  const t = useTranslations("Header");
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  const navItems: navItemsType = [];

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/">
          <span className="text-foreground font-semibold">
            {SiteConfig.title}
          </span>
        </Link>
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
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />

            {isPending ? (
              <Skeleton className="flex size-8 shrink-0 overflow-hidden rounded-md" />
            ) : session?.user ? (
              <UserButton {...session.user} />
            ) : (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("signInButton")}
                </Link>
              </Button>
            )}
          </div>

          {/* <div className="hidden items-center gap-2 sm:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
            {!session?.user && !isPending && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/sign-in">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("signInButton")}
                </Link>
              </Button>
            )}
            {isPending ? (
              <Skeleton className="flex size-8 shrink-0 overflow-hidden rounded-md" />
            ) : (
              session?.user && <UserButton {...session?.user} />
            )}
          </div> */}
        </div>
      </div>
    </header>
  );
}
