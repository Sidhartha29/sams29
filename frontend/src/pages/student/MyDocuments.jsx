import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getMyDocuments } from "../../services/api";

export default function MyDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getMyDocuments(user._id);
        setDocuments(data);
      } catch (err) {
        console.error("Fetch error:", err);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Documents</h1>
        <Link to="/documents/upload" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
          + Upload Document
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No documents uploaded yet.</p>
            <Link to="/documents/upload" className="text-indigo-600 text-sm mt-2 inline-block">Upload your first document →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Document Type</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Uploaded</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{doc.docType}</td>
                    <td className="px-4 py-3">
                      <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                        View File
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {doc.verified ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs font-medium">✓ Verified</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 rounded text-xs font-medium">Pending</span>
                      )}
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
