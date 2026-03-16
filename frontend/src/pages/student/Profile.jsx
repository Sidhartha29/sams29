import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../services/api";

export default function Profile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    branch: user?.branch || "",
    department: user?.department || "",
    program: user?.program || "",
    admissionType: user?.admissionType || "",
    year: user?.year || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = { ...form };
      if (payload.year) payload.year = Number(payload.year);
      const { data } = await updateProfile(payload);
      login({ ...user, ...data });
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "Full Name", name: "name", editable: true },
    { label: "Registration No", value: user?.regNo, editable: false },
    { label: "Email", value: user?.email, editable: false },
    { label: "Phone", name: "phone", editable: true },
    { label: "Department", name: "department", editable: true },
    { label: "Branch", name: "branch", editable: true },
    { label: "Program", name: "program", editable: true },
    { label: "Admission Type", name: "admissionType", editable: true },
    { label: "Year", name: "year", editable: true, type: "number" },
    { label: "Role", value: user?.role, editable: false },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">View and manage your personal information</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)} className="btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" /></svg>
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success"
            ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Profile header card */}
      <div className="card card-body mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-200">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user?.name || "—"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-indigo">{user?.regNo}</span>
              <span className="badge badge-green capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile fields */}
      <div className="card card-body">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Personal Information</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((f) => (
            <div key={f.label}>
              <label className="label">{f.label}</label>
              {editing && f.editable ? (
                <input
                  type={f.type || "text"}
                  name={f.name}
                  value={form[f.name] || ""}
                  onChange={handleChange}
                  className="input"
                />
              ) : (
                <p className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700">
                  {f.value || form[f.name] || "—"}
                </p>
              )}
            </div>
          ))}
        </div>

        {editing && (
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={handleSave} disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
