import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import {
  sendResetPasswordEmail,
  sendVerificationEmail as sendVerificationEmailUtil,
} from "./mail";
import { hashPassword, verifyPassword } from "./hash";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
    requireEmailVerification: true,
    password: {
      hash: async (password) => await hashPassword(password),
      verify: async ({ hash, password }) =>
        await verifyPassword(hash, password),
    },
    sendResetPassword: async ({ user, url, token }) => {
      console.log("sendResetPasswordEmail: ", url);

      await sendResetPasswordEmail(user.email, token);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      console.log("sendVerificationEmail: ", url);

      await sendVerificationEmailUtil(user.email, token);
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    },
  },
  plugins: [nextCookies()],
});
