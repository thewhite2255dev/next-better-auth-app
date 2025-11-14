"use client";

import { useTranslations } from "next-intl";
import {
  Settings,
  type LucideProps,
  KeyRound,
  Shield,
  Sliders,
  User,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

type settingsNavItemType = {
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const t = useTranslations("SettingsLayout");

  const settingsNavItems: settingsNavItemType[] = [
    {
      label: t("profile"),
      href: "/settings/profile",
      icon: User,
    },
    {
      label: t("security"),
      href: "/settings/security",
      icon: Shield,
    },
    {
      label: t("preferences"),
      href: "/settings/preferences",
      icon: Sliders,
    },
    {
      label: t("account"),
      href: "/settings/account",
      icon: Settings,
    },
    {
      label: t("sessions"),
      href: "/settings/sessions",
      icon: KeyRound,
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col pt-6">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl [animation-delay:2s]" />
      </div>

      <div className="container">
        <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-lg">{t("description")}</p>
        <Separator className="mt-2" />
      </div>

      <div className="container flex flex-col gap-6 py-6 lg:flex-row">
        <div className="flex flex-col gap-2 lg:w-64">
          {settingsNavItems.map((item) => {
            const isActive = pathname.endsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "group relative flex h-9 items-center gap-3 overflow-hidden rounded-md px-4 py-2 transition-all duration-200",
                  isActive
                    ? "text-foreground bg-linear-to-r from-blue-500/10 to-blue-600/10 ring-1 ring-blue-500/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {/* Icon with background */}
                <div
                  className={cn(
                    "relative flex h-6 w-6 items-center justify-center rounded-md transition-all duration-200",
                    isActive
                      ? "bg-blue-500/20"
                      : "bg-muted/50 group-hover:bg-blue-500/10",
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-4 w-4 transition-all duration-200",
                      isActive
                        ? "text-blue-500"
                        : "text-muted-foreground group-hover:text-blue-500",
                    )}
                  />
                  {isActive && (
                    <div className="absolute inset-0 animate-pulse rounded-md bg-blue-500/20 blur-sm" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "font-medium transition-all duration-200",
                    isActive
                      ? "text-foreground"
                      : "group-hover:text-foreground",
                  )}
                >
                  {item.label}
                </span>

                {/* Hover gradient effect */}
                {!isActive && (
                  <div className="absolute inset-0 -z-10 rounded-md bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
