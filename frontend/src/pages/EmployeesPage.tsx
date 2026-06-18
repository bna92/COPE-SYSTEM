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
      .includes(search.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <h2 className="text-xl font-semibold text-slate-700">
          Cargando empleados...
        </h2>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Sistema COPE
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">
                Empleados
              </h1>
              <p className="mt-2 text-slate-500">
                Consulta colaboradores, genera CVs y abre PDFs automáticamente.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 px-5 py-3 text-center">
              <p className="text-2xl font-bold text-blue-700">
                {employees.length}
              </p>
              <p className="text-sm text-blue-600">empleados</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <input
            type="text"
            placeholder="Buscar por código, nombre, puesto o empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
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
                  <tr
                    key={employee.id}
                    className="transition hover:bg-slate-50"
                  >
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
        </div>
      </section>
    </main>
  );
}