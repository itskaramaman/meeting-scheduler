"use server";

import { db } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validators";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import { google } from "googleapis";

type BookingDataType = z.infer<typeof bookingSchema> & {
  eventId: string;
  startTime: Date;
  endTime: Date;
} & {
  name: string;
  email: string;
  additionalInfo: string | undefined;
};

export async function createBooking(bookingData: BookingDataType) {
  try {
    const event = await db.event.findUnique({
      where: { id: bookingData.eventId },
      include: { user: true },
    });

    if (!event) throw new Error("Event not found");

    // use google calender api to generate meet link and add to calender
    const { data } = await clerkClient.users.getUserOauthAccessToken(
      event.user.clerkUserId,
      "oauth_google"
    );

    const token = data[0]?.token;
    if (!token)
      throw new Error("Event creator has not connected Google Calender");

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calender = google.calendar({ version: "v3", auth: oauth2Client });

    const meetResponse = await calender.events.insert({
      calendarId: "primary",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${bookingData.name} - ${event.title}`,
        description: bookingData.additionalInfo,
        start: { dateTime: bookingData.startTime },
        end: { dateTime: bookingData.endTime },
        attendees: [{ email: bookingData.email }, { email: event.user.email }],
        conferenceData: {
          createRequest: { requestId: `${event.id}-${Date.now()}` },
        },
      },
    });

    const meetLink = meetResponse?.data?.hangoutLink;
    const googleEventId = meetResponse.data.id;

    const booking = await db.booking.create({
      data: {
        eventId: event.id,
        userId: event.user.id,
        name: bookingData.name,
        email: bookingData.email,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        additionalInfo: bookingData.additionalInfo,
        meetLink,
        googleEventId,
      },
    });

    return { success: true, booking, meetLink };
  } catch (error: unknown) {
    return { success: false, error: error };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");

    const dbUser = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!dbUser) throw new Error("User not found");

    const booking = await db.booking.findUnique({
      where: { id: bookingId, userId: dbUser.id },
      include: { event: true, user: true },
    });

    if (!booking) throw new Error("Booking not found");

    // use google calender api to generate meet link and add to calender
    const { data } = await clerkClient.users.getUserOauthAccessToken(
      booking.user.clerkUserId,
      "oauth_google"
    );

    const token = data[0]?.token;
    if (!token)
      throw new Error("Event creator has not connected Google Calender");

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calender = google.calendar({ version: "v3", auth: oauth2Client });

    await calender.events.delete({
      calendarId: "primary",
      eventId: booking.googleEventId,
    });

    await db.booking.delete({ where: { id: bookingId } });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
}
