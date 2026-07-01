import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
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
import type { WorkCenterStats } from "../types/workCenterStats";
import type { CompanyStats } from "../types/companyStats";

function useScreenSize() {
  const [screen, setScreen] = useState({
    isMobile: false,
    isLaptop: false,
    isDesktop: false,
  });

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;

      setScreen({
        isMobile: width < 768,
        isLaptop: width >= 768 && width < 1536,
        isDesktop: width >= 1536,
      });
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return screen;
}

export default function DashboardPage() {
  const { isMobile, isLaptop, isDesktop } = useScreenSize();

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

  const companyLabels = companyStats.map((item) => item.company || "N/A");
  const companyValues = companyStats.map((item) => Number(item.total));

  const workCenterLabels = workCenterStats.map(
    (item) => item.workCenter || "N/A"
  );
  const workCenterValues = workCenterStats.map((item) => Number(item.total));

  const companyChartHeight = isMobile ? 230 : isLaptop ? 280 : 320;

  const workCenterChartHeight = isMobile
    ? Math.max(420, workCenterStats.length * 42)
    : isLaptop
    ? Math.max(520, workCenterStats.length * 38)
    : Math.max(560, workCenterStats.length * 34);

  const companyOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: isMobile ? "45%" : "50%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: companyLabels,
      labels: {
        style: {
          fontSize: isMobile ? "10px" : "12px",
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        maxWidth: isMobile ? 130 : 220,
        style: {
          fontSize: isMobile ? "10px" : "12px",
          colors: "#334155",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} employees`,
      },
    },
    colors: ["#2563eb"],
  };

  const companySeries = [
    {
      name: "Employees",
      data: companyValues,
    },
  ];

  const workCenterOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: isMobile ? "45%" : "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: workCenterLabels,
      labels: {
        style: {
          fontSize: isMobile ? "10px" : "12px",
          colors: "#64748b",
        },
      },
    },
    yaxis: {
      labels: {
        maxWidth: isMobile ? 130 : isLaptop ? 180 : 220,
        style: {
          fontSize: isMobile ? "10px" : isLaptop ? "11px" : "12px",
          colors: "#334155",
        },
      },
    },
    grid: {
      borderColor: "#e2e8f0",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} employees`,
      },
    },
    colors: ["#2563eb"],
  };

  const workCenterSeries = [
    {
      name: "Employees",
      data: workCenterValues,
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

        <Chart
          options={companyOptions}
          series={companySeries}
          type="bar"
          height={companyChartHeight}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
        <h2 className="text-lg font-semibold mb-4">
          Employees by Work Center
        </h2>

        <Chart
          options={workCenterOptions}
          series={workCenterSeries}
          type="bar"
          height={workCenterChartHeight}
        />
      </div>
    </div>
  );
}