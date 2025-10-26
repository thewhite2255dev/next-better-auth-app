import { prisma } from "@/lib/prisma";

export const getUserTwoFactorByUserId = async (userId: string) => {
  try {
    const user = await prisma.twoFactor.findFirst({
      where: {
        userId,
      },
    });

    return user;
  } catch {
    return null;
  }
};
