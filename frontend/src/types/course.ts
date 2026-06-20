export interface Course {
    id: number;
    course_code: string;
    course_name: string;
    course_revision: string | null;
    created_at: string | null;
    excel_course_id: number | null;
    trained_employees: number;
}