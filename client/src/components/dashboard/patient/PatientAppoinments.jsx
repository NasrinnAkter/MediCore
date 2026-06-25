import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getMyAppointmentsApi,
  cancelAppointmentApi,
} from "../../../services/appointmentService.js";

const statusStyle = {
  confirmed: "bg-green-100 text-green-600",
  pending: "bg-yellow-100 text-yellow-600",
  completed: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-500",
};

export default function PatientAppointments() {
  const { token } = useAuth();
  const [tab, setTab] = useState("upcoming");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getMyAppointmentsApi(token);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const now = new Date();

  const filtered = appointments.filter((a) => {
    const appointmentDate = new Date(a.date);
    const isPast =
      appointmentDate < now ||
      a.status === "completed" ||
      a.status === "cancelled";

    return tab === "upcoming" ? !isPast : isPast;
  });

  const handleCancel = async () => {
    if (!cancelId) return;

    setCancelling(true);
    try {
      await cancelAppointmentApi(cancelId, token);

      // Update local state
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === cancelId ? { ...a, status: "cancelled" } : a,
        ),
      );
      setCancelId(null);
    } catch (err) {
      console.error("Cancel failed:", err);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-6">
        My Appointments
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {["upcoming", "past"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all
              ${
                tab === t
                  ? "bg-primary text-white"
                  : "bg-white text-primary border border-gray-200 hover:border-primary"
              }`}
          >
            {t} Appointments
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            Loading...
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Doctor",
                  "Department",
                  "Date",
                  "Time",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
                    No {tab} appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr
                    key={apt._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-primary">
                      {apt.doctor?.name || "Unknown Doctor"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {apt.department || "N/A"}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {new Date(apt.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-gray-500">{apt.time}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[apt.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {apt.status?.charAt(0).toUpperCase() +
                          apt.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {(apt.status === "pending" ||
                        apt.status === "confirmed") &&
                      new Date(apt.date) >= now ? (
                        <button
                          onClick={() => setCancelId(apt._id)}
                          className="text-xs text-red-500 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Cancel Modal */}
      {cancelId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-primary mb-2">
              Cancel Appointment?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Keep It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
