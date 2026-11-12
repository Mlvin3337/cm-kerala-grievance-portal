import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, logout, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const user = await login(email, password);

      if (user.role === "CITIZEN") {
        navigate("/dashboard");
      } else {
        await logout();
        setError("Please use your designated staff login portal.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-gray-100/80 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-9">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-green-100 to-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
              <LogIn className="text-green-800" size={26} />
            </div>
            <h1 className="text-2xl font-bold mt-5 text-gray-900 tracking-tight">
              Citizen Login
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Login to access your grievance dashboard.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-100 p-3.5 rounded-xl text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/40 focus:border-green-700 transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/40 focus:border-green-700 transition-shadow"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-900 disabled:opacity-60 shadow-sm hover:shadow transition-all"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-green-800 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>

          <div className="flex justify-center items-center gap-2 mt-6 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Secure citizen login
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Staff?{" "}
          <Link to="/officer/login" className="text-gray-500 hover:text-green-800">
            Officer
          </Link>
          {" · "}
          <Link to="/cmo/login" className="text-gray-500 hover:text-green-800">
            CMO
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
