"use server";

import { UserDaysAvailability } from "@/app/(private)/availability/data";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type Day = (typeof days)[number];

export async function getUserAvailability() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: {
        include: { days: true },
      },
    },
  });

  if (!dbUser || !dbUser.availability) {
    return null;
  }

  const availabilityData: UserDaysAvailability = {
    timeGap: dbUser.availability.timeGap,
  };

  days.forEach((day: Day) => {
    const dayAvailabilty = dbUser.availability?.days.find(
      (d) => d.day === day.toUpperCase()
    );

    availabilityData[day] = {
      isAvailable: !!dayAvailabilty,
      startTime: dayAvailabilty
        ? dayAvailabilty?.startTime.toISOString().slice(11, 16)
        : "09:00",

      endTime: dayAvailabilty
        ? dayAvailabilty?.endTime.toISOString().slice(11, 16)
        : "17:00",
    };
  });

  return availabilityData;
}


type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

type DaysAvailability = Record<DayOfWeek, {isAvailable: boolean, startTime: string, endTime: string}>

// Define the final type using an intersection to add `timeGap`
interface UpdateAvailabilityData extends DaysAvailability {
  timeGap: number; // Static property for timeGap
}


export async function updateAvailability(data: UpdateAvailabilityData) {
  const { userId } = auth();
  if (!userId) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      availability: true,
    },
  });

  if (!dbUser) throw new Error("User not found");

  const availabilityData = Object.entries(data).flatMap(
    ([day, { isAvailable, startTime, endTime }]) => {
      if (isAvailable) {
        const baseDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

        return [
          {
            day: day.toUpperCase(),
            startTime: new Date(`${baseDate}T${startTime}:00Z`),
            endTime: new Date(`${baseDate}T${endTime}:00Z`),
          },
        ];
      }
      return [];
    }
  );

  if (dbUser.availability) {
    await db.availability.update({
      where: { id: dbUser.availability.id },
      data: {
        timeGap: data.timeGap,
        days: {
          deleteMany: {},
          // @ts-expect-error: This line is necessary because we're manually mapping a string to an enum
          create: availabilityData,
        },
      },
    });
  } else {
    await db.availability.create({
      data: {
        userId: dbUser.id,
        timeGap: data.timeGap,
        days: {
          // @ts-expect-error: This line is necessary because we're manually mapping a string to an enum
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}

export async function getAvailabilityByEventId(eventId: string) {
  try {
    const event = await db.event.findUnique({
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
        const dateStr = format(date, "yyyy-MM-dd");
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
  bookings: {
    startTime: Date;
    endTime: Date;
  }[],
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
  if (format(now, "yyyy-MM-dd") === dateStr) {
    currentTime = isBefore(currentTime, now)
      ? addMinutes(now, timeGap)
      : currentTime;
  }

  while (currentTime < slotEndTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    const isSlotAvailable = !bookings.some((booking) => {
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

    currentTime = addMinutes(currentTime, timeGap);
  }

  return slots;
}
