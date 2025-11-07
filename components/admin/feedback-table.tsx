"use client";

import type { Feedback } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { FeedbackActions } from "./feedback-actions";
import { Bug, MessageCircle, Settings2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { StarRating } from "../shared/star-rating";

type FeedbackTableProps = {
  feedbacks: Feedback[];
};

const categoryIcon: Record<string, React.ReactNode> = {
  BUG: <Bug className="h-4 w-4" />,
  FEATURE: <Sparkles className="h-4 w-4" />,
  IMPROVEMENT: <Settings2 className="h-4 w-4" />,
  OTHER: <MessageCircle className="h-4 w-4" />,
};

const getStatusVariant = (
  status: string,
): "secondary" | "default" | "destructive" | "outline" => {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "RESOLVED":
      return "default";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDate = (
  date: Date,
  t: (key: string, values?: Record<string, number>) => string,
) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return t("Form.table.date.today");
  if (days === 1) return t("Form.table.date.yesterday");
  if (days < 7) return t("Form.table.date.daysAgo", { days });
  if (days < 30)
    return t("Form.table.date.weeksAgo", { weeks: Math.floor(days / 7) });
  if (days < 365)
    return t("Form.table.date.monthsAgo", { months: Math.floor(days / 30) });
  return t("Form.table.date.yearsAgo", { years: Math.floor(days / 365) });
};

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  const t = useTranslations();
  const router = useRouter();

  if (feedbacks.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-lg font-semibold">{t("Form.table.empty.title")}</p>
          <p className="text-muted-foreground text-sm">
            {t("Form.table.empty.description")}
          </p>
        </div>
      </div>
    );
  }

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <div className="rounded-lg border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.category")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.message")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.rating")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.email")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.status")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                {t("Form.table.headers.date")}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">
                {t("Form.table.headers.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {feedbacks.map((feedback) => (
              <tr key={feedback.id} className="hover:bg-muted/50">
                <td className="px-4 py-3">{categoryIcon[feedback.category]}</td>
                <td className="max-w-md px-4 py-3">
                  <p className="line-clamp-2 text-sm">{feedback.message}</p>
                </td>
                <td className="px-4 py-3">
                  <StarRating
                    className="[&_svg]:h-4 [&_svg]:w-4"
                    value={feedback.rating ?? 0}
                  />
                </td>
                <td className="px-4 py-3">
                  {feedback.userEmail ? (
                    <span className="text-sm">{feedback.userEmail}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">
                      {t("Form.table.anonymous")}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(feedback.status)}>
                    {feedback.status}
                  </Badge>
                </td>
                <td className="text-muted-foreground px-4 py-3 text-sm">
                  {formatDate(feedback.createdAt, t)}
                </td>
                <td className="px-4 py-3 text-right">
                  <FeedbackActions
                    feedback={feedback}
                    onUpdate={handleUpdate}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
