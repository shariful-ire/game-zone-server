const { ObjectId } = require("mongodb");
const { getDB } = require("../lib/db");
const { facilitySchema } = require("../models/validators");

async function getFacilities(req, res, next) {
  try {
    const db = getDB();
    const { search, type, maxPrice, location, featured, page = 1, limit = 20 } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (type) {
      const types = type.split(",");
      filter.facility_type = { $in: types };
    }

    if (maxPrice) {
      filter.price_per_hour = { $lte: Number(maxPrice) };
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    let sort = { _id: -1 };
    if (featured === "true") {
      sort = { booking_count: -1 };
    }

    const facilities = await db
      .collection("facilities")
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .toArray();

    const total = await db.collection("facilities").countDocuments(filter);

    res.json({ facilities, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

async function getFacilityById(req, res, next) {
  try {
    const db = getDB();
    const { id } = req.params;

    let facility;
    try {
      facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });
    } catch {
      return res.status(400).json({ message: "Invalid facility ID" });
    }

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    res.json(facility);
  } catch (err) {
    next(err);
  }
}

async function createFacility(req, res, next) {
  try {
    const db = getDB();
    const parsed = facilitySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    const facility = {
      ...parsed.data,
      owner_email: req.user.email,
      booking_count: 0,
      created_at: new Date(),
    };

    const result = await db.collection("facilities").insertOne(facility);
    res.status(201).json({ ...facility, _id: result.insertedId });
  } catch (err) {
    next(err);
  }
}

async function updateFacility(req, res, next) {
  try {
    const db = getDB();
    const { id } = req.params;

    let facility;
    try {
      facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });
    } catch {
      return res.status(400).json({ message: "Invalid facility ID" });
    }

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    if (facility.owner_email !== req.user.email) {
      return res.status(403).json({ message: "You can only edit your own facilities" });
    }

    const parsed = facilitySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    await db.collection("facilities").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...parsed.data, updated_at: new Date() } }
    );

    const updated = await db.collection("facilities").findOne({ _id: new ObjectId(id) });
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function deleteFacility(req, res, next) {
  try {
    const db = getDB();
    const { id } = req.params;

    let facility;
    try {
      facility = await db.collection("facilities").findOne({ _id: new ObjectId(id) });
    } catch {
      return res.status(400).json({ message: "Invalid facility ID" });
    }

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    if (facility.owner_email !== req.user.email) {
      return res.status(403).json({ message: "You can only delete your own facilities" });
    }

    await db.collection("facilities").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Facility deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};
