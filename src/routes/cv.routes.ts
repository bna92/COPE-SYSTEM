import { Router } from "express";
import { getEmployeeCV } from "../controllers/cv.controller";

const router = Router();

router.get("/employees/:id/cv", getEmployeeCV);

export default router;