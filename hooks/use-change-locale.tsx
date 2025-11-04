import { useRouter, usePathname } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useCallback } from "react";

/**
 * Hook to handle language/locale changes
 * @returns A function to change the current locale
 */
export function useChangeLocale() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const changeLocale = useCallback(
    (newLocale: string) => {
      if (newLocale !== currentLocale) {
        router.replace(pathname, { locale: newLocale });
      }
    },
    [router, pathname],
  );

  return changeLocale;
}
