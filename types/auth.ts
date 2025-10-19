import * as z from "zod";
import {
  ForgotPasswordFormSchema,
  SignInFormSchema,
  ResetPasswordFormSchema,
  SignUpFormSchema,
} from "@/schemas/auth";

export type SignInFormValues = z.infer<ReturnType<typeof SignInFormSchema>>;
export type SignUpFormValues = z.infer<ReturnType<typeof SignUpFormSchema>>;

export type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof ForgotPasswordFormSchema>
>;
export type ResetPasswordFormValues = z.infer<
  ReturnType<typeof ResetPasswordFormSchema>
>;
