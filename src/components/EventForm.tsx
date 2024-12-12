"use client";

import { eventSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "./ui/select";
import { createEvent, EventData } from "@/actions/events";
import useFetch from "@/hooks/useFetch";
import { useRouter } from "next/navigation";

type EventFormProps = {
  onSubmitForm: () => void;
};

const EventForm = ({ onSubmitForm }: EventFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      duration: 30,
      isPrivate: true,
      title: "",
      description: "",
    },
  });

  const { loading, error, fn: fnCreateEvent } = useFetch(createEvent);

  const handleFormSubmit = async (eventData: EventData) => {
    await fnCreateEvent(eventData);

    if (!loading && !error) onSubmitForm();
    router.refresh();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <Input id="title" placeholder="Title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea placeholder="Description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <Input
          placeholder="Duration in minutes"
          {...register("duration", { valueAsNumber: true })}
        />
        {errors.duration && (
          <p className="text-sm text-red-500 mt-1">{errors.duration.message}</p>
        )}
      </div>

      <Controller
        name="isPrivate"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value ? "true" : "false"}
            onValueChange={(value) => field.onChange(value === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Event Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="false">Public</SelectItem>
                <SelectItem value="true">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      {errors.isPrivate && (
        <p className="text-sm text-red-500 mt-1">{errors.isPrivate.message}</p>
      )}

      <Button className="w-full" type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Event"}
      </Button>
    </form>
  );
};

export default EventForm;
