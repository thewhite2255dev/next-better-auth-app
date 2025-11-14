export const SiteConfigEN = {
  title: "Degni Kit - Next.js Authentication Starter Kit",
  description:
    "Modern starter kit with complete authentication, i18n, and elegant UI. Created by Degni Beugre Israël.",
  features: [
    "🔐 Complete authentication (Email/Password, OAuth, 2FA)",
    "🌍 Multilingual (FR/EN) with next-intl",
    "🎨 Dark/Light mode",
    "⚡ Server-Side Rendering (SSR)",
    "🛡️ Enhanced security",
    "📱 Responsive design",
    "🚀 Production ready",
  ],
} as const;

export type SiteConfigEN = typeof SiteConfigEN;
