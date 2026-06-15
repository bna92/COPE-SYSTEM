import { Router } from "express";
import {
  getExternalTraining,
  createExternalTraining,
} from "../controllers/externalTraining.controller";

const router = Router();

router.get("/", getExternalTraining);
router.post("/", createExternalTraining);

export default router;