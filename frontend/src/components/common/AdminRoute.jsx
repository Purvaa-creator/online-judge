import { Navigate } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext.jsx";
import { Card, Spinner } from "../ui/SharedComponents.jsx";

function AdminRoute({ children }) {
  const { isAuthenticated, role, hydrating } = useAuth();

  if (hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="flex items-center gap-3 px-6 py-4 text-text-secondary">
          <Spinner />
          <span>Checking admin access...</span>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/problems" replace />;
  }

  return children;
}

export default AdminRoute;