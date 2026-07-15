import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService.js";

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(username, email, password);
      navigate("/login");
    } catch (registerError) {
      const backendMessage = registerError?.response?.data?.message;
      setError(backendMessage || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-lg">
        <h1 className="text-2xl font-semibold text-paper">Register</h1>
        <p className="mt-2 text-sm text-paper/60">
          Create an account to start solving problems.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-paper/80" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-paper/80" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-paper/80"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              required
            />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium text-paper/80"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-paper outline-none transition focus:border-signal focus:ring-2 focus:ring-signal/20"
              required
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-signal px-4 py-2 text-sm font-medium text-ink transition hover:bg-signal-dark disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-sm text-paper/60">
          Already have an account?{" "}
          <Link className="font-medium text-paper underline underline-offset-4" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;