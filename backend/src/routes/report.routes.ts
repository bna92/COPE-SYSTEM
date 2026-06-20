import { Router } from "express";
import { getExpiredTraining } from "../controllers/report.controller";

const router = Router();

router.get("/expired-training", getExpiredTraining);

export default router;