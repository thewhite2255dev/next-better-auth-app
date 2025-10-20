"use server";

import { auth } from "@/lib/auth";
import { ResetPasswordFormSchema } from "@/schemas/auth";
import type { ResetPasswordFormValues } from "@/types/auth";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function resetPassword(
  values: ResetPasswordFormValues,
  token: string,
) {
  const t = await getTranslations();

  try {
    if (!token) {
      return {
        error: t("Form.errors.token.missing"),
      };
    }

    const validatedFields = ResetPasswordFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { password } = validatedFields.data;

    const existingToken = await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });

    if (!existingToken) {
      return { error: t("Form.errors.token.invalid") };
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("Form.forgotPassword.states.error"), error);
    return { error: t("Form.errors.generic") };
  }
}
