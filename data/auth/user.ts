import { prisma } from "@/lib/prisma";
import { getAccountById } from "./account";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    const account = await getAccountById(user.id);

    return { ...user, password: account?.password };
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return user;
  } catch {
    return null;
  }
};
