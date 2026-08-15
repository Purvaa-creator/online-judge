import { useEffect, useState } from "react";
import { Card, EmptyState, ErrorState, Spinner } from "../../components/ui/SharedComponents.jsx";
import { getStats } from "../../services/adminService.js";

function AdminDashboard() {
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
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-border-subtle/80 bg-bg-surface/70 px-4 py-8 text-sm text-text-secondary">
        <Spinner />
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!stats) {
    return <EmptyState message="No admin dashboard data is available right now." />;
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Overview of platform activity and admin tools.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.label} className="p-5">
            <p className="text-sm font-medium text-text-secondary">{card.label}</p>
            <p className="mt-3 text-3xl font-semibold text-text-primary">
              {card.value ?? 0}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;