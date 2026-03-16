import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";

const initialForm = {
  name: "",
  regNo: "",
  email: "",
  phone: "",
  department: "",
  branch: "",
  program: "",
  admissionCategory: "",
  admissionType: "",
  year: "",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "student";

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
    if (role === "admin") {
      if (!form.email || !form.password) {
        setError("Email and password are required");
        return;
      }
    } else {
      if (!form.name || !form.regNo || !form.email || !form.password || !form.branch || !form.admissionType || !form.year) {
        setError("Name, Reg No, Email, Password, Branch, Admission Type, and Year are required");
        return;
      }
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
      const { confirmPassword, ...fields } = form;

      let payload;
      if (role === "admin") {
        payload = {
          email: fields.email,
          password: fields.password,
          role: "admin",
        };
      } else {
        payload = {
          name: fields.name,
          regNo: fields.regNo,
          email: fields.email,
          phone: fields.phone || undefined,
          department: fields.department || undefined,
          branch: fields.branch,
          program: fields.program || undefined,
          admissionCategory: fields.admissionCategory || undefined,
          admissionType: fields.admissionType,
          year: fields.year ? Number(fields.year) : undefined,
          password: fields.password,
        };
      }

      const { data } = await registerUser(payload);

      login(data);
      navigate(role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm";

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold leading-tight">Join<br />StudentAchieve</h1>
          <p className="mt-4 text-indigo-200 leading-relaxed max-w-xs">Create your account to start tracking achievements and managing your academic portfolio.</p>
          <div className="mt-10 space-y-3">
            {["Track all your achievements", "Upload & verify documents", "AI-powered certificate scanning"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                </div>
                <span className="text-sm text-indigo-100">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 py-8">
        <div className="w-full max-w-2xl">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-1 text-sm">Fill in your details to get started</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <div className="card card-body">
            <form onSubmit={handleSubmit} className="space-y-5">
              {role !== "admin" && (
                <>
                  {/* Personal Info */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Personal Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className="label">Full Name *</label><input type="text" name="name" value={form.name} onChange={handleChange} className="input" placeholder="Full name" /></div>
                      <div><label className="label">Registration No *</label><input type="text" name="regNo" value={form.regNo} onChange={handleChange} className="input" placeholder="e.g. 21BCE7000" /></div>
                      <div><label className="label">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" /></div>
                      <div><label className="label">Phone</label><input type="text" name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="Phone number" /></div>
                    </div>
                  </div>

                  {/* Academic Info */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Academic Details</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div><label className="label">Department</label><input type="text" name="department" value={form.department} onChange={handleChange} className="input" placeholder="e.g. CSE" /></div>
                      <div><label className="label">Branch</label><input type="text" name="branch" value={form.branch} onChange={handleChange} className="input" placeholder="e.g. Computer Science" /></div>
                      <div><label className="label">Program</label><input type="text" name="program" value={form.program} onChange={handleChange} className="input" placeholder="e.g. B.Tech" /></div>
                      <div><label className="label">Admission Category</label><input type="text" name="admissionCategory" value={form.admissionCategory} onChange={handleChange} className="input" placeholder="e.g. General" /></div>
                      <div><label className="label">Admission Type</label><input type="text" name="admissionType" value={form.admissionType} onChange={handleChange} className="input" placeholder="e.g. Regular" /></div>
                      <div><label className="label">Year</label><input type="number" name="year" value={form.year} onChange={handleChange} className="input" placeholder="e.g. 3" min="1" max="5" /></div>
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Security</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="label">Password *</label><input type="password" name="password" value={form.password} onChange={handleChange} className="input" placeholder="Min 6 characters" /></div>
                  <div><label className="label">Confirm Password *</label><input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input" placeholder="Confirm password" /></div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? (
                  <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Creating account...</>
                ) : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
