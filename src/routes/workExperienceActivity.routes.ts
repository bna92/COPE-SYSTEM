import { Router } from "express";
import {
  getWorkExperienceActivities,
  createWorkExperienceActivity,
} from "../controllers/workExperienceActivity.controller";

const router = Router();

router.get("/", getWorkExperienceActivities);
router.post("/", createWorkExperienceActivity);

export default router;