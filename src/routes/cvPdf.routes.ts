import { Router } from "express";
import { generateEmployeeCVPDF } from "../controllers/cvPdf.controller";

const router = Router();

router.get("/employees/:id/cv/pdf", generateEmployeeCVPDF);

export default router;