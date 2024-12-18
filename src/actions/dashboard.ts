"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getDashboardActivities() {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) throw new Error("User not found");

    const now = new Date();
    const upcomingMeetings = await db.booking.findMany({
      where: { userId: dbUser.id, startTime: { gt: now } },
      include: {
        event: {
          select: {
            title: true,
            duration: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
      take: 3,
    });

    return upcomingMeetings;
  } catch (error) {
    console.error(error);
    return [];
  }
}
