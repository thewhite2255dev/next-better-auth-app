// ⚠️ Auto-generated file. Do not edit manually.
// Run "pnpm generate-routes" to update.

export const generatedRoutes = {
  public: [
  ":locale",
  ":locale/auth/forgot-password",
  ":locale/auth/sign-in",
  ":locale/auth/sign-up",
  ":locale/reset-password",
  ":locale/verify-email"
],
  protected: [
  ":locale/dashboard",
  ":locale/settings",
  ":locale/settings/account",
  ":locale/settings/preferences",
  ":locale/settings/profile",
  ":locale/settings/security",
  ":locale/settings/sessions"
],
  auth: [
  ":locale/auth/forgot-password",
  ":locale/auth/sign-in",
  ":locale/auth/sign-up"
],
  admin: [],
  generatedAt: '2025-11-03T03:39:39.770Z'
} as const;

export type GeneratedRoutes = typeof generatedRoutes;
