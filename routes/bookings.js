import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getMyBookings,
  createBooking,
  updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.get("/", requireAuth, getMyBookings);
router.post("/", requireAuth, createBooking);
router.patch("/:id", requireAuth, updateBooking);

export default router;
