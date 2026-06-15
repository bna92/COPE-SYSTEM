import { Router } from "express";
import {
  getWorkExperiences,
  createWorkExperience,
} from "../controllers/workExperience.controller";

const router = Router();

router.get("/", getWorkExperiences);
router.post("/", createWorkExperience);

export default router;