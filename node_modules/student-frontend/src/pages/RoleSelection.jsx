import { useSearchParams, Link } from "react-router-dom";

export default function RoleSelection() {
  const [searchParams] = useSearchParams();

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
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
          <h1 className="text-4xl font-bold leading-tight mb-6">Student<br />Achievement<br />System</h1>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-sm mb-12">Select your role to continue</p>
        </div>
      </div>

      {/* Right role cards */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Title */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Welcome</h1>
            <p className="text-gray-600 text-lg">Choose your role to get started</p>
          </div>

          {/* Role cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Student */}
            <Link to="/register?role=student" className="group">
              <div className="relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden">
                <div className={`absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">Student</h2>
                    <p className="text-gray-600 leading-relaxed">Track achievements, upload documents, and build your portfolio</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin */}
            <Link to="/admin/auth" className="group">
              <div className="relative p-8 bg-white border-2 border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden">
                <div className={`absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300`}>
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                    <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <div className="flex-1 pt-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors">Admin</h2>
                    <p className="text-gray-600 leading-relaxed">Manage students, verify documents, and oversee achievements</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Or continue links */}
          <div className="flex items-center justify-center space-x-4 pt-8 border-t border-gray-200">
            <span className="text-sm text-gray-500">Already have account?</span>
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">Skip →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

