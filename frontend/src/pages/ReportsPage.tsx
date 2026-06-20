import { Link } from "react-router-dom";

const reports = [
  {
    title: "Employees Report",
    description: "View employee information, work centers and company data.",
    path: "/employees",
    status: "Available",
  },
  {
    title: "Courses Report",
    description:
      "View courses, trained employees and expired training records.",
    path: "/courses",
    status: "Available",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="rounded-2xl bg-white p-5 md:p-6 shadow-sm border border-slate-200">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          COPE System
        </p>

        <h1 className="mt-2 text-2xl md:text-4xl font-bold text-slate-900">
          Reports
        </h1>

        <p className="mt-2 text-sm md:text-base text-slate-500">
          Access employee and course reports for COPE management.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-slate-900">{report.title}</h2>

                <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {report.status}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {report.description}
              </p>
            </div>

            <Link
              to={report.path}
              className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Open Report
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}