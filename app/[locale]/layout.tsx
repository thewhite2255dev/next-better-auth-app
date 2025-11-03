import "../globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { SiteConfig } from "@/lib/site-config";
import { Providers } from "@/components/shared/providers";

const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${SiteConfig.name}`,
    default: SiteConfig.title,
  },
  description: SiteConfig.description,
  authors: [{ name: SiteConfig.author.name, url: SiteConfig.author.githubUrl }],
  keywords: [...SiteConfig.keywords],
  creator: SiteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: SiteConfig.url,
    title: SiteConfig.title,
    description: SiteConfig.description,
    siteName: SiteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SiteConfig.title,
    description: SiteConfig.description,
    creator: `@${SiteConfig.author.name.replace(/\s+/g, "")}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body translate="no" className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
