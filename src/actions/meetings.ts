"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getMeetings(type: "upcoming" | "past") {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) throw new Error("User not found");

    const now = new Date();

    const meetings = await db.booking.findMany({
      where: {
        userId: dbUser.id,
        startTime: type === "upcoming" ? { gte: now } : { lt: now },
      },
      include: {
        event: { include: { user: { select: { name: true, email: true } } } },
      },
      orderBy: {
        startTime: type === "upcoming" ? "asc" : "desc",
      },
    });

    return meetings;
  } catch (error) {
    console.error(error);
    return [];
  }
}
