import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAdminStats, getAllStudents } from "../../services/api";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, achievements: 0, documents: 0, pendingDocs: 0 });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, studentsRes] = await Promise.all([
          getAdminStats(),
          getAllStudents(),
        ]);
        setStats(statsRes.data);
        setRecentStudents(studentsRes.data.slice(0, 5));
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 mb-8 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-indigo-100">Admin-only view: manage students, verify documents, and review achievements.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Admin mode enabled
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Students" value={stats.students} icon="👥" color="indigo" />
        <StatCard title="Total Achievements" value={stats.achievements} icon="🏆" color="green" />
        <StatCard title="Total Documents" value={stats.documents} icon="📄" color="blue" />
        <StatCard title="Pending Verification" value={stats.pendingDocs} icon="⏳" color="yellow" />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Students</h2>
          <Link to="/admin/students" className="text-sm text-indigo-600 hover:text-indigo-700">View All →</Link>
        </div>

        {recentStudents.length === 0 ? (
          <p className="text-gray-500 text-sm">No students registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">Name</th>
                  <th className="pb-2 font-medium">Reg No</th>
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Branch</th>
                  <th className="pb-2 font-medium">Year</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr key={s._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 font-medium">
                      <Link to={`/admin/students/${s._id}`} className="text-indigo-600 hover:underline">{s.name}</Link>
                    </td>
                    <td className="py-2.5">{s.regNo}</td>
                    <td className="py-2.5">{s.department || "—"}</td>
                    <td className="py-2.5">{s.branch || "—"}</td>
                    <td className="py-2.5">{s.year || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
