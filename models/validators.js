import { z } from "zod";

const VALID_FACILITY_TYPES = ["Turf", "Football", "Badminton", "Swimming", "Tennis"];

export const facilitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  facility_type: z.enum(VALID_FACILITY_TYPES, {
    errorMap: () => ({ message: `Must be one of: ${VALID_FACILITY_TYPES.join(", ")}` }),
  }),
  location: z.string().min(2, "Location must be at least 2 characters").max(200, "Location too long"),
  price_per_hour: z.number().positive("Price must be positive").max(100000, "Price seems unreasonably high"),
  capacity: z.number().int().positive("Capacity must be a positive integer").max(500, "Capacity too high"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  available_slots: z.array(z.string().min(1)).min(1, "At least one slot is required").max(20, "Too many slots"),
});

export const bookingSchema = z.object({
  facility_id: z.string().min(1, "Facility ID is required"),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  time_slot: z.string().min(1, "Time slot is required"),
  hours: z.number().int().positive("Hours must be positive").max(5, "Maximum 5 hours per booking"),
  total_price: z.number().positive("Total price must be positive"),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"], {
    errorMap: () => ({ message: "Status must be pending, confirmed, or cancelled" }),
  }),
});
