import { useRouter, usePathname } from "@/i18n/navigation";
import { useCallback } from "react";

export function useChangeLocale() {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [router, pathname],
  );

  return changeLocale;
}
