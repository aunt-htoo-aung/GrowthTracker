import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LayoutDashboard, PenLine, User, LogOut, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // Links available to authenticated users
  const authLinks = [
    { to: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/entry", label: "New Entry", icon: <PenLine size={18} /> },
  ];

  // Links available to guests
  const guestLinks = [
    { to: "/login", label: "Sign In", icon: <LogIn size={18} /> },
    { to: "/register", label: "Sign Up", icon: <UserPlus size={18} /> },
  ];

  const links = isAuthenticated ? authLinks : guestLinks;
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Brand */}
          <Link to="/" className="text-lg sm:text-xl font-bold text-slate-800 hover:text-blue-600 transition">
            GrowthTracker
          </Link>

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-gray-100 hover:text-slate-800"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Profile & Logout (authenticated only) */}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isActive("/profile")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-gray-100 hover:text-slate-800"
                  }`}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  {user?.name?.split(" ")[0] || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden p-2 rounded-lg text-slate-600 hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-2 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-gray-100"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {/* Mobile profile & logout */}
            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive("/profile")
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-gray-100"
                  }`}
                >
                  <User size={18} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition w-full text-left"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
