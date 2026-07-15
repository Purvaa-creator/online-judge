import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  const tabs = [
    {
      to: "/admin",
      label: "Dashboard",
    },
    {
      to: "/admin/problems",
      label: "Manage Problems",
    },
    {
      to: "/admin/users",
      label: "Users",
    },
    {
      to: "/admin/submissions",
      label: "All Submissions",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-white/10 bg-white/5 shadow-lg">
        <div className="border-b border-white/10 px-6 pt-6 sm:px-8">
          <nav className="-mb-px flex flex-wrap gap-2 overflow-x-auto text-sm font-medium text-paper/60">
            {tabs.map((tab) => (
              <Link
                key={tab.to}
                to={tab.to}
                className="rounded-t-xl border-b-2 border-transparent px-4 py-3 transition-colors hover:border-signal hover:text-signal"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;