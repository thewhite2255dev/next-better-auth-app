import type * as z from "zod";

import type { FeedbackFormSchema } from "@/schemas/other";

export type FeedbackFormValues = z.infer<ReturnType<typeof FeedbackFormSchema>>;
