import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string): string {
  if (!email) return "";

  const [localPart, domain] = email.split("@");

  if (!localPart || !domain) return email;

  let maskedLocalPart = localPart;
  if (localPart.length > 4) {
    maskedLocalPart =
      localPart.slice(0, 3) +
      "*".repeat(localPart.length - 5) +
      localPart.slice(-2);
  } else {
    maskedLocalPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
  }

  return `${maskedLocalPart}@${domain}`;
}

export function generateAvatarFallback(name: string): string {
  if (!name) return "";

  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function getNamePart(fullName: string, index: number): string {
  if (!fullName) return "";
  const parts = fullName?.trim().split(/\s+/) ?? [];
  return parts[index - 1] ?? "";
}
