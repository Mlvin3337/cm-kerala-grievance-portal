import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-700/40 focus:border-green-700 transition-shadow";

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-gray-50 to-gray-100/80 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 sm:p-9">
          <div className="text-center mb-8">
            <div className="mx-auto bg-gradient-to-br from-green-100 to-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm">
              <UserPlus className="text-green-800" size={26} />
            </div>
            <h1 className="text-2xl font-bold mt-5 text-gray-900 tracking-tight">
              Create Citizen Account
            </h1>
            <p className="text-gray-500 text-sm mt-2">
              Register to submit and track your grievances.
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={150}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter mobile number"
                required
                maxLength={15}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={6}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-800 text-white py-3 rounded-xl font-semibold hover:bg-green-900 disabled:opacity-60 shadow-sm hover:shadow transition-all"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-7">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-800 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

          <div className="flex justify-center items-center gap-2 mt-6 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Secure registration
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
