import { Navigate } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext.jsx";

function AdminRoute({ children }) {
  const { isAuthenticated, role, hydrating } = useAuth();

  if (hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
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