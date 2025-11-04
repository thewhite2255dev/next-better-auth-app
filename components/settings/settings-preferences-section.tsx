"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { SettingsHeader } from "./settings-header";
import { Skeleton } from "../ui/skeleton";
import { useChangeLocale } from "@/hooks/use-change-locale";

export function SettingsPreferencesSection() {
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  const changeLocale = useChangeLocale();
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
    return (
      <div className="flex flex-col gap-6">
        <SettingsHeader
          title={t("SettingsPreferencesPage.title")}
          description={t("SettingsPreferencesPage.description")}
        />
        <Card className="rounded-md p-4 shadow-none">
          <CardContent className="flex flex-col gap-4 p-0">
            <div className="flex items-center justify-between">
              <Label>{t("SettingsPreferencesPage.theme")}</Label>
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <Label>{t("SettingsPreferencesPage.language")}</Label>
              <Skeleton className="h-9 w-36 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader
        title={t("SettingsPreferencesPage.title")}
        description={t("SettingsPreferencesPage.description")}
      />
      <Card className="rounded-md p-4 shadow-none">
        <CardContent className="flex flex-col gap-4 p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}
