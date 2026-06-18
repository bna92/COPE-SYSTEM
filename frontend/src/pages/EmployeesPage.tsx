import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getEmployees } from "../services/employeeService";
import type { Employee } from "../types/employee";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.employee_code} ${employee.full_name} ${employee.position} ${employee.company}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <h2 className="text-lg md:text-xl font-semibold text-slate-700">
          Cargando empleados...
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Sistema COPE
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
              Empleados
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-500">
              Consulta colaboradores, genera CVs y abre PDFs automáticamente.
            </p>
          </div>

          <div className="w-full md:w-auto rounded-xl bg-blue-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-blue-700">
              {employees.length}
            </p>
            <p className="text-sm text-blue-600">empleados</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Buscar por código, nombre, puesto o empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm md:text-base text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </section>

      {/* Mobile cards */}
      <section className="grid gap-4 md:hidden">
        {filteredEmployees.map((employee) => (
          <article
            key={employee.id}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 truncate">
                  {employee.full_name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {employee.profession || "Sin profesión registrada"}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {employee.employee_code}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Puesto
                </p>
                <p className="text-slate-700">
                  {employee.position || "Sin puesto"}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Empresa
                </p>
                <p className="text-slate-700">
                  {employee.company || "Sin empresa"}
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-center text-sm font-semibold">
              <a
                href={`http://localhost:4000/api/employees/${employee.id}/cv/pdf`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
              >
                PDF
              </a>

              <Link
                to={`/employees/${employee.id}`}
                className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                CV
              </Link>
            </div>
          </article>
        ))}

        {filteredEmployees.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            No se encontraron empleados.
          </div>
        )}
      </section>

      {/* Desktop table */}
      <section className="hidden md:block overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-5 py-4 text-sm font-semibold">Código</th>
                <th className="px-5 py-4 text-sm font-semibold">Nombre</th>
                <th className="px-5 py-4 text-sm font-semibold">Puesto</th>
                <th className="px-5 py-4 text-sm font-semibold">Empresa</th>
                <th className="px-5 py-4 text-sm font-semibold text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {employee.employee_code}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {employee.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {employee.profession || "Sin profesión registrada"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {employee.position || "Sin puesto"}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {employee.company || "Sin empresa"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold">
                      <a
                        href={`http://localhost:4000/api/employees/${employee.id}/cv/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                      >
                        PDF
                      </a>

                      <Link
                        to={`/employees/${employee.id}`}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                      >
                        CV
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No se encontraron empleados.
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