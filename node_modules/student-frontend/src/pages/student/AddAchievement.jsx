import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { addAchievement, suggestActivityType } from "../../services/api";

const CATEGORIES = ["Hackathon", "Internship", "Research", "Technical Competition", "Workshop", "Sports", "Cultural", "Other"];
const ACTIVITY_TYPES = ["hackathon", "internship", "research", "sports", "workshop", "cultural", "technical", "other"];

export default function AddAchievement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    activityType: "",
    year: new Date().getFullYear(),
    academicYear: "",
    semester: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setOcrResult(null);
    }
  };

  const handleOCR = async () => {
    if (!file) return;
    setOcrLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await suggestActivityType(fd);
      setOcrResult(data);
      if (data.suggestedActivityType && data.suggestedActivityType !== "other") {
        setForm((prev) => ({
          ...prev,
          activityType: data.suggestedActivityType,
          category: CATEGORIES.find((c) => c.toLowerCase().includes(data.suggestedActivityType)) || prev.category,
        }));
      }
    } catch (err) {
      console.error("OCR error:", err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.year || !form.semester) {
      setError("Title, Category, Year and Semester are required");
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("studentId", user._id);
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("activityType", form.activityType || form.category.toLowerCase());
      fd.append("year", form.year);
      fd.append("academicYear", form.academicYear);
      fd.append("semester", form.semester);
      if (file) fd.append("file", file);

      await addAchievement(fd);
      navigate("/achievements");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add achievement");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Achievement</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className={inputClass} placeholder="Achievement title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
              <select name="activityType" value={form.activityType} onChange={handleChange} className={inputClass}>
                <option value="">Select type</option>
                {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input type="text" name="academicYear" value={form.academicYear} onChange={handleChange} className={inputClass} placeholder="e.g. 2024-2025" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
              <input type="number" name="year" value={form.year} onChange={handleChange} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
              <input type="number" name="semester" value={form.semester} onChange={handleChange} className={inputClass} placeholder="1-8" min="1" max="8" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputClass} placeholder="Brief description of the achievement" />
          </div>

          {/* Certificate upload with preview and OCR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Certificate (optional)</label>
            <input type="file" accept="image/*,.pdf" onChange={handleFileChange} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          </div>

          {preview && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex items-start gap-4">
                <img src={preview} alt="Preview" className="w-40 h-auto rounded border" />
                <div className="flex-1">
                  <button
                    type="button"
                    onClick={handleOCR}
                    disabled={ocrLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm disabled:opacity-50"
                  >
                    {ocrLoading ? "Scanning..." : "🔍 Auto-detect Activity Type (OCR)"}
                  </button>
                  {ocrResult && (
                    <div className="mt-3 text-sm">
                      <p className="text-gray-600">
                        Suggested: <span className="font-semibold text-green-700 capitalize">{ocrResult.suggestedActivityType}</span>
                        {" "}({ocrResult.confidence === "match_found" ? "✓ Match found" : "No strong match"})
                      </p>
                      {ocrResult.extractedText && (
                        <p className="text-gray-400 text-xs mt-1 truncate max-w-md">Extracted: {ocrResult.extractedText.substring(0, 100)}...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm disabled:opacity-50">
              {loading ? "Adding..." : "Add Achievement"}
            </button>
            <button type="button" onClick={() => navigate("/achievements")} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
