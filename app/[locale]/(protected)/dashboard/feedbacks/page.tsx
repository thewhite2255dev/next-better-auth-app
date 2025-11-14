import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getFeedbacks, getFeedbackStats } from "@/actions/admin/feedbacks";
import { FeedbackFilters } from "@/components/admin/feedback-filters";
import { FeedbackTable } from "@/components/admin/feedback-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeedbackCategory, FeedbackStatus } from "@prisma/client";
import {
  BarChart3,
  Clock,
  CheckCircle2,
  Star,
  Bug,
  Sparkles,
  Settings2,
  MessageCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

type SearchParams = {
  status?: FeedbackStatus;
  category?: FeedbackCategory;
  page?: string;
};

export default async function AdminFeedbacksPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const t = await getTranslations();

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user || session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Get filters from URL params
  const status = searchParams.status;
  const category = searchParams.category;
  const page = Number(searchParams.page) || 1;

  // Fetch data
  const { feedbacks, pagination } = await getFeedbacks({
    status,
    category,
    page,
    limit: 10,
  });

  const stats = await getFeedbackStats();

  return (
    <>
      {/* Background gradient effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-primary/10 absolute -top-40 -left-40 h-96 w-96 animate-pulse rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl [animation-delay:2s]" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl [animation-delay:4s]" />
      </div>

      <main className="relative min-h-screen space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            {t("Form.admin.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("Form.admin.subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-blue-500/20 bg-linear-to-br from-blue-500/5 to-blue-600/5">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/20 blur-2xl transition-all group-hover:scale-150" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Form.admin.stats.total.title")}
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">{stats.total}</div>
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("Form.admin.stats.total.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-amber-500/20 bg-linear-to-br from-amber-500/5 to-amber-600/5">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-amber-500/20 blur-2xl transition-all group-hover:scale-150" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Form.admin.stats.pending.title")}
              </CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {stats.byStatus.PENDING}
                </div>
                <Users className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("Form.admin.stats.pending.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-emerald-500/20 bg-linear-to-br from-emerald-500/5 to-emerald-600/5">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-emerald-500/20 blur-2xl transition-all group-hover:scale-150" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Form.admin.stats.resolved.title")}
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {stats.byStatus.RESOLVED}
                </div>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("Form.admin.stats.resolved.description")}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-purple-500/20 bg-linear-to-br from-purple-500/5 to-purple-600/5">
            <div className="absolute top-0 right-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-500/20 blur-2xl transition-all group-hover:scale-150" />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("Form.admin.stats.averageRating.title")}
              </CardTitle>
              <Star className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {stats.averageRating.toFixed(1)}
                </div>
                <Star className="h-4 w-4 fill-purple-500 text-purple-500" />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {t("Form.admin.stats.averageRating.description")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <Card className="border-primary/20 from-card to-card/50 overflow-hidden bg-linear-to-br transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {t("Form.admin.categories.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-lg border border-red-500/20 bg-linear-to-br from-red-500/5 to-red-600/5 p-4">
                <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-red-500/20 blur-xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-red-500/10 p-2">
                      <Bug className="h-5 w-5 text-red-500" />
                    </div>
                    <span className="font-medium">
                      {t("Form.admin.categories.bug")}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {stats.byCategory.BUG}
                  </span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-blue-500/20 bg-linear-to-br from-blue-500/5 to-blue-600/5 p-4">
                <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-blue-500/20 blur-xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Sparkles className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="font-medium">
                      {t("Form.admin.categories.feature")}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {stats.byCategory.FEATURE}
                  </span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-violet-500/20 bg-linear-to-br from-violet-500/5 to-violet-600/5 p-4">
                <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-violet-500/20 blur-xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-violet-500/10 p-2">
                      <Settings2 className="h-5 w-5 text-violet-500" />
                    </div>
                    <span className="font-medium">
                      {t("Form.admin.categories.improvement")}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {stats.byCategory.IMPROVEMENT}
                  </span>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-lg border border-emerald-500/20 bg-linear-to-br from-emerald-500/5 to-emerald-600/5 p-4">
                <div className="absolute top-0 right-0 h-16 w-16 translate-x-4 -translate-y-4 rounded-full bg-emerald-500/20 blur-xl transition-all group-hover:scale-150" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-emerald-500/10 p-2">
                      <MessageCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <span className="font-medium">
                      {t("Form.admin.categories.other")}
                    </span>
                  </div>
                  <span className="text-2xl font-bold">
                    {stats.byCategory.OTHER}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <FeedbackFilters />

        {/* Table */}
        <Card className="border-primary/20 from-card to-card/50 overflow-hidden bg-linear-to-br">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t("Form.admin.table.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FeedbackTable feedbacks={feedbacks} />
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <a
                  key={p}
                  href={`?page=${p}${status ? `&status=${status}` : ""}${category ? `&category=${category}` : ""}`}
                  className={`group rounded-lg border px-4 py-2 ${
                    p === page
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                >
                  {p}
                </a>
              ),
            )}
          </div>
        )}
      </main>
    </>
  );
}
