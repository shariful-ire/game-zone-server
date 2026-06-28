const { z } = require("zod");

const facilitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  facility_type: z.string().min(1, "Facility type is required"),
  location: z.string().min(1, "Location is required"),
  price_per_hour: z.number().positive("Price must be positive"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  description: z.string().min(1, "Description is required"),
  image_url: z.string().optional().default(""),
  available_slots: z.array(z.string()).min(1, "At least one slot is required"),
});

const bookingSchema = z.object({
  facility_id: z.string().min(1, "Facility ID is required"),
  booking_date: z.string().min(1, "Booking date is required"),
  time_slot: z.string().min(1, "Time slot is required"),
  hours: z.number().int().positive().max(5),
  total_price: z.number().positive(),
});

const bookingUpdateSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

module.exports = { facilitySchema, bookingSchema, bookingUpdateSchema };
