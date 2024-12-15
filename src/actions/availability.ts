"use server";

import { UserDaysAvailability } from "@/app/(private)/availability/data";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

export async function updateAvailability(data) {
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
          create: availabilityData,
        },
      },
    });
  }

  return { success: true };
}
