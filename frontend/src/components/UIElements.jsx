import { Link } from "react-router-dom";

export function Button({ onClick, children, variant = "primary", className = "" }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white border border-gray-300 text-slate-700 hover:bg-gray-50",
    ghost: "text-slate-600 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({ to, children, variant = "primary", className = "" }) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-white border border-gray-300 text-slate-700 hover:bg-gray-50",
    ghost: "text-slate-600 hover:bg-gray-100",
  };

  return (
    <Link
      to={to}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Box({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}
