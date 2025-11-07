"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Monitor, Moon, Sun, Menu, Sparkles, LogIn } from "lucide-react";
import { SiteConfig } from "@/lib/site-config";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { navItemsType } from "./header";
import { UserButton } from "./user-button";
import { FeedbackDialog } from "./feedback-dialog";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale, useTranslations } from "next-intl";
import { useIsTablet } from "@/hooks/use-media-query";
import { DEFAULT_HOME_REDIRECT } from "@/lib/redirect-config";
import { useTheme } from "next-themes";
import { useChangeLocale } from "@/hooks/use-change-locale";

interface MobileNavProps {
  navItems: navItemsType;
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = useState<boolean>(false);
  const changeLocale = useChangeLocale();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const t = useTranslations();
  const isTablet = useIsTablet();

  const { data: session, isPending } = authClient.useSession();

  const [mounted, setMounted] = useState<boolean>(false);

  const languages = [
    { code: "fr", name: t("LanguageSwitcher.fr") },
    { code: "en", name: t("LanguageSwitcher.en") },
  ];

  const themes = [
    { value: "system", label: t("ThemeSwitcher.system"), icon: Monitor },
    { value: "light", label: t("ThemeSwitcher.light"), icon: Sun },
    { value: "dark", label: t("ThemeSwitcher.dark"), icon: Moon },
  ];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Sheet open={isTablet && open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          aria-label="Menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full w-[300px] flex-col overflow-y-auto sm:w-[350px]"
      >
        <SheetHeader className="py-4">
          <SheetTitle className="flex items-center gap-2" asChild>
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
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        {navItems.length > 0 && (
          <nav className="mt-6 flex flex-col gap-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-2 py-3 text-base font-medium transition-all",
                  {
                    "text-foreground bg-accent font-semibold":
                      pathname === item.href,
                  },
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="flex flex-col gap-4 px-4">
          <FeedbackDialog />

          <div className="flex items-center justify-between">
            <Label>{t("SettingsPreferencesPage.theme")}</Label>
            <Select value={theme ?? undefined} onValueChange={setTheme}>
              <SelectTrigger className="w-36">
                <SelectValue
                  placeholder={t(
                    "SettingsPreferencesPage.placeholders.selectTheme",
                  )}
                />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectGroup>
                  {themes.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("SettingsPreferencesPage.language")}</Label>
            <Select defaultValue={locale} onValueChange={changeLocale}>
              <SelectTrigger className="w-36">
                <SelectValue
                  placeholder={t(
                    "SettingsPreferencesPage.placeholders.selectLanguage",
                  )}
                />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectGroup>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* User Section */}
        <div className="mt-auto flex flex-col gap-4 px-4">
          {isPending ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : session?.user ? (
            <UserButton />
          ) : (
            <Button
              variant="default"
              size="lg"
              asChild
              className="w-full justify-start"
            >
              <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                <LogIn className="h-4 w-4" />
                {t("Header.signInButton")}
              </Link>
            </Button>
          )}

          <div className="text-muted-foreground border-t p-4 text-center text-sm">
            <p className="mb-2">
              {t("Home.footer.builtWith")}{" "}
              <a
                href={SiteConfig.author.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground font-medium"
              >
                {SiteConfig.author.name}
              </a>{" "}
              {t("Home.footer.openSourceCommunity")}
            </p>
            <p>
              {t("Home.footer.licensedUnder")} · {new Date().getFullYear()}{" "}
              {SiteConfig.name}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
