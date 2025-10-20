"use client";

import { useRouter } from "@/i18n/navigation";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface LogoutButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  redirectTo?: string;
}

export function LogoutButton({
  children,
  className,
  redirectTo = "/",
}: LogoutButtonProps) {
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
