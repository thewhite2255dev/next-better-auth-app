"use client";

import { useTranslations } from "next-intl";

export function useAuthErrorMessages() {
  const t = useTranslations();

  const ERROR_CODES: Record<string, string> = {
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: t("Form.errors.userAlreadyExist"),
    INVALID_EMAIL_OR_PASSWORD: t("Form.errors.credential.incorrect"),
    INVALID_PASSWORD: t("Form.errors.password.incorrect"),
  };

  return ERROR_CODES;
}
