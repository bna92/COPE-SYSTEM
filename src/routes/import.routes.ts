import { Router } from "express";
import multer from "multer";
import {
  importCopeExcel,
  importCopeCourses,
  importCopeInternalTraining,
  previewCopeSheet,
} from "../controllers/import.controller";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/cope", upload.single("file"), importCopeExcel);
router.post("/preview/:sheetName", upload.single("file"), previewCopeSheet);
router.post("/courses", upload.single("file"), importCopeCourses);
router.post("/internal-training", upload.single("file"), importCopeInternalTraining,);
export default router;
