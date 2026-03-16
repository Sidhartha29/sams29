import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";

import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";
  const [form, setForm] = useState({ email: "", password: "", role });
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
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const { data } = await loginUser({ ...form, role });
      login(data);
      navigate(data.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-indigo-300/10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold leading-tight">Student<br />Achievement<br />System</h1>
          <p className="mt-4 text-indigo-200 text-lg leading-relaxed max-w-sm">Track achievements, manage documents, and showcase your academic journey.</p>
          <div className="mt-12 flex gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-xs text-indigo-300 mt-1">Students</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">1.2K</p>
              <p className="text-xs text-indigo-300 mt-1">Achievements</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-bold">98%</p>
              <p className="text-xs text-indigo-300 mt-1">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">StudentAchieve</h1>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">{role === "admin" ? "Admin Login" : "Welcome back"}</h2>
            <p className="text-gray-500 mt-1 text-sm">{role === "admin" ? "Sign in with your admin credentials" : "Sign in to your account to continue"}</p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="label">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="input" placeholder="Enter your password" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Signing in...</>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            {role === "admin" ? (
              <>Don't have an admin account? <Link to="/admin/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create one</Link></>
            ) : (
              <>Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create one</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
