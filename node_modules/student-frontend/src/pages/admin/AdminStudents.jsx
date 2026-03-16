import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { getAllStudents, searchStudents } from "../../services/api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const uniqueDepartments = Array.from(new Set(students.map((s) => s.department).filter(Boolean))).sort();
  const uniqueYears = Array.from(new Set(students.map((s) => s.year).filter(Boolean))).sort((a, b) => a - b);

  const downloadCSV = () => {
    const rows = filteredStudents;
    const headers = ["Name", "Reg No", "Email", "Department", "Branch", "Year"];
    const csv = [headers.join(",")];

    rows.forEach((s) => {
      const line = [
        s.name || "",
        s.regNo || "",
        s.email || "",
        s.department || "",
        s.branch || "",
        s.year || "",
      ];
      csv.push(line.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","));
    });

    const blob = new Blob([csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Student Report", 14, 20);

    const tableData = filteredStudents.map((s) => [
      s.name || "",
      s.regNo || "",
      s.email || "",
      s.department || "",
      s.branch || "",
      s.year || "",
    ]);

    doc.autoTable({
      startY: 30,
      head: [["Name", "Reg No", "Email", "Department", "Branch", "Year"]],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      theme: "grid",
    });

    doc.save(`students_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  const applyFilters = (data) => {
    let list = data;

    if (departmentFilter) {
      list = list.filter((s) => s.department?.toLowerCase() === departmentFilter.toLowerCase());
    }

    if (yearFilter) {
      list = list.filter((s) => String(s.year) === String(yearFilter));
    }

    setFilteredStudents(list);
  };

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getAllStudents();
        setStudents(data);
        setFilteredStudents(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Apply filters whenever they change
  useEffect(() => {
    applyFilters(students);
  }, [departmentFilter, yearFilter, students]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }
    setSearching(true);
    try {
      const { data } = await searchStudents(query.trim());
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Students</h1>
          <p className="text-sm text-gray-500">Search, filter, and export student reports.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Export CSV
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid gap-3 lg:grid-cols-2">
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by registration number..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              disabled={searching}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm disabled:opacity-50"
            >
              {searching ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {(departmentFilter || yearFilter) && (
              <button
                type="button"
                onClick={() => {
                  setDepartmentFilter("");
                  setYearFilter("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Reg No</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Branch</th>
                  <th className="px-4 py-3 font-medium">Year</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{s.name}</td>
                    <td className="px-4 py-3">{s.regNo}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3">{s.department || "—"}</td>
                    <td className="px-4 py-3">{s.branch || "—"}</td>
                    <td className="px-4 py-3">{s.year || "—"}</td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/students/${s._id}`} className="text-indigo-600 hover:underline text-xs font-medium">
                        View Details
                      </Link>
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

