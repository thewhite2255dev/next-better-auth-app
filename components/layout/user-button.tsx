"use client";

import { LogOut, Settings, User } from "lucide-react";

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
import { generateAvatarFallback } from "@/lib/user-utils";
import { useTranslations } from "next-intl";
import { SignOut } from "../auth/sign-out-button";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";

export function UserButton() {
  const t = useTranslations("UserButton");

  const { data: session } = authClient.useSession();

  const userFallback = generateAvatarFallback(session?.user.name as string);

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
                {session?.user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>
              <User />
              {t("profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={"/settings/profile"}>
              <Settings />
              {t("settings")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SignOut className="hover:bg-accent">
            <LogOut />
            {t("SignOut")}
          </SignOut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
