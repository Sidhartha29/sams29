import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";

const initialForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AdminRegister() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const { data } = await registerUser({ ...payload, role: "admin" });
      login(data);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Signup</h1>
        <p className="text-sm text-gray-500 mb-6">Create an admin account to manage students, verify documents, and review achievements.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="admin@example.com" />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} className="input" placeholder="Enter password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input" placeholder="Confirm password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg> Creating admin...
              </>
            ) : (
              "Create Admin"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
