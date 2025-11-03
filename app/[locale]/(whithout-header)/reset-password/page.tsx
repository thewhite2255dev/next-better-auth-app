import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Form.resetPassword");

  return {
    title: t("title"),
  };
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
