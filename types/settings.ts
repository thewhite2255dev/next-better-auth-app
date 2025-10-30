import type * as z from "zod";
import type {
  ChangePasswordFormSchema,
  DeleteAccountSchema,
  ProfileFormSchema,
} from "@/schemas/settings";
import type { TwoFactorAuthFormSchema } from "@/schemas/auth";

export type ProfileFormValues = z.infer<ReturnType<typeof ProfileFormSchema>>;
export type DeleteAccountFormValues = z.infer<
  ReturnType<typeof DeleteAccountSchema>
>;
export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof ChangePasswordFormSchema>
>;
export type TwoFactorAuthFormValues = z.infer<
  ReturnType<typeof TwoFactorAuthFormSchema>
>;
