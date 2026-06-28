import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
  getMyFacilities,
} from "../controllers/facilityController.js";

const router = express.Router();

router.get("/", getFacilities);
router.get("/mine", requireAuth, getMyFacilities);
router.get("/:id", requireAuth, getFacilityById);
router.post("/", requireAuth, createFacility);
router.put("/:id", requireAuth, updateFacility);
router.delete("/:id", requireAuth, deleteFacility);

export default router;
