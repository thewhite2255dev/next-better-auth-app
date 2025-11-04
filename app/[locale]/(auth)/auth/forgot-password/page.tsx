import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Form.forgotPassword");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
