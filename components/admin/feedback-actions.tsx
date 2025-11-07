"use client";

import { useState, useTransition } from "react";
import type { Feedback, FeedbackStatus } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Check, X, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import {
  updateFeedbackStatus,
  deleteFeedback,
} from "@/actions/admin/feedbacks";
import { useTranslations } from "next-intl";

type FeedbackActionsProps = {
  feedback: Feedback;
  onUpdate: () => void;
};

export function FeedbackActions({ feedback, onUpdate }: FeedbackActionsProps) {
  const t = useTranslations("Form.admin.actions");
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleStatusChange = (status: FeedbackStatus) => {
    startTransition(async () => {
      try {
        await updateFeedbackStatus(feedback.id, status);
        toast.success(
          t("toast.statusUpdated", { status: status.toLowerCase() }),
        );
      } catch (_error) {
        toast.error(t("toast.statusUpdateFailed"));
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteFeedback(feedback.id);
        toast.success(t("toast.deleted"));
        setShowDeleteDialog(false);
        onUpdate();
      } catch (_error) {
        toast.error(t("toast.deleteFailed"));
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {feedback.status !== "RESOLVED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("RESOLVED")}>
              <Check className="mr-2 h-4 w-4 text-emerald-600" />
              {t("markResolved")}
            </DropdownMenuItem>
          )}
          {feedback.status !== "REJECTED" && (
            <DropdownMenuItem onClick={() => handleStatusChange("REJECTED")}>
              <X className="mr-2 h-4 w-4 text-red-600" />
              {t("markRejected")}
            </DropdownMenuItem>
          )}
          {feedback.status !== "PENDING" && (
            <DropdownMenuItem onClick={() => handleStatusChange("PENDING")}>
              <Clock className="mr-2 h-4 w-4 text-yellow-600" />
              {t("markPending")}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending
                ? t("deleteDialog.deleting")
                : t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
