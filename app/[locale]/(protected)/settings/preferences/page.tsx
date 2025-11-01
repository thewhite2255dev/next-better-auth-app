"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { Header } from "../_components/header";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function SettingsPreferencesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

  const [isClient, setIsClient] = useState<boolean>(false);

  const languages = [
    { code: "fr", name: t("LanguageSwitcher.fr") },
    { code: "en", name: t("LanguageSwitcher.en") },
  ];

  const themes = [
    { value: "system", label: t("ThemeSwitcher.system"), icon: Monitor },
    { value: "light", label: t("ThemeSwitcher.light"), icon: Sun },
    { value: "dark", label: t("ThemeSwitcher.dark"), icon: Moon },
  ];

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <Header
        title={t("SettingsPreferencesPage.title")}
        description={t("SettingsPreferencesPage.description")}
      />
      {!isClient ? null : (
        <>
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
                      {option.icon && <option.icon className="h-4 w-4" />}{" "}
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label>{t("SettingsPreferencesPage.language")}</Label>
            <Select defaultValue={locale} onValueChange={handleLanguageChange}>
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
        </>
      )}
    </div>
  );
}
