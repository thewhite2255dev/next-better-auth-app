/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const SignInFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.errors.email.required"),
      })
      .email({
        message: t("Form.errors.email.invalid"),
      }),
    password: z.string().min(1, {
      message: t("Form.errors.password.required"),
    }),
    code: z.string().optional(),
  });

export const SignUpFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.errors.email.required"),
      })
      .email({
        message: t("Form.errors.email.invalid"),
      }),
    password: z
      .string()
      .min(1, {
        message: t("Form.errors.password.required"),
      })
      .min(8, {
        message: t("Form.errors.password.minLength", { minLength: 8 }),
      }),
    name: z
      .string()
      .min(1, {
        message: t("Form.errors.name.required"),
      })
      .min(2, {
        message: t("Form.errors.name.minLength", { minLength: 2 }),
      })
      .max(50, {
        message: t("Form.errors.name.maxLength", { maxLength: 50 }),
      }),
  });

export const ResetPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z
      .string()
      .min(1, {
        message: t("Form.errors.password.required"),
      })
      .min(8, {
        message: t("Form.errors.password.minLength", { minLength: 8 }),
      }),
  });

export const TwoFactorFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    code: z.string().min(1, {
      message: t("Form.errors.password.required"),
    }),
  });

export const TwoFactorAuthFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    password: z
      .string()
      .min(1, {
        message: t("Form.errors.password.required"),
      })
      .min(8, {
        message: t("Form.errors.password.minLength", { minLength: 8 }),
      }),
  });

export const ForgotPasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    email: z
      .string()
      .min(1, {
        message: t("Form.errors.email.required"),
      })
      .email({
        message: t("Form.errors.email.invalid"),
      }),
  });
