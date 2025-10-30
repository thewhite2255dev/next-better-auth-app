import type * as z from "zod";
import type {
  ForgotPasswordFormSchema,
  SignInFormSchema,
  ResetPasswordFormSchema,
  SignUpFormSchema,
  TwoFactorFormSchema,
} from "@/schemas/auth";

export type SignInFormValues = z.infer<ReturnType<typeof SignInFormSchema>>;
export type SignUpFormValues = z.infer<ReturnType<typeof SignUpFormSchema>>;

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof ForgotPasswordFormSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof ResetPasswordFormSchema>
>;
export type TwoFactorFormValues = z.infer<
  ReturnType<typeof TwoFactorFormSchema>
>;
