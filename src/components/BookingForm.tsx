"use client";

import { bookingSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format, parseISO } from "date-fns";
import { Button } from "./ui/button";

type BookingFormProps = {
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
  availability: {
    date: string;
    slots: string[];
  }[];
};

const BookingForm = ({ event, availability }: BookingFormProps) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(bookingSchema) });

  console.log("availability", availability);
  const availableDays = availability.map((day) => parseISO(day.date));
  console.log("availableDays", availableDays);

  const timeSlots = selectedDate
    ? availability.find(
        (day) => day.date === format(selectedDate, "yyyy-MM-dd")
      )?.slots || []
    : [];

  console.log("56", timeSlots);

  return (
    <div className="bg-white p-5">
      <div>
        <div>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setSelectedTime(null);
            }}
            disabled={[{ before: new Date() }]}
            modifiers={{ available: availableDays }}
            modifiersStyles={{
              available: { backgroundColor: "lightblue", borderRadius: 100 },
            }}
          />
        </div>
      </div>
      <div>
        {selectedDate && (
          <div>
            <h3>Available Time Slots</h3>
            <div>
              {timeSlots.map((slot) => (
                <Button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  variant={selectedTime === slot ? "default" : "outline"}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
