import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAchievements, getMyDocuments, verifyDocument } from "../../services/api";
import API from "../../services/api";

export default function AdminStudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Fetch student by ObjectId - use the students collection directly
        const [achRes, docRes] = await Promise.all([
          getAchievements(id),
          getMyDocuments(id),
        ]);
        setAchievements(achRes.data);
        setDocuments(docRes.data);

        // Get student info from the all students endpoint filtered client-side
        // or we can try fetching via the ObjectId
        const allRes = await API.get("/students/all");
        const found = allRes.data.find((s) => s._id === id);
        setStudent(found || null);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleVerify = async (docId) => {
    try {
      await verifyDocument(docId);
      setDocuments((prev) =>
        prev.map((d) => (d._id === docId ? { ...d, verified: true, verifiedAt: new Date() } : d))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  if (!student) {
    return <div className="text-center py-12 text-gray-500">Student not found.</div>;
  }

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "achievements", label: `Achievements (${achievements.length})` },
    { id: "documents", label: `Documents (${documents.length})` },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Link to="/admin/students" className="text-gray-500 hover:text-gray-700 text-sm">← Students</Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-800">{student.name}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["Name", student.name],
              ["Reg No", student.regNo],
              ["Email", student.email],
              ["Phone", student.phone],
              ["Department", student.department],
              ["Branch", student.branch],
              ["Program", student.program],
              ["Admission Type", student.admissionType],
              ["Year", student.year],
              ["Role", student.role],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="font-medium text-gray-800">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {tab === "achievements" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {achievements.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No achievements found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Year</th>
                    <th className="px-4 py-3 font-medium">Semester</th>
                    <th className="px-4 py-3 font-medium">Certificate</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((a) => (
                    <tr key={a._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{a.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">{a.category}</span>
                      </td>
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
      )}

      {/* Documents Tab */}
      {tab === "documents" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {documents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No documents found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">File</th>
                    <th className="px-4 py-3 font-medium">Uploaded</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc._id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{doc.docType}</td>
                      <td className="px-4 py-3">
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">View</a>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {doc.verified ? (
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">✓ Verified</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!doc.verified && (
                          <button onClick={() => handleVerify(doc._id)} className="text-green-600 hover:text-green-800 text-xs font-medium">
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
