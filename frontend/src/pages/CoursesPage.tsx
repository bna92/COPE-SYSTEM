import { useEffect, useState } from "react";
import { getCourses } from "../services/courseService";
import type { Course } from "../types/course";
import { Link } from "react-router-dom";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    `${course.course_code} ${course.course_name} ${course.course_revision ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-slate-500">Loading courses...</p>;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          COPE System
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
              Courses
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-500">
              View registered courses, codes and revisions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-auto rounded-xl bg-blue-50 px-5 py-3 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {courses.length}
              </p>
              <p className="text-sm text-blue-600">courses</p>
            </div>

            <Link
              to="/reports/expired-training"
              className="flex items-center justify-center rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Expired Training
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search by code, course name or revision..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm md:text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </section>

      {/* Mobile cards */}
      <section className="grid gap-4 md:hidden">
        {filteredCourses.map((course) => (
          <article
            key={course.id}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 break-words">
                  {course.course_name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Revision: {course.course_revision || "N/A"}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {course.course_code}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Trained Employees
              </p>

              <p className="font-semibold text-blue-700">
                {course.trained_employees}
              </p>
            </div>

            <div className="mt-4 text-sm">
              <p className="text-xs font-semibold uppercase text-slate-400">
                Excel Course ID
              </p>
              <p className="text-slate-700">
                {course.excel_course_id ?? "N/A"}
              </p>
            </div>
          </article>
        ))}

        {filteredCourses.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            No courses found.
          </div>
        )}
      </section>

      {/* Desktop table */}
      <section className="hidden md:block overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold">Code</th>
                <th className="px-5 py-4 text-sm font-semibold">Course</th>
                <th className="px-5 py-4 text-sm font-semibold">Revision</th>
                <th className="px-5 py-4 text-sm font-semibold">Trained Employees</th>
                <th className="px-5 py-4 text-sm font-semibold">Excel Course ID</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredCourses.map((course) => (
                <tr key={course.id}>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {course.course_code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {course.course_name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.course_revision || "N/A"}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-blue-700">
                    {course.trained_employees}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {course.excel_course_id ?? "N/A"}
                  </td>
                </tr>
              ))}

              {filteredCourses.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}