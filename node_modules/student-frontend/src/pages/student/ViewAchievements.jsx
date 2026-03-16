import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAchievements, deleteAchievement } from "../../services/api";

export default function ViewAchievements() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await getAchievements(user._id);
      setAchievements(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) load();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this achievement?")) return;
    try {
      await deleteAchievement(id);
      setAchievements((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Achievements</h1>
        <Link to="/achievements/add" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          + Add Achievement
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {achievements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No achievements found.</p>
            <Link to="/achievements/add" className="text-indigo-600 text-sm mt-2 inline-block">Add your first achievement →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Semester</th>
                  <th className="px-4 py-3 font-medium">Certificate</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {achievements.map((a) => (
                  <tr key={a._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{a.title}</td>
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
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(a._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                        Delete
                      </button>
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
