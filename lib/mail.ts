"use server";

import { sendEmail } from "./nodemailer";
import { SiteConfig } from "./site-config";
import VerificationEmail from "@/emails/verification-email";
import ResetPasswordEmail from "@/emails/reset-password-email";
import TwoFactorOTPEmail from "@/emails/two-factor-otp-email";
import FeedbackEmail from "@/emails/feedback-email";

const SMTP_USER = process.env.SMTP_USER!;

export const sendTwoFactorOTPEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Votre code de vérification 2FA",
    react: TwoFactorOTPEmail({ token, email }),
  });
};

export const sendResetPasswordEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Réinitialisez votre mot de passe",
    react: ResetPasswordEmail({ token, email }),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: email,
    subject: "Vérifiez votre adresse e-mail",
    react: VerificationEmail({ token, email }),
  });
};
export const sendFeedbackEmail = async (
  userEmail: string | undefined,
  feedback: string,
  category: "BUG" | "FEATURE" | "IMPROVEMENT" | "OTHER",
  rating: number | undefined,
  totalFeedbacks: number,
  averageRating: number,
) => {
  await sendEmail({
    from: `"${SiteConfig.title}" <${SMTP_USER}>`,
    to: SMTP_USER,
    subject: "New user feedback received",
    replyTo: userEmail ?? "",
    react: FeedbackEmail({
      feedback,
      userEmail,
      category,
      rating,
      totalFeedbacks,
      averageRating,
    }),
  });
};
