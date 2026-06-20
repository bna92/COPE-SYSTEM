import { useEffect, useState } from "react";
import type { DashboardStats } from "../types/dashboard";
import { FaUsers, FaBook, FaGraduationCap, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { RecentEmployee } from "../types/recentEmployee";
import {
  getDashboardStats,
  getRecentEmployees,
  getEmployeesByWorkCenter,
  getEmployeesByCompany,
} from "../services/dashboardService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WorkCenterStats } from "../types/workCenterStats";
import type { CompanyStats } from "../types/companyStats";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return isMobile;
}

export default function DashboardPage() {
  const isMobile = useIsMobile();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recentEmployees, setRecentEmployees] = useState<RecentEmployee[]>([]);
  const [workCenterStats, setWorkCenterStats] = useState<WorkCenterStats[]>([]);
  const [companyStats, setCompanyStats] = useState<CompanyStats[]>([]);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setError("Could not load dashboard statistics."))
      .finally(() => setLoading(false));

    getRecentEmployees().then(setRecentEmployees).catch(console.error);
    getEmployeesByWorkCenter().then(setWorkCenterStats).catch(console.error);
    getEmployeesByCompany().then(setCompanyStats).catch(console.error);
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  const cards = [
    {
      title: "Employees",
      value: stats?.employees ?? 0,
      icon: <FaUsers size={24} />,
    },
    {
      title: "Courses",
      value: stats?.courses ?? 0,
      icon: <FaBook size={24} />,
    },
    {
      title: "Internal Training",
      value: stats?.internalTraining ?? 0,
      icon: <FaGraduationCap size={24} />,
    },
    {
      title: "External Training",
      value: stats?.externalTraining ?? 0,
      icon: <FaAward size={24} />,
    },
  ];

  return (
    <div className="space-y-6 overflow-x-hidden">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-slate-500">
          Overview of employees, courses and training records.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 md:p-6"
          >
            <div className="flex justify-between items-center gap-4">
              <div>
                <p className="text-slate-500 text-sm">{card.title}</p>
                <h2 className="text-2xl md:text-3xl font-bold mt-2">
                  {card.value}
                </h2>
              </div>

              <div className="text-blue-600 shrink-0">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            to="/employees"
            className="text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Employees
          </Link>

          <Link
            to="/courses"
            className="text-center px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition"
          >
            Courses
          </Link>

          <Link
            to="/reports"
            className="text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Reports
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Employees</h2>

        <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase mb-2">
          <span>Employee</span>
          <span className="w-20 text-center">Code</span>
        </div>

        <div className="space-y-3">
          {recentEmployees.map((employee) => (
            <div
              key={employee.id}
              className="flex justify-between items-start gap-4 border-b border-slate-100 pb-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {employee.full_name}
                </p>

                <p className="text-sm text-slate-500 truncate">
                  {employee.position}
                </p>

                <p className="text-xs text-slate-400 truncate">
                  {employee.department}
                </p>
              </div>

              <span className="w-20 text-center text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full shrink-0">
                {employee.employee_code}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">Employees by Company</h2>

        <div className="h-[120px] md:h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            {isMobile ? (
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companyStats}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 10,
                      left: -40,
                      bottom: 10,
                    }}
                  >
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      domain={[0, 150]}
                      ticks={[0, 25, 50, 75, 100, 125, 150]}
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="company"
                      width={120}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="total"
                      fill="#2563eb"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <BarChart data={companyStats} barCategoryGap="120%">
                <XAxis
                  dataKey="company"
                  angle={-90}
                  textAnchor="end"
                  interval={0}
                  height={180}
                  tick={{ fontSize: 11 }}
                  tickMargin={25}
                  padding={{
                    left: 0,
                    right: 1340,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, 150]}
                  ticks={[0, 25, 50, 75, 100, 125, 150]}
                />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">
          Employees by Work Center
        </h2>

        <div className="h-[520px] md:h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            {isMobile ? (
              <div className="h-[900px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workCenterStats}
                    layout="vertical"
                    margin={{
                      top: 10,
                      right: 10,
                      left: -40,
                      bottom: 10,
                    }}
                  >
                    <XAxis
                      type="number"
                      allowDecimals={false}
                      ticks={[0, 5, 10, 15, 20, 25]}
                      tick={{ fontSize: 10 }}
                    />

                    <YAxis
                      type="category"
                      dataKey="workCenter"
                      width={120}
                      interval={0}
                      tick={{ fontSize: 10 }}
                    />

                    <Tooltip />

                    <Bar
                      dataKey="total"
                      fill="#2563eb"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <BarChart
                data={workCenterStats}
                margin={{ top: 10, right: 30, left: 0, bottom: 150 }}
              >
                <XAxis
                  dataKey="workCenter"
                  angle={-90}
                  textAnchor="end"
                  interval={0}
                  height={80}
                  tick={{ fontSize: 15 }}
                  tickMargin={25}
                  padding={{
                    left: 0,
                    right: 200,
                  }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 15 }}
                  ticks={[0, 5, 10, 15, 20, 25]}
                />

                <Tooltip />

                <Bar
                  dataKey="total"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}