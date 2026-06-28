const { ObjectId } = require("mongodb");
const { getDB } = require("../lib/db");
const { bookingSchema, bookingUpdateSchema } = require("../models/validators");

async function getMyBookings(req, res, next) {
  try {
    const db = getDB();
    const bookings = await db
      .collection("bookings")
      .find({ user_email: req.user.email })
      .sort({ booking_date: -1 })
      .toArray();

    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

async function createBooking(req, res, next) {
  try {
    const db = getDB();
    const parsed = bookingSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    let facilityId;
    try {
      facilityId = new ObjectId(parsed.data.facility_id);
    } catch {
      return res.status(400).json({ message: "Invalid facility ID" });
    }

    const facility = await db.collection("facilities").findOne({ _id: facilityId });
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const booking = {
      ...parsed.data,
      user_email: req.user.email,
      facility_name: facility.name,
      facility_image: facility.image_url || "",
      status: "pending",
      created_at: new Date(),
    };

    const result = await db.collection("bookings").insertOne(booking);

    await db.collection("facilities").updateOne(
      { _id: facilityId },
      { $inc: { booking_count: 1 } }
    );

    res.status(201).json({ ...booking, _id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

async function updateBooking(req, res, next) {
  try {
    const db = getDB();
    const { id } = req.params;

    const parsed = bookingUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    let booking;
    try {
      booking = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    } catch {
      return res.status(400).json({ message: "Invalid booking ID" });
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user_email !== req.user.email) {
      return res.status(403).json({ message: "You can only modify your own bookings" });
    }

    await db.collection("bookings").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: parsed.data.status, updated_at: new Date() } }
    );

    const updated = await db.collection("bookings").findOne({ _id: new ObjectId(id) });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyBookings, createBooking, updateBooking };
