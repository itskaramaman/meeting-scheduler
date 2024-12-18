"use client";

import { Link, Trash2 } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/events";

type EventCardProps = {
  username: string;
  isPublic: boolean;
  event: {
    id: string;
    title: string;
    description: string;
    duration: number;
    isPrivate: boolean;
    _count: {
      bookings: number;
    };
  };
};

const EventCard = ({ event, username, isPublic = false }: EventCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { loading, fn: fnDeleteEvent } = useFetch(deleteEvent);
  const router = useRouter();

  const handleDelete = async () => {
    await fnDeleteEvent(event.id);
    router.push("/events");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/${username}/${event.id}`
      );
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.tagName !== "BUTTON" &&
      e.target.tagName !== "SVG"
    ) {
      window?.open(
        `${window.location.origin}/${username}/${event.id}`,
        "_blank"
      );
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="flex flex-col justify-between cursor-pointer"
    >
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>
            {event.duration} min | {event.isPrivate ? "Private" : "Public"}
          </span>
          <span>Bookings: {event._count.bookings}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-2">{event.description}</CardContent>
      {!isPublic && (
        <CardFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={handleCopy}>
            <Link /> {isCopied ? "Copied" : "Copy Link"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 />
            {loading ? "Deleting" : "Delete"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EventCard;
