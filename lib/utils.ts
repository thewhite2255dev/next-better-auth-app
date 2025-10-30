import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string) {
  if (!email) return null;

  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  let maskedLocalPart = localPart;
  if (localPart.length > 4) {
    maskedLocalPart =
      localPart.slice(0, 3) +
      "*".repeat(localPart.length - 4) +
      localPart.slice(-1);
  } else {
    maskedLocalPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
  }

  return `${maskedLocalPart}@${domain}`;
}
