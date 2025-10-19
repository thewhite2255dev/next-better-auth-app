"use server";

import { getUserByEmail } from "@/data/auth/user";
import { auth } from "@/lib/auth";
import { SignUpFormSchema } from "@/schemas/auth";
import type { SignUpFormValues } from "@/types/auth";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function signUpWithEmail(values: SignUpFormValues) {
  const t = await getTranslations();

  try {
    const validatedFields = SignUpFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { email, password, name } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: t("Form.errors.emailFound") };
    }

    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("Form.signUp.states.error"), error);
    return { error: t("Form.errors.generic") };
  }
}
