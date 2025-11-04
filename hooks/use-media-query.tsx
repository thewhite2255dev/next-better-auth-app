import * as React from "react";

/**
 * Tailwind CSS breakpoints
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

/**
 * Generic hook for media queries
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handleChange = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    handleChange();

    // Listen for changes
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return !!matches;
}

/**
 * Hook to detect mobile devices (< 768px / md breakpoint)
 * @returns true if viewport width is less than 768px
 */
export function useIsMobile() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.md - 1}px)`);
}

/**
 * Hook to detect tablet devices (< 1024px / lg breakpoint)
 * @returns true if viewport width is less than 1024px
 */
export function useIsTablet() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.lg - 1}px)`);
}

/**
 * Hook to detect desktop devices (>= 1024px / lg breakpoint)
 * @returns true if viewport width is 1024px or more
 */
export function useIsDesktop() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.xl - 1}px)`);
}

/**
 * Hook to detect large desktop devices (>= 1280px / xl breakpoint)
 * @returns true if viewport width is 1280px or more
 */
export function useIsLargeDesktop() {
  return useMediaQuery(`(max-width: ${BREAKPOINTS["2xl"] - 1}px)`);
}

/**
 * Hook to detect extra large desktop devices (>= 1536px / 2xl breakpoint)
 * @returns true if viewport width is 1536px or more
 */
export function useIsExtraLargeDesktop() {
  return useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);
}

/**
 * Hook to detect if viewport matches a specific breakpoint
 * @param breakpoint - The breakpoint to check ('sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @returns true if viewport width is at or above the breakpoint
 */
export function useBreakpoint(breakpoint: keyof typeof BREAKPOINTS) {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
}

/**
 * Hook to get the current breakpoint name
 * @returns The current breakpoint name or 'xs' if below sm
 */
export function useCurrentBreakpoint(): "xs" | keyof typeof BREAKPOINTS {
  const is2xl = useBreakpoint("2xl");
  const isXl = useBreakpoint("xl");
  const isLg = useBreakpoint("lg");
  const isMd = useBreakpoint("md");
  const isSm = useBreakpoint("sm");

  if (is2xl) return "2xl";
  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return "xs";
}
