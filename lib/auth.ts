import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import {
  sendResetPasswordEmail,
  sendTwoFactorOTPEmail,
  sendVerificationEmail as sendVerificationEmailUtil,
} from "./mail";
import { hashPassword, verifyPassword } from "./hash";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { SiteConfig } from "./site-config";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    password: {
      hash: async (password) => await hashPassword(password),
      verify: async ({ hash, password }) =>
        await verifyPassword(hash, password),
    },
    sendResetPassword: async ({ user, token }) => {
      await sendResetPasswordEmail(user.email, token);
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, token }) => {
      await sendVerificationEmailUtil(user.email, token);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      totpEnabled: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60,
    },
  },
  plugins: [
    nextCookies(),
    twoFactor({
      skipVerificationOnEnable: true,
      otpOptions: {
        async sendOTP({ user, otp }) {
          await sendTwoFactorOTPEmail(user.email, otp);
        },
      },
    }),
  ],
  appName: SiteConfig.title,
});
