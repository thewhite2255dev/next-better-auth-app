"use client";

import { useTranslations } from "next-intl";
import {
  Settings,
  User,
  type LucideProps,
  KeyRound,
  Shield,
  Sliders,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

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
    <div className="container py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex flex-col lg:w-64">
          {settingsNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "text-muted-foreground group hover:bg-accent relative flex h-9 items-center truncate rounded-md px-4 py-2",
                { "bg-accent": pathname.endsWith(item.href) },
              )}
            >
              <div
                className={cn(
                  "absolute top-1/2 left-0 h-4.5 w-1 -translate-y-1/2 rounded-full group-hover:bg-blue-500",
                  { "bg-blue-500": pathname.endsWith(item.href) },
                )}
              ></div>
              <div
                className={cn("flex items-center gap-2", {
                  "text-foreground font-medium": pathname.endsWith(item.href),
                })}
              >
                <item.icon
                  className={cn("size-4", {
                    "text-blue-500": pathname.endsWith(item.href),
                  })}
                />
                {item.label}
              </div>
            </Link>
          ))}
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
