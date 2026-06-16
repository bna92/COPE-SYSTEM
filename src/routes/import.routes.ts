import { Router } from "express";
import multer from "multer";
import { importCopeExcel } from "../controllers/import.controller";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/cope", upload.single("file"), importCopeExcel);

export default router;