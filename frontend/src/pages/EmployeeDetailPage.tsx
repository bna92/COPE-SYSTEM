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
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <h2 className="text-xl font-semibold text-slate-700">Cargando CV...</h2>
      </main>
    );
  }

  if (!cv) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <h2 className="text-xl font-semibold text-red-600">
          No se encontró información del empleado.
        </h2>
      </main>
    );
  }

  const { employee } = cv;

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <Link to="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800">
              ← Volver a empleados
            </Link>

            <h1 className="mt-4 text-4xl font-bold text-slate-900">
              {employee.full_name}
            </h1>

            <p className="mt-2 text-slate-500">
              {employee.position || "Sin puesto"} · {employee.company}
            </p>
          </div>

          <a
            href={getEmployeeCVPdfUrl(String(employee.id))}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Abrir PDF
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Código</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{employee.employee_code}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Departamento</p>
            <p className="mt-1 font-semibold text-slate-900">{employee.department || "N/A"}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Profesión</p>
            <p className="mt-1 font-semibold text-slate-900">{employee.profession || "N/A"}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Empresa</p>
            <p className="mt-1 font-semibold text-slate-900">{employee.company || "N/A"}</p>
          </div>
        </div>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Experiencia relevante
          </h2>

          <div className="space-y-3">
            {cv.relevantExperience.map((item) => (
              <p key={item.order_number} className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {item.description}
              </p>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Capacitación interna
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {cv.internalTraining.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                <p className="text-sm font-bold text-slate-900">
                  {item.course_code} - {item.course_name}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  Fecha inicial: {formatDate(item.initial_date)} · Refrendo:{" "}
                  {formatDate(item.latest_renewal_date)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Capacitación externa
          </h2>

          <div className="space-y-4">
            {cv.externalTraining.map((item, index) => (
              <div key={index} className="rounded-xl border border-slate-200 p-4">
                <p className="font-bold text-slate-900">{item.course_name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {item.training_provider} · {item.training_date}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Experiencia laboral
          </h2>

          <div className="space-y-6">
            {cv.workExperience.map((work) => (
              <div key={work.id} className="rounded-xl border border-slate-200 p-5">
                <h3 className="text-lg font-bold text-slate-900">
                  {work.period} · {work.company}
                </h3>

                <p className="mt-1 text-sm font-semibold text-blue-600">
                  {work.position}
                </p>

                <div className="mt-4 space-y-2">
                  {work.activities.map((activity) => (
                    <p key={activity.order_number} className="text-sm leading-6 text-slate-700">
                      • {activity.activity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}