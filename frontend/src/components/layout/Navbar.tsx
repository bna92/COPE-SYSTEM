export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          COPE Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Competency and training management
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-700">Admin</p>
          <p className="text-xs text-slate-400">System user</p>
        </div>

        <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          A
        </div>
      </div>
    </header>
  );
}