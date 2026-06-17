import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmployeesPage from "../pages/EmployeesPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeesPage />} />
      </Routes>
    </BrowserRouter>
  );
}