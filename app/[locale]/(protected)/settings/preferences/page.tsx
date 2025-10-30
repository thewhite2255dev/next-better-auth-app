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
// no client-only mount guards needed; we suppress hydration where necessary

export default function SettingsPreferencesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const t = useTranslations();

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

  // Note: theme comes from next-themes and resolves on client; we suppress hydration where needed.

  return (
    <div className="flex flex-col gap-6">
      <Header
        title={t("SettingsPreferences.title")}
        description={t("SettingsPreferences.description")}
      />
      <div
        className="flex items-center justify-between"
        suppressHydrationWarning
      >
        <Label>Thème</Label>
        <Select value={theme ?? undefined} onValueChange={setTheme}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sélectionner un thème" />
          </SelectTrigger>
          <SelectContent side="bottom">
            <SelectGroup>
              {themes.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label>Langue</Label>
        <Select defaultValue={locale} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sélectionner une langue" />
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
  );
}
