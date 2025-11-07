/* eslint-disable @typescript-eslint/no-explicit-any */
import { FeedbackCategory } from "@prisma/client";
import * as z from "zod";

export const FeedbackFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    userEmail: z.string().optional(),
    message: z.string().min(5, {
      message: t("Form.errors.message.minLength", { minLength: 5 }),
    }),

    category: z.enum([
      FeedbackCategory.BUG,
      FeedbackCategory.FEATURE,
      FeedbackCategory.IMPROVEMENT,
      FeedbackCategory.OTHER,
    ]),
    rating: z.number().optional(),
  });
