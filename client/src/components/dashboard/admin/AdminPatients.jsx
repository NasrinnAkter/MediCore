import { useState, useEffect } from "react";
import { FaEye, FaTimes } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import { getPatientsApi } from "../../../services/authService.js";
import { getAppointmentsApi } from "../../../services/appointmentService.js";

export default function AdminPatients() {
  const { token } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedVisits, setSelectedVisits] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await getPatientsApi(token);
        setPatients(data);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [token]);

  const handleView = async (patient) => {
    setSelected(patient);
    try {
      // Fetch ALL appointments then filter by patient id on the client
      // because the backend /appointments endpoint doesn't support ?patient= filter
      const data = await getAppointmentsApi(token);
      const patientAppointments = data.filter(
        (a) => a.patient?._id === patient._id || a.patient === patient._id
      );
      setSelectedVisits(patientAppointments.length);
    } catch {
      setSelectedVisits(0);
    }
  };

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
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Email", "Phone", "Date of Birth", "Blood Group", "Action"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">No patients found.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-primary">{p.name}</td>
                    <td className="px-5 py-4 text-gray-500">{p.email}</td>
                    <td className="px-5 py-4 text-gray-500">{p.phone || "—"}</td>
                    <td className="px-5 py-4 text-gray-500">
                      {p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{p.bloodGroup || "—"}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => handleView(p)} className="text-xs text-blue-500 border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50 flex items-center gap-1">
                        <FaEye size={11} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-primary">Patient Details</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-primary"><FaTimes /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Full Name", value: selected.name },
                { label: "Email", value: selected.email },
                { label: "Phone", value: selected.phone || "—" },
                { label: "Date of Birth", value: selected.dateOfBirth ? new Date(selected.dateOfBirth).toLocaleDateString() : "—" },
                { label: "Blood Group", value: selected.bloodGroup || "—" },
                { label: "Total Visits", value: selectedVisits },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="text-primary text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-6 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}