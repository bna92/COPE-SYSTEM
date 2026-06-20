import type { ExpiredTraining } from "../types/expiredTraining";

const API_URL = "http://localhost:4000/api";

export async function getExpiredTraining(): Promise<ExpiredTraining[]> {
  const response = await fetch(`${API_URL}/reports/expired-training`);

  if (!response.ok) {
    throw new Error("Error fetching expired training report");
  }

  return response.json();
}