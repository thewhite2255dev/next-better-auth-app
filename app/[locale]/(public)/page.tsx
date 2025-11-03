import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteConfig } from "@/lib/site-config";
import {
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Github,
  Rocket,
  Lock,
  Users,
  LayoutDashboard,
  Palette,
  Globe,
} from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");

  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default async function Home() {
  const t = await getTranslations("Home");

  const features = [
    {
      icon: Shield,
      title: t("features.auth.title"),
      description: t("features.auth.description"),
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Palette,
      title: t("features.design.title"),
      description: t("features.design.description"),
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Globe,
      title: t("features.i18n.title"),
      description: t("features.i18n.description"),
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Zap,
      title: t("features.performance.title"),
      description: t("features.performance.description"),
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-primary/20 absolute -top-40 -left-40 h-[500px] w-[500px] animate-pulse rounded-full blur-3xl" />
        <div className="animation-delay-2000 absolute top-1/4 -right-40 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div className="animation-delay-4000 absolute bottom-0 left-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative container px-4 py-20 md:py-32">
        <div className="mx-auto max-w-5xl text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/5 mb-6 gap-2 px-4 py-2 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            {t("hero.badge")}
          </Badge>

          {/* Hero Title */}
          <h1 className="from-foreground via-foreground/90 to-foreground/70 mb-6 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            {t("hero.title")}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="group gap-2 shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              asChild
            >
              <Link href="/auth/sign-up">
                <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                {t("hero.cta.primary")}
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group gap-2 transition-all hover:scale-105"
              asChild
            >
              <Link href="/auth/sign-in">
                <Lock className="h-5 w-5" />
                {t("hero.cta.secondary")}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-2 flex justify-center">
                <Shield className="h-8 w-8 text-blue-500 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-2xl font-bold">{t("stats.secure")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.secureLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-2 flex justify-center">
                <Zap className="h-8 w-8 text-amber-500 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-2xl font-bold">{t("stats.fast")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.fastLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-2 flex justify-center">
                <Users className="h-8 w-8 text-green-500 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-2xl font-bold">{t("stats.users")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.usersLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur transition-all hover:scale-105 hover:shadow-lg">
              <div className="mb-2 flex justify-center">
                <LayoutDashboard className="h-8 w-8 text-purple-500 transition-transform group-hover:scale-110" />
              </div>
              <div className="text-2xl font-bold">{t("stats.modern")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.modernLabel")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container px-4 py-20">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              {t("features.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-primary/10 from-card to-card/50 relative overflow-hidden bg-gradient-to-br transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                <div
                  className={`absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 blur-2xl transition-all group-hover:scale-150`}
                />
                <CardContent className="relative p-6">
                  <div
                    className={`mb-4 inline-flex rounded-lg bg-gradient-to-br ${feature.gradient} p-3 shadow-lg`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container px-4 py-20">
        <Card className="border-primary/20 from-primary/5 via-card to-primary/5 relative overflow-hidden bg-gradient-to-br">
          <div className="from-primary/10 absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l to-transparent blur-3xl" />
          <CardContent className="relative p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="group gap-2 shadow-lg transition-all hover:scale-105"
                asChild
              >
                <Link href="/auth/sign-up">
                  <Sparkles className="h-5 w-5" />
                  {t("cta.button")}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 transition-all hover:scale-105"
                asChild
              >
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  {t("cta.github")}
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t py-12">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">{SiteConfig.name}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {SiteConfig.description}
                </p>
              </div>

              {/* Product */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.product")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.features")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.pricing")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.resources")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <a
                      href={SiteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.documentation")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={SiteConfig.author.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.github")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.company")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.about")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
              <p>
                © {new Date().getFullYear()} {SiteConfig.name}. Made with ❤️ by{" "}
                <a
                  href={SiteConfig.author.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground font-medium"
                >
                  {SiteConfig.author.name}
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
