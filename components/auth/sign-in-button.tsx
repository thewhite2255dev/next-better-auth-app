"use client";

import { Link } from "@/i18n/navigation";
import { type ComponentProps } from "react";

interface SignInButtonProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
}

export function SignInButton({ children, ...props }: SignInButtonProps) {
  return (
    <Link {...props} href="/auth/sign-in">
      {children}
    </Link>
  );
}
