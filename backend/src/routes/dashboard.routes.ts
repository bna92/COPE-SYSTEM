import { Router } from "express";
import { getDashboardStats, getRecentEmployees,  getEmployeesByWorkCenter, getEmployeesByCompany } from "../controllers/dashboard.controller";

const router = Router();

router.get("/stats", getDashboardStats);
router.get("/recent-employees", getRecentEmployees);
router.get("/employees-by-department", getEmployeesByWorkCenter);
router.get("/employees-by-company", getEmployeesByCompany);

export default router;