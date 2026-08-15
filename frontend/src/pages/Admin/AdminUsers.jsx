import { useEffect, useState } from "react";
import { Card, EmptyState, ErrorState, Spinner } from "../../components/ui/SharedComponents.jsx";
import { getAllUsers } from "../../services/adminService.js";

function getRoleBadgeClasses(role) {
  const normalizedRole = String(role ?? "").toLowerCase();

  if (normalizedRole === "admin") {
    return "border border-signal text-signal font-display uppercase tracking-wider";
  }

  return "border border-paper/30 text-paper/60 font-display uppercase tracking-wider";
}

function formatCreatedAt(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const usersResponse = await getAllUsers();

        if (isMounted) {
          setUsers(Array.isArray(usersResponse) ? usersResponse : []);
        }
      } catch (usersError) {
        const backendMessage =
          usersError?.response?.data?.message ||
          usersError?.message ||
          "Failed to load users.";

        if (isMounted) {
          setError(backendMessage);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-text-primary">Users</h1>
        <p className="text-sm text-text-secondary">View all registered accounts.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-border-subtle/80 bg-bg-surface/70 px-4 py-6 text-sm text-text-secondary">
          <Spinner />
          <span>Loading users...</span>
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => window.location.reload()} />
      ) : users.length === 0 ? (
        <EmptyState message="No users found." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border-subtle/80">
          <table className="min-w-full divide-y divide-border-subtle/80">
            <thead className="bg-bg-surface-hover/80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Username</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-text-secondary">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/80 bg-bg-surface/70">
              {users.map((user) => {
                const userId = user?.id ?? "";
                const createdAt = formatCreatedAt(
                  user?.created_at ?? user?.createdAt ?? user?.createdAt
                );

                return (
                  <tr key={userId} className="transition hover:bg-bg-surface-hover/70">
                    <td className="px-4 py-4 text-sm text-text-secondary">{userId}</td>
                    <td className="px-4 py-4 text-sm font-medium text-text-primary">
                      {user?.username ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      {user?.email ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getRoleBadgeClasses(
                          user?.role
                        )}`}
                      >
                        {user?.role ?? "user"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-text-secondary">{createdAt}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;