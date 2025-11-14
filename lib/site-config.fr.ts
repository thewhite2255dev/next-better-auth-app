export const SiteConfigFR = {
  title: "Degni Kit - Starter Kit d'Authentification Next.js",
  description:
    "Kit de démarrage moderne avec authentification complète, i18n, et UI élégante. Créé par Degni Beugre Israël.",
  features: [
    "🔐 Authentification complète (Email/Password, OAuth, 2FA)",
    "🌍 Multilingue (FR/EN) avec next-intl",
    "🎨 Mode sombre/clair",
    "⚡ Server-Side Rendering (SSR)",
    "🛡️ Sécurité renforcée",
    "📱 Design responsive",
    "🚀 Prêt pour la production",
  ],
} as const;

export type SiteConfigFR = typeof SiteConfigFR;
