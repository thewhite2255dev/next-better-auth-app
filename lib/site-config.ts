import { SiteConfigFR } from "./site-config.fr";
import { SiteConfigEN } from "./site-config.en";

// Constantes communes (ne changent pas selon la langue)
export const SiteConfigCommon = {
  siteName: "Degni Kit",
  url: "https://degni-kit.vercel.app",
  author: {
    name: "Degni Beugre Israël",
    githubUrl: "https://github.com/Thewhite2255dev",
  },
  links: {
    github: "https://github.com/Thewhite2255dev/degni-kit",
  },
  keywords: [
    // Branding
    "Degni Kit",
    "Degni Beugre Israël",
    "Thewhite2255",

    // Technologies principales
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "Better Auth",

    // Features
    "Authentication Starter Kit",
    "Next.js Authentication",
    "Two-Factor Authentication",
    "OAuth Integration",
    "Internationalization",
    "i18n Next.js",
    "Dark Mode",
    "Theme Switcher",

    // Use cases
    "Starter Template",
    "Boilerplate",
    "SaaS Starter",
    "Full Stack Template",

    // SEO
    "Modern Web App",
    "Responsive Design",
    "Server Components",
    "App Router",
    "Frontend Developer",
    "Web Development",
    "React Developer",
    "UI/UX",
    "Vercel Deployment",
    "Production Ready",
  ],
} as const;

// Helper pour obtenir la config selon la locale
export function getSiteConfig(locale: string = "fr") {
  const localeConfig = locale === "en" ? SiteConfigEN : SiteConfigFR;

  return {
    ...SiteConfigCommon,
    ...localeConfig,
  };
}

// Config par défaut (FR)
export const SiteConfig = getSiteConfig("fr");

export type SiteConfig = ReturnType<typeof getSiteConfig>;
