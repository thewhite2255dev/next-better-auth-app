"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Send, Star } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function FeedbackDialog() {
  const t = useTranslations("FeedbackDialog");
  const [open, setOpen] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error(t("errors.feedbackRequired"));
      return;
    }

    setIsSubmitting(true);

    // Simuler l'envoi du feedback
    // En production, vous pouvez envoyer vers GitHub Issues, un webhook, etc.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(t("success"));
    setFeedback("");
    setRating(0);
    setOpen(false);
    setIsSubmitting(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4" />
          {t("trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("title")}
          </AlertDialogTitle>
          <AlertDialogDescription>{t("description")}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>{t("rating.label")}</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="transition-all hover:scale-110"
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div className="space-y-2">
            <Label htmlFor="feedback">{t("feedback.label")}</Label>
            <Textarea
              id="feedback"
              placeholder={t("feedback.placeholder")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-muted-foreground text-xs">
              {t("feedback.hint")}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("buttons.submitting")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("buttons.submit")}
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
