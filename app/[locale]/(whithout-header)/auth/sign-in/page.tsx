import { SignInForm } from "@/components/auth/sign-in-form";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Form.signIn");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function SignInPage() {
  return <SignInForm />;
}
