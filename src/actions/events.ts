"use server";

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

export type EventData = z.infer<typeof eventSchema>;

export async function createEvent(eventData: EventData) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validatedData = eventSchema.parse(eventData);

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const event = await db.event.create({
    data: { ...validatedData, userId: user.id },
  });

  return event;
}

export async function getUserEvents() {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) {
      throw new Error("User not found");
    }

    const events = await db.event.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });

    return { events, username: dbUser.username };
  } catch (error) {
    console.error(error);
    return { events: [], username: null };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) {
      throw new Error("404 - User not found");
    }

    const event = await db.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new Error("404 - Event not found");
    }

    if (dbUser.id !== event.userId) {
      throw new Error("Unauthorized to delete post created by other user");
    }

    await db.event.delete({ where: { id: eventId } });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function getEventById(eventId: string, username: string) {
  try {
    const event = db.event.findUnique({
      where: { id: eventId, user: { username } },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            imageUrl: true,
            username: true,
          },
        },
      },
    });
    return event;
  } catch (error) {
    console.error(error);
  }
}
