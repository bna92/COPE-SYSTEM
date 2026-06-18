import type { Employee } from "./employee";

export interface RelevantExperience {
  description: string;
  order_number: number;
}

export interface InternalTraining {
  id: number;
  course_code: string;
  course_name: string;
  initial_date: string | null;
  latest_renewal_date: string | null;
}

export interface ExternalTraining {
  course_name: string;
  training_provider: string;
  training_date: string;
}

export interface WorkExperienceActivity {
  activity: string;
  order_number: number;
}

export interface WorkExperience {
  id: number;
  period: string;
  company: string;
  position: string;
  activities: WorkExperienceActivity[];
}

export interface EmployeeCV {
  employee: Employee;
  relevantExperience: RelevantExperience[];
  internalTraining: InternalTraining[];
  externalTraining: ExternalTraining[];
  workExperience: WorkExperience[];
}