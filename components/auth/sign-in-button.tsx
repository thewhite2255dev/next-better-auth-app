"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SignInButtonProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function SignInButton({ children, className }: SignInButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/auth/sign-in");
  };

  return (
    <span onClick={handleClick} className={cn("cursor-pointer", className)}>
      {children}
    </span>
  );
}
