const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  getMyBookings,
  createBooking,
  updateBooking,
} = require("../controllers/bookingController");

router.get("/", requireAuth, getMyBookings);
router.post("/", requireAuth, createBooking);
router.patch("/:id", requireAuth, updateBooking);

module.exports = router;
