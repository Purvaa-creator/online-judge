import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/AuthContext.jsx";

function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-lg font-semibold text-slate-900">
          Online Judge
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <Link to="/" className="transition-colors hover:text-slate-900">
            Home
          </Link>
          <Link to="/problems" className="transition-colors hover:text-slate-900">
            Problems
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/submissions" className="transition-colors hover:text-slate-900">
                Submissions
              </Link>
              <Link to="/profile" className="transition-colors hover:text-slate-900">
                Profile
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors hover:text-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="transition-colors hover:text-slate-900">
                Login
              </Link>
              <Link to="/register" className="transition-colors hover:text-slate-900">
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