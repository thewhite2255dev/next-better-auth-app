"use client";

import { useTranslations } from "next-intl";
import { LayoutDashboard, type LucideProps, MessageCircle } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type dashboardNavItemType = {
  label: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const t = useTranslations("DashboardLayout");

  const { data: session } = authClient.useSession();

  const dashboardNavItems: dashboardNavItemType[] = [
    {
      label: t("dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("feedbacks"),
      href: "/dashboard/feedbacks",
      icon: MessageCircle,
    },
  ];

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col gap-6">
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/5 absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/5 blur-3xl [animation-delay:2s]" />
      </div>

      <div className="container flex flex-col gap-6 py-6 lg:flex-row">
        {session?.user.role === "ADMIN" && (
          <div className="flex flex-col gap-2 lg:w-64">
            {dashboardNavItems.map((item) => {
              const isActive = pathname.endsWith(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group relative flex h-9 items-center gap-3 overflow-hidden rounded-md px-4 py-2",
                    isActive
                      ? "text-foreground bg-linear-to-r from-blue-500/10 to-blue-600/10 ring-1 ring-blue-500/20"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {/* Icon with background */}
                  <div
                    className={cn(
                      "relative flex h-6 w-6 items-center justify-center rounded-md",
                      isActive
                        ? "bg-blue-500/20"
                        : "bg-muted/50 group-hover:bg-blue-500/10",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4",
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
                      "font-medium",
                      isActive
                        ? "text-foreground"
                        : "group-hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </span>

                  {/* Hover gradient effect */}
                  {!isActive && (
                    <div className="absolute inset-0 -z-10 rounded-md bg-linear-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
