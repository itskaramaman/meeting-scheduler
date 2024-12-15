"use server";

import { db } from "@/lib/prisma";
import { eventSchema } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

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

export async function getEventAvailability(eventId: string) {
  try {
    const event = db.event.findUnique({
      where: { id: eventId },
      include: {
        user: {
          include: {
            availability: {
              select: {
                days: true,
                timeGap: true,
              },
            },
            bookings: {
              select: {
                startTime: true,
                endTime: true,
              },
            },
          },
        },
      },
    });

    if (!event || !event.user.availability) {
      return [];
    }

    const { bookings, availability } = event.user;

    const startDate = startOfDay(new Date());
    const endDate = addDays(startDate, 30);

    const availableDates = [];

    for (let date = startDate; date <= endDate; date = addDays(date, 1)) {
      const dayOfWeek = format(date, "EEEE").toUpperCase();
      const dayAvailabilty = availability.days.find((d) => d.day === dayOfWeek);

      if (dayAvailabilty) {
        const dateStr = format(date, "yyyy-mm-dd");
        const slots = generateAvailableTimeSlots(
          dayAvailabilty.startTime,
          dayAvailabilty.endTime,
          event.duration,
          bookings,
          dateStr,
          availability.timeGap
        );

        availableDates.push({ date: dateStr, slots });
      }
    }

    return availableDates;
  } catch (error) {
    console.error(error);
  }
}

function generateAvailableTimeSlots(
  startTime: Date,
  endTime: Date,
  duration: number,
  bookings,
  dateStr: string,
  timeGap: number
) {
  const slots = [];
  let currentTime = parseISO(
    `${dateStr}T${startTime.toISOString().slice(11, 16)}`
  );

  const slotEndTime = parseISO(
    `${dateStr}T${endTime.toISOString().slice(11, 16)}`
  );

  const now = new Date();
  if (format(now, "yyyy-mm-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);
    const isSlotAvailable = bookings.some((booking) => {
      const bookingStart = booking.startTime;
      const bookingEnd = booking.endTime;

      return (
        (currentTime >= bookingStart && currentTime < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (currentTime <= bookingStart && slotEnd >= bookingEnd)
      );
    });

    if (isSlotAvailable) {
      slots.push(format(currentTime, "HH:mm"));
    }

    currentTime = slotEndTime;
  }

  return slots;
}
