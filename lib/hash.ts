import argon2 from "argon2";

/**
 * Hash un mot de passe avec Argon2
 * @param password - mot de passe en clair
 * @returns hash sécurisé
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

/**
 * Vérifie qu'un mot de passe correspond au hash
 * @param password - mot de passe en clair
 * @param hashedPassword - hash stocké en DB
 * @returns true si correspond, false sinon
 */
export async function verifyPassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}
