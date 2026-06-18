import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Employees",
      path: "/employees",
    },
    {
      name: "Courses",
      path: "/courses",
    },
    {
      name: "Reports",
      path: "/reports",
    },
    {
      name: "Settings",
      path: "/settings",
    },
  ];

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col bg-slate-950 text-white fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">COPE System</h1>
        <p className="text-sm text-slate-400">
          Employee Management
        </p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}