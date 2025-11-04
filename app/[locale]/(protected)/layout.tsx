"use client";

import { Header } from "@/components/shared/header";
import { ScrollToTop } from "@/components/shared/scroll-to-top";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <ScrollToTop />
    </div>
  );
}
