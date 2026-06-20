import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import EmployeeDetailPage from "../pages/EmployeeDetailPage";
import CoursesPage from "../pages/CoursesPage";
import ReportsPage from "../pages/ReportsPage";
import SettingsPage from "../pages/SettingsPage";
import ExpiredTrainingReportPage from "../pages/ExpiredTrainingReportPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<DashboardPage />} />

        <Route path="/employees" element={<EmployeesPage />} />

        <Route
          path="/employees/:id"
          element={<EmployeeDetailPage />}
        />

        <Route path="/courses" element={<CoursesPage />} />

        <Route path="/reports/expired-training" element={<ExpiredTrainingReportPage />}/>

        <Route path="/reports" element={<ReportsPage />} />

        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}