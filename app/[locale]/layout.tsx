import "../globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getMessages } from "next-intl/server";
import { getSiteConfig } from "@/lib/site-config";
import { Providers } from "@/components/shared/providers";

const inter = localFont({
  src: "../fonts/InterVariable.woff2",
  variable: "--font-inter",
  weight: "100 900",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteConfig = getSiteConfig(locale);

  return {
    title: {
      template: `%s | ${siteConfig.siteName}`,
      default: siteConfig.title,
    },
    description: siteConfig.description,
    authors: [
      { name: siteConfig.author.name, url: siteConfig.author.githubUrl },
    ],
    keywords: [...siteConfig.keywords],
    creator: siteConfig.author.name,
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_US",
      alternateLocale: locale === "fr" ? ["en_US"] : ["fr_FR"],
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.siteName,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
      creator: `@${siteConfig.author.name.replace(/\s+/g, "")}`,
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
}

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
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body translate="no" className={`${inter.variable} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
