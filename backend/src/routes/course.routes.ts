import { Router } from "express";
import { getCourses, createCourse, getCourseEmployees, getCourseById } from "../controllers/course.controller";


const router = Router();

router.get("/", getCourses);
router.post("/", createCourse);
router.get("/:id", getCourseById);
router.get("/:id/employees", getCourseEmployees);

export default router;