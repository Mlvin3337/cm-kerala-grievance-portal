import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function OfficerLogin() {
  const { login, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedInUser = await login(email, password);

      if (loggedInUser.role !== "DEPARTMENT_OFFICER") {
        await logout();
        setError("This login is only for department officers.");
        return;
      }

      navigate("/officer/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-slate-50 to-slate-100/80 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-xl shadow-gray-200/40 p-8 sm:p-9">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LockKeyhole size={26} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Department Officer Login
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Sign in to review and update assigned grievances.
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
              placeholder="Officer email"
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
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
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          <Link to="/login" className="hover:text-gray-600">
            Citizen login
          </Link>
          {" · "}
          <Link to="/cmo/login" className="hover:text-gray-600">
            CMO login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OfficerLogin;
