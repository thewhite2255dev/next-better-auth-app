"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTranslations } from "next-intl";

interface ConfirmActionDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSubmit: () => void;
}

export function ConfirmActionDialog({
  title,
  description,
  onSubmit,

  children,
}: ConfirmActionDialogProps) {
  const t = useTranslations();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ? title : t("ConfirmActionDialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description ? description : t("ConfirmActionDialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>
            {t("ConfirmActionDialog.buttons.cancel")}
          </AlertDialogCancel>
          <AlertDialogCancel onClick={onSubmit}>
            <Button>{t("ConfirmActionDialog.buttons.yes")}</Button>
          </AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
