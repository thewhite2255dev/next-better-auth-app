"use server";

import { getUserByEmail } from "@/data/auth/user";
import { auth } from "@/lib/auth";
import { verifyPassword } from "@/lib/hash";
import { SignInFormSchema } from "@/schemas/auth";
import type { SignInFormValues } from "@/types/auth";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function signInWithEmail(values: SignInFormValues) {
  const t = await getTranslations();

  try {
    const validatedFields = SignInFormSchema(t).safeParse(values);

    if (!validatedFields.success) {
      return { error: t("Form.errors.fields.invalid") };
    }

    const { email, password } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
      return { error: t("Form.errors.email.notFound") };
    }

    const passwordMatches = await verifyPassword(
      existingUser.password,
      password,
    );

    if (!passwordMatches) {
      return { error: t("Form.signIn.errors.invalidCredentials") };
    }

    if (!existingUser.emailVerified) {
      return { verifyEmail: true };
    }

    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      asResponse: true,
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error(t("Form.signIn.states.error"), error);
    return { error: t("Form.errors.generic") };
  }
}
