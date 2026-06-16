import { Router } from "express";
import multer from "multer";
import {
  importCopeExcel,
  importCopeCourses,
  importCopeInternalTraining,
  previewCopeSheet,
  importCopeExternalTraining,
  importCopeRelevantExperience,
  importCopeWorkExperience,
} from "../controllers/import.controller";

const router = Router();

const upload = multer({
  dest: "uploads/",
});

router.post("/cope", upload.single("file"), importCopeExcel);
router.post("/preview/:sheetName", upload.single("file"), previewCopeSheet);
router.post("/courses", upload.single("file"), importCopeCourses);
router.post("/internal-training", upload.single("file"), importCopeInternalTraining,);
router.post("/external-training", upload.single("file"), importCopeExternalTraining,);
router.post("/relevant-experience", upload.single("file"), importCopeRelevantExperience,);
router.post("/work-experience", upload.single("file"), importCopeWorkExperience,
);
export default router;
