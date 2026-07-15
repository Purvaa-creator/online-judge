import { useEffect, useState } from "react";
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
        <h1 className="text-2xl font-semibold text-paper">Users</h1>
        <p className="text-sm text-paper/60">View all registered accounts.</p>
      </div>

      {loading ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
          Loading users...
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-6 text-sm text-paper/60">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  Username
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-paper/40">
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-white/5">
              {users.map((user) => {
                const userId = user?.id ?? "";
                const createdAt = formatCreatedAt(
                  user?.created_at ?? user?.createdAt ?? user?.createdAt
                );

                return (
                  <tr key={userId} className="transition hover:bg-white/10">
                    <td className="px-4 py-4 text-sm text-paper/80">{userId}</td>
                    <td className="px-4 py-4 text-sm font-medium text-paper">
                      {user?.username ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-paper/80">
                      {user?.email ?? "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-paper/80">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${getRoleBadgeClasses(
                          user?.role
                        )}`}
                      >
                        {user?.role ?? "user"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-paper/80">{createdAt}</td>
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