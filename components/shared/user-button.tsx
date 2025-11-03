"use client";

import {
  LogOut,
  Settings,
  ChevronsUpDown,
  LayoutDashboard,
  Check,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { generateAvatarFallback, maskEmail, cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { SignOut } from "../auth/sign-out-button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

export function UserButton() {
  const t = useTranslations();
  const { data: session } = authClient.useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();

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

  const userFallback = generateAvatarFallback(session?.user.name ?? "");

  if (isMobile) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "data-[state=open]:bg-accent h-auto w-full justify-start gap-2 px-3 py-2",
            )}
          >
            <Avatar className="h-10 w-10 rounded-md select-none">
              <AvatarImage src={session?.user.image as string} />
              <AvatarFallback className="rounded-md">
                {userFallback}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-1 items-center">
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="center"
          className="w-[calc(300px-32px)] sm:w-[calc(350px-32px)]"
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-md">
                <AvatarImage
                  src={session?.user.image as string}
                  alt={session?.user.name}
                />
                <AvatarFallback className="rounded-md">
                  {userFallback}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.user.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {maskEmail(session?.user.email ?? "")}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={"/dashboard"}>
                <LayoutDashboard />
                {t("UserButton.dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={"/settings/profile"}>
                <Settings />
                {t("UserButton.settings")}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-sm font-medium">
              <span>{t("UserButton.items.preferences.title")}</span>
            </DropdownMenuLabel>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>{t("UserButton.items.preferences.theme.label")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {themes.map(({ value, label, icon: Icon }) => (
                  <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
                    <Icon className="h-4 w-4" />
                    <span className="mr-auto">{label}</span>
                    <Check
                      className={cn({
                        "pointer-events-none opacity-0": theme !== value,
                        "pointer-events-auto opacity-100": theme === value,
                      })}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>{t("UserButton.items.preferences.language.label")}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40">
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                  >
                    <span className="mr-auto">{language.name}</span>
                    <Check
                      className={cn({
                        "pointer-events-none opacity-0":
                          locale !== language.code,
                        "pointer-events-auto opacity-100":
                          locale === language.code,
                      })}
                    />
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <SignOut className="hover:bg-accent">
              <LogOut />
              {t("UserButton.SignOut")}
            </SignOut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-md select-none">
          <AvatarImage src={session?.user.image as string} />
          <AvatarFallback className="rounded-md">{userFallback}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="rounded-md">
              <AvatarImage
                src={session?.user.image as string}
                alt={session?.user.name}
              />
              <AvatarFallback className="rounded-md">
                {userFallback}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{session?.user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {maskEmail(session?.user.email ?? "")}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/dashboard"}>
              <LayoutDashboard />
              {t("UserButton.dashboard")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings/profile"}>
              <Settings />
              {t("UserButton.settings")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut className="hover:bg-accent">
            <LogOut />
            {t("UserButton.SignOut")}
          </SignOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
