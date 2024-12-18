import { getUserEvents } from "@/actions/events";
import EventCard from "@/components/EventCard";

const EventsPage = async () => {
  const { events, username } = await getUserEvents();

  if (events.length === 0) {
    return <p>You have&apos;t created any events yet.</p>;
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          username={username}
          isPublic={false}
        />
      ))}
    </div>
  );
};

export default EventsPage;
