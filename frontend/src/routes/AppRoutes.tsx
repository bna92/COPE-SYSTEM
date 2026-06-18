import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeesPage from "../pages/EmployeesPage";
import EmployeeDetailPage from "../pages/EmployeeDetailPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}