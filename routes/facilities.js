import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
} from "../controllers/facilityController.js";

const router = express.Router();

router.get("/", getFacilities);
router.get("/:id", getFacilityById);
router.post("/", requireAuth, createFacility);
router.put("/:id", requireAuth, updateFacility);
router.delete("/:id", requireAuth, deleteFacility);

export default router;
