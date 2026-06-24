import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  getAppointmentsApi,
  updateAppointmentStatusApi,
} from "../../../services/appointmentService.js";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-600",
  confirmed: "bg-green-100 text-green-600",
  completed: "bg-blue-100 text-blue-600",
  cancelled: "bg-red-100 text-red-500",
};

const nextStatus = { pending: "confirmed", confirmed: "completed" };

export default function AdminAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointmentsApi(token);
        setAppointments(data);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const filtered =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const updateStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await updateAppointmentStatusApi(id, newStatus, token);

      // Optimistic update
      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: newStatus } : a)),
      );
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-primary mb-6">
        Manage Appointments
      </h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all
              ${filter === s ? "bg-primary text-white" : "bg-white text-primary border border-gray-200 hover:border-primary"}`}
          >
            {s}
          </button>
        ))}
      </div>

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
                  "Patient",
                  "Doctor",
                  "Department",
                  "Date",
                  "Time",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr
                    key={apt._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-primary">
                      {apt.patient?.name || apt.patientName || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {apt.doctor?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {apt.department || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(apt.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{apt.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[apt.status] || "bg-gray-100 text-gray-600"}`}
                      >
                        {apt.status?.charAt(0).toUpperCase() +
                          apt.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {nextStatus[apt.status] ? (
                        <button
                          onClick={() =>
                            updateStatus(apt._id, nextStatus[apt.status])
                          }
                          disabled={updating === apt._id}
                          className="text-xs text-primary border border-primary/30 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                          {updating === apt._id
                            ? "..."
                            : `→ ${nextStatus[apt.status]}`}
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
    </div>
  );
}
