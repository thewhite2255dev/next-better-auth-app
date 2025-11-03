# 🚀 Degni Kit

**Starter Kit d'Authentification Next.js** - Un template moderne et complet pour démarrer rapidement vos projets avec une authentification robuste.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-Latest-purple?style=flat-square)](https://better-auth.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Fonctionnalités

- 🔐 **Authentification complète** - Inscription, connexion, réinitialisation de mot de passe
- 🛡️ **Sécurité avancée** - 2FA/TOTP, vérification d'email, gestion des sessions
- 🌍 **Internationalisation** - Support multilingue (FR/EN) avec next-intl
- 🎨 **UI moderne** - Design épuré avec Tailwind CSS et shadcn/ui
- 📱 **Responsive** - Interface adaptée à tous les écrans
- 🌓 **Mode sombre** - Thème clair/sombre avec transition fluide
- ⚡ **Performance** - SSR, optimisations et meilleures pratiques Next.js 15
- 🔄 **Gestion des sessions** - Visualisation et révocation des sessions actives

---

## 🛠️ Technologies

### Core
- **[Next.js 15](https://nextjs.org/)** - Framework React avec App Router
- **[React 19](https://react.dev/)** - Bibliothèque UI
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Better Auth](https://better-auth.com/)** - Solution d'authentification moderne

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Composants UI réutilisables
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Gestion du thème

### Database & Backend
- **[Prisma](https://www.prisma.io/)** - ORM TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Base de données (recommandé)

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Gestion des formulaires
- **[Zod](https://zod.dev/)** - Validation de schémas

### Internationalization
- **[next-intl](https://next-intl-docs.vercel.app/)** - i18n pour Next.js

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
my-app/
├── app/                          # App Router Next.js
│   ├── [locale]/                 # Routes internationalisées
│   │   ├── (protected)/          # Routes protégées (auth requise)
│   │   │   ├── dashboard/        # Dashboard utilisateur
│   │   │   └── settings/         # Paramètres du compte
│   │   ├── (public)/             # Routes publiques
│   │   │   └── page.tsx          # Page d'accueil
│   │   └── (without-header)/     # Routes sans header
│   │       └── auth/             # Pages d'authentification
│   └── api/                      # API Routes
│       └── auth/                 # Endpoints Better Auth
├── components/                   # Composants React
│   ├── auth/                     # Composants d'authentification
│   ├── layout/                   # Layout et navigation
│   ├── settings/                 # Composants de paramètres
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
  locales: ['fr', 'en', 'de'],
  defaultLocale: 'fr'
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

Modifier `lib/site-config.ts` pour personnaliser :
- Nom et description
- URLs et liens
- Métadonnées SEO
- Fonctionnalités

---

## 📝 Scripts disponibles

```bash
# Développement
pnpm dev              # Lancer le serveur de développement
pnpm build            # Build de production
pnpm start            # Lancer le serveur de production

# Base de données
pnpm db:push      # Pousser le schema vers la DB
pnpm db:generate  # Générer le client Prisma
pnpm db:studio    # Ouvrir Prisma Studio

# Qualité de code
pnpm lint             # Linter le code
pnpm lint:fix         # Corriger les erreurs de lint
pnpm typecheck        # Vérifier les types TypeScript
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
