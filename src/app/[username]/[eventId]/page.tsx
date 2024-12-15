import { getEventById } from "@/actions/events";
import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";
import BookingForm from "@/components/BookingForm";
import { notFound } from "next/navigation";

type EventPageProps = {
  params: {
    eventId: string;
    username: string;
  };
};

export async function generateMetadata({ params }: EventPageProps) {
  const event = await getEventById(params.eventId, params.username);
  if (!event) return { title: "Event not found" };

  return {
    title: `Book ${event.title} with ${event.user.name} | Meeting Scheduler`,
    description: `Schedule a ${event.duration}-minute ${event.title} with ${event.user.name}.`,
  };
}

const EventPage = async ({ params }: EventPageProps) => {
  const event = await getEventById(params.eventId, params.username);

  if (!event) return notFound();

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetails event={event} />
      <Suspense fallback={<div>Loading Booking Form...</div>}>
        <BookingForm />
      </Suspense>
    </div>
  );
};

export default EventPage;