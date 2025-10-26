"use server";

import { getUserByEmail } from "@/data/auth/user";
import { getTranslations } from "next-intl/server";

export async function checkTwoFactor(email: string) {
  const t = await getTranslations();

  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: t("Form.errors.unauthorized") };
    }

    return {
      totp: existingUser.totpEnabled,
    };
  } catch (error) {
    console.error(error);
    return { error: t("Form.errors.generic") };
  }
}
