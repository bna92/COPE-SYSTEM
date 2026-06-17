import { Router } from "express";
import {
  getInternalTraining,
  createInternalTraining,
} from "../controllers/internalTraining.controller";

const router = Router();

router.get("/", getInternalTraining);
router.post("/", createInternalTraining);

export default router;