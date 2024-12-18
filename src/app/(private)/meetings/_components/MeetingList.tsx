"use client";

import MeetingCard from "./MeetingCard";

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {meetings.map((meeting) => (
        <MeetingCard key={meeting.id} meeting={meeting} type={type} />
      ))}
    </div>
  );
};

export default MeetingList;
