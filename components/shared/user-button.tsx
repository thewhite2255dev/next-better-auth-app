"use client";

import {
  LogOut,
  Settings,
  ChevronsUpDown,
  LayoutDashboard,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { generateAvatarFallback, maskEmail, cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { SignOut } from "../auth/sign-out-button";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { useIsTablet } from "@/hooks/use-media-query";
import { type ComponentProps } from "react";

interface UserButtonProps extends ComponentProps<typeof Button> {
  className?: string;
  closeMobileNav?: () => void;
}

export function UserButton({
  closeMobileNav,
  className,
  ...props
}: UserButtonProps) {
  const t = useTranslations();
  const { data: session } = authClient.useSession();
  const isTablet = useIsTablet();

  const userFallback = generateAvatarFallback(session?.user.name ?? "");

  if (isTablet) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            {...props}
            variant="ghost"
            className={cn(
              "data-[state=open]:bg-accent h-auto w-full justify-start gap-2 px-3 py-2",
              className,
            )}
          >
            <Avatar className="h-8 w-8 rounded-md select-none">
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
            <DropdownMenuItem asChild onClick={closeMobileNav}>
              <Link href={"/dashboard"}>
                <LayoutDashboard />
                {t("UserButton.dashboard")}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onClick={closeMobileNav}>
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
