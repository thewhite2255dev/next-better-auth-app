"use server";

import { getUserByEmail } from "@/data/auth/user";
import { verifyPassword } from "@/lib/hash";
import { DeleteAccountSchema } from "@/schemas/settings";
import type { DeleteAccountFormValues } from "@/types/settings";
import { getTranslations } from "next-intl/server";

export async function deleteAccount(values: DeleteAccountFormValues) {
  const t = await getTranslations();

  try {
    const validatedFields = DeleteAccountSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.allFieldsRequired") };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: t("Form.errors.unauthorized") };
    }

    if (email !== existingUser?.email) {
      return { error: t("Form.errors.email.incorrect") };
    }

    if (password && existingUser?.password) {
      const passwordMatch = await verifyPassword(
        existingUser?.password,
        password,
      );

      if (!passwordMatch) {
        return { error: t("Form.errors.currentPassword.incorrect") };
      }
    }

    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: t("Form.errors.generic") };
  }
}
