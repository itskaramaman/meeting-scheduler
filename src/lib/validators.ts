import { z } from "zod";

export const usernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers or underscores"
    ),
});

export type UsernameSchemaType = z.infer<typeof usernameSchema>;

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be 500 charaters or less"),

  duration: z.number().int().positive("Duration must be a positive integer"),

  isPrivate: z.boolean(),
});

export const daySchema = z
  .object({
    isAvailable: z.boolean(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.isAvailable) {
        return (
          data.startTime !== undefined &&
          data.endTime !== undefined &&
          data.startTime < data.endTime
        );
      }
      return true; // If not available, no need to check time validity
    },
    {
      message: "End time must be greater than start time",
      path: ["endTime"],
    }
  );

export const availabilitySchema = z.object({
  monday: daySchema,
  tuesday: daySchema,
  wednesday: daySchema,
  thursday: daySchema,
  friday: daySchema,
  saturday: daySchema,
  sunday: daySchema,
  timeGap: z.number().min(0, "Time gap must be 0 or more minutes").int(),
});

export type AvailabilitySchemaType = z.infer<typeof availabilitySchema>

export const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid date format"),
  additionalInfo: z.string().optional(),
});
