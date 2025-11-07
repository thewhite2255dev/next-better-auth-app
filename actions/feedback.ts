"use server";

import { sendFeedbackEmail } from "@/lib/mail";
import { prisma } from "@/lib/prisma";
import { FeedbackFormSchema } from "@/schemas/other";
import type { FeedbackFormValues } from "@/types/other";
import { getTranslations } from "next-intl/server";
import { revalidatePath } from "next/cache";

export async function sendFeedback(values: FeedbackFormValues) {
  const t = await getTranslations();

  try {
    const validedFields = FeedbackFormSchema(t).safeParse(values);

    if (!validedFields.success) {
      return { error: t("Form.errors.allFieldsRequired") };
    }

    await prisma.feedback.create({
      data: {
        ...values,
      },
    });

    const [totalFeedbacks, averageRatingResult] = await Promise.all([
      prisma.feedback.count(),
      prisma.feedback.aggregate({
        _avg: {
          rating: true,
        },
      }),
    ]);

    const averageRating = averageRatingResult._avg.rating || 0;

    await sendFeedbackEmail(
      values.userEmail,
      values.message,
      values.category,
      values.rating,
      totalFeedbacks,
      Number(averageRating.toFixed(1)),
    );

    revalidatePath("/[locale]/(protected)/admin/feedbacks", "page");

    return { error: null };
  } catch (error) {
    console.error(error);
    return { error: t("Form.errors.generic") };
  }
}
