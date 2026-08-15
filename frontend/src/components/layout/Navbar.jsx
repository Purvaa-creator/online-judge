import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, role, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-border-subtle/80 bg-bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-semibold text-text-primary">
          Online Judge
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
          <Link to="/" className="transition-colors hover:text-accent-primary">
            Home
          </Link>
          <Link to="/problems" className="transition-colors hover:text-accent-primary">
            Problems
          </Link>
          {isAuthenticated ? (
            <>
              {role === "admin" ? (
                <Link to="/admin" className="transition-colors hover:text-accent-secondary">
                  Admin
                </Link>
              ) : null}
              <Link to="/submissions" className="transition-colors hover:text-accent-primary">
                Submissions
              </Link>
              <Link to="/profile" className="transition-colors hover:text-accent-primary">
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors hover:text-accent-primary"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-colors hover:text-accent-primary">
                Login
              </Link>
              <Link to="/register" className="transition-colors hover:text-accent-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;