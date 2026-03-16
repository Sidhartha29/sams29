import { useState, useEffect } from "react";
import { getAllAchievements } from "../../services/api";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllAchievements();
        setAchievements(data);
      } catch (err) {
        console.error("Fetch error:", err);
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Achievements</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {achievements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No achievements found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Reg No</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">Certificate</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((a) => (
                  <tr key={a._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{a.studentId?.name || "—"}</td>
                    <td className="px-4 py-3">{a.studentId?.regNo || "—"}</td>
                    <td className="px-4 py-3">{a.title}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">{a.category}</span>
                    </td>
                    <td className="px-4 py-3 capitalize">{a.activityType || "—"}</td>
                    <td className="px-4 py-3">{a.year}</td>
                    <td className="px-4 py-3">{a.semester}</td>
                    <td className="px-4 py-3">
                      {a.certificateUrl ? (
                        <a href={a.certificateUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View</a>
                      ) : "—"}
                    </td>
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
