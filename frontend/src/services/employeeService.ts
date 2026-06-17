import axios from "axios";
import type { Employee } from "../types/employee";

const API_URL = "http://localhost:4000/api";

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await axios.get<Employee[]>(`${API_URL}/employees`);
  return response.data;
};