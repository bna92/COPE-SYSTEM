import type { DashboardStats } from "../types/dashboard";
import type { RecentEmployee } from "../types/recentEmployee";
import type { WorkCenterStats } from "../types/workCenterStats";

const API_URL = "http://localhost:4000/api";

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(`${API_URL}/dashboard/stats`);

  if (!response.ok) {
    throw new Error("Error fetching dashboard stats");
  }

  return response.json();
}

export async function getRecentEmployees(): Promise<RecentEmployee[]> {
  const response = await fetch(
    "http://localhost:4000/api/dashboard/recent-employees",
  );

  if (!response.ok) {
    throw new Error("Error fetching recent employees");
  }

  return response.json();
}

export async function getEmployeesByWorkCenter(): Promise<WorkCenterStats[]> {
  const response = await fetch(
    "http://localhost:4000/api/dashboard/employees-by-department",
  );

  if (!response.ok) {
    throw new Error("Error fetching employees by department");
  }

  return response.json();
}

import type { CompanyStats } from "../types/companyStats";

export async function getEmployeesByCompany(): Promise<CompanyStats[]> {
  const response = await fetch(
    "http://localhost:4000/api/dashboard/employees-by-company",
  );

  if (!response.ok) {
    throw new Error("Error fetching employees by company");
  }

  return response.json();
}
