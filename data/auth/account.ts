import { prisma } from "@/lib/prisma";

export const getAccountById = async (id: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: {
        providerId: "credential",
        userId: id,
      },
    });

    return account;
  } catch {
    return null;
  }
};
