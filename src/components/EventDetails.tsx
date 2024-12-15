import { Calendar, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

type EventDetailsProps = {
  event: {
    id: string;
    title: string;
    description: string;
    duration: number;
    userId: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      name: string;
      email: string;
      imageUrl?: string;
      username: string;
    };
  };
};

const EventDetails = ({ event }: EventDetailsProps) => {
  return (
    <div className="p-10 lg:w-1/3 bg-white">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="flex items-center mb-4">
        <Avatar className="w-12 h-12 mr-4">
          <AvatarImage src={event.user.imageUrl} alt="user-image" />
          <AvatarFallback>
            {event.user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{event.user.name}</h2>
          <p className=" text-gray-600">@{event.user.username}</p>
        </div>
      </div>

      <div>
        <span className="flex items-center mb-2">
          <Clock className="mr-2" />
          {event.duration} minutes
        </span>
        <span className="flex items-center mb-4">
          <Calendar className="mr-2" />
          Google Meet
        </span>
        <span className="text-gray-700">{event.description}</span>
      </div>
    </div>
  );
};

export default EventDetails;
