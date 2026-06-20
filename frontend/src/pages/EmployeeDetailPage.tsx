import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEmployeeCV, getEmployeeCVPdfUrl } from "../services/cvService";
import type { EmployeeCV } from "../types/cv";

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-MX");
};

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [cv, setCv] = useState<EmployeeCV | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCV = async () => {
      if (!id) return;

      try {
        const data = await getEmployeeCV(id);
        setCv(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadCV();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <h2 className="text-lg md:text-xl font-semibold text-slate-700">
          Cargando CV...
        </h2>
      </div>
    );
  }

  if (!cv) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center">
        <h2 className="text-lg md:text-xl font-semibold text-red-600">
          No se encontró información del empleado.
        </h2>
      </div>
    );
  }

  const { employee } = cv;

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <Link
              to="/employees"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              ← Back to employees
            </Link>

            <h1 className="mt-4 text-2xl md:text-4xl font-bold text-slate-900 break-words">
              {employee.full_name}
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500">
              {employee.position || "No position"} ·{" "}
              {employee.company || "No company"}
            </p>
          </div>

          <a
            href={getEmployeeCVPdfUrl(String(employee.id))}
            target="_blank"
            rel="noreferrer"
            className="w-full lg:w-auto rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Open PDF
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Code</p>
          <p className="mt-1 text-xl font-bold text-slate-900">
            {employee.employee_code}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Work Center</p>
          <p className="mt-1 font-semibold text-slate-900">
            {employee.department || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Profession</p>
          <p className="mt-1 font-semibold text-slate-900">
            {employee.profession || "N/A"}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500">Company</p>
          <p className="mt-1 font-semibold text-slate-900">
            {employee.company || "N/A"}
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-slate-900">
          Relevant Experience
        </h2>

        {cv.relevantExperience.length > 0 ? (
          <div className="space-y-3">
            {cv.relevantExperience.map((item) => (
              <p
                key={item.order_number}
                className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700"
              >
                {item.description}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No relevant experience registered.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-slate-900">
          Internal Training
        </h2>

        {cv.internalTraining.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cv.internalTraining.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-sm font-bold text-slate-900 break-words">
                  {item.course_code} - {item.course_name}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Initial date: {formatDate(item.initial_date)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Latest renewal: {formatDate(item.latest_renewal_date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No internal training registered.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-slate-900">
          External Training
        </h2>

        {cv.externalTraining.length > 0 ? (
          <div className="space-y-4">
            {cv.externalTraining.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="font-bold text-slate-900 break-words">
                  {item.course_name}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {item.training_provider || "N/A"} ·{" "}
                  {formatDate(item.training_date)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No external training registered.
          </p>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-xl md:text-2xl font-bold text-slate-900">
          Work Experience
        </h2>

        {cv.workExperience.length > 0 ? (
          <div className="space-y-6">
            {cv.workExperience.map((work) => (
              <div
                key={work.id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <h3 className="text-base md:text-lg font-bold text-slate-900 break-words">
                  {work.period} · {work.company}
                </h3>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {work.position}
                </p>

                <div className="mt-4 space-y-2">
                  {work.activities.map((activity) => (
                    <p
                      key={activity.order_number}
                      className="text-sm leading-6 text-slate-700"
                    >
                      • {activity.activity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No work experience registered.
          </p>
        )}
      </section>
    </div>
  );
}