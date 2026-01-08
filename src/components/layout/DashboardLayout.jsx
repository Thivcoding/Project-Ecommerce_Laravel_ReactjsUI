import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBox,
  FaShoppingCart,
  FaUsers,
  FaHome,
  FaSignOutAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const { user, loading, logout } = useContext(AuthContext);

  /* ===== PROTECT ADMIN ===== */
  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/login");
      else if (user.role !== "admin") navigate("/");
    }
  }, [user, loading, navigate]);

  if (!user || user.role !== "admin") return null;

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Category", path: "/dashboard/categories", icon: <FaBox /> },
    { name: "Products", path: "/dashboard/products", icon: <FaBox /> },
    { name: "Orders", path: "/dashboard/orders", icon: <FaShoppingCart /> },
    { name: "Users", path: "/dashboard/users", icon: <FaUsers /> },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-indigo-700 text-white
        transition-all duration-300
        ${open ? "w-64" : "w-20"}`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-indigo-600">
          <h1 className={`font-bold text-lg ${!open && "hidden"}`}>
            Admin Panel
          </h1>
          <button
            onClick={() => setOpen(!open)}
            className="text-white hover:text-indigo-200"
          >
            <FaBars />
          </button>
        </div>

        {/* MENU */}
        <nav className="mt-4 space-y-1">
          {menu.map((m) => (
            <NavLink
              key={m.name}
              to={m.path}
              end
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 text-sm font-medium
                 transition-all
                 hover:bg-indigo-600
                 ${
                   isActive
                     ? "bg-indigo-600 border-l-4 border-white"
                     : "border-l-4 border-transparent"
                 }`
              }
            >
              <span className="text-lg">{m.icon}</span>
              <span className={`${!open && "hidden"}`}>{m.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* ===== MAIN ===== */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${open ? "ml-64" : "ml-20"}`}
      >
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <h2 className="font-semibold text-slate-700 text-lg">
            E-commerce Dashboard
          </h2>

          <div className="flex items-center gap-4">
            <span className="text-slate-600 text-sm font-medium">
              Hi, {user.name}
            </span>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-2 text-rose-600 hover:text-rose-700 text-sm font-medium"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
