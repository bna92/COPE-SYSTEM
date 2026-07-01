import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCourseEmployees, getCourseById } from "../services/courseService";
import type { CourseEmployee, CourseDetail } from "../types/course";

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-MX");
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [employees, setEmployees] = useState<CourseEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!id) return;

    Promise.all([getCourseById(id), getCourseEmployees(id)])
      .then(([courseData, employeesData]) => {
        setCourse(courseData);
        setEmployees(employeesData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.employee_code} ${employee.full_name} ${employee.company ?? ""} ${
      employee.work_center ?? ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return <p className="text-slate-500">Loading course employees...</p>;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <Link
          to="/courses"
          className="text-sm font-semibold text-blue-600 hover:text-blue-800"
        >
          ← Back to courses
        </Link>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Course Detail
            </p>

            <h1 className="mt-2 text-2xl md:text-4xl font-bold text-slate-900">
              {course?.course_code}
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500">
              {course?.course_name}
            </p>

            {course?.course_revision && (
              <p className="mt-1 text-xs font-semibold text-slate-400">
                Revision: {course.course_revision}
              </p>
            )}
          </div>

          <div className="w-full md:w-auto rounded-xl bg-blue-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">
              {employees.length}
            </p>
            <p className="text-sm text-blue-600">employees</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search by employee, company or work center..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm md:text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </section>

      {/* Mobile cards */}
      <section className="grid gap-4 lg:hidden">
        {filteredEmployees.map((employee) => (
          <article
            key={employee.id}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 break-words">
                  {employee.full_name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {employee.employee_code}
                </p>
              </div>

              <Link
                to={`/employees/${employee.id}`}
                className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                CV
              </Link>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Company / Work Center
                </p>
                <p className="text-slate-700">
                  {employee.company || "N/A"} · {employee.work_center || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Course Date
                  </p>
                  <p className="text-slate-700">
                    {formatDate(employee.initial_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Next Renewal
                  </p>
                  <p className="font-semibold text-blue-700">
                    {formatDate(employee.next_renewal)}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            No employees found for this course.
          </div>
        )}
      </section>

      {/* Desktop table */}
      <section className="hidden lg:block overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold">Employee</th>
                <th className="px-5 py-4 text-sm font-semibold">Company</th>
                <th className="px-5 py-4 text-sm font-semibold">Work Center</th>
                <th className="px-5 py-4 text-sm font-semibold">Course Date</th>
                <th className="px-5 py-4 text-sm font-semibold">
                  Next Renewal
                </th>
                <th className="px-5 py-4 text-sm font-semibold text-center">
                  CV
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {employee.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {employee.employee_code}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {employee.company || "N/A"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {employee.work_center || "N/A"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(employee.initial_date)}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-blue-700">
                    {formatDate(employee.next_renewal)}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <Link
                      to={`/employees/${employee.id}`}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      View CV
                    </Link>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No employees found for this course.
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
