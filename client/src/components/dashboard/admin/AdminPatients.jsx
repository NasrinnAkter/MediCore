import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getPatientsApi } from "../../../services/authService.js";
import { getAppointmentsApi } from "../../../services/appointmentService.js";

export default function AdminPatients() {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [visitCounts, setVisitCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patients and all appointments together so we can compute
        // each patient's total visit count up front instead of on-demand.
        const [patientsData, appointmentsData] = await Promise.all([
          getPatientsApi(token),
          getAppointmentsApi(token),
        ]);

        setPatients(patientsData);

        const counts = {};
        appointmentsData.forEach((a) => {
          const patientId = a.patient?._id || a.patient;
          if (patientId) {
            counts[patientId] = (counts[patientId] || 0) + 1;
          }
        });
        setVisitCounts(counts);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-primary">Manage Patients</h1>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-accent w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Date of Birth", "Total Visits"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No patients found.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{p.name}</td>
                    <td className="px-5 py-4 text-gray-500">{p.email}</td>
                    <td className="px-5 py-4 text-gray-500">{p.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">
                      {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-primary bg-blue-50 px-3 py-1 rounded-full">
                        {visitCounts[p._id] || 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}