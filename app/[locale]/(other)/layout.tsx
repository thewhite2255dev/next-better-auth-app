"use client";

import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Link } from "@/i18n/navigation";
import { DEFAULT_HOME_REDIRECT } from "@/lib/redirect-config";
import { getSiteConfig } from "@/lib/site-config";
import { Sparkles } from "lucide-react";
import { useLocale } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const siteConfig = getSiteConfig(locale);
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-purple-400/20 blur-3xl [animation-delay:2s] dark:bg-purple-600/20" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl [animation-delay:4s] dark:bg-pink-600/20" />
      </div>

      <header className="bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={DEFAULT_HOME_REDIRECT}
              className="group flex items-center gap-2"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-linear-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20" />
              </div>
              <span className="bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                {siteConfig.siteName}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <div className="container my-auto py-6">{children}</div>
    </div>
  );
}
