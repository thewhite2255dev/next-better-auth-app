export const SiteConfig = {
  name: "Degni Kit",
  title: "Degni Kit - Starter Kit d'Authentification Next.js",
  description:
    "Kit de démarrage moderne avec authentification complète, i18n, et UI élégante. Créé par Degni Beugre Israël.",
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

export type SiteConfig = typeof SiteConfig;
