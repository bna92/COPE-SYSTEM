export interface ExpiredTraining {
  employee_code: string;
  full_name: string;
  company: string | null;
  work_center: string | null;
  course_code: string | null;
  course_name: string | null;
  base_date: string | null;
  expiration_date: string;
  days_expired: number;
}