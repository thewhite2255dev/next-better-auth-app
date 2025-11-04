"use client";

import { Check, Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useChangeLocale } from "@/hooks/use-change-locale";

interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const changeLocale = useChangeLocale();

  const languages = [
    { code: "fr", name: t("fr") },
    { code: "en", name: t("en") },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className={className}>
          <Globe />
          <span className="sr-only">{t("srOnly")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLocale(language.code)}
          >
            <span className="mr-auto">{language.name}</span>
            <Check
              className={cn({
                "pointer-events-none opacity-0": locale !== language.code,
                "pointer-events-auto opacity-100": locale === language.code,
              })}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
