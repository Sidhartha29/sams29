import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { uploadDocument } from "../../services/api";

const DOC_TYPES = ["Aadhaar", "PAN", "MarkMemo", "VoterID", "ABC", "Passport", "Other"];

export default function UploadDocument() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [docType, setDocType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file"); return; }
    if (!docType) { setError("Please select a document type"); return; }

    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("studentId", user.regNo);
      fd.append("docType", docType);
      await uploadDocument(fd);
      navigate("/documents");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Document</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type *</label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} className={inputClass}>
              <option value="">Select document type</option>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File *</label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {preview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-2">Preview:</p>
              <img src={preview} alt="Preview" className="max-w-xs max-h-48 rounded border" />
            </div>
          )}

          {file && !preview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600">📎 {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50">
              {loading ? "Uploading..." : "Upload Document"}
            </button>
            <button type="button" onClick={() => navigate("/documents")} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
