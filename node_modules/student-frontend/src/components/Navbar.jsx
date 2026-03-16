import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {user?.role === "admin" ? "Admin Panel" : "Student Portal"}
          </h2>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-[11px] text-gray-400 capitalize">{user?.role}{user?.regNo ? ` · ${user.regNo}` : ""}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-indigo-200">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Logout"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
