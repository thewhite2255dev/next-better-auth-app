"use server";

import { auth } from "@/lib/auth";
import type { ActionResult } from "@/types/action";
import { getTranslations } from "next-intl/server";

export async function verifyEmail(token: string): Promise<ActionResult> {
  const t = await getTranslations();

  try {
    if (!token) {
      return {
        error: t("Form.errors.token.missing"),
      };
    }

    const existingToken = await auth.api.verifyEmail({ query: { token } });

    if (!existingToken) {
      return { error: t("Form.errors.token.invalid") };
    }

    return { success: true };
  } catch (error) {
    console.error(t("Form.verifyEmail.states.error"), error);
    return {
      error: t("Form.errors.generic"),
    };
  }
}
