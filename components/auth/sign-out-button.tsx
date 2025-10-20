"use client";

import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface SignOutProps {
  children: React.ReactNode;
  redirectTo?: string;
  className?: string;
}

export function SignOut({
  children,
  className,
  redirectTo = "/",
}: SignOutProps) {
  const router = useRouter();

  const handleClick = () => {
    signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(redirectTo);
        },
      },
    });
  };

  return (
    <span onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
