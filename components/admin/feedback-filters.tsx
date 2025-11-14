"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bug, MessageCircle, Settings2, Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";

export function FeedbackFilters() {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "ALL";
  const currentCategory = searchParams.get("category") || "ALL";

  const categoryIcon: Record<
    string,
    React.ComponentType<React.SVGProps<SVGSVGElement>>
  > = {
    BUG: Bug,
    FEATURE: Sparkles,
    IMPROVEMENT: Settings2,
    OTHER: MessageCircle,
  };
  const categoryItems: Record<string, string> = {
    BUG: t("Form.feedback.category.bug"),
    FEATURE: t("Form.feedback.category.feature"),
    IMPROVEMENT: t("Form.feedback.category.improvement"),
    OTHER: t("Form.feedback.category.other"),
  };

  const feedbackCategoryItems = Object.entries(categoryIcon).map(
    ([key, Icon]) => (
      <SelectItem key={key} value={key}>
        <Icon className="h-4 w-4" />
        {categoryItems[key]}
      </SelectItem>
    ),
  );

  const handleFilterChange = (type: "status" | "category", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "ALL") {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    router.push(`?${params.toString()}`);
  };

  const handleReset = () => {
    router.push(window.location.pathname);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {t("Form.filters.status.label")}:
        </label>
        <Select
          value={currentStatus}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("Form.filters.status.all")}</SelectItem>
            <SelectItem value="PENDING">
              {t("Form.filters.status.pending")}
            </SelectItem>
            <SelectItem value="RESOLVED">
              {t("Form.filters.status.resolved")}
            </SelectItem>
            <SelectItem value="REJECTED">
              {t("Form.filters.status.rejected")}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">
          {t("Form.filters.category.label")}:
        </label>
        <Select
          value={currentCategory}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              {t("Form.filters.category.all")}
            </SelectItem>
            {feedbackCategoryItems}
          </SelectContent>
        </Select>
      </div>

      {(currentStatus !== "ALL" || currentCategory !== "ALL") && (
        <Button onClick={handleReset} size="sm" variant="ghost">
          <X className="mr-1 h-4 w-4" />
          {t("Form.filters.reset")}
        </Button>
      )}
    </div>
  );
}
