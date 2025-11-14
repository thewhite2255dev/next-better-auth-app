import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Shield,
  Sparkles,
  ArrowRight,
  Github,
  Rocket,
  Lock,
  Palette,
  Globe,
  Code2,
  Scale,
} from "lucide-react";
import { getSiteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Home");

  return {
    title: t("hero.title"),
    description: t("hero.subtitle"),
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations("Home");
  const { locale } = await params;
  const siteConfig = getSiteConfig(locale);

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
      gradient: "from-emerald-500 to-emerald-500",
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
      <section className="relative container py-20 md:py-32">
        <div className="text-center">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="border-primary/20 bg-primary/5 mb-6 gap-2 py-2 text-sm"
          >
            <Sparkles className="h-4 w-4" />
            {t("hero.badge")}
          </Badge>

          {/* Hero Title */}
          <h1 className="from-foreground via-foreground/90 to-foreground/70 mb-6 bg-linear-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            {t("hero.title")}
          </h1>

          {/* Hero Subtitle */}
          <p className="text-muted-foreground mb-10 text-lg md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="group gap-2" asChild>
              <Link href="/auth/sign-up">
                <Rocket className="h-5 w-5" />
                {t("hero.cta.primary")}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group gap-2" asChild>
              <Link href="/auth/sign-in">
                <Lock className="h-5 w-5" />
                {t("hero.cta.secondary")}
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur">
              <div className="mb-2 flex justify-center">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{t("stats.secure")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.secureLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur">
              <div className="mb-2 flex justify-center">
                <Zap className="h-8 w-8 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{t("stats.fast")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.fastLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur">
              <div className="mb-2 flex justify-center">
                <Scale className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">{t("stats.modern")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.modernLabel")}
              </div>
            </div>
            <div className="group bg-card/50 rounded-lg border p-4 backdrop-blur">
              <div className="mb-2 flex justify-center">
                <Code2 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{t("stats.users")}</div>
              <div className="text-muted-foreground text-sm">
                {t("stats.usersLabel")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative container py-20">
        <div>
          {/* Section Header */}
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              {t("features.badge")}
            </Badge>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground text-lg">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-primary/10 from-card to-card/50 relative overflow-hidden bg-linear-to-br hover:scale-[1.02]"
              >
                <div
                  className={`absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-linear-to-br ${feature.gradient} opacity-20 blur-2xl group-hover:scale-150`}
                />
                <CardContent className="relative p-6">
                  <div
                    className={`mb-4 inline-flex rounded-lg bg-linear-to-br ${feature.gradient} p-3`}
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
      <section className="relative container py-20">
        <Card className="border-primary/20 from-primary/5 via-card to-primary/5 relative overflow-hidden bg-linear-to-br">
          <div className="from-primary/10 absolute top-0 right-0 h-full w-1/3 bg-linear-to-l to-transparent blur-3xl" />
          <CardContent className="relative p-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="group gap-2" asChild>
                <Link href="/auth/sign-up">
                  <Sparkles className="h-5 w-5" />
                  {t("cta.button")}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2" asChild>
                <a
                  href={siteConfig.links.github}
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
        <div className="container">
          <div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Brand */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-purple-600">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">
                    {siteConfig.siteName}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {siteConfig.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Open Source
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    MIT License
                  </Badge>
                </div>
              </div>

              {/* Community */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.resources")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <a
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground flex items-center gap-2 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      {t("footer.github")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/issues`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.documentation")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/discussions`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.community")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contribute */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.contribute")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <a
                      href={`${siteConfig.links.github}/issues/new`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.reportIssues")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/pulls`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.pullRequests")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/blob/main/CONTRIBUTING.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.contributingGuide")}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Project */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">
                  {t("footer.project")}
                </h3>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <a
                      href={`${siteConfig.links.github}/releases`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.releases")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/blob/main/CHANGELOG.md`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.changelog")}
                    </a>
                  </li>
                  <li>
                    <a
                      href={`${siteConfig.links.github}/blob/main/LICENSE`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-foreground transition-colors"
                    >
                      {t("footer.license")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-muted-foreground mt-8 border-t pt-8 text-center text-sm">
              <p className="mb-2">
                {t("footer.builtWith")}{" "}
                <a
                  href={siteConfig.author.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground font-medium"
                >
                  {siteConfig.author.name}
                </a>{" "}
                {t("footer.openSourceCommunity")}
              </p>
              <p>
                {t("footer.licensedUnder")} · {new Date().getFullYear()}{" "}
                {siteConfig.siteName}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
