import axios from "axios";
import type { EmployeeCV } from "../types/cv";

const API_URL = "http://localhost:4000/api";

export const getEmployeeCV = async (id: string): Promise<EmployeeCV> => {
  const response = await axios.get<EmployeeCV>(`${API_URL}/employees/${id}/cv`);
  return response.data;
};

export const getEmployeeCVPdfUrl = (id: string) => {
  return `${API_URL}/employees/${id}/cv/pdf`;
};