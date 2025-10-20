"use server";

import { getUserByEmail } from "@/data/auth/user";
import { auth } from "@/lib/auth";
import { ForgotPasswordFormSchema } from "@/schemas/auth";
import type { ForgotPasswordFormValues } from "@/types/auth";
import { getTranslations } from "next-intl/server";

export async function forgotPassword(values: ForgotPasswordFormValues) {
  const t = await getTranslations();

  try {
    const validatedFields = ForgotPasswordFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("Form.errors.email.notFound") };
    }

    await auth.api.requestPasswordReset({
      body: {
        email,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(t("Form.forgotPassword.states.error"), error);
    return { error: t("Form.errors.generic") };
  }
}
