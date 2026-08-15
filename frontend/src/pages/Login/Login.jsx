import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Input, Spinner } from "../../components/ui/SharedComponents.jsx";
import { login } from "../../services/authService.js";
import { useAuth } from "../../stores/AuthContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(email, password);
      const token = response?.token ?? response?.accessToken;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      authLogin(response?.user, token, response?.user?.role);
      navigate("/problems");
    } catch (loginError) {
      const backendMessage =
        loginError?.response?.data?.message ||
        loginError?.response?.data?.error ||
        loginError?.message;

      setError(backendMessage || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10">
      <Card className="w-full max-w-md p-8 shadow-card">
        <h1 className="text-2xl font-semibold text-text-primary">Login</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Sign in to continue to the platform.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error ? <p className="text-sm text-verdict-wrong">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-accent-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner className="border-white/25 border-t-white" /> : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link className="font-medium text-text-primary underline underline-offset-4" to="/register">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;