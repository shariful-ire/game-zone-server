const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");
const {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} = require("../controllers/facilityController");

router.get("/", getFacilities);
router.get("/:id", getFacilityById);
router.post("/", requireAuth, createFacility);
router.put("/:id", requireAuth, updateFacility);
router.delete("/:id", requireAuth, deleteFacility);

module.exports = router;
