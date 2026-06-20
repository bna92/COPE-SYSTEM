import { useEffect, useState } from "react";
import { getExpiredTraining } from "../services/reportService";
import type { ExpiredTraining } from "../types/expiredTraining";

const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-MX");
};

export default function ExpiredTrainingReportPage() {
  const [records, setRecords] = useState<ExpiredTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getExpiredTraining()
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredRecords = records.filter((record) =>
    `${record.employee_code} ${record.full_name} ${record.company ?? ""} ${
      record.work_center ?? ""
    } ${record.course_code ?? ""} ${record.course_name ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return <p className="text-slate-500">Loading expired training report...</p>;
  }

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Training Report
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
              Expired Training
            </h1>
            <p className="mt-2 text-sm md:text-base text-slate-500">
              Employees with internal training records expired based on a
              3-year validity period.
            </p>
          </div>

          <div className="w-full md:w-auto rounded-xl bg-red-50 px-5 py-3 text-center">
            <p className="text-2xl font-bold text-red-700">
              {records.length}
            </p>
            <p className="text-sm text-red-600">expired records</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
        <input
          type="text"
          placeholder="Search by employee, company, work center or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm md:text-base text-slate-700 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100"
        />
      </section>

      {/* Mobile cards */}
      <section className="grid gap-4 lg:hidden">
        {filteredRecords.map((record, index) => (
          <article
            key={`${record.employee_code}-${record.course_code}-${index}`}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 break-words">
                  {record.full_name}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {record.employee_code}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                {record.days_expired} days
              </span>
            </div>

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Course
                </p>
                <p className="text-slate-700">
                  {record.course_code} - {record.course_name}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Company / Work Center
                </p>
                <p className="text-slate-700">
                  {record.company || "N/A"} · {record.work_center || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Base Date
                  </p>
                  <p className="text-slate-700">
                    {formatDate(record.base_date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase text-slate-400">
                    Expiration
                  </p>
                  <p className="font-semibold text-red-700">
                    {formatDate(record.expiration_date)}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}

        {filteredRecords.length === 0 && (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 border border-slate-200">
            No expired training records found.
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
                <th className="px-5 py-4 text-sm font-semibold">
                  Work Center
                </th>
                <th className="px-5 py-4 text-sm font-semibold">Course</th>
                <th className="px-5 py-4 text-sm font-semibold">Base Date</th>
                <th className="px-5 py-4 text-sm font-semibold">
                  Expiration
                </th>
                <th className="px-5 py-4 text-sm font-semibold">
                  Days Expired
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredRecords.map((record, index) => (
                <tr
                  key={`${record.employee_code}-${record.course_code}-${index}`}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {record.full_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.employee_code}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {record.company || "N/A"}
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {record.work_center || "N/A"}
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {record.course_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {record.course_code}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(record.base_date)}
                  </td>

                  <td className="px-5 py-4 text-sm font-semibold text-red-700">
                    {formatDate(record.expiration_date)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                      {record.days_expired}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No expired training records found.
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