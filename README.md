# 🚀 Degni Kit

**Starter Kit d'Authentification Next.js** - Un template moderne et complet pour démarrer rapidement vos projets avec une authentification robuste.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.3-purple?style=flat-square)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.2-61dafb?style=flat-square&logo=react)](https://react.dev/)

---

## ✨ Fonctionnalités

- 🔐 **Authentification complète** - Inscription, connexion, réinitialisation de mot de passe
- 🛡️ **Sécurité avancée** - 2FA/TOTP, vérification d'email, gestion des sessions
- 🌍 **Internationalisation** - Support multilingue (FR/EN) avec next-intl
- 🎨 **UI moderne** - Design épuré avec Tailwind CSS et shadcn/ui
- 📱 **Responsive** - Interface adaptée à tous les écrans
- 🌓 **Mode sombre** - Thème clair/sombre avec transition fluide
- ⚡ **Performance** - SSR, Turbopack, optimisations et meilleures pratiques Next.js 16
- 🔄 **Gestion des sessions** - Visualisation et révocation des sessions actives
- 💬 **Système de feedback** - Collection et gestion des retours utilisateurs
- 👨‍💼 **Panel administrateur** - Gestion des feedbacks avec filtres et actions

---

## 🛠️ Technologies

### Core

- **[Next.js 16](https://nextjs.org/)** - Framework React avec App Router et Turbopack
- **[React 19.2](https://react.dev/)** - Bibliothèque UI avec nouvelles fonctionnalités
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Typage statique
- **[Better Auth 1.3](https://better-auth.com/)** - Solution d'authentification moderne

### Styling & UI

- **[Tailwind CSS v4.1](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI réutilisables (Radix UI)
- **[Lucide React 0.552](https://lucide.dev/)** - Icônes modernes
- **[next-themes 0.4](https://github.com/pacocoursey/next-themes)** - Gestion du thème

### Database & Backend

- **[Prisma 6.18](https://www.prisma.io/)** - ORM TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Base de données (recommandé)

### Forms & Validation

- **[React Hook Form 7.66](https://react-hook-form.com/)** - Gestion des formulaires
- **[Zod 4.1](https://zod.dev/)** - Validation de schémas

### Internationalization

- **[next-intl 4.4](https://next-intl-docs.vercel.app/)** - i18n pour Next.js

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+ et pnpm
- PostgreSQL ou base de données compatible

### Installation

1. **Cloner le projet**

```bash
git clone https://github.com/thewhite2255dev/degni-kit.git
cd degni-kit
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configurer les variables d'environnement**

```bash
cp .env.example .env
```

Remplir le fichier `.env` :

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DB-NAME?schema=public"

# App
BETTER_AUTH_URL=""

# Better-Auth
# macOS openssl rand -base64 32
# Windows can use https://generate-secret.vercel.app/32
BETTER_AUTH_SECRET=""

# Oauth
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Nodemailer SMTP (for verification / reset)
SMTP_PORT="587"
SMTP_SECURE="true"

SMTP_HOST=""
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="Your App <noreply@yourdomain.com>"
```

4. **Initialiser la base de données**

```bash
pnpm prisma db push
pnpm prisma generate
```

5. **Lancer le serveur de développement**

```bash
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 📁 Structure du projet

```
degni-kit/
├── app/                          # App Router Next.js
│   ├── [locale]/                 # Routes internationalisées
│   │   ├── (protected)/          # Routes protégées (auth requise)
│   │   │   ├── dashboard/        # Dashboard utilisateur
│   │   │   └── settings/         # Paramètres du compte
│   │   ├── (public)/             # Routes publiques
│   │   │   └── page.tsx          # Page d'accueil
│   │   └── (other)/              # Routes avec layout alternatif (auth, reset, verify)
│   │       ├── auth/             # Pages d'authentification
│   │       ├── reset-password/   # Réinitialisation de mot de passe
│   │       └── verify-email/     # Vérification d'email
│   └── api/                      # API Routes
│       └── auth/                 # Endpoints Better Auth
├── actions/                      # Server Actions
│   ├── admin/                    # Actions administrateur
│   ├── auth/                     # Actions d'authentification
│   ├── settings/                 # Actions de paramètres
│   └── feedback.ts               # Actions de feedback
├── components/                   # Composants React
│   ├── admin/                    # Composants administrateur
│   ├── auth/                     # Composants d'authentification
│   ├── react-email/              # Templates d'email
│   ├── settings/                 # Composants de paramètres
│   ├── shared/                   # Composants partagés
│   └── ui/                       # shadcn/ui components
├── lib/                          # Utilitaires et configurations
│   ├── auth.ts                   # Configuration Better Auth
│   ├── auth-client.ts            # Client d'authentification
│   ├── prisma.ts                 # Client Prisma
│   └── site-config.ts            # Configuration du site
├── messages/                     # Fichiers de traduction
│   ├── en.json                   # Traductions anglaises
│   └── fr.json                   # Traductions françaises
├── prisma/                       # Schema et migrations
│   └── schema.prisma             # Modèles de données
├── schemas/                      # Schémas de validation Zod
│   ├── auth.ts                   # Schémas d'authentification
│   └── settings.ts               # Schémas de paramètres
└── types/                        # Types TypeScript
```

---

## 🔐 Fonctionnalités d'authentification

### Inscription & Connexion

- ✅ Inscription avec email et mot de passe
- ✅ Connexion sécurisée
- ✅ Vérification d'email obligatoire
- ✅ Réinitialisation de mot de passe

### Sécurité avancée

- ✅ Authentification à deux facteurs (2FA/TOTP)
- ✅ Gestion des sessions multiples
- ✅ Révocation de sessions
- ✅ Hachage sécurisé des mots de passe
- ✅ Tokens d'expiration

### Gestion du compte

- ✅ Modification du profil
- ✅ Changement de mot de passe
- ✅ Configuration de 2FA
- ✅ Gestion des préférences
- ✅ Suppression du compte

### Fonctionnalités additionnelles

- ✅ Système de feedback utilisateur
- ✅ Panel administrateur pour gérer les feedbacks
- ✅ Filtres et recherche avancée
- ✅ Envoi d'emails de notification
- ✅ Navigation responsive avec menu mobile

---

## 🌍 Internationalisation

Le projet supporte plusieurs langues grâce à `next-intl` :

- 🇫🇷 Français (par défaut)
- 🇬🇧 English

### Ajouter une nouvelle langue

1. Créer un fichier de traduction dans `messages/` (ex: `de.json`)
2. Ajouter la locale dans `i18n/routing.ts` :

```typescript
export const routing = defineRouting({
  locales: ["fr", "en", "de"],
  defaultLocale: "fr",
});
```

---

## 🎨 Personnalisation

### Thème et couleurs

Modifier les couleurs dans `app/globals.css` :

```css
@theme {
  --color-primary: /* votre couleur */;
  /* ... autres variables */
}
```

### Configuration du site

Le projet utilise un système de configuration modulaire en trois fichiers :

#### 📁 Structure des fichiers

- **`lib/site-config.ts`** - Configuration principale et constantes communes
- **`lib/site-config.fr.ts`** - Traductions françaises
- **`lib/site-config.en.ts`** - Traductions anglaises

#### 🔧 Configuration commune (`site-config.ts`)

Modifiez les constantes qui ne changent pas selon la langue :

```typescript
export const SiteConfigCommon = {
  siteName: "Votre App",          // Nom de l'application
  url: "https://votreapp.com",     // URL de production
  author: {
    name: "Votre Nom",
    githubUrl: "https://github.com/votre-profil",
  },
  links: {
    github: "https://github.com/votre-profil/votre-repo",
  },
  keywords: [
    // Ajoutez vos mots-clés pour le SEO
    "Votre App",
    "Next.js",
    // ...
  ],
};
```

#### 🇫🇷 Configuration française (`site-config.fr.ts`)

Personnalisez le contenu en français :

```typescript
export const SiteConfigFR = {
  title: "Votre App - Titre SEO en français",
  description: "Description de votre application en français",
  features: [
    "🔐 Fonctionnalité 1",
    "🌍 Fonctionnalité 2",
    // ...
  ],
};
```

#### 🇬🇧 Configuration anglaise (`site-config.en.ts`)

Personnalisez le contenu en anglais :

```typescript
export const SiteConfigEN = {
  title: "Your App - SEO Title in English",
  description: "Your application description in English",
  features: [
    "🔐 Feature 1",
    "🌍 Feature 2",
    // ...
  ],
};
```

#### 💡 Utilisation dans votre code

**Dans un Server Component :**

```typescript
import { getSiteConfig } from "@/lib/site-config";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteConfig = getSiteConfig(locale);

  return (
    <div>
      <h1>{siteConfig.siteName}</h1>
      <p>{siteConfig.description}</p>
      <a href={siteConfig.author.githubUrl}>{siteConfig.author.name}</a>
    </div>
  );
}
```

**Dans un Client Component :**

```typescript
"use client";

import { getSiteConfig } from "@/lib/site-config";
import { useLocale } from "next-intl";

export default function Component() {
  const locale = useLocale();
  const siteConfig = getSiteConfig(locale);

  return <h1>{siteConfig.title}</h1>;
}
```

**Pour les métadonnées SEO :**

```typescript
import { getSiteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteConfig = getSiteConfig(locale);

  return {
    title: siteConfig.title,
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [
      { name: siteConfig.author.name, url: siteConfig.author.githubUrl },
    ],
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      url: siteConfig.url,
    },
  };
}
```

**Dans les emails :**

```typescript
import { SiteConfig } from "@/lib/site-config";

// Utilise la configuration par défaut (FR)
<Text>
  Bienvenue sur {SiteConfig.siteName}
</Text>
```

#### ✨ Avantages de cette approche

- ✅ **Séparation des préoccupations** - Configuration commune vs traductions
- ✅ **Type-safe** - TypeScript garantit la cohérence
- ✅ **i18n intégré** - Contenu adapté automatiquement selon la langue
- ✅ **SEO optimisé** - Métadonnées multilingues
- ✅ **Maintenance facile** - Un seul endroit pour chaque type de config

---

## 📝 Scripts disponibles

```bash
# Développement
pnpm dev              # Lancer le serveur de développement
pnpm build            # Build de production
pnpm start            # Lancer le serveur de production

# Base de données
pnpm db:push          # Pousser le schema vers la DB
pnpm db:generate      # Générer le client Prisma
pnpm db:studio        # Ouvrir Prisma Studio

# Better Auth
pnpm auth:generate    # Générer le schéma Prisma depuis Better Auth

# Qualité de code
pnpm lint             # Linter le code
pnpm typecheck        # Vérifier les types TypeScript
pnpm format           # Format tout le projet avec Prettier

# Routes
pnpm generate-routes  # Générer les routes typées (automatique avec dev/build)
```

---

## 🚀 Déploiement

### Vercel (recommandé)

1. Push votre code sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com)
3. Configurer les variables d'environnement
4. Déployer !

### Autres plateformes

Le projet peut être déployé sur :

- Netlify
- Railway
- Render
- VPS avec Docker

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**Degni Beugre Israël**

- GitHub: [@thewhite2255dev](https://github.com/thewhite2255dev)
- Email: contact@degnikit.com

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React incroyable
- [Better Auth](https://better-auth.com/) - Solution d'auth moderne
- [shadcn/ui](https://ui.shadcn.com/) - Composants UI magnifiques
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS puissant

---

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Better Auth](https://better-auth.com/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation next-intl](https://next-intl-docs.vercel.app/)

---

<div align="center">
  <p>Fait avec ❤️ par <a href="https://github.com/thewhite2255dev">Degni Beugre Israël</a></p>
  <p>⭐ N'oubliez pas de star le projet si vous l'aimez !</p>
</div>
