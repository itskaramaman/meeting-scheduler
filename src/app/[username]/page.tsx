import { getUserMeetings } from "@/actions/users";
import EventCard from "@/components/EventCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { notFound } from "next/navigation";

type UserPageProps = { params: { username: string } };

export async function generateMetadata({ params }: UserPageProps) {
  const user = await getUserMeetings(params.username);
  if (!user) return { title: "User not found" };

  return {
    title: `${user.name}'s Profile | Meeting Scheduler`,
    description: `Book an event with ${user.name}. View avaialable public events and schedules.`,
  };
}

const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserMeetings(params.username);

  if (!user) return notFound();

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center py-10">
        <Avatar className="w-32 h-32 mb-4">
          <AvatarImage src={user.imageUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl bg-gradient-to-r from-pink-500 to-violet-500 py-1 px-2 text-white rounded-md">
          {user.name}
        </h1>
        <p className="text-gray-600">
          Welcome to my Scheduling page. Please select an event below to book a
          call with me.
        </p>
      </div>

      {user.events.length === 0 ? (
        <p className="text-gray-600 text-center">No public events avialable</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {user.events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              username={params.username}
              isPublic={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPage;
