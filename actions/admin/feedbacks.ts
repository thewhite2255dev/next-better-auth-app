"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type { FeedbackCategory, FeedbackStatus } from "@prisma/client";

async function verifyAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  return session?.user;
}

export async function getFeedbacks({
  page = 1,
  limit = 10,
  status,
  category,
}: {
  page?: number;
  limit?: number;
  status?: FeedbackStatus;
  category?: FeedbackCategory;
} = {}) {
  await verifyAdmin();

  const where = {
    ...(status && { status }),
    ...(category && { category }),
  };

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedback.count({ where }),
  ]);

  return {
    feedbacks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateFeedbackStatus(id: string, status: FeedbackStatus) {
  await verifyAdmin();

  const feedback = await prisma.feedback.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/[locale]/(protected)/admin/feedbacks", "page");

  return { success: true, feedback };
}

export async function deleteFeedback(id: string) {
  await verifyAdmin();

  await prisma.feedback.delete({
    where: { id },
  });

  revalidatePath("/[locale]/(protected)/admin/feedbacks", "page");

  return { success: true };
}

export async function getFeedbackStats() {
  await verifyAdmin();

  const [total, byStatus, byCategory, avgRating] = await Promise.all([
    prisma.feedback.count(),
    prisma.feedback.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.feedback.groupBy({
      by: ["category"],
      _count: true,
    }),
    prisma.feedback.aggregate({
      _avg: {
        rating: true,
      },
    }),
  ]);

  return {
    total,
    byStatus: byStatus.reduce(
      (acc, item) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<FeedbackStatus, number>,
    ),
    byCategory: byCategory.reduce(
      (acc, item) => {
        acc[item.category] = item._count;
        return acc;
      },
      {} as Record<FeedbackCategory, number>,
    ),
    averageRating: avgRating._avg.rating || 0,
  };
}
