"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Sparkles, LogIn } from "lucide-react";
import { SiteConfig } from "@/lib/site-config";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { navItemsType } from "./header";
import { UserButton } from "./user-button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_HOME_REDIRECT } from "@/lib/redirect-config";

interface MobileNavProps {
  navItems: navItemsType;
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations();
  const { data: session, isPending } = authClient.useSession();

  const isMobile = useIsMobile();

  return (
    <Sheet open={isMobile && open} onOpenChange={setOpen}>
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
        className="flex h-full w-[300px] flex-col sm:w-[350px]"
      >
        <SheetHeader className="py-4">
          <SheetTitle className="flex items-center gap-2" asChild>
            <Link
              href={DEFAULT_HOME_REDIRECT}
              className="group flex items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-all group-hover:shadow-xl group-hover:shadow-purple-500/50">
                <Sparkles className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-xl font-bold text-transparent">
                {SiteConfig.name}
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation Links */}
        {navItems.length > 0 && (
          <>
            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-muted-foreground hover:text-foreground hover:bg-accent flex items-center rounded-lg px-4 py-3 text-base font-medium transition-all",
                    pathname === item.href &&
                      "text-foreground bg-accent font-semibold",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* User Section */}
        <div className="mt-auto flex flex-col gap-4 px-4">
          {isPending ? (
            <Skeleton className="h-10 w-full rounded-lg" />
          ) : session?.user ? (
            <UserButton />
          ) : (
            <Button variant="default" size="lg" asChild className="w-full">
              <Link href="/auth/sign-in" onClick={() => setOpen(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                {t("Header.signInButton")}
              </Link>
            </Button>
          )}

          <div className="border-t-muted border-t p-4">
            <p className="text-muted-foreground text-center text-xs">
              © {new Date().getFullYear()} {SiteConfig.name}
            </p>
            <p className="text-muted-foreground text-center text-xs">
              Made with ❤️ by {SiteConfig.author.name}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
