import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function CMOLogin() {
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

      if (user.role === "CMO_ADMIN") {
        navigate("/cmo/dashboard");
      } else {
        await logout();
        setError(
          "Access denied. CMO administrator credentials are required."
        );
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
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-gray-200/40 border border-gray-100 p-8 sm:p-9">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-green-100 to-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={32} className="text-green-800" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-5 tracking-tight">
            CMO Administration
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to manage and monitor public grievances.
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="CMO admin email"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/40 focus:border-green-700"
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
              placeholder="Password"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/40 focus:border-green-700"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/login" className="hover:text-gray-600">
            Citizen login
          </Link>
          {" · "}
          <Link to="/officer/login" className="hover:text-gray-600">
            Officer login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CMOLogin;
