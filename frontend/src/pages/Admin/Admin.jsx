import { useEffect, useState } from "react";
import { getStats } from "../../services/adminService.js";

function Admin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        setLoading(true);
        setError("");

        const adminStats = await getStats();

        if (isMounted) {
          setStats(adminStats ?? null);
        }
      } catch (statsError) {
        const backendMessage =
          statsError?.response?.data?.message ||
          statsError?.message ||
          "Failed to load admin dashboard.";

        if (isMounted) {
          setError(backendMessage);
          setStats(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
          <p className="text-sm text-slate-600">Failed to load admin dashboard.</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
    },
    {
      label: "Total Problems",
      value: stats.totalProblems,
    },
    {
      label: "Total Submissions",
      value: stats.totalSubmissions,
    },
    {
      label: "Accepted Submissions",
      value: stats.acceptedSubmissions,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:p-8">
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
            <p className="mt-2 text-sm text-slate-600">
              Overview of platform activity and admin tools.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-700">
              Manage Problems
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-700">
              Users
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-700">
              All Submissions
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-slate-600">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {card.value ?? 0}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Admin;