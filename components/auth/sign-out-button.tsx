"use client";

import { useRouter } from "@/i18n/navigation";
import { DEFAULT_SIGN_OUT_REDIRECT } from "@/lib/redirect-config";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

interface SignOutProps {
  children: React.ReactNode;
  redirectTo?: string;
  className?: string;
}

export function SignOut({
  children,
  className,
  redirectTo = DEFAULT_SIGN_OUT_REDIRECT,
}: SignOutProps) {
  const router = useRouter();

  function handleClick() {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(redirectTo);
        },
      },
    });
  }

  return (
    <span onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
