import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";
import { format } from "date-fns";

type MeetingProp = {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email: string;
  additionalInfo: string;
  startTime: Date;
  endTime: Date;
  meetLink: string;
  googleEventId: string;
  createdAt: Date;
  updatedAd: Date;
  event: {
    id: string;
    title: string;
    description: string;
    duration: number;
    userId: string;
    isPrivate: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

const MeetingList = ({
  meetings,
  type,
}: {
  meetings: MeetingProp[];
  type: "upcoming" | "past";
}) => {
  if (meetings.length === 0) return <p>No {type} meetings found.</p>;
  console.log(meetings);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <Card key={meeting.id}>
          <CardHeader>
            <CardTitle>{meeting.event.title}</CardTitle>
            <CardDescription>{meeting.name}</CardDescription>
            {meeting.additionalInfo && (
              <CardDescription>
                &quote;{meeting.additionalInfo}&quote;
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>{format(new Date(meeting.startTime), "MMMM d, yyyy")}</span>
            </div>

            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {format(new Date(meeting.startTime), "h:mm a")} -{" "}
                {format(new Date(meeting.endTime), "h:mm a")}
              </span>
            </div>
            {meeting.meetLink && (
              <div className="flex items-center">
                <Video className="mr-2 h-4 w-4" />
                <a
                  href={meeting.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Join Meeting
                </a>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button variant="destructive" size="sm">
              Cancel Meeting
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MeetingList;
