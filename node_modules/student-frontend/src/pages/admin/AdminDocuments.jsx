import { useState, useEffect } from "react";
import { getAllDocuments, verifyDocument, deleteDocument } from "../../services/api";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllDocuments();
        setDocuments(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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

  const handleDelete = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Documents</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {documents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No documents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Reg No</th>
                  <th className="px-4 py-3 font-medium">Doc Type</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Uploaded</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{doc.studentId?.name || "—"}</td>
                    <td className="px-4 py-3">{doc.studentId?.regNo || "—"}</td>
                    <td className="px-4 py-3">{doc.docType}</td>
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
                      <div className="flex gap-2">
                        {!doc.verified && (
                          <button onClick={() => handleVerify(doc._id)} className="text-green-600 hover:text-green-800 text-xs font-medium">
                            Verify
                          </button>
                        )}
                        <a href={doc.fileUrl} download className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                          Download
                        </a>
                        <button onClick={() => handleDelete(doc._id)} className="text-red-600 hover:text-red-800 text-xs font-medium">
                          Delete
                        </button>
                      </div>
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
