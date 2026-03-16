import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStudentStats, getAchievements } from "../../services/api";
import StatCard from "../../components/StatCard";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ achievements: 0, documents: 0, pendingDocs: 0 });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, achRes] = await Promise.all([
          getStudentStats(user._id),
          getAchievements(user._id),
        ]);
        setStats(statsRes.data);
        setRecent(achRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user?._id) load();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening with your academic portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatCard title="Total Achievements" value={stats.achievements} icon="🏆" color="indigo" />
        <StatCard title="Documents Uploaded" value={stats.documents} icon="📄" color="green" />
        <StatCard title="Pending Verification" value={stats.pendingDocs} icon="⏳" color="yellow" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { to: "/achievements/add", label: "Add Achievement", icon: "M12 4.5v15m7.5-7.5h-15", color: "from-indigo-500 to-indigo-600" },
          { to: "/documents/upload", label: "Upload Document", icon: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5", color: "from-emerald-500 to-emerald-600" },
          { to: "/achievements", label: "View Achievements", icon: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z", color: "from-violet-500 to-violet-600" },
          { to: "/profile", label: "My Profile", icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", color: "from-amber-500 to-amber-600" },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${a.color} flex items-center justify-center shadow-sm`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d={a.icon} /></svg>
            </div>
            <span className="text-xs font-medium text-gray-700 text-center">{a.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Achievements */}
      <div className="card">
        <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="section-title">Recent Achievements</h2>
          <Link to="/achievements" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View All →</Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-10 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-4.5A3.375 3.375 0 0013.125 10.875h-2.25A3.375 3.375 0 007.5 14.25v4.5" /></svg>
            </div>
            <p className="text-gray-500 text-sm">No achievements yet.</p>
            <Link to="/achievements/add" className="text-indigo-600 text-sm font-medium mt-1 inline-block">Add your first achievement →</Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="desktop-table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Year</th>
                    <th className="px-5 py-3 font-medium">Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((a) => (
                    <tr key={a._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-900">{a.title}</td>
                      <td className="px-5 py-3"><span className="badge-indigo">{a.category || a.activityType}</span></td>
                      <td className="px-5 py-3 text-gray-600">{a.year}</td>
                      <td className="px-5 py-3 text-gray-600">{a.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="mobile-card space-y-3 p-4">
              {recent.map((a) => (
                <div key={a._id} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="badge-indigo">{a.category || a.activityType}</span>
                    <span className="text-xs text-gray-500">{a.year} • Sem {a.semester}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
