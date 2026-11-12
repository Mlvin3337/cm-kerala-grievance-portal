import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Departments", path: "/departments" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const dashboardPath =
    user?.role === "CMO_ADMIN"
      ? "/cmo/dashboard"
      : user?.role === "DEPARTMENT_OFFICER"
        ? "/officer/dashboard"
        : "/dashboard";

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-green-800 to-green-900 text-white p-2 rounded-xl shadow-md group-hover:shadow-lg transition-shadow">
            <ShieldCheck size={24} strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-gray-900 leading-tight tracking-tight">
              CM Kerala
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-500 font-medium">
              Grievance Redressal Portal
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(link.path)
                  ? "text-green-800 bg-green-50"
                  : "text-gray-600 hover:text-green-800 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2.5">
          {user ? (
            <>
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-800 border border-green-200 rounded-lg hover:bg-green-50"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-green-800 border border-green-800/80 rounded-lg hover:bg-green-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-green-800 rounded-lg hover:bg-green-900 shadow-sm hover:shadow"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3 flex flex-col gap-1 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2.5 text-sm font-medium rounded-lg ${
                isActive(link.path)
                  ? "text-green-800 bg-green-50"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="border-t border-gray-100 mt-2 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={dashboardPath}
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-green-800 bg-green-50 rounded-lg"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 rounded-lg text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold text-green-800 border border-green-800 rounded-lg text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold text-white bg-green-800 rounded-lg text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
