/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const ProfileFormSchema = (t: (key: string, object?: any) => string) =>
  z.object({
    name: z
      .string()
      .min(2, {
        message: t("Form.errors.name.minLength", { minLength: 2 }),
      })
      .max(50, {
        message: t("Form.errors.name.maxLength", { maxLength: 50 }),
      })
      .optional(),
    bio: z.string().max(200).optional(),
    location: z.string().max(100).optional(),
  });

export const DeleteAccountSchema = (t: (key: string, object?: any) => string) =>
  z
    .object({
      email: z.string().email({
        message: t("Form.errors.email.invalid"),
      }),
      confirmation: z.string().min(1, {
        message: t("Form.deleteAccount.errors.confirmationRequired"),
      }),
      password: z.string().optional(),
    })
    .refine(
      (data) => {
        if (
          data.confirmation !== t("Form.deleteAccount.confirmationWord")
          // data.confirmation !==  "delete my account" &&
          // data.confirmation !== "supprimer mon compte"
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("Form.deleteAccount.errors.deleteAccountConfirmation", {
          keyword: t("Form.deleteAccount.confirmationWord"),
        }),
        path: ["confirmation"],
      },
    );

export const ChangePasswordFormSchema = (
  t: (key: string, object?: any) => string,
) =>
  z.object({
    currentPassword: z.string().min(1, {
      message: t("Form.errors.currentPassword.required"),
    }),
    newPassword: z
      .string()
      .min(1, {
        message: t("Form.errors.newPassword.required"),
      })
      .min(8, {
        message: t("Form.errors.password.minLength", { minLength: 8 }),
      }),
    revokeOtherSessions: z.boolean(),
  });
