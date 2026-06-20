import type { Course } from "../types/course";

const API_URL = "http://localhost:4000/api";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error("Error fetching courses");
  }

  return response.json();
}