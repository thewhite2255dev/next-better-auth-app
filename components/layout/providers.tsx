"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ProgressProvider } from "@bprogress/next/app";
import { Toaster } from "../ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface providersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: providersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Toaster position="top-center" richColors />
      <ProgressProvider options={{ showSpinner: false }} shallowRouting>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </ProgressProvider>
    </NextThemesProvider>
  );
}
