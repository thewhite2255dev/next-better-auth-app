"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { FeedbackForm, type FeedbackFormRef } from "./feedback-form";
import { Spinner } from "../ui/spinner";

export function FeedbackDialog() {
  const t = useTranslations();
  const [open, setOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<FeedbackFormRef>(null);

  useEffect(() => {
    if (!formRef.current) return;
    formRef.current.resetForm();
  }, [open]);

  function handleSubmit() {
    startTransition(async () => {
      if (!formRef.current) return;

      const success = await formRef.current.submitForm();

      if (success) {
        setOpen(false);
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="h-4 w-4" />
          {t("FeedbackDialog.trigger")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="no-scrollbar max-h-[calc(90vh)] max-w-md overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {t("FeedbackDialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("FeedbackDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <FeedbackForm ref={formRef} onSuccess={() => setOpen(false)} />
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {t("FeedbackDialog.buttons.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Spinner /> : t("FeedbackDialog.buttons.submit")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
