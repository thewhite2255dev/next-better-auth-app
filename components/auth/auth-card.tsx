"use client";

import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LanguageSwitcher } from "../shared/language-switcher";
import { ThemeSwitcher } from "../shared/theme-switcher";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { DEFAULT_HOME_REDIRECT } from "@/lib/redirect-config";
import { SiteConfig } from "@/lib/site-config";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className = "",
}: AuthCardProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {/* Animated Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-600/20" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-purple-400/20 blur-3xl [animation-delay:2s] dark:bg-purple-600/20" />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 animate-pulse rounded-full bg-pink-400/20 blur-3xl [animation-delay:4s] dark:bg-pink-600/20" />
      </div>

      <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
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
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Card className={`mx-auto w-full max-w-md ${className}`}>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
          {footer && (
            <CardFooter className="flex justify-center">{footer}</CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
