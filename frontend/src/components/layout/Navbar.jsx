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
    <nav className="border-b border-white/10 bg-ink">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-lg font-semibold text-paper">
          Online Judge
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-paper/70">
          <Link to="/" className="transition-colors hover:text-signal">
            Home
          </Link>
          <Link to="/problems" className="transition-colors hover:text-signal">
            Problems
          </Link>
          {isAuthenticated ? (
            <>
              {role === "admin" ? (
                <Link to="/admin" className="transition-colors hover:text-signal">
                  Admin
                </Link>
              ) : null}
              <Link to="/submissions" className="transition-colors hover:text-signal">
                Submissions
              </Link>
              <Link to="/profile" className="transition-colors hover:text-signal">
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors hover:text-signal"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-colors hover:text-signal">
                Login
              </Link>
              <Link to="/register" className="transition-colors hover:text-signal">
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