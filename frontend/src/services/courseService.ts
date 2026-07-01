import type { Course, CourseEmployee, CourseDetail } from "../types/course";



const API_URL = "http://localhost:4000/api";

export async function getCourses(): Promise<Course[]> {
  const response = await fetch(`${API_URL}/courses`);

  if (!response.ok) {
    throw new Error("Error fetching courses");
  }

  return response.json();
}

export async function getCourseEmployees(
  courseId: string
): Promise<CourseEmployee[]> {
  const response = await fetch(`${API_URL}/courses/${courseId}/employees`);

  if (!response.ok) {
    throw new Error("Error fetching course employees");
  }

  return response.json();
}


export async function getCourseById(courseId: string): Promise<CourseDetail> {
  const response = await fetch(`${API_URL}/courses/${courseId}`);

  if (!response.ok) {
    throw new Error("Error fetching course detail");
  }

  return response.json();
}
